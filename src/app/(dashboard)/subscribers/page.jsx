"use client";

import {
  RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine,
  RiEye2Line,
  RiFlashlightLine,
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";
import { format } from "date-fns";

const headers = [
  { label: "Subscriber", width: "300px" },
  { label: "Company", width: "300px" },
  { label: "Plan", width: "300px" },
  { label: "Industry ", width: "150px" },
  { label: "Subscribed at", width: "150px" },
  { label: "Users", width: "100px" },
  { label: "Status", width: "125px" },
  { label: "", width: "50px" }
];


function Subscribers() {
  const router = useRouter();
  const { data: subscribers, isLoading, error } = useGetSubscribersQuery();
  const [toggleActivation] = useToggleSubscriberActivationMutation();

  const [isDeleteSubAert, setIsDeleteSubAert] = useState(false);
  const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

  const handleDeleteSubAert = () => {
    setIsDeleteSubAert(!isDeleteSubAert);
  }

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
      <div className={"flex justify-between items-start"}>
        <div className={" h-[50px] w-[50px]"}>
          <img className={"rounded-full h-[50px] w-[50px] max-w-full"}
            src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"} />
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-0 overflow-hidden">
        <span
          className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate w-full block max-w-[200px]"
          title={subscriber.name}
        >
          {subscriber.name}
        </span>
        <span
          className="text-xs text-gray-500 truncate w-full block max-w-[200px]"
          title={subscriber.email}
        >
          {subscriber.email}
        </span>
      </div>
    </div>,
    // Company Name cell
    <div key={`${subscriber._id}_company`} className="flex items-center justify-start gap-2">
      <div className={"flex justify-between items-start"}>
        <div className={" h-[50px] w-[50px]"}>
          <img className={"rounded-full h-[50px] w-[50px] max-w-full"}
            src={"/images/company.default.logo.png"} alt={"image-user"} />
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-0 overflow-hidden">
        <span
          className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate w-full block max-w-[200px]"
          title={subscriber.organization?.name || "N/A"}
        >
          {subscriber.organization?.name || "N/A"}
        </span>
        <span
          className="text-xs text-gray-500 truncate w-full block max-w-[200px]"
          title={subscriber.organization?.website || "N/A"}
        >
          {subscriber.organization?.website || "N/A"}
        </span>
      </div>
    </div>,

    // Plan Cell
    <div key={`${subscriber._id}_plan`} className="flex items-center justify-start gap-2">
      <div className="rounded-full p-2 bg-primary-100">
        <div className="rounded-full p-2 bg-primary-200">
          <RiFlashlightLine size={18} className="rounded-full text-primary-500 stroke-[5px]" />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
        {"Standard"}
      </span>
    </div>,

    // Industry and Date cell
    <div key={`${subscriber._id}_industry`} className="text-sm truncate max-w-[120px]" title={subscriber.organization?.industry?.name || "N/A"}>
      {subscriber.organization?.industry?.name || "N/A"}
    </div>,
    <div key={`${subscriber._id}_date`} className="text-sm">
      {subscriber.createdAt ? format(new Date(subscriber.createdAt), "MMM dd, yyyy") : "N/A"}
    </div>,

    // Users Subscribed cell
    <div key={`${subscriber._id}_amount`} className="px-2 py-0.5 text-gray-900 text-xs bg-gray-50 text-center rounded-[25px] w-fit mx-auto">
      {"0"}
    </div>,

    // Status cell
    statusCell(subscriber.is_active ? "active" : "in-active")
  ]) || [];


  const industryOptions = [
    { name: "All", value: "All" },
    { name: "Design", value: "design" },
    { name: "Product Management", value: "product management" }
  ];

  const SubscriptionActions = ({ subscriber }) => {
    const { t, i18n } = useTranslation();
    const statesActions = [
      {
        text: "View", icon: <FiEye className="text-primary-400" />, onClick: () => {
          router.push(`/subscribers/${subscriber._id}/profile`);
        },
      },
      {
        text: "Edit", icon: <RiEditLine className="text-primary-400" />, onClick: () => {
          console.log("Edit", subscriber._id)
        },
      },
      {
        text: subscriber.is_active ? "Deactivate" : "Activate",
        icon: subscriber.is_active ? <RiCloseCircleLine className="text-red-500" /> : <RiCheckboxCircleLine className="text-green-500" />,
        onClick: () => {
          handleToggleActivation(subscriber._id)
        },
      },
      {
        text: "Delete", icon: <RiDeleteBin7Line className="text-red-500" />, onClick: () => {
          handleDeleteSubAert()
          console.log("Delete", subscriber._id)
        },
      }
    ]
    return (
      <StatusActions states={statesActions} className={`${i18n.language === "ar" ? "left-0" : "right-0"
        }`} />
    );
  }

  if (isLoading) return <div className="flex justify-center items-center h-full p-10">Loading subscribers...</div>;
  if (error) return <div className="flex justify-center items-center h-full p-10 text-red-500">Error loading subscribers. Please try again later.</div>;

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
        showIndustryFilter={true}
        customActions={(actualRowIndex) => (
          <SubscriptionActions subscriber={subscribers?.[actualRowIndex]} />)
        }
        industryOptions={industryOptions}
      />
      <CheckAlert
        isOpen={isDeleteSubAert}
        onClose={handleDeleteSubAert}
        type="cancel"
        title="Cancel Subscription"
        confirmBtnText="Yes, Stop"
        description={
          <p>
            Are you sure you want to <span className="font-bold text-black">Delete Subscription</span> of the
            <span className="font-bold text-black"> this client</span>?
          </p>
        }
        onSubmit={() => { }}
      />
      <ApiResponseAlert
        isOpen={apiResponse.isOpen}
        status={apiResponse.status}
        message={apiResponse.message}
        onClose={() => setApiResponse({ ...apiResponse, isOpen: false })}
      />
    </Page>
  );
}

export default Subscribers;