"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultButton from "../../../Form/DefaultButton.jsx";
import AccountPicker from "../../SocialMedia/AccountPicker.jsx";
import ApiResponseAlert from "../../../Alerts/ApiResponseAlert.jsx";
import { useProcessing } from "@/app/providers";
import { useUnfollowAccountMutation } from "@/redux/socialMedia/twitterAccountsApi";

function UnFollowMethod() {
    const { t } = useTranslation();
    const [unfollow, { isLoading }] = useUnfollowAccountMutation();
    const { showProcessing, hideProcessing } = useProcessing();

    const [sourceAccounts, setSourceAccounts] = useState([]);
    const [targets, setTargets] = useState("");
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const parseTargets = (raw) =>
        raw
            .split(/[\s,;\n]+/)
            .map((s) => s.trim().replace(/^@/, ""))
            .filter(Boolean);

    const handleSubmit = async () => {
        const followList = parseTargets(targets);

        if (sourceAccounts.length === 0 || followList.length === 0) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select source accounts and usernames to unfollow"),
            });
            return;
        }

        showProcessing(t("Sending unfollow requests..."));
        try {
            await unfollow({
                accounts: sourceAccounts,
                follow: followList,
            }).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Unfollow requests sent successfully"),
            });
            setTargets("");
            setSourceAccounts([]);
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.errors?.[0]?.msg ||
                error?.data?.error ||
                t("Failed to send unfollow requests");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <AccountPicker
                selected={sourceAccounts}
                onChange={setSourceAccounts}
                title={t("Source accounts (who will unfollow)")}
            />

            <div className="flex flex-col gap-1 w-full items-start">
                <label className="text-cell-primary text-sm font-medium">
                    {t("Accounts to unfollow")} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={targets}
                    onChange={(e) => setTargets(e.target.value)}
                    placeholder={`${t("Paste usernames, one per line or comma-separated")}`}
                    rows={3}
                    className="rounded-xl p-2 text-xs border-2 border-status-border w-full focus:outline-none bg-status-bg text-cell-primary focus:border-primary-400"
                />
                <p className="text-xs text-cell-secondary">
                    {t("Parsed")}: {parseTargets(targets).length}
                </p>
            </div>

            <div className="flex gap-2 pt-2">
                <DefaultButton
                    type="button"
                    title={t("Cancel")}
                    onClick={() => {
                        setSourceAccounts([]);
                        setTargets("");
                    }}
                    className="font-medium text-cell-secondary"
                    disabled={isLoading}
                />
                <DefaultButton
                    type="button"
                    title={isLoading ? t("Submitting...") : t("Apply")}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-primary-500 font-medium text-white hover:bg-primary-600 transition-colors"
                />
            </div>

            <ApiResponseAlert
                isOpen={apiResponse.isOpen}
                status={apiResponse.status}
                message={apiResponse.message}
                onClose={() => setApiResponse({ isOpen: false, status: null, message: "" })}
            />
        </div>
    );
}

export default UnFollowMethod;
