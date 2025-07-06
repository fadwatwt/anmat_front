import BtnAddOutline from "../../../../../components/Form/BtnAddOutline.jsx";
import PropTypes from "prop-types";
import { BiSolidFilePdf } from "react-icons/bi";
import { IoDocument, IoImage } from "react-icons/io5";
import { PiVideoFill } from "react-icons/pi";
import { RiDownload2Line } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";

function AttachmentsList({ initialAttachments }) {
    const { t } = useTranslation();
    const [attachments, setAttachments] = useState(initialAttachments || []);
    const inputFileRef = useRef(null);

    const getFileIcons = (type) => {
        switch (type) {
            case "pdf":
                return <BiSolidFilePdf size={15} className={"text-gray-400 rounded"} />;
            case "image":
                return <IoImage size={15} className={"text-gray-400 rounded"} />;
            case "video":
                return <PiVideoFill size={15} className={"text-gray-400 rounded"} />;
            default:
                return <IoDocument size={15} className={"text-gray-500 rounded"} />;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type.split("/")[0];
            const type = fileType === "application" && file.name.endsWith(".pdf") ? "pdf" : fileType;

            setAttachments((prev) => [
                ...prev,
                {
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + " KB",
                    type: type,
                    file: file
                },
            ]);
        }
    };

    const handleDelete = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddFileClick = () => {
        if (inputFileRef.current) {
            inputFileRef.current.click();
        }
    };

    const handleDownload = (file) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={"flex flex-col w-full p-4 rounded-2xl items-start gap-3 bg-white dark:bg-white-0"}>
            <p className={"text-lg dark:text-gray-200"}>{t("Attachments")}</p>
            <div className={"flex flex-col gap-3 w-full"}>
                {attachments.map((attachment, index) => (
                    <div key={index} className={"flex justify-between items-center"}>
                        <div className={"flex gap-3 items-center"}>
                            <div className={"p-1 bg-gray-50 dark:bg-gray-900 rounded-full"}>
                                {getFileIcons(attachment.type)}
                            </div>
                            <div className={"nameAndWork flex flex-col gap-1 items-start"}>
                                <div className={"nameAndRule flex gap-1"}>
                                    <p className={"text-sm dark:text-gray-200"}>{attachment.name}</p>
                                </div>
                                <p className={"text-xs text-sub-500 dark:text-sub-300"}>
                                    {t("size")}: {attachment.size}
                                </p>
                            </div>
                        </div>
                        <div className={"flex gap-2"}>
                            <AiOutlineDelete
                                className={"text-red-500 cursor-pointer"}
                                size={20}
                                onClick={() => handleDelete(index)}
                            />
                            <RiDownload2Line
                                className={"text-primary-base dark:text-primary-200 cursor-pointer"}
                                size={20}
                                onClick={() => handleDownload(attachment.file)} // استدعاء دالة التنزيل
                            />
                        </div>
                    </div>
                ))}
                <div className={"cursor-pointer"}>
                    <BtnAddOutline onClick={handleAddFileClick} title={t("Add a file")} />
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
    initialAttachments: PropTypes.array,
};

export default AttachmentsList;
