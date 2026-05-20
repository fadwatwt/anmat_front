"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import DefaultButton from "../../../Form/DefaultButton.jsx";
import InputAndLabel from "../../../Form/InputAndLabel.jsx";
import AccountPicker from "../../SocialMedia/AccountPicker.jsx";
import ApiResponseAlert from "../../../Alerts/ApiResponseAlert.jsx";
import { useProcessing } from "@/app/providers";
import { useReplyToTweetMutation } from "@/redux/socialMedia/twitterAccountsApi";

// tweetAPI's reply endpoint expects a txt file whose lines (separated by '/')
// pair with the accounts array. We build it on the client from the single
// reply text the user provides so they don't have to upload a file manually.
function ReplayMethod() {
    const { t } = useTranslation();
    const [reply, { isLoading }] = useReplyToTweetMutation();
    const { showProcessing, hideProcessing } = useProcessing();

    const [accounts, setAccounts] = useState([]);
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const handleSubmit = async () => {
        if (accounts.length === 0 || !url.trim() || !text.trim()) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please fill all required fields"),
            });
            return;
        }

        showProcessing(t("Sending replies..."));
        try {
            const repliesPayload = accounts.map(() => text.trim()).join("/");
            const blob = new Blob([repliesPayload], { type: "text/plain" });
            const formData = new FormData();
            formData.append("txtFile", blob, "replies.txt");
            accounts.forEach((acc) => formData.append("accounts", acc));
            formData.append("url", url.trim());

            await reply(formData).unwrap();
            setApiResponse({
                isOpen: true,
                status: "success",
                message: t("Replied from {{count}} account(s)", { count: accounts.length }),
            });
            setUrl("");
            setText("");
            setAccounts([]);
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.data?.errors?.[0]?.msg ||
                error?.data?.error ||
                t("Failed to send replies");
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

            <div className="flex flex-col gap-1 w-full items-start">
                <label className="text-cell-primary text-sm font-medium">
                    {t("Reply text")} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`${t("Your reply...")}`}
                    rows={3}
                    maxLength={280}
                    className="rounded-xl p-2 text-xs border-2 border-status-border w-full focus:outline-none bg-status-bg text-cell-primary focus:border-primary-400"
                />
                <span className="text-xs text-cell-secondary">{text.length}/280</span>
            </div>

            <div className="flex gap-2 pt-2">
                <DefaultButton
                    type="button"
                    title="Cancel"
                    onClick={() => {
                        setAccounts([]);
                        setUrl("");
                        setText("");
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

export default ReplayMethod;
