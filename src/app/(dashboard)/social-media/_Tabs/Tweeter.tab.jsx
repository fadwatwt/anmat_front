"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiPlus, FiTag, FiLogIn } from "react-icons/fi";
import { TfiImport } from "react-icons/tfi";
import { ImSpinner2 } from "react-icons/im";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Table from "@/components/Tables/Table.jsx";
import PermissionGuard from "@/components/PermissionGuard.jsx";
import FollowAndUnfollow from "@/components/Modal/Methods/FollowAndUnfollow.jsx";
import ReplayAndDeleteReplay from "@/components/Modal/Methods/ReplayAndDeleteReplay.jsx";
import LikeAndUnLike from "@/components/Modal/Methods/LikeAndUnlike.jsx";
import PostAndDeletePost from "@/components/Modal/Methods/PostAndDeletePost.jsx";
import LoginAccountsModal from "@/components/Modal/Methods/LoginAccountsModal.jsx";
import AddTwitterAccountModal from "@/components/Modal/SocialMedia/AddTwitterAccountModal.jsx";
import EditTwitterAccountModal from "@/components/Modal/SocialMedia/EditTwitterAccountModal.jsx";
import ImportAccountsModal from "@/components/Modal/SocialMedia/ImportAccountsModal.jsx";
import AccountQuotaCard from "./_components/AccountQuotaCard.jsx";
import {
    useGetTwitterAccountsQuery,
    useDeleteTwitterAccountMutation,
} from "@/redux/socialMedia/twitterAccountsApi";
import { useGetMySocialMediaQuotaQuery } from "@/redux/socialMedia/socialMediaQuotaApi";
import { selectPermissions } from "@/redux/auth/authSlice";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";

const HAS_PERMISSION = (perms, key) =>
    Array.isArray(perms) && (perms.includes("*") || perms.includes(key));

const getStatusLabel = (status, t) => {
    switch (status) {
        case "Normal": return t("Normal");
        case "Suspended": return t("Suspended");
        case "Locked": return t("Locked");
        case "Wrong Password": return t("Wrong Password");
        case "Network Error": return t("Network Error");
        case "Unknown Error": return t("Unknown Error");
        case "Wrong Captcha": return t("Wrong Captcha");
        case "Email Verify": return t("Email Verify");
        case "Phone Verify": return t("Phone Verify");
        case "FA Verify": return t("FA Verify");
        case "Password Change Required": return t("Password Change Required");
        case "Wrong User Agent": return t("Wrong User Agent");
        case "Binding Success": return t("Binding Success");
        case "Binding Failure": return t("Binding Failure");
        default: return status || t("Unknown");
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case "Normal":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
        case "Email Verify":
        case "Phone Verify":
        case "FA Verify":
            return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
        case "Suspended":
        case "Locked":
        case "Wrong Password":
        case "Network Error":
        case "Wrong Captcha":
        case "Password Change Required":
        case "Wrong User Agent":
            return "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
};

function TweeterTab() {
    const { t } = useTranslation();
    const permissions = useSelector(selectPermissions);
    const { showProcessing, hideProcessing } = useProcessing();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [isFollowOpen, setIsFollowOpen] = useState(false);
    const [isLikeOpen, setIsLikeOpen] = useState(false);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [deletingAccountId, setDeletingAccountId] = useState(null);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });

    const { data: accountsResp, isLoading: accountsLoading, isFetching } = useGetTwitterAccountsQuery({});
    const { data: quota, isLoading: quotaLoading } = useGetMySocialMediaQuotaQuery();
    const [deleteAccount, { isLoading: deleting }] = useDeleteTwitterAccountMutation();

    const accounts = accountsResp?.data || [];

    const isQuotaFull =
        !quota?.unlimited && (quota?.limit ?? 0) > 0 && (quota?.used ?? 0) >= (quota?.limit ?? 0);

    const headers = useMemo(
        () => [
            { label: t("Account"), width: "220px" },
            { label: t("Category"), width: "150px" },
            { label: t("Status"), width: "120px" },
            { label: t("Followers"), width: "120px" },
            { label: t("Description"), width: "240px" },
        ],
        [t],
    );

    const rows = useMemo(
        () =>
            accounts.map((acc) => [
                <div key="name" className="flex flex-col">
                    <span className="font-medium text-cell-primary">
                        {acc?.AccountDataInfo1?.FullName || acc.name}
                    </span>
                    <span className="text-xs text-cell-secondary">@{acc.name}</span>
                </div>,
                acc?.Category?.name || "-",
                <span
                    key="status"
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        acc.AccountStatus,
                    )}`}
                >
                    {getStatusLabel(acc.AccountStatus, t)}
                </span>,
                acc?.AccountDataInfo1?.Followers ?? "-",
                <span key="desc" className="text-cell-secondary line-clamp-2">
                    {acc.Description || "-"}
                </span>,
            ]),
        [accounts, t],
    );

    const handleEdit = (rowIndex) => {
        setEditingAccount(accounts[rowIndex]);
        setIsEditOpen(true);
    };

    const handleDelete = (rowIndex) => {
        setDeletingAccountId(accounts[rowIndex]?._id || null);
    };

    const confirmDelete = async () => {
        if (!deletingAccountId) return;
        showProcessing(t("Deleting account..."));
        try {
            await deleteAccount(deletingAccountId).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Account deleted successfully"),
            });
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.error ||
                error?.error ||
                t("Failed to delete account");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
            setDeletingAccountId(null);
        }
    };

    return (
        <>
            <div className="w-full flex gap-6 flex-wrap flex-row">
                <div className="bg-surface xl:w-8/12 w-full rounded-2xl md:order-1 order-2 py-5 md:px-4 px-3 flex flex-col gap-4 items-start overflow-hidden tab-content">
                    <p className="text-cell-secondary text-sm">
                        {t("Select accounts from the table to take action")}
                    </p>

                    {/* Action bar — each button gated by its specific permission */}
                    <div className="flex gap-2 flex-wrap">
                        <PermissionGuard permission="social_media_actions.post" fallback={null}>
                            <button
                                onClick={() => setIsPostOpen(true)}
                                className="flex gap-1 items-center bg-primary-100 dark:bg-primary-700 px-3 py-2 rounded-lg text-primary-500 dark:text-primary-200 text-sm hover:bg-primary-200 transition-colors"
                            >
                                <FiPlus />
                                {t("Post")}
                            </button>
                        </PermissionGuard>
                        <PermissionGuard permission="social_media_actions.follow" fallback={null}>
                            <button
                                onClick={() => setIsFollowOpen(true)}
                                className="flex gap-1 items-center bg-primary-100 dark:bg-primary-700 px-3 py-2 rounded-lg text-primary-500 dark:text-primary-200 text-sm hover:bg-primary-200 transition-colors"
                            >
                                <FiPlus />
                                {t("Follow")}
                            </button>
                        </PermissionGuard>
                        <PermissionGuard permission="social_media_actions.like" fallback={null}>
                            <button
                                onClick={() => setIsLikeOpen(true)}
                                className="flex gap-1 items-center bg-primary-100 dark:bg-primary-700 px-3 py-2 rounded-lg text-primary-500 dark:text-primary-200 text-sm hover:bg-primary-200 transition-colors"
                            >
                                <FiPlus />
                                {t("Like")}
                            </button>
                        </PermissionGuard>
                        <PermissionGuard permission="social_media_actions.reply" fallback={null}>
                            <button
                                onClick={() => setIsReplyOpen(true)}
                                className="flex gap-1 items-center bg-primary-100 dark:bg-primary-700 px-3 py-2 rounded-lg text-primary-500 dark:text-primary-200 text-sm hover:bg-primary-200 transition-colors"
                            >
                                <FiPlus />
                                {t("Reply")}
                            </button>
                        </PermissionGuard>
                        <PermissionGuard permission="social_media_accounts.update" fallback={null}>
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="flex gap-1 items-center bg-primary-100 dark:bg-primary-700 px-3 py-2 rounded-lg text-primary-500 dark:text-primary-200 text-sm hover:bg-primary-200 transition-colors"
                            >
                                <FiLogIn />
                                {t("Login")}
                            </button>
                        </PermissionGuard>
                    </div>

                    {accountsLoading ? (
                        <div className="flex items-center justify-center w-full p-8">
                            <ImSpinner2 className="animate-spin text-primary-500" size={30} />
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="w-full text-center py-12 text-cell-secondary text-sm">
                            {t("No Twitter accounts yet. Add your first account to get started.")}
                        </div>
                    ) : (
                        <Table
                            title={t("Twitter Accounts")}
                            headers={headers}
                            rows={rows}
                            isActions={
                                HAS_PERMISSION(permissions, "social_media_accounts.update") ||
                                HAS_PERMISSION(permissions, "social_media_accounts.delete")
                            }
                            handelEdit={handleEdit}
                            handelDelete={handleDelete}
                        />
                    )}
                </div>

                <div className="sm:flex-1 md:order-2 w-full md:w-auto order-1 flex flex-col gap-4">
                    <AccountQuotaCard
                        used={quota?.used ?? 0}
                        limit={quota?.limit ?? 0}
                        unlimited={!!quota?.unlimited}
                        isLoading={quotaLoading}
                    />

                    <div className="bg-surface border border-status-border rounded-2xl p-4 flex flex-col gap-3">
                        <h3 className="text-cell-primary text-sm font-semibold">{t("Quick Actions")}</h3>

                        <PermissionGuard
                            permission="social_media_accounts.create"
                            fallback={
                                <button
                                    disabled
                                    className="w-full px-3 py-2 rounded-lg bg-status-bg text-cell-secondary text-sm cursor-not-allowed"
                                    title={t("You don't have permission to add accounts")}
                                >
                                    <FiPlus className="inline mb-0.5 me-1" />
                                    {t("Add Account")}
                                </button>
                            }
                        >
                            <button
                                onClick={() => setIsAddOpen(true)}
                                disabled={isQuotaFull}
                                className={`w-full flex gap-2 items-center justify-center px-3 py-2 rounded-lg text-sm transition-colors ${
                                    isQuotaFull
                                        ? "bg-status-bg text-cell-secondary cursor-not-allowed"
                                        : "bg-primary-500 text-white hover:bg-primary-600"
                                }`}
                                title={isQuotaFull ? t("Quota reached") : t("Add new Twitter account")}
                            >
                                <FiPlus />
                                {t("Add Account")}
                            </button>
                        </PermissionGuard>

                        <PermissionGuard permission="social_media_accounts.import" fallback={null}>
                            <button
                                onClick={() => setIsImportOpen(true)}
                                disabled={isQuotaFull}
                                className={`w-full flex gap-2 items-center justify-center px-3 py-2 rounded-lg text-sm border-2 border-status-border transition-colors ${
                                    isQuotaFull
                                        ? "text-cell-secondary cursor-not-allowed"
                                        : "text-cell-primary hover:bg-status-bg"
                                }`}
                                title={isQuotaFull ? t("Quota reached") : t("Import accounts from CSV")}
                            >
                                <TfiImport size={14} />
                                {t("Import CSV")}
                            </button>
                        </PermissionGuard>

                        <PermissionGuard permission="social_media_categories.list" fallback={null}>
                            <Link
                                href="/social-media/categories"
                                className="w-full flex gap-2 items-center justify-center px-3 py-2 rounded-lg text-sm border-2 border-status-border text-cell-primary hover:bg-status-bg transition-colors"
                                title={t("Manage account categories")}
                            >
                                <FiTag size={14} />
                                {t("Manage Categories")}
                            </Link>
                        </PermissionGuard>

                        {isFetching && (
                            <p className="text-xs text-cell-secondary flex items-center gap-1">
                                <ImSpinner2 className="animate-spin" size={12} />
                                {t("Refreshing...")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <AddTwitterAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
            <ImportAccountsModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
            <EditTwitterAccountModal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditingAccount(null);
                }}
                account={editingAccount}
            />

            <PostAndDeletePost isOpen={isPostOpen} onClose={() => setIsPostOpen(false)} />
            <FollowAndUnfollow isOpen={isFollowOpen} onClose={() => setIsFollowOpen(false)} />
            <LikeAndUnLike isOpen={isLikeOpen} onClose={() => setIsLikeOpen(false)} />
            <ReplayAndDeleteReplay isOpen={isReplyOpen} onClose={() => setIsReplyOpen(false)} />
            <LoginAccountsModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            <ApprovalAlert
                isOpen={!!deletingAccountId}
                onClose={() => setDeletingAccountId(null)}
                onConfirm={confirmDelete}
                title={t("Confirm Delete")}
                message={t("Are you sure you want to delete this Twitter account?")}
                confirmBtnText={deleting ? t("Deleting...") : t("Delete")}
                type="warning"
            />
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ isOpen: false, status: null, message: "" })}
            />
        </>
    );
}

export default TweeterTab;
