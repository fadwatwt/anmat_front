
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { VscCloudUpload } from "react-icons/vsc";
import { useTranslation } from "react-i18next";

const FileUpload = ({ title, callBack, accept = "image/*", maxSize = 5 * 1024 * 1024, description, disabled = false }) => {
    const { t } = useTranslation()
    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles);
        callBack && callBack(acceptedFiles[0])
    }, [callBack]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept,
        maxSize: maxSize,
        disabled: disabled,
    });

    return (
        <div className="flex flex-col justify-center gap-3 w-full">
            <label >{title}</label>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed dark:border-gray-600 rounded-lg p-6 text-center w-full transition-all ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200" :
                        isDragActive ? "border-blue-500 bg-blue-50 cursor-pointer" : "border-gray-300 cursor-pointer hover:border-gray-400"
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
                        className={`mt-4 text-sm px-8 py-2 border-2 rounded-xl transition-colors ${disabled ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100"
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
