"use client";

import { useTranslation } from "react-i18next";

const categoryConfig = {
  meeting: {
    icon: "🤝",
    defaultColor: "#3B82F6",
    labelKey: "Meeting",
  },
  task: {
    icon: "📋",
    defaultColor: "#8B5CF6",
    labelKey: "Task",
  },
  project: {
    icon: "📁",
    defaultColor: "#10B981",
    labelKey: "Project",
  },
  interview: {
    icon: "🎤",
    defaultColor: "#F59E0B",
    labelKey: "Interview",
  },
  training: {
    icon: "📚",
    defaultColor: "#06B6D4",
    labelKey: "Training",
  },
  deadline: {
    icon: "⏰",
    defaultColor: "#EF4444",
    labelKey: "Deadline",
  },
  other: {
    icon: "📌",
    defaultColor: "#6B7280",
    labelKey: "Other",
  },
};

function AppointmentCategoryBadge({
  category = "other",
  color,
  size = "md",
  showLabel = true,
}) {
  const { t } = useTranslation();

  const config = categoryConfig[category] || categoryConfig.other;
  const badgeColor = color || config.defaultColor;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${badgeColor}20`,
        color: badgeColor,
      }}
    >
      <span>{config.icon}</span>
      {showLabel && <span>{t(config.labelKey)}</span>}
    </span>
  );
}

export default AppointmentCategoryBadge;
