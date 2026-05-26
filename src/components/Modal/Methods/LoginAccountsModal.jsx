"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "../Modal.jsx";
import DefaultButton from "../../Form/DefaultButton.jsx";
import AccountPicker from "../SocialMedia/AccountPicker.jsx";
import ApiResponseAlert from "../../Alerts/ApiResponseAlert.jsx";
import { useProcessing } from "@/app/providers";
import { useCheckTwitterAccountsMutation } from "@/redux/socialMedia/twitterAccountsApi";

function LoginAccountsModal({ isOpen, onClose, className }) {
    const { t } = useTranslation();
    const [checkTwitterAccounts, { isLoading }] = useCheckTwitterAccountsMutation();
    const { showProcessing, hideProcessing } = useProcessing();

    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [userAgent, setUserAgent] = useState("web");
    const [results, setResults] = useState(null);
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const reset = () => {
        setSelectedAccounts([]);
        setUserAgent("web");
        setResults(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async () => {
        if (selectedAccounts.length === 0) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select at least one account"),
            });
            return;
        }

        showProcessing(t("Checking account credentials..."));
        try {
            // Map selected account names to objects with `name` key expected by backend
            const accountsPayload = selectedAccounts.map((name) => ({ name }));

            const response = await checkTwitterAccounts({
                accounts: accountsPayload,
                userAgent,
            }).unwrap();

            // Extract the result array returned in response.data
            const outcome = response?.data || [];
            setResults(outcome);

            const failed = outcome.filter((r) => !r.status).length;
            const succeeded = outcome.length - failed;

            if (failed === 0) {
                setApiResponse({
                    isOpen: true,
                    status: "success",
                    message: t("Login checks completed successfully for {{count}} account(s)", { count: succeeded }),
                });
            } else if (succeeded === 0) {
                setApiResponse({
                    isOpen: true,
                    status: "error",
                    message: t("Login checks failed for all selected accounts"),
                });
            } else {
                setApiResponse({
                    isOpen: true,
                    status: "warning",
                    message: t("Succeeded: {{succeeded}}, Failed: {{failed}}", { succeeded, failed }),
                });
            }
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.errors?.[0]?.msg ||
                error?.data?.error ||
                t("Failed to run login verification");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={t("Login Twitter Account(s)")} className={className}>
            <div className="flex flex-col gap-4 text-start">
                <AccountPicker
                    selected={selectedAccounts}
                    onChange={setSelectedAccounts}
                    title={t("Select Account(s) to Login")}
                />

                <div className="flex flex-col gap-1 w-full items-start">
                    <label className="text-cell-primary text-sm font-medium">
                        {t("User Agent Type")} <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={userAgent}
                        onChange={(e) => setUserAgent(e.target.value)}
                        className="py-2 px-2 text-sm bg-status-bg border-status-border border-2 rounded-xl w-full focus:outline-none focus:border-primary-400 text-cell-primary cursor-pointer"
                    >
                        <option value="web">{t("Web Browser")}</option>
                        <option value="mobile">{t("Mobile Device")}</option>
                    </select>
                </div>

                {results && (
                    <div className="flex flex-col gap-2 w-full border border-status-border p-3 rounded-xl bg-status-bg mt-1">
                        <h4 className="text-sm font-semibold text-cell-primary border-b border-status-border pb-1">
                            {t("Verification Outcomes")}
                        </h4>
                        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto mt-1">
                            {results.map((res, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center text-xs py-1 border-b border-status-border last:border-b-0"
                                >
                                    <span className="font-medium text-cell-primary">@{res.user}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                            res.status
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                        }`}
                                    >
                                        {res.status ? t("Login Success") : res.message || t("Failed")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-2 w-full pt-2">
                    <DefaultButton
                        type="button"
                        title={t("Cancel")}
                        onClick={handleClose}
                        className="font-medium text-cell-secondary"
                        disabled={isLoading}
                    />
                    <DefaultButton
                        type="button"
                        title={isLoading ? t("Logging in...") : t("Apply")}
                        onClick={handleSubmit}
                        disabled={isLoading || selectedAccounts.length === 0}
                        className="bg-primary-500 font-medium text-white hover:bg-primary-600 transition-colors"
                    />
                </div>
            </div>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ isOpen: false, status: null, message: "" })}
            />
        </Modal>
    );
}

LoginAccountsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default LoginAccountsModal;
