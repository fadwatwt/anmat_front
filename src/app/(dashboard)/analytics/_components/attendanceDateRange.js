// Calendar months including the current month, ending today (local date).
export function attendanceDateRange(range, now = new Date()) {
    const months = { '1m': 1, '3m': 3, '6m': 6, '12m': 12 }[range] || 6;
    const format = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return {
        startDate: format(new Date(now.getFullYear(), now.getMonth() - months + 1, 1)),
        endDate: format(now),
    };
}
