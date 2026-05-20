"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultButton from "../../../Form/DefaultButton.jsx";
import InputAndLabel from "../../../Form/InputAndLabel.jsx";
import AccountPicker from "../../SocialMedia/AccountPicker.jsx";
import ApiResponseAlert from "../../../Alerts/ApiResponseAlert.jsx";
import { useProcessing } from "@/app/providers";
import { useLikeTweetMutation } from "@/redux/socialMedia/twitterAccountsApi";

function LikeMethod() {
    const { t } = useTranslation();
    const [likeTweet, { isLoading }] = useLikeTweetMutation();
    const { showProcessing, hideProcessing } = useProcessing();

    const [accounts, setAccounts] = useState([]);
    const [url, setUrl] = useState("");
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const handleSubmit = async () => {
        if (accounts.length === 0 || !url.trim()) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select accounts and provide a tweet URL"),
            });
            return;
        }

        showProcessing(t("Liking tweet..."));
        try {
            await likeTweet({ accounts, url: url.trim() }).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Tweet liked from {{count}} account(s)", { count: accounts.length }),
            });
            setUrl("");
            setAccounts([]);
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.errors?.[0]?.msg ||
                error?.data?.error ||
                t("Failed to like tweet");
            setApiResponse({ isOpen: true, status: "error", message });
        } finally {
            hideProcessing();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <AccountPicker selected={accounts} onChange={setAccounts} title="Accounts" />

            <InputAndLabel
                title="Tweet URL"
                placeholder="https://x.com/user/status/..."
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                isRequired
            />

            <div className="flex gap-2 pt-2">
                <DefaultButton
                    type="button"
                    title="Cancel"
                    onClick={() => {
                        setAccounts([]);
                        setUrl("");
                    }}
                    className="font-medium text-cell-secondary"
                    disabled={isLoading}
                />
                <DefaultButton
                    type="button"
                    title={isLoading ? "Submitting..." : "Apply"}
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

export default LikeMethod;
