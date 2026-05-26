"use client";

import Page from "@/components/Page";
import PermissionGuard from "@/components/PermissionGuard";
import { usePermission } from "@/Hooks/usePermission";
import { useTranslation } from "react-i18next";
import AIPlansTab from "../_components/AIPlansTab";

export default function AIPlansPage() {
    const { t } = useTranslation();
    const canCreate = usePermission("admin.subscription_plans.create");
    const canUpdate = usePermission("admin.subscription_plans.update");
    const canDelete = usePermission("admin.subscription_plans.delete");

    return (
        <PermissionGuard permission="admin.subscription_plans.list">
            <Page title={t("AI Token Plans")}>
                <AIPlansTab
                    canCreate={canCreate}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                />
            </Page>
        </PermissionGuard>
    );
}
