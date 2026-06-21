"use client";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import ApprovalAlert from "@/components/Alerts/ApprovalAlert";
import { useTranslation } from "react-i18next";
import {
    RiUploadCloud2Line,
    RiFile3Line,
    RiFileTextLine,
    RiImageLine,
    RiFilePdf2Line,
    RiDownloadLine,
    RiDeleteBin7Line,
    RiLoader4Line,
} from "@remixicon/react";
import {
    useGetEmployeeDocumentsQuery,
    useUploadEmployeeDocumentMutation,
    useDeleteEmployeeDocumentMutation,
} from "@/redux/employees/employeesApi";
import { translateDate } from "@/functions/Days";
import { usePermission } from "@/Hooks/usePermission";

const CATEGORIES = [
    { value: "CONTRACT", label: "Contract" },
    { value: "CV", label: "CV / Resume" },
    { value: "NATIONAL_ID", label: "National ID" },
    { value: "CERTIFICATE", label: "Certificate" },
    { value: "OTHER", label: "Other" },
];

const CATEGORY_STYLES = {
    CONTRACT: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
    CV: "text-green-600 bg-green-50 dark:bg-green-500/10",
    NATIONAL_ID: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
    CERTIFICATE: "text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10",
    OTHER: "text-gray-600 bg-gray-50 dark:bg-gray-500/10",
};

const MAX_SIZE_MB = 25;

const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const FileIcon = ({ type }) => {
    if (!type) return <RiFile3Line size={20} />;
    if (type.startsWith("image/")) return <RiImageLine size={20} />;
    if (type === "application/pdf") return <RiFilePdf2Line size={20} />;
    if (type.includes("word") || type.startsWith("text/"))
        return <RiFileTextLine size={20} />;
    return <RiFile3Line size={20} />;
};

FileIcon.propTypes = {
    type: PropTypes.string,
};

function EmployeeDocumentsCard({ employeeId }) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [category, setCategory] = useState("CONTRACT");
    const [errorMsg, setErrorMsg] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null); // attachmentId to confirm

    const canManage = usePermission("employee_details.update");

    const { data: documents = [], isLoading } =
        useGetEmployeeDocumentsQuery(employeeId, { skip: !employeeId });
    const [uploadDocument, { isLoading: isUploading }] =
        useUploadEmployeeDocumentMutation();
    const [deleteDocument] = useDeleteEmployeeDocumentMutation();

    const handlePick = () => {
        setErrorMsg("");
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow re-selecting same file
        if (!file) return;

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setErrorMsg(t("File is too large. Maximum size is {{size}} MB.", { size: MAX_SIZE_MB }));
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", category);
            await uploadDocument({ employeeId, formData }).unwrap();
        } catch (err) {
            console.error("Failed to upload document:", err);
            setErrorMsg(err?.data?.message || t("Failed to upload document"));
        }
    };

    const handleDelete = (attachmentId) => {
        setDeleteTarget(attachmentId);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteDocument({ employeeId, attachmentId: deleteTarget }).unwrap();
        } catch (err) {
            console.error("Failed to delete document:", err);
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className={"bg-surface rounded-2xl p-4 gap-4 flex flex-col w-full"}>
            <div className={"flex flex-wrap justify-between items-center gap-3 w-full"}>
                <p className={"text-lg text-cell-primary font-bold"}>{t("Employee Documents")}</p>

                {canManage && (
                    <div className={"flex items-center gap-2"}>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isUploading}
                            className={"text-sm rounded-lg border border-status-border bg-surface text-cell-primary px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{t(c.label)}</option>
                            ))}
                        </select>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handlePick}
                            disabled={isUploading}
                            className={"bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-60"}
                        >
                            {isUploading ? (
                                <RiLoader4Line size={18} className="animate-spin" />
                            ) : (
                                <RiUploadCloud2Line size={18} />
                            )}
                            {isUploading ? t("Uploading...") : t("Upload Document")}
                        </button>
                    </div>
                )}
            </div>

            {errorMsg && (
                <p className={"text-sm text-red-500"}>{errorMsg}</p>
            )}

            <div className={"w-full flex flex-col gap-2"}>
                {isLoading ? (
                    <p className={"text-sm text-cell-secondary py-4 text-center"}>{t("Loading...")}</p>
                ) : documents.length === 0 ? (
                    <div className={"flex flex-col items-center justify-center gap-2 py-8 text-cell-secondary"}>
                        <RiFile3Line size={32} />
                        <p className={"text-sm"}>{t("No documents uploaded yet")}</p>
                    </div>
                ) : (
                    documents.map((doc) => {
                        const catStyle = CATEGORY_STYLES[doc.category] || CATEGORY_STYLES.OTHER;
                        const catLabel = CATEGORIES.find((c) => c.value === doc.category)?.label || "Other";
                        return (
                            <div
                                key={doc._id}
                                className={"flex items-center justify-between gap-3 p-3 rounded-xl border border-status-border hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"}
                            >
                                <div className={"flex items-center gap-3 min-w-0"}>
                                    <span className={`p-2 rounded-lg shrink-0 ${catStyle}`}>
                                        <FileIcon type={doc.type} />
                                    </span>
                                    <div className={"flex flex-col min-w-0"}>
                                        <div className={"flex items-center gap-2"}>
                                            <span className={"text-sm font-medium text-cell-primary truncate"} title={doc.name}>
                                                {doc.name}
                                            </span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${catStyle}`}>
                                                {t(catLabel)}
                                            </span>
                                        </div>
                                        <span className={"text-xs text-cell-secondary"}>
                                            {formatSize(doc.size)}
                                            {doc.createdAt ? ` · ${translateDate(doc.createdAt)}` : ""}
                                        </span>
                                    </div>
                                </div>
                                <div className={"flex items-center gap-1 shrink-0"}>
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className={"p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"}
                                        title={t("Download")}
                                    >
                                        <RiDownloadLine size={18} />
                                    </a>
                                    {canManage && (
                                        <button
                                            onClick={() => handleDelete(doc._id)}
                                            className={"p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"}
                                            title={t("Delete")}
                                        >
                                            <RiDeleteBin7Line size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ApprovalAlert
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                type="danger"
                title="Delete Document"
                message="Are you sure you want to delete this document? This action cannot be undone."
                confirmBtnText="Delete"
                cancelBtnText="Cancel"
            />
        </div>
    );
}

EmployeeDocumentsCard.propTypes = {
    employeeId: PropTypes.string.isRequired,
};

export default EmployeeDocumentsCard;
