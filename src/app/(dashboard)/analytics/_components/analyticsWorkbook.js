const AR = {
  "Subscription Usage": "الاشتراك", "Tasks Analytics": "المهام", "Projects Analytics": "المشاريع",
  "Employees Analytics": "الموظفون", "Department Analytics": "الأقسام", "Companies Analytics": "الشركات",
  "Revenues & Engagement": "الإيرادات", Departments: "الأقسام", Attended: "حضور", Absent: "غياب",
  "On Time": "في الموعد", Late: "متأخر", completed: "مكتملة", done: "منجزة", rejected: "مرفوضة",
  open: "مفتوحة", pending: "قيد الانتظار", "in-progress": "قيد التنفيذ", "Low Rating": "تقييم منخفض",
  "Medium Rating": "تقييم متوسط", "High Rating": "تقييم مرتفع", "Completed on time": "مكتملة في الموعد",
  Overdue: "متأخرة", "N/A": "غير محدد",
};
const tr = (value) => AR[String(value)] || String(value ?? "");
const EN_BY_AR = {
  "الملخص": "Summary", "الاشتراك": "Subscription", "المهام": "Tasks", "المشاريع": "Projects", "الموظفون": "Employees", "الأقسام": "Departments",
  "ملخص تقرير التحليلات": "Analytics report summary", "أهم النتائج والمؤشرات": "Key results and metrics", "المؤشرات الرئيسية": "Key metrics",
  "المؤشر": "Metric", "القيمة": "Value", "إجمالي المهام": "Total tasks", "المهام المكتملة": "Completed tasks", "المهام المرفوضة": "Rejected tasks",
  "المشاريع المسجلة": "Projects tracked", "الموظفون المستخدمون": "Employees used", "الحد الأقصى للموظفين": "Employee limit", "نسبة استخدام الموظفين": "Employee utilization",
  "سجلات الغياب": "Absence records", "الأقسام المتأخرة": "Overdue departments", "حالة المهام": "Task status", "العدد": "Count", "نتائج الأقسام": "Department results",
  "استخدام الاشتراك": "Subscription usage", "السعة المتاحة ونسب الاستخدام": "Capacity and utilization", "تفاصيل الاستخدام": "Usage details", "المورد": "Resource",
  "المستخدم": "Current", "الحد": "Limit", "نسبة الاستخدام": "Utilization", "التخزين (GB)": "Storage (GB)",
  "تحليلات المهام": "Task analytics", "الحالات والتقييم والأداء الشهري": "Status, ratings, and monthly performance", "الحالات والتقييم": "Status and ratings",
  "حالة المهمة": "Task status", "التقييم": "Rating", "الأداء والوقت": "Performance and time", "الشهر": "Month", "في الموعد": "On time", "متأخر": "Late",
  "الساعات المتوقعة": "Expected hours", "الساعات الفعلية": "Actual hours", "تحليلات المشاريع": "Project analytics", "الأداء الشهري ونسب الإنجاز": "Monthly performance and completion",
  "تفاصيل المشاريع": "Project details", "المشروع": "Project", "الأيام المتبقية": "Days left",
  "نسبة الإنجاز": "Completion", "أحدث مشروع": "Recent project", "القسم": "Department", "تحليلات الموظفين": "Employee analytics",
  "الحضور والالتزام والأداء والإنجاز": "Attendance, adherence, performance, and accomplishment", "الحضور والالتزام والأداء": "Attendance, adherence, and performance",
  "حالة الحضور": "Attendance status", "الالتزام": "Adherence", "الأسبوع": "Week", "تقييم الأداء": "Performance rating", "الإنجاز والتأخير": "Accomplishment and delay",
  "مؤشر التأخير": "Delay metric", "أفضل الموظفين": "Top employees", "الموظف": "Employee", "النقاط": "Points", "تحليلات الأقسام": "Department analytics",
  "الإنجاز والحضور والتقييم والمسؤولية": "Delivery, attendance, rating, and ownership", "ملخص الأقسام": "Department summary", "نتيجة الإنجاز": "Delivery result",
  "ترتيب الأقسام": "Department ranking", "الأداء": "Performance", "الحضور": "Attendance", "المدير": "Manager", "تفاصيل التحليلات": "Analytics details",
  "البيانات": "Data", "الفئة": "Category", "البيان": "Label", "قيمة إضافية": "Additional value", "مرفوضة": "Rejected", "منجزة": "Done",
  "مكتملة": "Completed", "مفتوحة": "Open", "قيد الانتظار": "Pending", "قيد التنفيذ": "In progress", "تقييم منخفض": "Low rating", "تقييم متوسط": "Medium rating",
  "تقييم مرتفع": "High rating", "مكتملة في الموعد": "Completed on time", "متأخرة": "Overdue", "غياب": "Absent", "غير محدد": "N/A",
  "المهام حسب الحالة": "Tasks by status",
};
const localizeSheets = (sheets, locale) => {
  const isArabic = String(locale || "ar").toLowerCase().startsWith("ar");
  if (isArabic) return sheets.map((sheet) => ({ ...sheet, rtl: true }));
  const translate = (value) => {
    if (typeof value !== "string") return value;
    if (value.startsWith("تاريخ التصدير:")) return value.replace("تاريخ التصدير:", "Exported on:");
    return EN_BY_AR[value] || value;
  };
  return sheets.map((sheet) => ({
    ...sheet, rtl: false, name: translate(sheet.name), rows: sheet.rows.map((row) => row.map(translate)),
    charts: sheet.charts.map((chart) => ({ ...chart, title: translate(chart.title) })),
  }));
};
const typedValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const text = String(value).trim();
  if (/^-?\d+(?:\.\d+)?%$/.test(text)) return Number.parseFloat(text) / 100;
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number.parseFloat(text);
  return text;
};
const parseCards = (flatRows) => {
  const cards = new Map();
  (flatRows || []).forEach((row) => {
    if (!row?.[0] || !row?.[1] || row[0] === "Section") return;
    if (!cards.has(row[1])) cards.set(row[1], []);
    cards.get(row[1]).push(row);
  });
  return cards;
};
const values = (cards, name) => (cards.get(name) || []).map((row) => [tr(row[2]), typedValue(row[3]), typedValue(row[4])]);
const findValue = (cards, card, label) => typedValue((cards.get(card) || []).find((row) => String(row[2]) === label)?.[3]);
const pad = (row, start, data) => { data.forEach((value, index) => { row[start + index] = value; }); return row; };
const makeSheet = (name, rows, options = {}) => ({
  name, rows, headerRows: options.headerRows || [], sectionRows: options.sectionRows || [], percentCells: options.percentCells || [],
  widths: options.widths || [28, 16, 16, 4, 28, 16, 16, 16], freezeRow: options.freezeRow || 6, charts: options.charts || [],
});
const sideBySideRows = (left, right, leftHeaders, rightHeaders) => {
  const rows = [pad(pad([], 0, leftHeaders), 4, rightHeaders)];
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) rows.push(pad(pad([], 0, left[i] || []), 4, right[i] || []));
  return rows;
};

const buildSummary = (cards, exportedAt) => {
  const taskRows = values(cards, "Tasks Summary").filter((row) => row[1] !== null);
  const departmentRows = values(cards, "Performance").filter((row) => row[1] !== null);
  const total = taskRows.reduce((sum, row) => sum + Number(row[1] || 0), 0);
  const completed = taskRows.filter((row) => ["مكتملة", "منجزة"].includes(row[0])).reduce((sum, row) => sum + Number(row[1] || 0), 0);
  const projects = values(cards, "Projects Progress").length || values(cards, "My Projects").length;
  const metrics = [
    ["إجمالي المهام", total || null], ["المهام المكتملة", completed || null],
    ["المهام المرفوضة", taskRows.find((row) => row[0] === "مرفوضة")?.[1]], ["المشاريع المسجلة", projects || null],
    ["الموظفون المستخدمون", findValue(cards, "Employees Quota", "Current")], ["الحد الأقصى للموظفين", findValue(cards, "Employees Quota", "Max")],
    ["نسبة استخدام الموظفين", findValue(cards, "Employees Quota", "Percentage")],
    ["سجلات الغياب", values(cards, "Attendance").find((row) => row[0] === "غياب")?.[1]],
    ["الأقسام المتأخرة", departmentRows.find((row) => row[0] === "متأخرة")?.[1]],
  ].filter((row) => row[1] !== null && row[1] !== undefined);
  const rows = [["ملخص تقرير التحليلات"], [`تاريخ التصدير: ${exportedAt.toISOString().slice(0, 10)}`], [], ["المؤشرات الرئيسية"], ["المؤشر", "القيمة"]];
  metrics.forEach((row) => rows.push(row));
  rows.push([]);
  const taskHeaderRow = rows.length + 1;
  rows.push(["حالة المهام", "العدد"]);
  taskRows.forEach((row) => rows.push(row.slice(0, 2)));
  rows.push([]);
  const departmentHeaderRow = rows.length + 1;
  rows.push(["نتائج الأقسام", "العدد"]);
  departmentRows.forEach((row) => rows.push(row.slice(0, 2)));
  const percentCells = [];
  metrics.forEach((row, index) => { if (row[0] === "نسبة استخدام الموظفين") percentCells.push(`B${index + 6}`); });
  const charts = [];
  if (taskRows.length) charts.push({ title: "المهام حسب الحالة", categoryColumn: "A", valueColumn: "B", startRow: taskHeaderRow + 1, endRow: taskHeaderRow + taskRows.length, fromCol: 3, fromRow: 4, toCol: 8, toRow: 16 });
  if (departmentRows.length) charts.push({ title: "نتائج الأقسام", categoryColumn: "A", valueColumn: "B", startRow: departmentHeaderRow + 1, endRow: departmentHeaderRow + departmentRows.length, fromCol: 3, fromRow: 18, toCol: 8, toRow: 30 });
  return makeSheet("الملخص", rows, { headerRows: [5, taskHeaderRow, departmentHeaderRow], sectionRows: [4], percentCells, widths: [34, 18, 4, 4, 28, 18, 18, 18], charts });
};

const buildSubscription = (cards) => {
  const employeeCurrent = findValue(cards, "Employees Quota", "Current");
  const storageCurrent = findValue(cards, "Storage Quota", "Current (bytes)");
  if (employeeCurrent === null && storageCurrent === null) return null;
  const storageMax = findValue(cards, "Storage Quota", "Max (bytes)");
  const rows = [["استخدام الاشتراك"], ["السعة المتاحة ونسب الاستخدام"], [], ["تفاصيل الاستخدام"], ["المورد", "المستخدم", "الحد", "نسبة الاستخدام"],
    ["الموظفون", employeeCurrent, findValue(cards, "Employees Quota", "Max"), findValue(cards, "Employees Quota", "Percentage")],
    ["التخزين (GB)", typeof storageCurrent === "number" ? storageCurrent / (1024 ** 3) : storageCurrent, typeof storageMax === "number" ? storageMax / (1024 ** 3) : storageMax, findValue(cards, "Storage Quota", "Percentage")]];
  return makeSheet("الاشتراك", rows, { headerRows: [5], sectionRows: [4], percentCells: ["D6", "D7"], widths: [28, 18, 18, 18] });
};
const buildTasks = (cards) => {
  const status = values(cards, "Tasks Summary").map((r) => r.slice(0, 2));
  const ratings = values(cards, "Tasks Rating").map((r) => r.slice(0, 2));
  const monthly = values(cards, "Tasks Performance"); const timeline = values(cards, "Tasks Timeline");
  if (![status, ratings, monthly, timeline].some((items) => items.length)) return null;
  const first = sideBySideRows(status, ratings, ["حالة المهمة", "العدد"], ["التقييم", "العدد"]);
  const secondHeader = 7 + first.length;
  const rows = [["تحليلات المهام"], ["الحالات والتقييم والأداء الشهري"], [], ["الحالات والتقييم"], ...first, [], ["الأداء والوقت"], ...sideBySideRows(monthly, timeline, ["الشهر", "في الموعد", "متأخر"], ["الشهر", "الساعات المتوقعة", "الساعات الفعلية"])];
  return makeSheet("المهام", rows, { headerRows: [5, secondHeader], sectionRows: [4, secondHeader - 1] });
};
const buildProjects = (cards) => {
  const performance = values(cards, "Projects Performance"); const timeline = values(cards, "Project Timeline");
  const progressSource = cards.get("Projects Progress") || cards.get("My Projects") || [];
  const days = new Map();
  for (const [name, rows] of cards) rows.forEach((row) => { if (row[2] === "Days Left") days.set(name, typedValue(row[3])); });
  const progress = progressSource.map((row) => { const done = Number(typedValue(row[3]) || 0); const total = Number(typedValue(row[4]) || 0); return [row[2], done, total, days.get(row[2]) ?? null, total ? done / total : 0]; });
  const recent = values(cards, "Last Projects").length ? values(cards, "Last Projects") : values(cards, "Recent Projects");
  if (![performance, timeline, progress, recent].some((items) => items.length)) return null;
  const first = sideBySideRows(performance, timeline, ["الشهر", "في الموعد", "متأخر"], ["الشهر", "الساعات المتوقعة", "الساعات الفعلية"]);
  const detailHeader = 7 + first.length; const rows = [["تحليلات المشاريع"], ["الأداء الشهري ونسب الإنجاز"], [], ["الأداء والوقت"], ...first, [], ["تفاصيل المشاريع"], ["المشروع", "المهام المكتملة", "إجمالي المهام", "الأيام المتبقية", "نسبة الإنجاز", "", "أحدث مشروع", "القسم"]];
  const percentCells = [];
  for (let i = 0; i < Math.max(progress.length, recent.length); i += 1) { rows.push(pad(pad([], 0, progress[i] || []), 6, recent[i]?.slice(0, 2) || [])); if (progress[i]) percentCells.push(`E${rows.length}`); }
  return makeSheet("المشاريع", rows, { headerRows: [5, detailHeader], sectionRows: [4, detailHeader - 1], percentCells, widths: [30, 18, 18, 18, 18, 4, 30, 24] });
};
const buildEmployees = (cards) => {
  const attendance = values(cards, "Attendance").map((r) => r.slice(0, 2)); const adherence = values(cards, "Adherence").map((r) => r.slice(0, 2));
  const weekly = values(cards, "Performance (Weekly)").map((r) => r.slice(0, 2)); const accomplishment = values(cards, "Accomplishment");
  const delay = values(cards, "Tasks Delay").map((r) => r.slice(0, 2)); const top = values(cards, "Top Employees");
  if (![attendance, adherence, weekly, accomplishment, delay, top].some((items) => items.length)) return null;
  const rows = [["تحليلات الموظفين"], ["الحضور والالتزام والأداء والإنجاز"], [], ["الحضور والالتزام والأداء"], ["حالة الحضور", "العدد", "", "الالتزام", "العدد", "", "الأسبوع", "تقييم الأداء"]];
  for (let i = 0; i < Math.max(attendance.length, adherence.length, weekly.length); i += 1) rows.push(pad(pad(pad([], 0, attendance[i] || []), 3, adherence[i] || []), 6, weekly[i] || []));
  const secondHeader = rows.length + 3; rows.push([], ["الإنجاز والتأخير"], ["الشهر", "الساعات المتوقعة", "الساعات الفعلية", "", "مؤشر التأخير", "القيمة"]);
  for (let i = 0; i < Math.max(accomplishment.length, delay.length); i += 1) rows.push(pad(pad([], 0, accomplishment[i] || []), 4, delay[i] || []));
  const topHeader = rows.length + 3; rows.push([], ["أفضل الموظفين"], ["الموظف", "النقاط", "القسم"]); top.forEach((row) => rows.push(row));
  return makeSheet("الموظفون", rows, { headerRows: [5, secondHeader, topHeader], sectionRows: [4, secondHeader - 1, topHeader - 1] });
};
const buildDepartments = (cards) => {
  const delivery = values(cards, "Performance").map((r) => r.slice(0, 2)); const adherence = values(cards, "Adherence").map((r) => r.slice(0, 2));
  const detailCards = new Map();
  for (const [name, rows] of cards) { if (["Performance", "Adherence", "Ranking"].includes(name)) continue; const detail = {}; rows.forEach((row) => { detail[String(row[2])] = typedValue(row[3]); }); detailCards.set(name, detail); }
  const ranking = (cards.get("Ranking") || []).map((row) => { const detail = detailCards.get(row[2]) || {}; return [row[2], typedValue(row[3]), typedValue(row[4]), detail.Rating ?? null, tr(detail.Manager ?? "N/A")]; });
  if (![delivery, adherence, ranking].some((items) => items.length)) return null;
  const first = sideBySideRows(delivery, adherence, ["نتيجة الإنجاز", "العدد"], ["الالتزام", "العدد"]); const rankingHeader = 7 + first.length;
  const rows = [["تحليلات الأقسام"], ["الإنجاز والحضور والتقييم والمسؤولية"], [], ["ملخص الأقسام"], ...first, [], ["ترتيب الأقسام"], ["القسم", "الأداء", "الحضور", "التقييم", "المدير"]]; ranking.forEach((row) => rows.push(row));
  return makeSheet("الأقسام", rows, { headerRows: [5, rankingHeader], sectionRows: [4, rankingHeader - 1], widths: [38, 18, 18, 18, 28], freezeRow: rankingHeader + 1 });
};
const buildGenericSheets = (flatRows) => {
  const sections = new Map();
  (flatRows || []).forEach((row) => { if (!row?.[0] || !row?.[1] || row[0] === "Section") return; if (!sections.has(row[0])) sections.set(row[0], []); sections.get(row[0]).push(row); });
  return [...sections].map(([section, source]) => { const rows = [[tr(section)], ["تفاصيل التحليلات"], [], ["البيانات"], ["الفئة", "البيان", "القيمة", "قيمة إضافية"]]; source.forEach((row) => rows.push([tr(row[1]), tr(row[2]), typedValue(row[3]), typedValue(row[4])])); return makeSheet(tr(section), rows, { headerRows: [5], sectionRows: [4], widths: [28, 30, 18, 18] }); });
};
export const buildAnalyticsSheets = (flatRows, _fileName, exportedAt = new Date(), locale = "ar") => {
  const cards = parseCards(flatRows); const specialized = [buildSubscription(cards), buildTasks(cards), buildProjects(cards), buildEmployees(cards), buildDepartments(cards)].filter(Boolean);
  return localizeSheets([buildSummary(cards, exportedAt), ...(specialized.length ? specialized : buildGenericSheets(flatRows))], locale);
};
export const buildAnalyticsWorkbook = (XLSX, flatRows, fileName, locale = "ar") => {
  const workbook = XLSX.utils.book_new();
  buildAnalyticsSheets(flatRows, fileName, new Date(), locale).forEach((sheet) => { const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows); worksheet["!cols"] = sheet.widths.map((wch) => ({ wch })); sheet.percentCells.forEach((address) => { if (worksheet[address]) worksheet[address].z = "0.0%"; }); XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name); });
  return workbook;
};
