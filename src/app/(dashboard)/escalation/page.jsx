"use client";

import React, { useState } from "react";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  useGetPendingEscalationsQuery,
  useApproveEscalationMutation,
  useRejectEscalationMutation,
} from "@/redux/api/aiApi";
import { Check, X, MessageCircle, Clock, User } from "lucide-react";

function EscalationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: requests,
    isLoading,
    refetch,
  } = useGetPendingEscalationsQuery();
  const [approveEscalation] = useApproveEscalationMutation();
  const [rejectEscalation] = useRejectEscalationMutation();
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const result = await approveEscalation({ id }).unwrap();
      if (result?.chat_id) {
        router.push(`/chat/${result.chat_id}`);
      }
      refetch();
    } catch (err) {
      console.error("Failed to approve:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    try {
      await rejectEscalation({ id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to reject:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Page title={t("escalationRequests") || "طلبات التحويل لموظف بشري"} isBtn={false}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
        </div>
      ) : !requests || requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <Clock size={48} className="mb-4 opacity-50" />
          <p className="text-lg">{t("noPendingRequests") || "لا توجد طلبات معلقة"}</p>
        </div>
      ) : (
        <div className="grid gap-4 p-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <User size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {request.requester_name || request.requester?.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {request.requester_email || request.requester?.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(request.created_at).toLocaleString("ar-SA")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={processingId === request._id}
                    onClick={() => handleApprove(request._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                  >
                    <Check size={16} />
                    {t("Accept") || "قبول"}
                  </button>
                  <button
                    disabled={processingId === request._id}
                    onClick={() => handleReject(request._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-60 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
                  >
                    <X size={16} />
                    {t("Reject") || "رفض"}
                  </button>
                </div>
              </div>
              {request.message && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {request.message}
                  </p>
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <MessageCircle size={14} />
                <span>
                  {t("requestTime") || "وقت الطلب"}:{" "}
                  {new Date(request.created_at).toLocaleTimeString("ar-SA")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}

export default EscalationPage;
