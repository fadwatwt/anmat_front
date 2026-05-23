"use client";

import React, { useState } from "react";
import Page from "@/components/Page.jsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useGetTokensBalanceQuery, useGetTokenHistoryQuery } from "@/redux/api/aiApi";
import { CreditCard, Calendar, BarChart3, Receipt, ArrowUpRight, ArrowDownRight, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

const AnalyticsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: balanceData, isLoading: loadingBalance } = useGetTokensBalanceQuery();
  const { data: historyData, isLoading: loadingHistory } = useGetTokenHistoryQuery({ page, limit });

  // Map daily usage for Recharts
  const chartData = (balanceData?.daily_usage || []).map((item) => ({
    name: format(new Date(item._id), "MMM dd"),
    tokens: item.total,
  }));

  // Calculate 30-day usage sum
  const totalThirtyDayUsage = (balanceData?.daily_usage || []).reduce(
    (acc, curr) => acc + curr.total,
    0
  );

  // Calculate next renewal date (last renewal + 30 days)
  const getNextRenewalDate = () => {
    if (!balanceData?.last_renewal) return "N/A";
    const date = new Date(balanceData.last_renewal);
    date.setDate(date.getDate() + 30);
    return format(date, "MMM dd, yyyy");
  };

  const getTransactionTypeBadge = (type) => {
    switch (type) {
      case "topup":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
            <ArrowUpRight size={12} />
            Top-up
          </span>
        );
      case "monthly_replenish":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
            <RefreshCw size={12} />
            Monthly Free
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
            <ArrowDownRight size={12} />
            Consumption
          </span>
        );
    }
  };

  const getTransactionAmountClass = (type) => {
    return type === "consume" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400";
  };

  const getFormattedAmount = (amount, type) => {
    const formatted = Math.abs(amount).toLocaleString();
    return type === "consume" ? `-${formatted}` : `+${formatted}`;
  };

  const totalPages = historyData ? Math.ceil(historyData.total / limit) : 0;

  return (
    <Page isTitle={false}>
      <div className="flex flex-col gap-8 bg-gray-50 dark:bg-gray-950 p-6 sm:p-8 min-h-[calc(100vh-100px)]">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            AI Assistant Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitor your token usage, daily consumption trends, and detailed transaction ledger.
          </p>
        </div>

        {loadingBalance ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <span className="text-gray-500 dark:text-gray-400 font-medium">Loading analytics dashboard...</span>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Balance */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex items-start justify-between shadow-sm">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Tokens Balance
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                    {balanceData?.balance?.toLocaleString() || 0}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Limit: {balanceData?.free_limit?.toLocaleString() || "5,000"} tokens
                  </p>
                </div>
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/20 rounded-2xl">
                  <CreditCard className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                </div>
              </div>

              {/* Card 2: 30-Day Consumption */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex items-start justify-between shadow-sm">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    30-Day Consumption
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                    {totalThirtyDayUsage.toLocaleString()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Cumulative tokens deducted in last 30 days
                  </p>
                </div>
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">
                  <BarChart3 className="text-rose-600 dark:text-rose-400 w-6 h-6" />
                </div>
              </div>

              {/* Card 3: Next replenishment */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex items-start justify-between shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Replenishment Cycle
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                    {getNextRenewalDate()}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Date of next monthly free token replenishment
                  </p>
                </div>
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl">
                  <Calendar className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Consumption Trend Chart */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Daily Token Consumption (Last 30 Days)
              </h2>
              {chartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <span className="text-gray-400 text-sm">No recent consumption data to display</span>
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#375DFB" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#375DFB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.15)" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.8)",
                          borderRadius: "12px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="tokens"
                        stroke="#375DFB"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTokens)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Transaction Ledger Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt size={20} className="text-gray-400" />
                  Transaction History Log
                </h2>
              </div>

              {loadingHistory ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
              ) : !historyData?.transactions || historyData.transactions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <p className="text-gray-400 text-sm">No transaction ledger history found.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800/80">
                    <table className="min-w-full divide-y divide-gray-150 dark:divide-gray-800">
                      <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Transaction Type
                          </th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Amount (Tokens)
                          </th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Balance After
                          </th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-150 dark:divide-gray-800">
                        {historyData.transactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getTransactionTypeBadge(tx.type)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getTransactionAmountClass(tx.type)}`}>
                              {getFormattedAmount(tx.amount, tx.type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                              {tx.balance_after?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {format(new Date(tx.created_at || tx.date), "MMM dd, yyyy HH:mm")}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
                              {tx.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80">
                      <span className="text-xs text-gray-500">
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={page === 1}
                          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                          className="p-1.5 rounded-lg border border-gray-250 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          disabled={page === totalPages}
                          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                          className="p-1.5 rounded-lg border border-gray-250 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default AnalyticsPage;
