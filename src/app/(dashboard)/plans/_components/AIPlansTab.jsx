"use client"
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImSpinner2 } from "react-icons/im";
import {
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiEditLine,
    RiFlashlightLine,
    RiCoinLine,
    RiSparklingLine,
} from "@remixicon/react";
import { RiDeleteBin7Line } from "react-icons/ri";
import Table from "@/components/Tables/Table";
import StatusActions from "@/components/Dropdowns/StatusActions";
import { statusCell } from "@/components/StatusCell";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import TokenPackageModal from "./TokenPackageModal";
import {
    useGetTokenPackagesQuery,
    useDeleteTokenPackageMutation,
    useUpdateTokenPackageMutation,
    useSeedTokenPackagesMutation,
} from "@/redux/plans/tokenPackagesApi";

const headers = [
    { label: "Package", width: "200px" },
    { label: "Price", width: "100px" },
    { label: "Tokens", width: "130px" },
    { label: "Features", width: "250px" },
    { label: "Order", width: "70px" },
    { label: "Status", width: "100px" },
    { label: "", width: "50px" },
];

export default function AIPlansTab({ canCreate, canUpdate, canDelete }) {
    const { t, i18n } = useTranslation();
    const { data: packages, isLoading, error } = useGetTokenPackagesQuery();
    const [deletePackage] = useDeleteTokenPackageMutation();
    const [updatePackage] = useUpdateTokenPackageMutation();
    const [seedPackages, { isLoading: isSeeding }] = useSeedTokenPackagesMutation();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [approvalConfig, setApprovalConfig] = useState({ isOpen: false, type: "warning", title: "", message: "", onConfirm: null });
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: "", message: "" });

    const handleEdit = (pkg) => {
        setSelectedPackage(pkg);
        setEditModalOpen(true);
    };

    const handleAction = async (action, pkg) => {
        let config = { isOpen: true, title: "", message: "", type: "warning", onConfirm: null };

        if (action === "delete") {
            config = {
                ...config,
                title: t("Delete Package"),
                message: `${t("Are you sure you want to delete")} "${pkg.name}"? ${t("This action cannot be undone.")}`,
                type: "danger",
                onConfirm: async () => {
                    try {
                        await deletePackage(pkg._id).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: t("Package deleted successfully!") });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to delete package.") });
                    }
                },
            };
        } else if (action === "toggle-status") {
            config = {
                ...config,
                title: pkg.is_active ? t("Deactivate Package") : t("Activate Package"),
                message: `${t("Are you sure you want to")} ${pkg.is_active ? t("deactivate") : t("activate")} "${pkg.name}"?`,
                type: "warning",
                onConfirm: async () => {
                    try {
                        await updatePackage({ id: pkg._id, is_active: !pkg.is_active }).unwrap();
                        setApiResponse({ isOpen: true, status: "success", message: `${t("Package")} ${pkg.is_active ? t("deactivated") : t("activated")} ${t("successfully!")}` });
                    } catch (err) {
                        setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to update status.") });
                    }
                },
            };
        }

        setApprovalConfig(config);
    };

    const handleSeed = async () => {
        try {
            const result = await seedPackages().unwrap();
            setApiResponse({ isOpen: true, status: "success", message: result?.message || t("Default packages seeded successfully!") });
        } catch (err) {
            setApiResponse({ isOpen: true, status: "error", message: err?.data?.message || t("Failed to seed packages.") });
        }
    };

    const PackageActions = ({ pkg }) => {
        const statesActions = [
            canUpdate && {
                text: t("Edit"),
                icon: <RiEditLine className="text-primary-400" />,
                onClick: () => handleEdit(pkg),
            },
            canUpdate && {
                text: pkg.is_active ? t("Deactivate") : t("Activate"),
                icon: pkg.is_active ? (
                    <RiCloseCircleLine className="text-orange-500" />
                ) : (
                    <RiCheckboxCircleLine className="text-green-500" />
                ),
                onClick: () => handleAction("toggle-status", pkg),
            },
            canDelete && {
                text: t("Delete"),
                icon: <RiDeleteBin7Line className="text-red-500" />,
                onClick: () => handleAction("delete", pkg),
            },
        ].filter(Boolean);

        return (
            <StatusActions
                states={statesActions}
                className={`${i18n.language === "ar" ? "left-0" : "right-0"}`}
            />
        );
    };

    const formatNumber = (num) => {
        return num?.toLocaleString() || "0";
    };

    const rows = packages?.map(pkg => [
        // Package Name Cell
        <div key={`${pkg._id}_name`} className="flex items-center justify-start gap-2">
            <div className="rounded-full p-2 bg-violet-100 dark:bg-violet-900/30">
                <div className="rounded-full p-2 bg-violet-200 dark:bg-violet-800/50">
                    <RiSparklingLine size={18} className="text-violet-600 dark:text-violet-300" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-cell-primary max-w-[150px] truncate" title={pkg.name}>
                    {pkg.name}
                </span>
                {pkg.description && (
                    <span className="text-[11px] text-cell-secondary max-w-[150px] truncate" title={pkg.description}>
                        {pkg.description}
                    </span>
                )}
            </div>
        </div>,

        // Price Cell
        <div key={`${pkg._id}_price`} className="flex flex-col">
            <span className="text-sm font-semibold text-cell-primary">{pkg.price_label}</span>
            <span className="text-[10px] text-cell-secondary">{formatNumber(pkg.price_cents)} cents</span>
        </div>,

        // Tokens Cell
        <div key={`${pkg._id}_tokens`} className="flex items-center gap-1.5">
            <RiCoinLine size={16} className="text-amber-500" />
            <span className="text-sm font-semibold text-cell-primary">{formatNumber(pkg.tokens)}</span>
        </div>,

        // Features Cell
        <div key={`${pkg._id}_features`} className="flex flex-col gap-1.5 max-w-[280px] py-1">
            {pkg.features?.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    <span className="text-[12px] text-cell-secondary leading-tight">{feature}</span>
                </div>
            ))}
            {pkg.features?.length > 3 && (
                <span className="text-[10px] text-primary-500 font-medium">+{pkg.features.length - 3} more</span>
            )}
        </div>,

        // Sort Order Cell
        <div key={`${pkg._id}_order`} className="text-sm text-cell-secondary text-center">
            {pkg.sort_order || 0}
        </div>,

        // Status Cell
        <div key={`${pkg._id}_status`} className="cursor-pointer" onClick={() => handleAction("toggle-status", pkg)}>
            {statusCell(pkg.is_active ? "active" : "in-active", pkg._id)}
        </div>,
    ]) || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full p-10">
                <ImSpinner2 className="animate-spin text-primary-base dark:text-primary-200" size={30} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-full p-10 text-red-500">
                {t("Error loading AI token packages.")}
            </div>
        );
    }

    return (
        <div>
            {/* Seed / Add buttons at the top */}
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="text-sm text-cell-secondary">
                    {packages?.length || 0} {t("packages")}
                </div>
                <div className="flex gap-2">
                    {canCreate && packages?.length === 0 && (
                        <button
                            onClick={handleSeed}
                            disabled={isSeeding}
                            className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 flex gap-1 items-center px-3 py-2 rounded-lg text-sm hover:bg-violet-200 dark:hover:bg-violet-800/50 transition-colors"
                        >
                            <RiFlashlightLine size={16} />
                            <span>{isSeeding ? t("Seeding...") : t("Seed Default Packages")}</span>
                        </button>
                    )}
                    {canCreate && (
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="bg-primary-base dark:bg-primary-200 flex gap-1 items-center px-3 py-2 rounded-lg text-sm"
                        >
                            <span className="text-white dark:text-black font-medium">+ {t("Add Package")}</span>
                        </button>
                    )}
                </div>
            </div>

            <Table
                classContainer={"rounded-2xl px-8"}
                title={t("AI Token Packages")}
                headers={headers}
                isActions={false}
                rows={rows}
                customActions={(actualRowIndex) => (
                    <PackageActions pkg={packages?.[actualRowIndex]} />
                )}
                isFilter={true}
            />

            {/* Modals */}
            <TokenPackageModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
            />
            <TokenPackageModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedPackage(null);
                }}
                editPackage={selectedPackage}
            />

            {/* Alerts */}
            <ApprovalAlert
                isOpen={approvalConfig.isOpen}
                onClose={() => setApprovalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={approvalConfig.onConfirm}
                title={approvalConfig.title}
                message={approvalConfig.message}
                type={approvalConfig.type}
            />
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
