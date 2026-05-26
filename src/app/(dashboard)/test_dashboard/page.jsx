"use client";

import Page from "@/components/Page";
import { useTranslation } from "react-i18next";

function TaskManagementDashboard() {
  const { t } = useTranslation();
  return (
    <Page isTitle={false}>
      <div className="text-gray-700 text-xl dark:text-gray-200">
        {t("This page for testing purposes.")}
      </div>
    </Page>
  );
};

export default TaskManagementDashboard;
