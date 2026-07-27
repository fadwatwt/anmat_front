"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { LineChart, Line } from "recharts";
import { useTheme } from "@/app/providers";
import { useTranslation } from "react-i18next";

const DEFAULT_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];

function DonutChart({ chart }) {
  const { t } = useTranslation();
  const total = chart.data.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 self-start">
        {t(chart.titleAr || chart.title)}
      </span>
      <div className="flex items-center gap-4 w-full">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={52}
                dataKey="value"
                paddingAngle={2}
              >
                {chart.data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {chart.data.map((entry, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    entry.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
                }}
              />
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {t(entry.name)}
              </span>
              <span className="ms-auto font-semibold text-gray-900 dark:text-gray-100">
                {entry.value}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
            <span className="text-xs text-gray-400">
              {t("Total")}:{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {total}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChartSimple({ chart }) {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {t(chart.titleAr || chart.title)}
      </span>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart.data} barSize={24}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#6b7280",
                fontSize: 11,
              }}
              interval={0}
              angle={chart.data.length > 5 ? -30 : 0}
              textAnchor={chart.data.length > 5 ? "end" : "middle"}
              height={chart.data.length > 5 ? 50 : 30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#6b7280",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chart.data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.fill ||
                    DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function GroupedBarChart({ chart }) {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {t(chart.titleAr || chart.title)}
      </span>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart.data} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#6b7280",
                fontSize: 11,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#6b7280",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
            <Bar
              dataKey="onTime"
              name={t("On Time")}
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
            <Bar
              dataKey="late"
              name={t("Late")}
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LineChartSimple({ chart }) {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
        {t(chart.titleAr || chart.title)}
      </span>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart.data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#6b7280",
                fontSize: 11,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? "#9ca3af" : "#6b7280",
                fontSize: 11,
              }}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="Expected Time"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              name={t("Expected Time")}
            />
            <Line
              type="monotone"
              dataKey="Actual Time"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3 }}
              name={t("Actual Time")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartCard({ chart }) {
  switch (chart.type) {
    case "donut":
      return (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4">
          <DonutChart chart={chart} />
        </div>
      );
    case "bar":
      return (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4">
          <BarChartSimple chart={chart} />
        </div>
      );
    case "groupedBar":
      return (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4">
          <GroupedBarChart chart={chart} />
        </div>
      );
    case "line":
      return (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4">
          <LineChartSimple chart={chart} />
        </div>
      );
    default:
      return null;
  }
}

function AiCharts({ charts }) {
  if (!Array.isArray(charts) || charts.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {charts.map((chart) => (
        <ChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  );
}

export default AiCharts;
