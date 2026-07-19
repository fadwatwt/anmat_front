import PropTypes from "prop-types";
import Modal from "./Modal";
import StarRating from "../StarRating";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";
import { useState } from "react";

const getFileUrl = (attachment) => {
    if (!attachment) return null;
    if (typeof attachment === "string") return attachment;
    return attachment.url || attachment.file_url || attachment.path || attachment.src || null;
};

const getFileName = (attachment) => {
    if (!attachment) return "";
    if (typeof attachment === "string") return attachment;
    return attachment.original_name || attachment.name || attachment.filename || "";
};

const getMimeType = (attachment) => {
    if (!attachment || typeof attachment === "string") return "";
    return attachment.mime_type || attachment.type || "";
};

const EvaluationDetailsModal = ({ isOpen, onClose, ratings }) => {
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    if (!ratings || ratings.length === 0) return null;

    const latest = ratings[ratings.length - 1];
    const avgScore = ratings.length > 0
        ? Math.round((ratings.reduce((acc, r) => acc + (r.score || 0), 0) / ratings.length) * 10) / 10
        : 0;

    const attachment = latest.attachment;
    const fileUrl = getFileUrl(attachment);
    const fileName = getFileName(attachment) || t("Attachment");
    const mimeType = getMimeType(attachment);
    const isImage = mimeType.startsWith("image/") ||
        (fileUrl && /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i.test(fileUrl));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t("Evaluation Details")}
            className="lg:w-[500px] md:w-8/12 sm:w-10/12 w-11/12 p-6"
        >
            <div className="flex flex-col gap-5 py-2">
                <div className="flex items-center justify-between">
                    <StarRating rating={avgScore} />
                    {latest.created_at && (
                        <span className="text-xs text-cell-secondary">
                            {new Date(latest.created_at).toLocaleDateString()}
                        </span>
                    )}
                </div>

                {latest.comment && (
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-cell-primary">{t("Description")}:</p>
                        <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                            <p className="text-sm text-cell-secondary whitespace-pre-wrap">{latest.comment}</p>
                        </div>
                    </div>
                )}

                {fileUrl && (
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-cell-primary">{t("Attachment")}:</p>
                        {isImage && !imgError && (
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={fileUrl}
                                    alt={fileName}
                                    className="w-full max-h-64 object-contain rounded-xl border border-status-border bg-gray-50 dark:bg-white/5"
                                    onError={() => setImgError(true)}
                                />
                            </a>
                        )}
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary-500 hover:underline"
                        >
                            <FiDownload size={14} />
                            <span>{fileName}</span>
                        </a>
                    </div>
                )}

                {!fileUrl && attachment && typeof attachment === "string" && attachment.trim() && (
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-cell-primary">{t("Attachment")}:</p>
                        <p className="text-sm text-cell-secondary">{attachment}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

EvaluationDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    ratings: PropTypes.array,
};

export default EvaluationDetailsModal;
