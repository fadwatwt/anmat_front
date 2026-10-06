import { strToU8, zipSync } from 'fflate';
import { buildAnalyticsSheets } from './analyticsWorkbook';

const xml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const columnName = (index) => {
  let value = index + 1;
  let result = '';
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
};

const cellXml = (value, address, style) => {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<c r="${address}" s="${style}"><v>${value}</v></c>`;
  }
  const text = String(value);
  const preserve = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : '';
  return `<c r="${address}" s="${style}" t="inlineStr"><is><t${preserve}>${xml(text)}</t></is></c>`;
};

const worksheetXml = (sheet, hasCharts) => {
  const maxColumns = Math.max(sheet.widths.length, 1, ...sheet.rows.map((row) => row.length));
  const percentCells = new Set(sheet.percentCells);
  const headerRows = new Set(sheet.headerRows);
  const sectionRows = new Set(sheet.sectionRows);
  const rows = sheet.rows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    let rowStyle = 0;
    if (rowNumber === 1) rowStyle = 1;
    else if (rowNumber === 2) rowStyle = 2;
    else if (headerRows.has(rowNumber)) rowStyle = 3;
    else if (sectionRows.has(rowNumber)) rowStyle = 4;
    const height = rowNumber === 1 ? ' ht="30" customHeight="1"' : (headerRows.has(rowNumber) || sectionRows.has(rowNumber) ? ' ht="23" customHeight="1"' : '');
    const cells = row.map((value, columnIndex) => {
      const address = `${columnName(columnIndex)}${rowNumber}`;
      let style = rowStyle;
      if (percentCells.has(address)) style = 6;
      else if (rowStyle === 0 && typeof value === 'number') style = 5;
      return cellXml(value, address, style);
    }).join('');
    return `<row r="${rowNumber}"${height}>${cells}</row>`;
  }).join('');

  const mergedRows = [1, 2, ...sheet.sectionRows];
  const merges = maxColumns > 1
    ? mergedRows.map((row) => `<mergeCell ref="A${row}:${columnName(maxColumns - 1)}${row}"/>`).join('')
    : '';
  const mergeBlock = merges ? `<mergeCells count="${mergedRows.length}">${merges}</mergeCells>` : '';
  const columns = sheet.widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join('');
  const dimension = `A1:${columnName(maxColumns - 1)}${Math.max(sheet.rows.length, 1)}`;

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<dimension ref="${dimension}"/><sheetViews><sheetView showGridLines="0"${sheet.rtl ? ' rightToLeft="1"' : ''} workbookViewId="0"><pane ySplit="${sheet.freezeRow - 1}" topLeftCell="A${sheet.freezeRow}" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A${sheet.freezeRow}" sqref="A${sheet.freezeRow}"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="18"/><cols>${columns}</cols><sheetData>${rows}</sheetData>${mergeBlock}
<pageMargins left="0.35" right="0.35" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>${hasCharts ? '<drawing r:id="rId1"/>' : ''}
</worksheet>`;
};

const stylesXml = (rtl) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="0.00%"/></numFmts>
<fonts count="4">
<font><sz val="11"/><name val="Aptos"/><family val="2"/></font>
<font><b/><sz val="18"/><color rgb="FFFFFFFF"/><name val="Aptos Display"/></font>
<font><i/><sz val="10"/><color rgb="FF5B6573"/><name val="Aptos"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font>
</fonts>
<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF16324F"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FF147D82"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8F0F6"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD8E0E8"/></left><right style="thin"><color rgb="FFD8E0E8"/></right><top style="thin"><color rgb="FFD8E0E8"/></top><bottom style="thin"><color rgb="FFD8E0E8"/></bottom><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="${rtl ? 'right' : 'left'}" vertical="center"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="${rtl ? 'right' : 'left'}" vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="${rtl ? 'right' : 'left'}" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="${rtl ? 'right' : 'left'}" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="${rtl ? 'right' : 'left'}" vertical="center"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>
</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

const chartXml = (sheetName, chart) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="ar-SA" sz="1200" b="1"/><a:t>${xml(chart.title)}</a:t></a:r></a:p></c:rich></c:tx><c:layout/><c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/><c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="1"/><c:ser><c:idx val="0"/><c:order val="0"/><c:cat><c:strRef><c:f>'${xml(sheetName)}'!$${chart.categoryColumn}$${chart.startRow}:$${chart.categoryColumn}$${chart.endRow}</c:f></c:strRef></c:cat><c:val><c:numRef><c:f>'${xml(sheetName)}'!$${chart.valueColumn}$${chart.startRow}:$${chart.valueColumn}$${chart.endRow}</c:f></c:numRef></c:val></c:ser><c:axId val="48650112"/><c:axId val="48672768"/></c:barChart><c:catAx><c:axId val="48650112"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:tickLblPos val="nextTo"/><c:crossAx val="48672768"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/></c:catAx><c:valAx><c:axId val="48672768"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines/><c:numFmt formatCode="0" sourceLinked="0"/><c:tickLblPos val="nextTo"/><c:crossAx val="48650112"/><c:crosses val="autoZero"/><c:crossBetween val="between"/></c:valAx></c:plotArea><c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart></c:chartSpace>`;

const drawingXml = (charts) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${charts.map((chart, index) => `<xdr:twoCellAnchor><xdr:from><xdr:col>${chart.fromCol}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${chart.fromRow}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${chart.toCol}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${chart.toRow}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${index + 2}" name="Chart ${index + 1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId${index + 1}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`).join('')}</xdr:wsDr>`;

const contentTypesXml = (sheets) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}${sheets.flatMap((sheet, sheetIndex) => (sheet.charts || []).map((_, chartIndex) => `<Override PartName="/xl/charts/chart${sheetIndex + 1}_${chartIndex + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`)).join('')}${sheets.map((sheet, index) => sheet.charts?.length ? `<Override PartName="/xl/drawings/drawing${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>` : '').join('')}</Types>`;

export const buildStyledAnalyticsXlsx = (flatRows, fileName, exportedAt = new Date(), locale = 'ar') => {
  const sheets = buildAnalyticsSheets(flatRows, fileName, exportedAt, locale);
  const workbookSheets = sheets.map((sheet, index) => `<sheet name="${xml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join('');
  const workbookRels = sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join('');
  const styleRelId = sheets.length + 1;
  const now = exportedAt.toISOString();
  const files = {
    '[Content_Types].xml': strToU8(contentTypesXml(sheets)),
    '_rels/.rels': strToU8('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'),
    'docProps/core.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(fileName.replace(/_/g, ' '))}</dc:title><dc:subject>Anmaat analytics export</dc:subject><dc:creator>Anmaat</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`),
    'docProps/app.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Anmaat</Application><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>${sheets.length}</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="${sheets.length}" baseType="lpstr">${sheets.map((sheet) => `<vt:lpstr>${xml(sheet.name)}</vt:lpstr>`).join('')}</vt:vector></TitlesOfParts></Properties>`),
    'xl/workbook.xml': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView activeTab="0"/></bookViews><sheets>${workbookSheets}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`),
    'xl/_rels/workbook.xml.rels': strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${workbookRels}<Relationship Id="rId${styleRelId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    'xl/styles.xml': strToU8(stylesXml(sheets[0]?.rtl !== false)),
  };
  sheets.forEach((sheet, index) => {
    const hasCharts = Boolean(sheet.charts?.length);
    files[`xl/worksheets/sheet${index + 1}.xml`] = strToU8(worksheetXml(sheet, hasCharts));
    if (hasCharts) {
      files[`xl/worksheets/_rels/sheet${index + 1}.xml.rels`] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing${index + 1}.xml"/></Relationships>`);
      files[`xl/drawings/drawing${index + 1}.xml`] = strToU8(drawingXml(sheet.charts));
      files[`xl/drawings/_rels/drawing${index + 1}.xml.rels`] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheet.charts.map((_, chartIndex) => `<Relationship Id="rId${chartIndex + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${index + 1}_${chartIndex + 1}.xml"/>`).join('')}</Relationships>`);
      sheet.charts.forEach((chart, chartIndex) => { files[`xl/charts/chart${index + 1}_${chartIndex + 1}.xml`] = strToU8(chartXml(sheet.name, chart)); });
    }
  });
  return zipSync(files, { level: 6 });
};
