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
      className="w-full h-full p-0 m-0 overflow-hidden"
    >
      <div className="w-full h-full overflow-hidden bg-main">
        <ChatContainer />
      </div>
    </Page>
  );
};

export default ConversationPage;
