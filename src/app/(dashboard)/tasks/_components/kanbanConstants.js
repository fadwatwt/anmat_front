export const KANBAN_COLUMNS = [
  { id: "open", label: "Open", color: "#3B82F6", bgColor: "#EFF6FF", darkBgColor: "#1E3A5F", darkBorderColor: "#2563EB" },
  { id: "pending", label: "Pending", color: "#F59E0B", bgColor: "#FFFBEB", darkBgColor: "#78350F", darkBorderColor: "#D97706" },
  { id: "in-progress", label: "In Progress", color: "#8B5CF6", bgColor: "#F5F3FF", darkBgColor: "#4C1D95", darkBorderColor: "#7C3AED" },
  { id: "completed", label: "Completed", color: "#10B981", bgColor: "#ECFDF5", darkBgColor: "#064E3B", darkBorderColor: "#059669" },
  { id: "done", label: "Done", color: "#059669", bgColor: "#D1FAE5", darkBgColor: "#022C22", darkBorderColor: "#047857" },
  { id: "rejected", label: "Rejected", color: "#EF4444", bgColor: "#FEF2F2", darkBgColor: "#7F1D1D", darkBorderColor: "#DC2626" },
  { id: "cancelled", label: "Cancelled", color: "#6B7280", bgColor: "#F9FAFB", darkBgColor: "#374151", darkBorderColor: "#4B5563" },
];

export const PRIORITY_COLORS = {
  low: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  medium: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  high: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  urgent: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
};
