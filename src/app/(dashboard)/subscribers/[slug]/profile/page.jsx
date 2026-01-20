"use client"
import {
    RiBriefcaseLine,
    RiBuilding2Line,
    RiCake2Line,
    RiCalendarLine,
    RiCheckboxCircleFill,
    RiCheckboxLine,
    RiDiscountPercentLine,
    RiFlashlightLine,
    RiGlobalLine,
    RiGraduationCapLine,
    RiGroupLine,
    RiMailLine,
    RiMapPinLine,
    RiPhoneLine,
    RiUserLine,
    RiWalletLine
} from "@remixicon/react";
import Page from "@/components/Page";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import Status from "@/app/(dashboard)/projects/_components/TableInfo/Status";
import EditAdminProfileModal from "@/app/(dashboard)/profile/_components/modals/admin/EditAdminProfile.modal";
import { useState } from "react";
import ChangePasswordModal from "@/app/(dashboard)/profile/_components/modals/ChangePassword.modal";
import Table from "@/components/Tables/Table";
import { statusCell } from "@/components/StatusCell";
import CheckAlert from "@/components/Alerts/CheckِِAlert";
import { useGetSubscriberQuery } from "@/redux/subscribers/subscribersApi";
import { useGetSubscriptionsQuery, useUpdateSubscriptionStatusMutation } from "@/redux/subscriptions/subscriptionsApi";
import { format, differenceInDays } from "date-fns";
import Switch2 from "@/components/Form/Switch2";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";

function AdminProfile() {
    const { t, i18n } = useTranslation()
    const [isEditAdminProfileModal, setIsEditAdminProfileModal] = useState(false);
    const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);
    const { slug } = useParams();
    const { data: subscriber, isLoading, error } = useGetSubscriberQuery(slug);
    const { data: subscriptions, isLoading: isSubsLoading } = useGetSubscriptionsQuery({ subscriber_id: slug });
    const [updateSubscriptionStatus, { isLoading: isUpdatingStatus }] = useUpdateSubscriptionStatusMutation();
    const [isDeleteCatalogAert, setIsDeleteCatalogAert] = useState(false);

    // Status update states
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [isResponseOpen, setIsResponseOpen] = useState(false);
    const [apiResponse, setApiResponse] = useState({ status: "", message: "" });
    const [pendingSubscription, setPendingSubscription] = useState(null);
    const [targetStatus, setTargetStatus] = useState("");

    const statusOptions = [
        { id: 'active', value: 'active', name: t('Active') },
        { id: 'inactive', value: 'inactive', name: t('Inactive') },
        { id: 'terminated', value: 'terminated', name: t('Terminated') },
        { id: 'expired', value: 'expired', name: t('Expired') },
        { id: 'cancelled', value: 'cancelled', name: t('Cancelled') },
    ];

    const handelEditAdminProfileModal = () => {
        setIsEditAdminProfileModal(!isEditAdminProfileModal)
    }
    const handelChangePasswordModal = () => {
        setIsChangePasswordModal(!isChangePasswordModal)
    }

    const handleDeleteCatalogAert = () => {
        setIsDeleteCatalogAert(!isDeleteCatalogAert);
    }

    const handleStatusChange = (subscription, newStatus) => {
        setPendingSubscription(subscription);
        setTargetStatus(newStatus);
        setIsApprovalOpen(true);
    }

    const confirmUpdateStatus = async () => {
        if (!pendingSubscription || !targetStatus) return;

        try {
            const result = await updateSubscriptionStatus({ id: pendingSubscription._id, status: targetStatus }).unwrap();
            setApiResponse({
                status: "success",
                message: result.message || t("Subscription status updated successfully")
            });
        } catch (err) {
            setApiResponse({
                status: "error",
                message: err.data?.message || t("Failed to update subscription status")
            });
        } finally {
            setIsResponseOpen(true);
            setPendingSubscription(null);
            setTargetStatus("");
        }
    }

    const headers = [
        { label: "Plan Name", width: "300px" },
        { label: "Subscription Date", width: "150px" },
        { label: "Status", width: "125px" },
        { label: "", width: "50px" }
    ];

    const lastActiveSubscription = subscriptions?.find(sub => sub.status === 'active') || subscriptions?.[0];

    const rows = (subscriptions || []).map(subscription => [

        // Plan Cell
        <div key={`${subscription._id}_plan`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-primary-100">
                <div className="rounded-full p-2 bg-primary-200">
                    <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                </div>
            </div>
            <span className="text-md text-gray-900 dark:text-gray-50">
                {subscription.plan_id?.name || "N/A"}
            </span>
        </div>,


        // Created at cell
        <div key={`${subscription._id}_created_at`}>
            {subscription.createdAt ? format(new Date(subscription.createdAt), "MMM dd, yyyy") : "N/A"}
        </div>,


        // Status cell
        statusCell(subscription.status, subscription._id)
    ]);
    // const employeeId = slug ? slug.split('-')[0] : null;
    if (isLoading || isSubsLoading) return <div className="flex justify-center items-center h-full p-10">Loading profile...</div>;
    if (error) return <div className="flex justify-center items-center h-full p-10 text-red-500">Error loading profile.</div>;

    return (
        <Page isTitle={false} className={"w-full"}>
            <div className={"w-full flex flex-col items-center md:gap-6 xl:gap-4 gap-8 h-full"}>
                <div className={"relative flex min-h-48 justify-center  w-full h-full md:mb-0 mb-44"}>
                    <div className={"w-full md:h-40 h-[50vh]"}>
                        <img className={"max-w-full w-full max-h-full object-cover"} src={"/images/profileBanner.png"} alt={""} />
                    </div>
                    <p className={"absolute top-3 right-3 text-sm text-white"}>{t("Change")}</p>
                    <div className={"absolute md:top-1/3 top-[50px] w-full md:px-10 px-2"}>
                        <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                            <div
                                className={"flex md:items-center md:flex-row md:justify-center flex-col justify-between gap-3 flex-1"}>
                                <div className={"flex justify-between items-center"}>
                                    <div className={"relative h-[72px] w-[72px]"}>
                                        <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                            src={"https://randomuser.me/api/portraits/men/1.jpg"} alt={"image-user"} />
                                        {subscriber?.is_active && (
                                            <RiCheckboxCircleFill size="23"
                                                className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-full text-cyan-500" />
                                        )}
                                    </div>
                                    <button
                                        className={"p-1.5 rounded-lg md:hidden text-nowrap bg-none border text-sm dark:border-gray-700 dark:text-gray-200 self-start"}>{t("Edit profile")}
                                    </button>
                                </div>
                                <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                    <div className={`flex flex-col gap-4 w-56  ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiUserLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Name")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium "}>{subscriber?.name || "N/A"}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiCake2Line size={18} className={"text-soft-400 dark:text-gray-300"} />
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Joined")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>
                                                {subscriber?.createdAt ? format(new Date(subscriber.createdAt), "MMM dd, yyyy") : "N/A"}
                                            </p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiBriefcaseLine size="18" className="text-soft-400 dark:text-gray-300" />
                                            <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Type")}:</p>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{t(subscriber?.type || "Subscriber")}</p>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col gap-4 flex-1"}>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiMailLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Email")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.email || "N/A"}</p>
                                        </div>
                                        <div className={"name-profile flex items-center gap-1"}>
                                            <RiPhoneLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                            <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Phone Number")}:</span>
                                            <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.phone || "N/A"}</p>
                                            {/* Unverified & Verified */}
                                            <Status type={subscriber?.is_active ? "Verified" : "Unverified"} />
                                        </div>
                                    </div>
                                </div>
                                <div className={"flex flex-col justify-between h-full "}>
                                    <div className={"flex justify-center items-center gap-3"}>
                                        <button
                                            onClick={handelChangePasswordModal}
                                            className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-blue-100 text-blue-500 border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                            {t("Change password")}
                                        </button>
                                        <button
                                            onClick={handelEditAdminProfileModal}
                                            className={"p-1.5 rounded-lg hidden md:block text-nowrap bg-none border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                            {t("Edit Subscriber Profile")}
                                        </button>
                                    </div>
                                    <div className={"flex justify-end items-end"}>
                                        <button
                                            onClick={handleDeleteCatalogAert}
                                            className={"p-1.5 rounded-lg hidden md:block text-red-500 text-nowrap bg-none border text-sm self-start dark:text-gray-200 dark:border-gray-700"}>
                                            {t("Delete")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"md:px-10 px-2 w-full"}>
                    <div className={" rounded-2xl p-4 border dark:border-gray-700 flex bg-white dark:bg-gray-800"}>
                        <div
                            className={"flex md:items-start md:flex-row md:justify-start flex-col justify-between gap-3 flex-1"}>
                            <div className={"flex justify-between items-start"}>
                                <div className={" h-[72px] w-[72px]"}>
                                    <img className={"rounded-full h-[72px] w-[72px] max-w-full"}
                                        src={"/images/company.default.logo.png"} alt={"image-user"} />
                                </div>
                            </div>
                            <div className={"w-full flex md:flex-row flex-col gap-4 "}>
                                <div className={`flex flex-col gap-4 w-56  ${i18n.language === "ar" ? "md:border-l-2 " : "md:border-r-2 "}`}>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiUserLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Company")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium "}>{subscriber?.organization?.name || "N/A"}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiGlobalLine size={18} className={"text-soft-400 dark:text-gray-300"} />
                                        <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Website")}:</p>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.organization?.website || "N/A"}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiGraduationCapLine size="18" className="text-soft-400 dark:text-gray-300" />
                                        <p className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Industry")}:</p>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.organization?.industry?.name || "N/A"}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1 "}>
                                        <RiGroupLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Country")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.organization?.country || "N/A"}</p>
                                    </div>
                                </div>
                                <div className={"flex flex-col gap-4 flex-1"}>
                                    <div className={"name-profile flex items-center gap-1 "}>
                                        <RiMapPinLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Country")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.organization?.country || "N/A"}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiMapPinLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("City")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.organization?.city || "N/A"}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiMailLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Org Email")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{subscriber?.organization?.email || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"flex gap-6 md:flex-row flex-col items-start w-full md:px-10 px-2 justify-between"}>
                    <div className={"md:w-full w-full flex flex-col gap-4 items-center h-full"}>
                        <div className={"bg-white rounded-2xl p-4 gap-6 md:flex-1 flex flex-col dark:bg-gray-800 items-center w-full p-5"}>
                            <div className={"w-full border border-gray-200 rounded-md flex flex-col gap-4 p-4"}>
                                <div className="flex justify-between items-center">
                                    <h3 className={"text-lg font-s"}>{t("Subscription Information")}</h3>
                                    {lastActiveSubscription && (
                                        <div className="flex items-center gap-2">
                                            <SelectWithoutLabel
                                                className="w-40"
                                                name="subscriptionStatus"
                                                title="Status"
                                                value={lastActiveSubscription.status}
                                                options={statusOptions}
                                                onChange={(newStatus) => handleStatusChange(lastActiveSubscription, newStatus)}
                                                onBlur={() => { }}
                                                disabled={isUpdatingStatus}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={"w-full grid grid-flow-col grid-rows-2 gap-3 "}>

                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiBuilding2Line size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Last Plan Subscribed:")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>{t(lastActiveSubscription?.plan_id?.name || "N/A")}</p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCheckboxLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Features")}:</span>
                                        <div className={"flex items-center gap-1 flex-wrap"}>
                                            {
                                                lastActiveSubscription?.plan_id?.features?.length > 0 ? (
                                                    lastActiveSubscription.plan_id.features.map((feature, index) => (
                                                        <p key={index} className={"bg-blue-50 py-1 px-2 rounded-xl text-black text-sm dark:text-gray-100 font-medium"}>
                                                            {feature.feature_type_id?.title || feature.feature_type_id?.type || feature.feature_type_id}
                                                            {feature.properties?.length > 0 && ` (${feature.properties.map(p => `${p.key}: ${p.value}`).join(', ')})`}
                                                        </p>
                                                    ))
                                                ) : (
                                                    <p className={"text-soft-400 text-sm"}>{t("No features")}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCalendarLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Subscription Date")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>
                                            {lastActiveSubscription?.starts_at ? format(new Date(lastActiveSubscription.starts_at), "MMM dd, yyyy") : "N/A"}
                                        </p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiCalendarLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Duration")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>
                                            {lastActiveSubscription?.starts_at && lastActiveSubscription?.expires_at ?
                                                `${differenceInDays(new Date(lastActiveSubscription.expires_at), new Date(lastActiveSubscription.starts_at))} ${t("days")}` :
                                                "N/A"}
                                        </p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiWalletLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Price")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>
                                            {lastActiveSubscription?.plan_id?.pricing?.[0]?.price ? `$${lastActiveSubscription.plan_id.pricing[0].price}` : "N/A"}
                                        </p>
                                    </div>
                                    <div className={"name-profile flex items-center gap-1"}>
                                        <RiDiscountPercentLine size={18} className={"text-soft-400 text-sm dark:text-gray-300"} />
                                        <span className={"text-soft-400 text-sm dark:text-gray-300"}>{t("Discount")}:</span>
                                        <p className={"text-black text-sm dark:text-gray-100 font-medium"}>
                                            {lastActiveSubscription?.plan_id?.pricing?.[0]?.discount ? `${lastActiveSubscription.plan_id.pricing[0].discount}%` : "0%"}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <Table
                            classContainer={"rounded-2xl px-8"}
                            title="Subscriptions"
                            headers={headers}
                            isActions={false}
                            handelDelete={() => { }}
                            rows={rows}
                            isFilter={true}
                        />
                    </div>
                </div>
            </div>

            <EditAdminProfileModal isOpen={isEditAdminProfileModal} onClose={handelEditAdminProfileModal} onClick={() => { }} />
            <ChangePasswordModal isOpen={isChangePasswordModal} onClose={handelChangePasswordModal} onClick={() => { }} />
            <CheckAlert
                isOpen={isDeleteCatalogAert}
                onClose={handleDeleteCatalogAert}
                type="cancel"
                title="Cancel Subscription"
                confirmBtnText="Yes, Stop"
                description={
                    <p>
                        Are you sure you want to <span className="font-bold text-black">Delete Catalog</span> of the
                        <span className="font-bold text-black"> Account subscription</span>?
                    </p>
                }
                onSubmit={() => { }}
            />

            <ApprovalAlert
                isOpen={isApprovalOpen}
                onClose={() => setIsApprovalOpen(false)}
                onConfirm={confirmUpdateStatus}
                title="Change Subscription Status"
                message={`Are you sure you want to change the subscription status to ${t(targetStatus.charAt(0).toUpperCase() + targetStatus.slice(1))}?`}
                confirmBtnText="Confirm"
                type="warning"
            />

            <ApiResponseAlert
                isOpen={isResponseOpen}
                onClose={() => setIsResponseOpen(false)}
                status={apiResponse.status}
                message={apiResponse.message}
            />
        </Page>
    );
}

export default AdminProfile;