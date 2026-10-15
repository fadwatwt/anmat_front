"use client";

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import useUnsavedChanges from "@/Hooks/useUnsavedChanges";

export default function UnsavedChangesGuard() {
  const { dirty, isSubmitting } = useFormikContext();
  const { t } = useTranslation();
  useUnsavedChanges(dirty && !isSubmitting, t("You have unsaved changes. Are you sure you want to leave?"));
  return null;
}
