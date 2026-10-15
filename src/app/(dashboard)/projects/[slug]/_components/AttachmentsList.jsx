import BtnAddOutline from "@/components/Form/BtnAddOutline.jsx";
import PropTypes from "prop-types";
import { BiSolidFilePdf } from "react-icons/bi";
import { IoDocument, IoImage } from "react-icons/io5";
import { PiVideoFill } from "react-icons/pi";
import { RiDownload2Line, RiCloseLine, RiAttachment2 } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import InputAndLabel from "@/components/Form/InputAndLabel.jsx";

function AttachmentsList({ attachments = [], onUpload, onDelete, isUploading, compact = false }) {
    const { t } = useTranslation();
    const inputFileRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState("");

    const getFileIcons = (type) => {
        if (type?.includes("pdf") || type === "pdf")
            return <BiSolidFilePdf size={15} className={"text-gray-400 dark:text-gray-500 rounded"} />;
        if (type?.includes("image") || type === "image")
            return <IoImage size={15} className={"text-gray-400 dark:text-gray-500 rounded"} />;
        if (type?.includes("video") || type === "video")
            return <PiVideoFill size={15} className={"text-gray-400 dark:text-gray-500 rounded"} />;
        return <IoDocument size={15} className={"text-gray-500 dark:text-gray-400 rounded"} />;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
        // clear input value so the same file can be selected again if canceled
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
    };

    const handleAddFileClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const confirmUpload = async () => {
        if (selectedFile && onUpload) {
            try {
                await onUpload(selectedFile, description);
                setSelectedFile(null);
                setDescription("");
            } catch {
                // The parent shows the API error; retain the selection for retry.
            }
        }
    };

    const cancelUpload = () => {
        setSelectedFile(null);
        setDescription("");
    };

    const handleDownload = (url, name) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = name || "download";
        link.target = "_blank";
        link.click();
    };

    const formatSize = (bytes) => {
        if (!bytes) return "0 KB";
        return (bytes / 1024).toFixed(2) + " KB";
    };

    return (
        <section className={`flex flex-col w-full items-start bg-surface border border-status-border shadow-sm ${compact ? "p-3 rounded-xl gap-3" : "p-4 sm:p-5 rounded-[24px] gap-4"}`}>
            <div className="flex items-center justify-between w-full gap-3">
                <h2 className={`${compact ? "text-base" : "text-lg"} font-bold text-table-title`}>{t("Attachments")}</h2>
                <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-badge-bg text-xs font-semibold text-cell-primary">{attachments.length}</span>
            </div>
            <div className={"flex flex-col gap-3 w-full"}>
                {attachments.length === 0 && !selectedFile && (
                    <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-status-border text-center text-cell-secondary ${compact ? "py-3" : "py-7"}`}>
                        <RiAttachment2 size={28} className="opacity-50" />
                        <p className="text-sm">{t("No attachments yet")}</p>
                    </div>
                )}
                {attachments?.map((attachment, index) => (
                    <div key={attachment._id || index} className="flex justify-between items-center gap-3 rounded-2xl border border-status-border p-3 hover:bg-status-bg transition-colors">
                        <div className="flex gap-3 items-center min-w-0">
                            <div className={"p-1 bg-gray-50 dark:bg-gray-900 rounded-full"}>
                                {getFileIcons(attachment.mime_type || attachment.type)}
                            </div>
                            <div className={"nameAndWork flex flex-col gap-0.5 items-start flex-1 min-w-0"}>
                                <div className={"nameAndRule flex gap-1 w-full"}>
                                    <p className={"text-sm font-medium dark:text-gray-200 truncate"}>{attachment.original_name || attachment.name}</p>
                                </div>
                                <div className={"flex flex-col gap-0.5 w-full"}>
                                    <p className={"text-[10px] text-sub-500 dark:text-sub-300"}>
                                        {t("size")}: {formatSize(attachment.size)}
                                    </p>
                                    {attachment.description && (
                                        <p className={"text-xs text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed"}>
                                            {attachment.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={"flex gap-2"}>
                            <button type="button" aria-label={t("Download")} onClick={() => handleDownload(attachment.url, attachment.original_name)} className="rounded-lg p-1.5 text-primary-base hover:bg-badge-bg transition-colors">
                                <RiDownload2Line size={18} />
                            </button>
                            {onDelete && (
                                <button type="button" aria-label={t("Delete")} onClick={() => onDelete(attachment._id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                    <AiOutlineDelete size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
                {isUploading && (
                   <p className="text-xs text-primary-base dark:text-primary-200 animate-pulse">{t("Uploading...")}</p>
                )}

                {!selectedFile && onUpload && (
                    <div className={"cursor-pointer"}>
                        <BtnAddOutline onClick={handleAddFileClick} title={t("Add a file")} disabled={isUploading} />
                    </div>
                )}

                {selectedFile && (
                    <div className="flex flex-col gap-3 p-3 mt-2 border border-status-border bg-menu-active-bg rounded-xl w-full">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                {selectedFile.name}
                            </span>
                            <RiCloseLine className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500" size={20} onClick={cancelUpload} />
                        </div>
                        <InputAndLabel 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            name="description"
                            type="text"
                            title={t("Description (Optional)")}
                            placeholder={t("Add a short description about this file")}
                        />
                        <div className="flex justify-end gap-2 mt-1">
                            <button onClick={cancelUpload} className="px-4 py-2 text-xs font-medium text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
                                {t("Cancel")}
                            </button>
                            <button onClick={confirmUpload} className="px-4 py-2 text-xs font-medium text-white dark:text-black bg-primary-base dark:bg-primary-200 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-600">
                                {t("Upload")}
                            </button>
                        </div>
                    </div>
                )}

                <input
                    ref={inputFileRef}
                    id="file-upload"
                    type="file"
                    className={"hidden"}
                    onChange={handleFileChange}
                />
            </div>
        </section>
    );
}

AttachmentsList.propTypes = {
    attachments: PropTypes.array,
    onUpload: PropTypes.func,
    onDelete: PropTypes.func,
    isUploading: PropTypes.bool,
    compact: PropTypes.bool,
};

export default AttachmentsList;
