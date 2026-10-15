"use client";
import { ImSpinner2 } from "react-icons/im";

import {
  RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine,
  RiEye2Line, RiFlashlightLine, RiNotification4Line,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import { statusCell } from "@/components/StatusCell";
import { RiDeleteBin7Line } from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useGetSubscribersQuery, useToggleSubscriberActivationMutation } from "@/redux/subscribers/subscribersApi";
import { useGetIndustriesQuery } from "@/redux/industries/industriesApi";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { format } from "date-fns";
import { getDateLocale } from "@/lib/dateLocale";
import SendAdminNotificationModal from "@/components/Modal/SendAdminNotificationModal";

import InitialsAvatar from "@/components/InitialsAvatar";




function Subscribers() {
  const { t } = useTranslation();
  const headers = [
    { label: t("Subscriber"), width: "250px" },
    { label: t("Company"), width: "250px" },
    { label: t("Plan"), width: "150px" },
    { label: t("Industry"), width: "150px" },
    { label: t("Subscribed at"), width: "150px" },
    { label: t("Expires at"), width: "150px" },
    { label: t("Users"), width: "100px" },
    { label: t("Status"), width: "125px" },
    { label: "", width: "50px" }
  ];
  const router = useRouter();
  const { data: subscribers, isLoading, error } = useGetSubscribersQuery();
  const [toggleActivation] = useToggleSubscriberActivationMutation();

  const { data: industriesResponse } = useGetIndustriesQuery("en");
  const [pendingDeactivate, setPendingDeactivate] = useState(null);
  const [isDeactivateAlert, setIsDeactivateAlert] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState(null);

  const handleToggleActivation = async (id) => {
    try {
      const result = await toggleActivation(id).unwrap();
      setApiResponse({
        isOpen: true,
        status: result.status || "success",
        message: result.message || "Subscriber status updated successfully",
      });
    } catch (err) {
      setApiResponse({
        isOpen: true,
        status: "error",
        message: err?.data?.message || err?.message || "Failed to update subscriber status",
      });
      console.error("Failed to toggle activation:", err);
    }
  };

  // Transform data into the format expected by the Table component
  const rows = subscribers?.map(subscriber => [
    <div key={`${subscriber._id}_subscriber`} className="flex items-center justify-start gap-2">
      <InitialsAvatar name={subscriber.name} size="40px" fontSize="text-sm" />
      <div className="flex flex-col items-start justify-start gap-0 overflow-hidden">
        <span
          className="text-sm font-medium text-cell-primary truncate w-full block max-w-[200px]"
          title={subscriber.name}
        >
          {subscriber.name}
        </span>
        <span
          className="text-xs text-cell-secondary truncate w-full block max-w-[200px]"
          title={subscriber.email}
        >
          {subscriber.email}
        </span>
      </div>
    </div>,
    // Company Name cell
    <div key={`${subscriber._id}_company`} className="flex items-center justify-start gap-2">
      <InitialsAvatar name={subscriber.organization?.name || "C"} size="40px" fontSize="text-sm" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" />
      <div className="flex flex-col items-start justify-start gap-0 overflow-hidden">
        <span
          className="text-sm font-medium text-cell-primary truncate w-full block max-w-[200px]"
          title={subscriber.organization?.name || t("N/A")}
        >
          {subscriber.organization?.name || t("N/A")}
        </span>
        <span
          className="text-xs text-cell-secondary truncate w-full block max-w-[200px]"
          title={subscriber.organization?.website || t("N/A")}
        >
          {subscriber.organization?.website || t("N/A")}
        </span>
      </div>
    </div>,

    // Plan Cell
    <div key={`${subscriber._id}_plan`} className="flex items-center justify-start gap-2">
      <div className="rounded-full p-1 bg-primary-100">
        <div className="rounded-full p-1 bg-primary-200">
          <RiFlashlightLine size={14} className="rounded-full text-primary-500 stroke-[5px]" />
        </div>
      </div>
      <span className="text-sm font-medium text-cell-primary">
        {subscriber.activePlan?.name || t("N/A")}
      </span>
    </div>,

    // Industry and Date cell
    <div key={`${subscriber._id}_industry`} className="text-sm text-cell-secondary truncate max-w-[120px]" title={subscriber.organization?.industry?.name || t("N/A")}>
      {subscriber.organization?.industry?.name || t("N/A")}
    </div>,
    <div key={`${subscriber._id}_date`} className="text-sm text-cell-secondary">
      {(subscriber.subscribed_at || subscriber.createdAt) ? format(new Date(subscriber.subscribed_at || subscriber.createdAt), "MMM dd, yyyy", { locale: getDateLocale() }) : t("N/A")}
    </div>,
    <div key={`${subscriber._id}_expiry`} className="text-sm text-cell-secondary">
      {subscriber.expires_at ? format(new Date(subscriber.expires_at), "MMM dd, yyyy", { locale: getDateLocale() }) : t("N/A")}
    </div>,

    // Users Subscribed cell
    <div key={`${subscriber._id}_amount`} className="px-2 py-0.5 text-xs text-badge-text bg-badge-bg border border-status-border text-center rounded-[25px] w-fit mx-auto">
      {subscriber.total_users || "0"}
    </div>,

    // Status cell
    statusCell(subscriber.is_active ? "active" : "in-active")
  ]) || [];


  const industryOptions = useMemo(() => {
    const list = industriesResponse?.data || industriesResponse || [];
    if (!Array.isArray(list) || list.length === 0) {
        return [
            { name: "All", value: "All" },
            { name: "Design", value: "design" },
            { name: "Product Management", value: "product management" }
        ];
    }
    return [
        { name: "All", value: "All" },
        ...list.map((ind) => ({ name: ind.name, value: ind._id || ind.name }))
    ];
  }, [industriesResponse]);

  const SubscriptionActions = ({ subscriber }) => {
    const { t, i18n } = useTranslation();
    const statesActions = [
      {
        text: t("View"), icon: <FiEye className="text-primary-400" />, onClick: () => {
          router.push(`/subscribers/${subscriber._id}`);
        },
      },
      {
        text: subscriber.is_active ? t("Deactivate") : t("Activate"),
        icon: subscriber.is_active ? <RiCloseCircleLine className="text-red-500" /> : <RiCheckboxCircleLine className="text-green-500" />,
        onClick: () => {
          if (subscriber.is_active) {
              setPendingDeactivate(subscriber);
              setIsDeactivateAlert(true);
          } else {
              handleToggleActivation(subscriber._id);
          }
        },
      },
      {
        text: t("Send Notification"), icon: <RiNotification4Line className="text-primary-400" />, onClick: () => {
          setNotifyTarget(subscriber);
          setIsNotifyModalOpen(true);
        },
      },
    ]
    return (
      <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
        }`} />
    );
  }

  if (isLoading) return <div className="flex justify-center items-center h-full p-10"> <div className="flex items-center justify-center w-full p-4"><ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} /></div> </div>;
  if (error) return <div className="flex justify-center items-center h-full p-10 text-red-500">{t("Error loading subscribers. Please try again later.")}</div>;

  return (
    <Page title="Subscribers" isBtn={false}>
      <Table
        classContainer={"rounded-2xl px-8"}
        title="All Subscribers"
        headers={headers}
        isActions={false}
        rows={rows}
        isFilter={true}
        showStatusFilter={true}
        statusOptions={[
          { id: "active", value: "active", name: t("Active") },
          { id: "in-active", value: "in-active", name: t("Inactive") },
        ]}
        showIndustryFilter={true}
        customActions={(actualRowIndex) => (
          <SubscriptionActions subscriber={subscribers?.[actualRowIndex]} />)
        }
        industryOptions={industryOptions}
        onRowClick={(index) => {
          if (subscribers?.[index]?._id) {
            router.push(`/subscribers/${subscribers[index]._id}`);
          }
        }}
      />
      <CheckAlert
        isOpen={isDeactivateAlert}
        onClose={() => { setIsDeactivateAlert(false); setPendingDeactivate(null); }}
        type="cancel"
        title={t("Deactivate Subscriber")}
        confirmBtnText={t("Yes, Deactivate")}
        description={
          <p className="text-cell-secondary">{t("Are you sure you want to deactivate")} <b>{pendingDeactivate?.name}</b>?</p>
        }
        onSubmit={async (confirmed) => {
          if (confirmed && pendingDeactivate) {
              await handleToggleActivation(pendingDeactivate._id);
          }
          setIsDeactivateAlert(false);
          setPendingDeactivate(null);
        }}
      />
      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
      />

      <SendAdminNotificationModal
        isOpen={isNotifyModalOpen}
        onClose={() => { setIsNotifyModalOpen(false); setNotifyTarget(null); }}
        preSelectedUser={notifyTarget}
        sourceType="subscriber"
      />
    </Page>
  );
}

export default Subscribers;
