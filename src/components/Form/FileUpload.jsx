
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { VscCloudUpload } from "react-icons/vsc";
import { useTranslation } from "react-i18next";
import { RiCloseLine, RiFileLine, RiImageLine } from "react-icons/ri";

const FileUpload = ({ title, callBack, onFileChange, accept = "image/*", maxSize = 5 * 1024 * 1024, description, disabled = false }) => {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const selected = acceptedFiles[0];
        if (!selected) return;
        setFile(selected);
        if (selected.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(selected));
        } else {
            setPreview(null);
        }
        const handler = onFileChange || callBack;
        handler && handler(selected);
    }, [callBack, onFileChange]);

    const handleRemove = (e) => {
        e.stopPropagation();
        setFile(null);
        setPreview(null);
        const handler = onFileChange || callBack;
        handler && handler(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        disabled,
        multiple: false,
    });

    if (file) {
        return (
            <div className="flex flex-col gap-3 w-full">
                {title && <label className="text-sm font-medium text-cell-secondary">{t(title)}</label>}
                <div className="flex items-center gap-3 p-3 border border-status-border rounded-xl bg-gray-50 dark:bg-white/5">
                    {preview ? (
                        <img src={preview} alt={file.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                            <RiFileLine size={22} className="text-primary-500" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cell-primary truncate">{file.name}</p>
                        <p className="text-xs text-cell-secondary">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                    >
                        <RiCloseLine size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center gap-3 w-full">
            {title && <label className="text-sm font-medium text-cell-secondary">{t(title)}</label>}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed dark:border-gray-700 rounded-lg p-6 text-center w-full transition-all ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 dark:border-gray-700" :
                        isDragActive ? "border-blue-500 bg-blue-50 cursor-pointer" : "border-gray-300 dark:border-gray-700 cursor-pointer hover:border-gray-400"
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col dark:text-gray-300 gap-2 items-center">
                    <VscCloudUpload size={35} className={disabled ? "text-gray-400" : "text-primary-500"} />
                    <p className="text-gray-800 dark:text-gray-300 text-sm font-medium">
                        {t("Choose a file or drag & drop it here.")}
                    </p>
                    <p className="text-gray-700 text-xs dark:text-gray-300">
                        {description ? t(description) : t("Supported formats: Images (PNG, JPG, etc.), up to 5 MB.")}
                    </p>
                    <button
                        type="button"
                        disabled={disabled}
                        className={`mt-4 text-sm px-8 py-2 border-2 rounded-xl transition-colors ${disabled ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        {t("Browse File")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
