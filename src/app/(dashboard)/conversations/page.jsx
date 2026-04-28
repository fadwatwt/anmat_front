"use client";
import React from "react";
import Page from "@/components/Page.jsx";
import { useTranslation } from "react-i18next";
import ChatContainer from "@/components/Chat/ChatContainer";

const ConversationPage = () => {
  const { t } = useTranslation();

  return (
    <Page
      isTitle={false}
      className="flex w-full h-screen bg-gray-50 dark:bg-gray-950 p-0"
    >
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t("Team Communications")}
          </h1>
        </div>
        <ChatContainer />
      </div>
    </Page>
  );
};

export default ConversationPage;
