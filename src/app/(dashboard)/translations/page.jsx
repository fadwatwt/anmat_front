"use client"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Page from "@/components/Page.jsx";
import Table from "@/components/Tables/Table.jsx";
import StatusActions from "@/components/Dropdowns/StatusActions";
import {
  RiFlashlightLine,
  RiTranslate2,
} from "@remixicon/react";
import { useGetSubscriptionPlansQuery } from "@/redux/plans/subscriptionPlansApi";
import { useGetPlanTranslationsQuery } from "@/redux/plans/planTranslationsApi";
import PlanTranslationsModal from "./_components/PlanTranslations.modal";
import { statusCell } from "@/components/StatusCell";
import PermissionGuard from "@/components/PermissionGuard";
import { usePermission } from "@/Hooks/usePermission";

function SubscriptionPlansTranslationsTab({ canUpdate }) {
  const { t, i18n } = useTranslation();
  const { data: plans } = useGetSubscriptionPlansQuery();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const headers = [
    { label: t("Plan"), width: "200px" },
    { label: t("Price"), width: "120px" },
    { label: t("Arabic"), width: "80px" },
    { label: t("English"), width: "80px" },
    { label: t("Status"), width: "100px" },
    { label: "", width: "50px" },
  ];

  const rows =
    plans?.map((plan) => [
      <div key={`${plan._id}_name`} className="flex items-center gap-2">
        <div className="rounded-full p-2 bg-primary-100">
          <RiFlashlightLine size={16} className="text-primary-500" />
        </div>
        <span className="text-sm font-medium text-cell-primary truncate max-w-[150px]" title={plan.name}>
          {plan.name}
        </span>
      </div>,
      <div key={`${plan._id}_price`} className="text-sm">
        {plan.pricing?.[0]
          ? `${plan.pricing[0].price} / ${plan.pricing[0].interval}`
          : t("N/A")}
      </div>,
      <PlanTranslationBadge key={`${plan._id}_ar`} planId={plan._id} locale="ar" />,
      <PlanTranslationBadge key={`${plan._id}_en`} planId={plan._id} locale="en" />,
      <div key={`${plan._id}_status`}>
        {statusCell(plan.is_active ? "active" : "in-active", plan._id)}
      </div>,
    ]) || [];

  const PlanActions = ({ plan }) => {
    if (!canUpdate) return null;
    return (
      <StatusActions
        states={[
          {
            text: t("Translate"),
            icon: <RiTranslate2 className="text-blue-500" />,
            onClick: () => {
              setSelectedPlan(plan);
              setModalOpen(true);
            },
          },
        ]}
        className={i18n.language === "ar" ? "left-0" : "right-0"}
      />
    );
  };

  return (
    <div>
      <Table
        classContainer={"rounded-2xl px-8"}
        title={t("Subscription Plans Translations")}
        headers={headers}
        isActions={false}
        rows={rows}
        customActions={(actualRowIndex) => (
          <PlanActions plan={plans?.[actualRowIndex]} />
        )}
        isFilter={true}
      />

      {selectedPlan && (
        <PlanTranslationsModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}

function PlanTranslationBadge({ planId, locale }) {
  const { data: translations } = useGetPlanTranslationsQuery(planId);
  const hasTranslation = translations?.some((t) => t.locale === locale);
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
        hasTranslation
          ? "bg-green-100 text-green-700"
          : "bg-badge-bg text-badge-text border border-status-border"
      }`}
    >
      {hasTranslation ? "\u2713" : "\u2717"}
    </span>
  );
}

function TranslationsPageContent() {
  const { t } = useTranslation();
  const canUpdate = usePermission("admin.subscription_plans.update");

  return (
    <Page title={t("Translations")}>
      <SubscriptionPlansTranslationsTab canUpdate={canUpdate} />
    </Page>
  );
}

function TranslationsPage() {
  return (
    <PermissionGuard permission="admin.subscription_plans.list">
      <TranslationsPageContent />
    </PermissionGuard>
  );
}

export default TranslationsPage;
