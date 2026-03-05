import { useTranslation } from "react-i18next";
import {
    RiFilePdfLine,
    RiImageLine,
    RiDeleteBinLine,
    RiDownloadLine,
    RiFileLine
} from "@remixicon/react";

function PersonalAttachments({ className }) {
    const { t } = useTranslation();

    const files = [
        {
            name: "File1.pdf",
            size: "5.50 MB",
            type: "pdf",
        },
        {
            name: "Certificate.png",
            size: "3.20 MB",
            type: "image",
        },
        {
            name: "Certificate.png",
            size: "3.20 MB",
            type: "image",
        },
        {
            name: "File1.pdf",
            size: "5.50 MB",
            type: "pdf",
        },
        {
            name: "File1.pdf",
            size: "5.50 MB",
            type: "pdf",
        },
    ];

    const getIcon = (type) => {
        switch (type) {
            case "pdf":
                return <RiFilePdfLine size={20} className="text-gray-500" />;
            case "image":
                return <RiImageLine size={20} className="text-gray-500" />;
            default:
                return <RiFileLine size={20} className="text-gray-500" />;
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 h-full flex flex-col gap-6 ${className}`}>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t("Personal Attachments")}</h3>
            <div className="flex flex-col gap-4">
                {files.map((file, index) => (
                    <div key={index} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                {getIcon(file.type)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
                                <span className="text-xs text-gray-400">{file.size}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                <RiDeleteBinLine size={18} />
                            </button>
                            <button className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                <RiDownloadLine size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PersonalAttachments;
