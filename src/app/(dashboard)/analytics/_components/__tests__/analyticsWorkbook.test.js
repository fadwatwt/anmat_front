import * as XLSX from 'xlsx';
import { describe, expect, it } from '@jest/globals';
import { buildAnalyticsWorkbook } from '../analyticsWorkbook';
import { buildStyledAnalyticsXlsx } from '../styledAnalyticsXlsx';
import { strFromU8, unzipSync } from 'fflate';

describe('buildAnalyticsWorkbook', () => {
  const rows = [
    ['Subscription Usage', '', '', '', ''],
    ['Subscription Usage', 'Employees Quota', 'Current', '7', ''],
    ['Subscription Usage', 'Employees Quota', 'Max', '8', ''],
    ['Subscription Usage', 'Employees Quota', 'Percentage', '88%', ''],
    ['Subscription Usage', 'Storage Quota', 'Current (bytes)', '1073741824', ''],
    ['Subscription Usage', 'Storage Quota', 'Max (bytes)', '2147483648', ''],
    ['Tasks Analytics', 'Tasks Summary', 'open', '6', ''],
    ['Tasks Analytics', 'Tasks Summary', 'completed', '2', ''],
    ['Tasks Analytics', 'Tasks Performance', 'Oct', '3', '1'],
  ];

  it('creates a summary and a separate worksheet for each section', () => {
    const workbook = buildAnalyticsWorkbook(XLSX, rows, 'analytics_report');

    expect(workbook.SheetNames).toEqual([
      'الملخص',
      'الاشتراك',
      'المهام',
    ]);
  });

  it('stores counts and percentages as numeric spreadsheet values', () => {
    const workbook = buildAnalyticsWorkbook(XLSX, rows, 'analytics_report');
    const summary = workbook.Sheets['الملخص'];
    const summaryRows = XLSX.utils.sheet_to_json(summary, { header: 1 });

    expect(summaryRows).toContainEqual(['إجمالي المهام', 8]);
    expect(summaryRows).toContainEqual(['نسبة استخدام الموظفين', 0.88]);
  });

  it('uses meaningful headers and converts storage bytes to gigabytes', () => {
    const workbook = buildAnalyticsWorkbook(XLSX, rows, 'analytics_report');
    const subscription = XLSX.utils.sheet_to_json(
      workbook.Sheets['الاشتراك'],
      { header: 1 },
    );
    const tasks = XLSX.utils.sheet_to_json(workbook.Sheets['المهام'], {
      header: 1,
    });

    expect(subscription).toContainEqual(['التخزين (GB)', 1, 2]);
    expect(tasks).toContainEqual(['حالة المهمة', 'العدد', undefined, undefined, 'التقييم', 'العدد']);
    expect(tasks).toContainEqual(['الشهر', 'في الموعد', 'متأخر', undefined, 'الشهر', 'الساعات المتوقعة', 'الساعات الفعلية']);
  });

  it('writes the visual model into the actual xlsx package', () => {
    const buffer = buildStyledAnalyticsXlsx(rows, 'analytics_report', new Date('2026-10-06T00:00:00.000Z'));
    const workbook = XLSX.read(buffer, { type: 'array', cellStyles: true });
    const files = unzipSync(buffer);
    const summaryXml = strFromU8(files['xl/worksheets/sheet1.xml']);
    const stylesXml = strFromU8(files['xl/styles.xml']);

    expect(workbook.SheetNames).toEqual(['الملخص', 'الاشتراك', 'المهام']);
    expect(summaryXml).toContain('state="frozen"');
    expect(summaryXml).toContain('rightToLeft="1"');
    expect(summaryXml).toContain('<mergeCell ref="A1:H1"/>');
    expect(summaryXml).toContain('<c r="A1" s="1"');
    expect(files['xl/charts/chart1_1.xml']).toBeDefined();
    expect(stylesXml).toContain('FF16324F');
    expect(stylesXml).toContain('FF147D82');
  });

  it('uses English and left-to-right layout when the interface language is English', () => {
    const buffer = buildStyledAnalyticsXlsx(rows, 'analytics_report', new Date('2026-10-06T00:00:00.000Z'), 'en');
    const workbook = XLSX.read(buffer, { type: 'array' });
    const files = unzipSync(buffer);
    const summaryXml = strFromU8(files['xl/worksheets/sheet1.xml']);
    const stylesXml = strFromU8(files['xl/styles.xml']);

    expect(workbook.SheetNames).toEqual(['Summary', 'Subscription', 'Tasks']);
    expect(XLSX.utils.sheet_to_json(workbook.Sheets.Summary, { header: 1 })).toContainEqual(['Total tasks', 8]);
    expect(summaryXml).not.toContain('rightToLeft="1"');
    expect(stylesXml).toContain('horizontal="left"');
  });
});
