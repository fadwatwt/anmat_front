"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

import Page from "@/components/Page.jsx";
import PermissionGuard from "@/components/PermissionGuard.jsx";
import AddCategoryModal from "@/components/Modal/SocialMedia/AddCategoryModal.jsx";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";
import { selectPermissions } from "@/redux/auth/authSlice";
import {
    useGetAccountCategoriesQuery,
    useDeleteAccountCategoryMutation,
} from "@/redux/socialMedia/twitterAccountsApi";

const HAS_PERMISSION = (perms, key) =>
    Array.isArray(perms) && (perms.includes("*") || perms.includes(key));

/**
 * Builds an in-memory tree from a flat category list (each category has a
 * `parent` ref). Categories whose parent is missing or not in the list are
 * treated as roots so nothing disappears.
 */
function buildTree(categories) {
    const byId = new Map();
    categories.forEach((c) => byId.set(String(c._id), { ...c, children: [] }));
    const roots = [];
    categories.forEach((c) => {
        const node = byId.get(String(c._id));
        const parentId = c.parent?._id ? String(c.parent._id) : c.parent ? String(c.parent) : null;
        if (parentId && byId.has(parentId)) {
            byId.get(parentId).children.push(node);
        } else {
            roots.push(node);
        }
    });
    return roots;
}

function CategoryNode({ node, depth, canEdit, canDelete, onEdit, onDelete }) {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children.length > 0;
    return (
        <div className="flex flex-col">
            <div
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-status-bg transition-colors"
                style={{ paddingInlineStart: `${depth * 20 + 12}px` }}
            >
                {hasChildren ? (
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="text-cell-secondary"
                        type="button"
                    >
                        {expanded ? <FiChevronDown /> : <FiChevronRight />}
                    </button>
                ) : (
                    <span className="w-4" />
                )}
                <span className="flex-1 text-cell-primary text-sm font-medium">{node.name}</span>
                {typeof node.accountCount === "number" && (
                    <span className="text-xs text-cell-secondary bg-status-bg px-2 py-0.5 rounded-full">
                        {node.accountCount}
                    </span>
                )}
                <div className="flex items-center gap-1">
                    {canEdit && (
                        <button
                            onClick={() => onEdit(node)}
                            className="p-1.5 rounded hover:bg-primary-100 text-primary-500"
                            type="button"
                            title="Edit"
                        >
                            <FiEdit2 size={14} />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(node)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500"
                            type="button"
                            title="Delete"
                        >
                            <FiTrash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
            {hasChildren && expanded && (
                <div>
                    {node.children.map((child) => (
                        <CategoryNode
                            key={child._id}
                            node={child}
                            depth={depth + 1}
                            canEdit={canEdit}
                            canDelete={canDelete}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SocialMediaCategoriesPage() {
    const { t } = useTranslation();
    const permissions = useSelector(selectPermissions);
    const { showProcessing, hideProcessing } = useProcessing();

    const { data: categories = [], isLoading, isFetching } = useGetAccountCategoriesQuery();
    const [deleteCategory] = useDeleteAccountCategoryMutation();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [apiResponse, setApiResponse] = useState({ isOpen: false, status: null, message: "" });

    const canCreate = HAS_PERMISSION(permissions, "social_media_categories.create");
    const canEdit = HAS_PERMISSION(permissions, "social_media_categories.update");
    const canDelete = HAS_PERMISSION(permissions, "social_media_categories.delete");

    const tree = useMemo(() => buildTree(categories), [categories]);

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        showProcessing(t("Deleting category..."));
        try {
            await deleteCategory(pendingDelete._id).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Category deleted (related accounts were also removed)"),
            });
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.error ||
                error?.error ||
                t("Failed to delete category");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
            setPendingDelete(null);
        }
    };

    return (
        <Page
            title={"Account Categories"}
            otherHeaderActions={
                <PermissionGuard permission="social_media_categories.create" fallback={null}>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-primary-500 hover:bg-primary-600 text-white flex gap-1 items-center px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                        <FiPlus />
                        {t("Add Category")}
                    </button>
                </PermissionGuard>
            }
        >
            <div className="bg-surface rounded-2xl border border-status-border p-4 flex flex-col gap-2">
                <p className="text-cell-secondary text-sm">
                    {t(
                        "Categories let you group your social media accounts. Each subscriber has their own private set — categories are never shared across tenants.",
                    )}
                </p>

                {isLoading ? (
                    <div className="flex items-center justify-center w-full p-8">
                        <ImSpinner2 className="animate-spin text-primary-500" size={30} />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="w-full text-center py-12 text-cell-secondary text-sm">
                        {canCreate
                            ? t("No categories yet. Click \"Add Category\" to create your first one.")
                            : t("No categories yet.")}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {tree.map((node) => (
                            <CategoryNode
                                key={node._id}
                                node={node}
                                depth={0}
                                canEdit={canEdit}
                                canDelete={canDelete}
                                onEdit={(cat) => setEditingCategory(cat)}
                                onDelete={(cat) => setPendingDelete(cat)}
                            />
                        ))}
                    </div>
                )}

                {isFetching && !isLoading && (
                    <p className="text-xs text-cell-secondary flex items-center gap-1">
                        <ImSpinner2 className="animate-spin" size={12} />
                        {t("Refreshing...")}
                    </p>
                )}
            </div>

            <AddCategoryModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                mode="create"
            />
            <AddCategoryModal
                isOpen={!!editingCategory}
                onClose={() => setEditingCategory(null)}
                mode="edit"
                category={editingCategory}
            />

            <ApprovalAlert
                isOpen={!!pendingDelete}
                onClose={() => setPendingDelete(null)}
                onConfirm={confirmDelete}
                title={t("Confirm Delete")}
                message={t(
                    "Deleting this category will also delete all its sub-categories and the Twitter accounts assigned to them. Continue?",
                )}
                confirmBtnText={t("Delete")}
                type="danger"
            />
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ isOpen: false, status: null, message: "" })}
            />
        </Page>
    );
}

export default SocialMediaCategoriesPage;
