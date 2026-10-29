"use client";

import Page from "@/components/Page.jsx";
import SurveysPanel from "@/app/(dashboard)/hr/SurveysPanel";
import { usePermission } from "@/Hooks/usePermission";

export default function EmployeeSurveysPage() {
  const canViewSurveys = usePermission("surveys.view");
  return <Page title="Surveys">{canViewSurveys && <SurveysPanel />}</Page>;
}
