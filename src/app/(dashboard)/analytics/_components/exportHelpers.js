import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const HEADERS = ['Section', 'Card', 'Label', 'Value 1', 'Value 2'];

const pushRows = (rows, section, card, items, labelKey, val1Key, val2Key) => {
  (items || []).forEach((item) => {
    rows.push([section, card, String(item[labelKey] ?? ''), String(item[val1Key] ?? ''), val2Key ? String(item[val2Key] ?? '') : '']);
  });
};

const pushKv = (rows, section, card, key, val) => {
  rows.push([section, card, String(key), String(val ?? ''), '']);
};

const pushSep = (rows) => {
  rows.push(['', '', '', '', '']);
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const exportAsPdf = async (elements, baseName = 'report') => {
  const pdf = new jsPDF('l', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const imgWidth = pageWidth - margin * 2;
  const maxImgHeight = pageHeight - margin * 2;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, Math.min(imgHeight, maxImgHeight) / 1.1);
    } catch (e) {
      console.warn('Failed to capture element', e);
    }
  }

  pdf.save(`${baseName}_${today()}.pdf`);
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportCsv = (headers, rows, fileName = 'report') => {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = '\uFEFF' + [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\r\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${fileName}.csv`);
};

export const exportXlsx = async (headers, rows, fileName = 'report') => {
  const XLSX = await import('xlsx');
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = headers.map(() => ({ wch: 25 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  downloadBlob(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${fileName}.xlsx`);
};

export const formatSubscriberAnalytics = (data) => {
  const rows = [];
  const d = data || {};

  const sub = d.subscriptionUsage || {};
  pushSep(rows);
  rows.push(['Subscription Usage', '', '', '', '']);
  rows.push(HEADERS);
  if (sub.employees) {
    pushKv(rows, 'Subscription Usage', 'Employees Quota', 'Current', sub.employees.current);
    pushKv(rows, 'Subscription Usage', 'Employees Quota', 'Max', sub.employees.max);
    pushKv(rows, 'Subscription Usage', 'Employees Quota', 'Percentage', `${sub.employees.percentage}%`);
  }
  if (sub.storage) {
    pushKv(rows, 'Subscription Usage', 'Storage Quota', 'Current (bytes)', sub.storage.currentBytes);
    pushKv(rows, 'Subscription Usage', 'Storage Quota', 'Max (bytes)', sub.storage.maxBytes);
    pushKv(rows, 'Subscription Usage', 'Storage Quota', 'Percentage', `${sub.storage.percentage}%`);
  }

  if (d.tasksSummary && d.tasksSummary.length) {
    pushSep(rows);
    rows.push(['Tasks Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Tasks Analytics', 'Tasks Summary', d.tasksSummary, 'name', 'value');
  }

  if (d.tasksRatingData && d.tasksRatingData.length) {
    pushRows(rows, 'Tasks Analytics', 'Tasks Rating', d.tasksRatingData, 'name', 'value');
  }

  if (d.tasksPerformanceMonthly && d.tasksPerformanceMonthly.length) {
    pushRows(rows, 'Tasks Analytics', 'Tasks Performance', d.tasksPerformanceMonthly, 'name', 'onTime', 'late');
  }

  if (d.tasksTimelineMonthly && d.tasksTimelineMonthly.length) {
    pushRows(rows, 'Tasks Analytics', 'Tasks Timeline', d.tasksTimelineMonthly, 'name', 'Expected Time', 'Actual Time');
  }

  if (d.projectsPerformanceMonthly && d.projectsPerformanceMonthly.length) {
    pushSep(rows);
    rows.push(['Projects Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Projects Analytics', 'Projects Performance', d.projectsPerformanceMonthly, 'name', 'onTime', 'late');
  }

  if (d.projectTimelineMonthly && d.projectTimelineMonthly.length) {
    pushRows(rows, 'Projects Analytics', 'Project Timeline', d.projectTimelineMonthly, 'name', 'Expected Time', 'Actual Time');
  }

  if (d.projectsProgress && d.projectsProgress.length) {
    pushRows(rows, 'Projects Analytics', 'Projects Progress', d.projectsProgress, 'name', 'completedTasks', 'totalTasks');
    d.projectsProgress.forEach((p) => {
      pushKv(rows, 'Projects Analytics', p.name || '', 'Days Left', p.daysLeft);
    });
  }

  if (d.recentProjects && d.recentProjects.length) {
    pushRows(rows, 'Projects Analytics', 'Last Projects', d.recentProjects, 'name', 'department');
  }

  if (d.employeeAttendance && d.employeeAttendance.length) {
    pushSep(rows);
    rows.push(['Employees Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Employees Analytics', 'Attendance', d.employeeAttendance, 'name', 'value');
  }

  if (d.employeeAdherence && d.employeeAdherence.length) {
    pushRows(rows, 'Employees Analytics', 'Adherence', d.employeeAdherence, 'name', 'value');
  }

  if (d.employeePerformanceWeeks && d.employeePerformanceWeeks.length) {
    pushRows(rows, 'Employees Analytics', 'Performance (Weekly)', d.employeePerformanceWeeks, 'name', 'rating');
  }

  if (d.accomplishmentMonthly && d.accomplishmentMonthly.length) {
    pushRows(rows, 'Employees Analytics', 'Accomplishment', d.accomplishmentMonthly, 'name', 'Expected Time', 'Actual Time');
  }

  if (d.tasksDelay) {
    pushKv(rows, 'Employees Analytics', 'Tasks Delay', 'Delay %', `${d.tasksDelay.percentage}%`);
    pushKv(rows, 'Employees Analytics', 'Tasks Delay', 'Expected Hours', d.tasksDelay.expectedHours);
    pushKv(rows, 'Employees Analytics', 'Tasks Delay', 'Actual Hours', d.tasksDelay.actualHours);
  }

  if (d.topEmployees && d.topEmployees.length) {
    pushRows(rows, 'Employees Analytics', 'Top Employees', d.topEmployees, 'name', 'points', 'department');
  }

  if (d.departmentAdherence && d.departmentAdherence.length) {
    pushSep(rows);
    rows.push(['Department Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Department Analytics', 'Adherence', d.departmentAdherence, 'name', 'value');
  }

  if (d.departmentPerformance && d.departmentPerformance.length) {
    pushRows(rows, 'Department Analytics', 'Performance', d.departmentPerformance, 'name', 'value');
  }

  if (d.departmentsRanking && d.departmentsRanking.length) {
    pushRows(rows, 'Department Analytics', 'Ranking', d.departmentsRanking, 'name', 'performance', 'attendance');
    d.departmentsRanking.forEach((r) => {
      pushKv(rows, 'Department Analytics', r.name || '', 'Rating', r.rating);
      pushKv(rows, 'Department Analytics', r.name || '', 'Manager', r.manager);
    });
  }

  return { headers: HEADERS, rows, fileName: `analytics_report_${today()}` };
};

export const formatAdminAnalytics = (data) => {
  const rows = [];
  const d = data || {};

  pushSep(rows);
  rows.push(['Overview', '', '', '', '']);
  rows.push(HEADERS);
  pushKv(rows, 'Overview', 'Companies', 'Total', d.totalCompanies);
  pushKv(rows, 'Overview', 'Projects', 'Total', d.totalProjects);
  pushKv(rows, 'Overview', 'Tasks', 'Total', d.totalTasks);
  pushKv(rows, 'Overview', 'Users', 'Total', d.totalUsers);

  if (d.industriesChart && d.industriesChart.length) {
    pushSep(rows);
    rows.push(['Companies Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Companies Analytics', 'Industries', d.industriesChart, 'name', 'value');
  }

  if (d.companiesSubscriptionsMonthly && d.companiesSubscriptionsMonthly.length) {
    pushRows(rows, 'Companies Analytics', 'Monthly Subscriptions', d.companiesSubscriptionsMonthly, 'name', 'total');
  }

  if (d.companiesContacted) {
    const cc = d.companiesContacted;
    pushKv(rows, 'Companies Analytics', 'Companies Contacted', 'Total', cc.total);
    if (cc.records) {
      pushRows(rows, 'Companies Analytics', 'Contacted Breakdown', cc.records, 'title', 'value');
    }
  }

  if (d.topCompanies && d.topCompanies.length) {
    pushRows(rows, 'Companies Analytics', 'Top Companies', d.topCompanies, 'name', 'users', 'email');
  }

  if (d.lastProjects && d.lastProjects.length) {
    pushSep(rows);
    rows.push(['Projects Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Projects Analytics', 'Last Projects', d.lastProjects, 'name', 'desc');
  }

  if (d.projectsPerformanceMonthly && d.projectsPerformanceMonthly.length) {
    pushRows(rows, 'Projects Analytics', 'Performance', d.projectsPerformanceMonthly, 'name', 'onTime', 'late');
  }

  if (d.projectTimelineMonthly && d.projectTimelineMonthly.length) {
    pushRows(rows, 'Projects Analytics', 'Timeline', d.projectTimelineMonthly, 'name', 'Expected Time', 'Actual Time');
  }

  if (d.revenuesMonthly && d.revenuesMonthly.length) {
    pushSep(rows);
    rows.push(['Revenues & Engagement', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Revenues & Engagement', 'Monthly Revenues', d.revenuesMonthly, 'name', 'value');
  }

  return { headers: HEADERS, rows, fileName: `admin_analytics_report_${today()}` };
};

export const formatEmployeeAnalytics = (data) => {
  const rows = [];
  const d = data || {};

  const ov = d.overview || {};
  pushSep(rows);
  rows.push(['Overview', '', '', '', '']);
  rows.push(HEADERS);
  pushKv(rows, 'Overview', 'Total Points', '', ov.totalPoints);
  pushKv(rows, 'Overview', 'Shift Type', '', ov.shiftType);
  pushKv(rows, 'Overview', 'Total Projects', '', ov.totalProjects);
  pushKv(rows, 'Overview', 'Total Tasks', '', ov.totalTasks);

  if (d.tasksSummary && d.tasksSummary.length) {
    pushSep(rows);
    rows.push(['Tasks Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Tasks Analytics', 'Tasks Summary', d.tasksSummary, 'name', 'value');
  }

  if (d.tasksRatingData && d.tasksRatingData.length) {
    pushRows(rows, 'Tasks Analytics', 'Tasks Rating', d.tasksRatingData, 'name', 'value');
  }

  if (d.tasksPerformanceMonthly && d.tasksPerformanceMonthly.length) {
    pushRows(rows, 'Tasks Analytics', 'Tasks Performance', d.tasksPerformanceMonthly, 'name', 'onTime', 'late');
  }

  if (d.tasksTimelineMonthly && d.tasksTimelineMonthly.length) {
    pushRows(rows, 'Tasks Analytics', 'Tasks Timeline', d.tasksTimelineMonthly, 'name', 'Expected Time', 'Actual Time');
  }

  if (d.projectsPerformanceMonthly && d.projectsPerformanceMonthly.length) {
    pushSep(rows);
    rows.push(['Projects Analytics', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Projects Analytics', 'Projects Performance', d.projectsPerformanceMonthly, 'name', 'onTime', 'late');
  }

  if (d.projectTimelineMonthly && d.projectTimelineMonthly.length) {
    pushRows(rows, 'Projects Analytics', 'Project Timeline', d.projectTimelineMonthly, 'name', 'Expected Time', 'Actual Time');
  }

  if (d.projectsPerformance && d.projectsPerformance.length) {
    pushRows(rows, 'Projects Analytics', 'My Projects', d.projectsPerformance, 'name', 'completedTasks', 'totalTasks');
  }

  if (d.recentProjects && d.recentProjects.length) {
    pushRows(rows, 'Projects Analytics', 'Recent Projects', d.recentProjects, 'name', 'department');
  }

  if (d.departmentsPerformance && d.departmentsPerformance.length) {
    pushSep(rows);
    rows.push(['Departments', '', '', '', '']);
    rows.push(HEADERS);
    pushRows(rows, 'Departments', 'Performance', d.departmentsPerformance, 'name', 'rate');
  }

  return { headers: HEADERS, rows, fileName: `my_analytics_report_${today()}` };
};
