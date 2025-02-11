
import { useDropzone } from "react-dropzone";
import {useCallback} from "react";
import {VscCloudUpload} from "react-icons/vsc";
import {useTranslation} from "react-i18next";

const FileUpload = () => {
    const {t} = useTranslation()
    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles); // معالجة الملفات المرفوعة
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".txt",
        maxSize: 50 * 1024 * 1024,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col dark:text-gray-300 gap-2 items-center">
                <VscCloudUpload size={35} />
                <p className="text-gray-800 dark:text-gray-300 text-sm">
                    {t("Choose a file or drag & drop it here.")}
                </p>
                <p className="text-gray-700 text-xs dark:text-gray-300">{t(".txt format, up to 50 MB.")}</p>
                <button className="mt-4 text-sm px-8 py-2 bg-white border-2 rounded-xl text-gray-900 hover:bg-gray-200">
                    {t("Browse File")}
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
