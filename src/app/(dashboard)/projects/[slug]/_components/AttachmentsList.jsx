import BtnAddOutline from "@/components/Form/BtnAddOutline.jsx";
import PropTypes from "prop-types";
import { BiSolidFilePdf } from "react-icons/bi";
import { IoDocument, IoImage } from "react-icons/io5";
import { PiVideoFill } from "react-icons/pi";
import { RiDownload2Line } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";

function AttachmentsList({ attachments = [], onUpload, onDelete, isUploading }) {
    const { t } = useTranslation();
    const inputFileRef = useRef(null);

    const getFileIcons = (type) => {
        if (type?.includes("pdf") || type === "pdf")
            return <BiSolidFilePdf size={15} className={"text-gray-400 rounded"} />;
        if (type?.includes("image") || type === "image")
            return <IoImage size={15} className={"text-gray-400 rounded"} />;
        if (type?.includes("video") || type === "video")
            return <PiVideoFill size={15} className={"text-gray-400 rounded"} />;
        return <IoDocument size={15} className={"text-gray-500 rounded"} />;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && onUpload) {
            onUpload(file);
        }
    };

    const handleAddFileClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
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
        <div className={"flex flex-col w-full p-4 rounded-2xl items-start gap-3 bg-white dark:bg-white-0"}>
            <p className={"text-lg dark:text-gray-200"}>{t("Attachments")}</p>
            <div className={"flex flex-col gap-3 w-full"}>
                {attachments?.map((attachment, index) => (
                    <div key={attachment._id || index} className={"flex justify-between items-center"}>
                        <div className={"flex gap-3 items-center"}>
                            <div className={"p-1 bg-gray-50 dark:bg-gray-900 rounded-full"}>
                                {getFileIcons(attachment.mime_type || attachment.type)}
                            </div>
                            <div className={"nameAndWork flex flex-col gap-1 items-start"}>
                                <div className={"nameAndRule flex gap-1"}>
                                    <p className={"text-sm dark:text-gray-200"}>{attachment.original_name || attachment.name}</p>
                                </div>
                                <p className={"text-xs text-sub-500 dark:text-sub-300"}>
                                    {t("size")}: {formatSize(attachment.size)}
                                </p>
                            </div>
                        </div>
                        <div className={"flex gap-2"}>
                            <RiDownload2Line
                                className={"text-primary-base dark:text-primary-200 cursor-pointer"}
                                size={20}
                                onClick={() => handleDownload(attachment.url, attachment.original_name)}
                            />
                            {onDelete && (
                                <AiOutlineDelete
                                    className={"text-red-500 cursor-pointer hover:opacity-80 transition-opacity"}
                                    size={20}
                                    onClick={() => onDelete(attachment._id)}
                                />
                            )}
                        </div>
                    </div>
                ))}
                
                {isUploading && (
                   <p className="text-xs text-primary-base animate-pulse">{t("Uploading...")}</p>
                )}

                <div className={"cursor-pointer"}>
                    <BtnAddOutline onClick={handleAddFileClick} title={t("Add a file")} disabled={isUploading} />
                </div>
                <input
                    ref={inputFileRef}
                    id="file-upload"
                    type="file"
                    className={"hidden"}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

AttachmentsList.propTypes = {
    attachments: PropTypes.array,
    onUpload: PropTypes.func,
    onDelete: PropTypes.func,
    isUploading: PropTypes.bool
};

export default AttachmentsList;
