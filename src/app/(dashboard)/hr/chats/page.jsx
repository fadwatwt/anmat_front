"use client";
import React, { useState } from "react";
import Page from "@/components/Page";
import Tabs from "@/components/Tabs.jsx";
import ChatsTab from "@/app/(dashboard)/hr/chats/tabs/ChatsTab";
import ChatPermissionsTab from "@/app/(dashboard)/hr/chats/tabs/ChatPermissionsTab";
import { useTranslation } from "react-i18next";

function ChatsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("Chats");

    const tabsData = [
        {
            title: "Chats",
            content: <ChatsTab />,
        },
        {
            title: "Chat Permissions",
            content: <ChatPermissionsTab />,
        },
    ];

    return (
        <Page title="HR - Chats Management">
            <Tabs tabs={tabsData} setActiveTitleTab={setActiveTab} />
        </Page>
    );
}

export default ChatsPage;

