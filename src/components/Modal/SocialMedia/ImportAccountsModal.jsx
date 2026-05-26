"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "@/components/Modal/Modal.jsx";
import FileUpload from "@/components/Form/FileUpload";
import SelectAndLabel from "@/components/Form/SelectAndLabel";
import ApiResponseAlert from "@/components/Alerts/ApiResponseAlert";
import { useProcessing } from "@/app/providers";
import {
    useImportTwitterAccountsMutation,
    useGetAccountCategoriesQuery,
} from "@/redux/socialMedia/twitterAccountsApi";

function ImportAccountsModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState("");
    const [importAccounts, { isLoading }] = useImportTwitterAccountsMutation();
    const { data: categories = [], isLoading: catsLoading } = useGetAccountCategoriesQuery(
        undefined,
        { skip: !isOpen },
    );
    const { showProcessing, hideProcessing } = useProcessing();
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setCategory("");
            setApiResponse({ isOpen: false, status: null, message: "" });
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!file || !category) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select a CSV file and a category."),
            });
            return;
        }

        const formData = new FormData();
        formData.append("csvFile", file);
        formData.append("Category", category);

        showProcessing(t("Importing accounts..."));
        try {
            const response = await importAccounts(formData).unwrap();
            const insertedCount = response?.insertedCount ?? 0;
            const failed = response?.failed ?? 0;
            const message = failed
                ? t("Imported {{insertedCount}} accounts. {{failed}} failed.", {
                      insertedCount,
                      failed,
                  })
                : t("Imported {{insertedCount}} accounts successfully.", { insertedCount });
            setApiResponse({
                isOpen: true,
                status: failed ? "warning" : "success",
                message,
            });
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.error ||
                error?.error ||
                t("Failed to import accounts.");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
        }
    };

    const handleAlertClose = () => {
        if (apiResponse.status === "success") onClose();
        setApiResponse({ isOpen: false, status: null, message: "" });
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={t("Import Twitter Accounts")}
                isBtns={true}
                btnApplyTitle={isLoading ? t("Importing...") : t("Import")}
                disabled={isLoading || !file || !category}
                onClick={handleSubmit}
                className="lg:w-5/12 md:w-8/12 sm:w-7/12 w-11/12 p-4"
            >
                <div className="flex flex-col gap-4 px-1">
                    <p className="text-cell-secondary text-xs">
                        {t(
                            "Upload a CSV file with columns: Username, Password, Email, Phone, Cookies, Proxy, etc. The quota will be enforced before insertion.",
                        )}
                    </p>
                    <SelectAndLabel
                        title={t("Category")}
                        name="Category"
                        isRequired
                        value={category}
                        options={categories.map((c) => ({ _id: c._id, name: c.name }))}
                        onChange={setCategory}
                        onBlur={() => {}}
                        placeholder={catsLoading ? t("Loading categories...") : t("Select category")}
                    />
                    <FileUpload
                        title={t("CSV File")}
                        callBack={setFile}
                        accept={{ "text/csv": [".csv"] }}
                        description="Supported format: CSV up to 5 MB."
                    />
                    {file && (
                        <div className="text-sm text-cell-primary bg-status-bg rounded-lg px-3 py-2 flex justify-between items-center">
                            <span className="truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="text-red-500 text-xs"
                            >
                                {t("Remove")}
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={handleAlertClose}
            />
        </>
    );
}

ImportAccountsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ImportAccountsModal;
