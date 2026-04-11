"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Page from "@/components/Page.jsx";
import Tabs from "@/components/Tabs.jsx";
import ProjectsTab from "@/app/(dashboard)/projects/tabs/ProjectsTab.jsx";
import TemplatesTab from "@/app/(dashboard)/projects/tabs/TemplatesTab.jsx";

function ProjectPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(0);

  const handleCreateBtn = () => {
    if (activeTab === 0) {
      router.push("/projects/create");
    } else {
      router.push("/projects/templates/create");
    }
  };

  const tabsData = [
    {
      title: "Projects",
      content: <ProjectsTab />,
    },
    {
      title: "Templates",
      content: <TemplatesTab />,
    },
  ];

  const btnTitle = activeTab === 0 ? t("Create a Project") : t("Create a Template");

  return (
    <Page
      title={t("Projects")}
      isBtn={true}
      btnOnClick={handleCreateBtn}
      btnTitle={btnTitle}
    >
      <Tabs tabs={tabsData} activeTab={activeTab} onTabChange={setActiveTab} />
    </Page>
  );
}

export default ProjectPage;
