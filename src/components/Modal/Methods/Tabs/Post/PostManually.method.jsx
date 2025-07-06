import { useState } from "react";
import { BsImage } from "react-icons/bs";
import { TfiVideoClapper } from "react-icons/tfi";
import { MdOutlineSell } from "react-icons/md";
import DefaultButton from "../../../../Form/DefaultButton.jsx";
import StatusBool from "../../../../Subcomponents/StatusBool.jsx";
import {useTranslation} from "react-i18next";

function PostManuallyMethod() {
    const {t} = useTranslation()
    const [uploadedFile, setUploadedFile] = useState(null); // لتخزين الملف الذي تم رفعه
    const [uploadError, setUploadError] = useState(false); // لتحديد حالة نجاح أو فشل التحميل

    // دالة لتحميل الملف
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // نحاول رفع الملف، وإذا فشل التحميل نحول حالة الخطأ إلى true
            const isUploadSuccessful = Math.random() > 0.5; // محاكاة حالة التحميل (نجاح/فشل)
            if (isUploadSuccessful) {
                setUploadedFile(file);
                setUploadError(false); // تم التحميل بنجاح
            } else {
                setUploadedFile(null);
                setUploadError(true); // فشل التحميل
            }
        }
    };

    // دالة لتنسيق حجم الملف
    const formatFileSize = (size) => {
        if (size < 1024) return `${size} Bytes`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className={"flex flex-col items-start gap-3 "}>
            <div className={"bg-gray-100 w-full flex justify-start p-2 dark:bg-gray-900 text-sm rounded-md"}>
                <p className={"dark:text-gray-200 text-xs"}>Account Name 1</p>
            </div>
            <div className={"flex flex-col gap-2 items-start w-full"}>
                <div className={"flex flex-col gap-1 w-full items-start"}>
                <label className={"text-black dark:text-gray-300 text-sm"}>{t("Post description")}</label>
                <textarea
                    placeholder={t("Placeholder text..")}
                    className={"rounded-xl p-2 text-xs border-2 w-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-primary-150  focus:border-blue-500"}
                    rows={5}
                ></textarea>
                </div>
                <div className={"flex flex-col gap-3 items-start w-full pl-2"}>
                    <div className={"icons-post flex justify-start gap-3"}>
                        {/* أيقونات تحميل الملفات */}
                        <label>
                            <BsImage
                                className={"dark:text-primary-200 text-primary-500 rounded-md cursor-pointer"}
                                size={20}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <label>
                            <TfiVideoClapper
                                className={"dark:text-primary-200 text-primary-500 rounded-md cursor-pointer"}
                                size={20}
                            />
                            <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                        <label>
                            <MdOutlineSell
                                className={"dark:text-primary-200 text-primary-500 cursor-pointer"}
                                size={20}
                            />
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                    <div className={"state-post-file w-full"}>
                        {/* عرض حالة التحميل */}
                        {uploadError ? (
                            <div className="flex flex-col w-full items-start gap-1">
                                <StatusBool status={false} titleFalse={"Failed to upload to the file"} />
                                <span className="text-sm text-red-500 cursor-pointer">{t("Try Again")}</span>
                            </div>
                        ) : uploadedFile ? (
                            <div className="w-full flex items-center justify-between">
                                <StatusBool status={true} titleTrue={t("Uploaded")} />
                                <div className={"flex gap-2 items-center border-2 rounded-lg px-2 py-1"}>
                                    {uploadedFile.type.startsWith("image/") && (
                                        <img
                                            src={URL.createObjectURL(uploadedFile)}
                                            alt="Uploaded"
                                            className="w-5 h-5 rounded-lg object-cover"
                                        />
                                    )}
                                    <span className="text-sm text-gray-700">
                    Size: {formatFileSize(uploadedFile.size)}
                  </span>
                                </div>
                            </div>
                        ) : (
                            <StatusBool status={false} titleFalse={t("No file uploaded")} />
                        )}
                    </div>
                </div>
            </div>
            <div className={"flex gap-2 w-full"}>
                <DefaultButton type={'button'} title={"Cancel"} className={"font-medium dark:text-gray-200 "} />
                <DefaultButton type={'button'} title={"Apply"} className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"} />
            </div>
        </div>
    );
}

export default PostManuallyMethod;
