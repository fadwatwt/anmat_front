"use client";

import Page from "@/components/Page.jsx";
import LearningPanel from "@/app/(dashboard)/hr/LearningPanel";
import { usePermission } from "@/Hooks/usePermission";

export default function EmployeeLearningPage() {
  const canViewLearning = usePermission("learning.view");
  return <Page title="Learning and skills">{canViewLearning && <LearningPanel />}</Page>;
}
