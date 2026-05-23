"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetFreeTokensLimitQuery, useUpdateFreeTokensLimitMutation } from "@/redux/api/aiApi";
import { Loader2, Save } from "lucide-react";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function AiSettingsTab() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetFreeTokensLimitQuery();
  const [updateLimit, { isLoading: isUpdating }] = useUpdateFreeTokensLimitMutation();

  const [limit, setLimit] = useState(5000);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  useEffect(() => {
    if (data && data.limit !== undefined) {
      setLimit(data.limit);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateLimit({ limit: parseInt(limit, 10) }).unwrap();
      setApiResponse({
        isOpen: true,
        status: "success",
        message: t("AI free tokens limit updated successfully"),
      });
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || t("Failed to update AI limit"),
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {t("AI Assistant Settings")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("Configure the global monthly free tokens limit for all users.")}
        </p>

        {isLoading ? (
          <div className="flex items-center gap-2 mt-4 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">{t("Loading settings...")}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-4 max-w-lg">
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="freeTokensLimit" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("Free Tokens Limit")}
              </label>
              <input
                id="freeTokensLimit"
                type="number"
                min="0"
                step="1000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                placeholder="e.g. 5000"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{t("Save Changes")}</span>
            </button>
          </div>
        )}
      </div>

      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ isOpen: false, status: "", message: "" })}
      />
    </div>
  );
}

export default AiSettingsTab;
