export const TIME_RANGE_OPTIONS = [
    { label: "Last Month", value: "1m" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "12m" },
    { label: "All Time", value: "all" },
];

export const resolveTimeRange = (value) => {
    const now = new Date();
    const end = now.toISOString().split("T")[0];

    if (!value || value === "all") {
        return { startDate: undefined, endDate: undefined };
    }

    const months = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };
    const count = months[value] || 6;

    const start = new Date(now.getFullYear(), now.getMonth() - count, 1);
    return {
        startDate: start.toISOString().split("T")[0],
        endDate: end,
    };
};

export const SECTION_OPTIONS = [
    { label: "All Sections", value: "" },
    { label: "Subscription Usage", value: "subscription" },
    { label: "Tasks Analytics", value: "tasks" },
    { label: "Projects Analytics", value: "projects" },
    { label: "Employees Analytics", value: "employees" },
    { label: "Department Analytics", value: "departments" },
];

export const CHART_TYPE_OPTIONS = [
    { label: "All Charts", value: "" },
    { label: "Bar Charts", value: "bar" },
    { label: "Line Charts", value: "line" },
    { label: "Doughnut Charts", value: "doughnut" },
    { label: "Gauge Charts", value: "gauge" },
];
