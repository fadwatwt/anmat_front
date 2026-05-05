"use client";

import {
     RiCheckboxCircleLine, RiCloseCircleLine, RiEditLine,
    RiFlashlightLine,
} from "@remixicon/react";
import {useTranslation} from "react-i18next";
import Table from "@/components/Tables/Table";
import Page from "@/components/Page";
import {statusCell} from "@/components/StatusCell";
import {RiDeleteBin7Line} from "react-icons/ri";
import StatusActions from "@/components/Dropdowns/StatusActions";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import {useState} from "react";
import { useGetSubscriptionsBasicDetailsQuery, useUpdateSubscriptionStatusMutation } from "@/redux/subscriptions/subscriptionsApi";
import { format } from "date-fns";

const headers = [
    { label: "Subscriber", width: "300px" },
    { label: "Company", width: "300px" },
    { label: "Subscribed at", width: "150px" },
    { label: "Expires at", width: "150px" },
    { label: "Status", width: "125px" },
    { label: "", width: "50px" }
];


function AdminCompaniesSubscriptions() {
    const { data: subscriptions, isLoading, error } = useGetSubscriptionsBasicDetailsQuery();
    const [updateStatus] = useUpdateSubscriptionStatusMutation();
    const { t } = useTranslation();

    const [isDeleteSubAert,setIsDeleteSubAert] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const handleDeleteSubAert = (sub = null) => {
        setSelectedSubscription(sub);
        setIsDeleteSubAert(!isDeleteSubAert);
    }

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
        } catch (err) {
            console.error("Failed to update subscription status:", err);
        }
    };

    // Transform data into the format expected by the Table component
    const rows = subscriptions?.map(item => [
        <div key={`${item.subscription._id}_subscriber`} className="flex items-center justify-start gap-2">
            <div className={"flex justify-between items-start"}>
                <div className={" h-[40px] w-[40px]"}>
                    <img className={"rounded-full h-[40px] w-[40px] max-w-full"}
                         src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"}/>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-0">
                <span className="text-sm font-medium text-cell-primary">
                    {item.subscriber?.name || "N/A"}
                </span>
                <span className="text-xs text-cell-secondary">
                    {item.subscriber?.email || "N/A"}
                </span>
            </div>
        </div>,
        // Company Name cell
        <div key={`${item.subscription._id}_company`} className="flex flex-col items-start justify-start gap-0">
            <span className="text-sm font-medium text-cell-primary">
                {item.organization?.name || "N/A"}
            </span>
            <span className="text-xs text-cell-secondary">
                {item.organization?.website || "N/A"}
            </span>
        </div>,

        // Dates
        <div key={`${item.subscription._id}_start`} className="text-sm text-cell-secondary">
            {item.subscription.starts_at ? format(new Date(item.subscription.starts_at), "MMM dd, yyyy") : "N/A"}
        </div>,
        <div key={`${item.subscription._id}_end`} className="text-sm text-cell-secondary">
            {item.subscription.expires_at ? format(new Date(item.subscription.expires_at), "MMM dd, yyyy") : "N/A"}
        </div>,

        // Status cell
        statusCell(item.subscription.status)
    ]) || [];


    const  SubscriptionActions = ({ item }) => {
        const { i18n } = useTranslation();
        const statesActions = [
            {
                text: "Active", icon: <RiCheckboxCircleLine className="text-green-500"/>, onClick: () => {
                    handleUpdateStatus(item.subscription._id, "active");
                },
            },
            {
                text: "Deactivate", icon: <RiCloseCircleLine className="text-red-500"/>, onClick: () => {
                    handleUpdateStatus(item.subscription._id, "inactive");
                },
            },
            {
                text: "Terminate", icon: <RiDeleteBin7Line className="text-red-500"/>, onClick: () => {
                    handleDeleteSubAert(item);
                },
            }
        ]
        return (
            <StatusActions states={statesActions}  className={`${
                i18n.language === "ar" ? "left-0" : "right-0"
            }`}/>
        );
    }

    if (isLoading) return <div className="p-10 text-center">Loading subscriptions...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Error loading subscriptions</div>;

    return (
        <Page title="Subscriptions" isBtn={false}>
            <Table
                classContainer={"rounded-2xl px-8"}
                title="All Subscriptions"
                headers={headers}
                isActions={false}
                rows={rows}
                isFilter={true}
                showStatusFilter={true}
                customActions={(actualRowIndex) => (
                    <SubscriptionActions item={subscriptions?.[actualRowIndex]} />)
                }
            />
            <CheckAlert
                isOpen={isDeleteSubAert}
                onClose={() => handleDeleteSubAert()}
                type="cancel"
                title="Terminate Subscription"
                confirmBtnText="Yes, Terminate"
                description={
                    <p className="text-cell-secondary">
                        Are you sure you want to <span className="font-bold text-cell-primary">Terminate Subscription</span> of 
                        <span className="font-bold text-cell-primary"> {selectedSubscription?.subscriber?.name}</span>?
                    </p>
                }
                onSubmit={() => {
                    if (selectedSubscription) {
                        handleUpdateStatus(selectedSubscription.subscription._id, "terminated");
                        handleDeleteSubAert();
                    }
                }}
            />
        </Page>
    );
}

export default AdminCompaniesSubscriptions;