export const REQUEST_TYPE_KEYS = ["DAY_OFF", "WORK_DELAY", "SALARY_ADVANCE", "SHORT_LEAVE"];

export function countRequestsByType(requests = []) {
    const counts = { DAY_OFF: 0, WORK_DELAY: 0, SALARY_ADVANCE: 0, SHORT_LEAVE: 0 };
    for (const req of requests || []) {
        if (req && Object.prototype.hasOwnProperty.call(counts, req.type)) {
            counts[req.type] += 1;
        }
    }
    return counts;
}

function escapeCsvCell(value) {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function buildRequestsCsv(requests = []) {
    const header = ["Type", "Employee", "Email", "Status", "Reason", "Created At"];
    const lines = [header.map(escapeCsvCell).join(",")];
    for (const req of requests || []) {
        lines.push([
            req?.type || "",
            req?.employee?.name || "",
            req?.employee?.email || "",
            req?.status || "",
            req?.reason || "",
            req?.created_at || "",
        ].map(escapeCsvCell).join(","));
    }
    return lines.join("\n");
}

export function downloadCsvFile(filename, csvText) {
    const blob = new Blob(["\uFEFF" + csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
