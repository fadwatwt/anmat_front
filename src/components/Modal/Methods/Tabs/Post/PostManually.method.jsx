"use client";

import { useState } from "react";
import { BsImage } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import DefaultButton from "../../../../Form/DefaultButton.jsx";
import AccountPicker from "../../../SocialMedia/AccountPicker.jsx";
import ApiResponseAlert from "../../../../Alerts/ApiResponseAlert.jsx";
import { useProcessing } from "@/app/providers";
import { usePostTweetSingleMutation } from "@/redux/socialMedia/twitterAccountsApi";

function PostManuallyMethod() {
    const { t } = useTranslation();
    const [postTweet, { isLoading }] = usePostTweetSingleMutation();
    const { showProcessing, hideProcessing } = useProcessing();

    const [accounts, setAccounts] = useState([]);
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    const [apiResponse, setApiResponse] = useState({
        isOpen: false,
        status: null,
        message: "",
    });

    const handleImage = (e) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files]);
        e.target.value = "";
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const reset = () => {
        setAccounts([]);
        setText("");
        setImages([]);
    };

    const handleSubmit = async () => {
        if (accounts.length === 0) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Please select at least one account"),
            });
            return;
        }
        if (!text.trim()) {
            setApiResponse({
                isOpen: true,
                status: "error",
                message: t("Tweet text is required"),
            });
            return;
        }

        showProcessing(t("Posting tweet..."));
        try {
            // Endpoint accepts one account at a time; loop on the client to fan out.
            const results = await Promise.allSettled(
                accounts.map(async (accountName) => {
                    const fd = new FormData();
                    fd.append("account", accountName);
                    fd.append("tweet", text);
                    images.forEach((img) => fd.append("images", img));
                    return postTweet(fd).unwrap();
                }),
            );

            const failed = results.filter((r) => r.status === "rejected").length;
            const succeeded = results.length - failed;

            if (failed === 0) {
                setApiResponse({
                    isOpen: true,
                    status: "success",
                    message: t("Tweet posted to {{count}} account(s)", { count: succeeded }),
                });
                reset();
            } else if (succeeded === 0) {
                setApiResponse({
                    isOpen: true,
                    status: "error",
                    message: t("Failed to post on all selected accounts"),
                });
            } else {
                setApiResponse({
                    isOpen: true,
                    status: "warning",
                    message: t("Posted on {{succeeded}} account(s). {{failed}} failed.", {
                        succeeded,
                        failed,
                    }),
                });
            }
        } finally {
            hideProcessing();
        }
    };

    return (
        <div className="flex flex-col items-start gap-3">
            <AccountPicker selected={accounts} onChange={setAccounts} title="Post from accounts" />

            <div className="flex flex-col gap-1 w-full items-start">
                <label className="text-cell-primary text-sm font-medium">
                    {t("Post description")} <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`${t("What's happening?")}...`}
                    className="rounded-xl p-2 text-xs border-2 border-status-border w-full focus:outline-none bg-status-bg text-cell-primary focus:border-primary-400"
                    rows={4}
                    maxLength={280}
                />
                <div className="flex justify-between w-full text-xs text-cell-secondary">
                    <span>{text.length}/280</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 items-start w-full">
                <label className="cursor-pointer flex items-center gap-2 text-primary-500 text-sm">
                    <BsImage size={18} />
                    <span>{t("Add image")}</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple
                        onChange={handleImage}
                    />
                </label>

                {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 w-full">
                        {images.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-status-border"
                            >
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl-lg"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-2 w-full pt-2">
                <DefaultButton
                    type="button"
                    title="Cancel"
                    onClick={reset}
                    className="font-medium text-cell-secondary"
                    disabled={isLoading}
                />
                <DefaultButton
                    type="button"
                    title={isLoading ? "Posting..." : "Apply"}
                    onClick={handleSubmit}
                    disabled={isLoading || accounts.length === 0 || !text.trim()}
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

export default PostManuallyMethod;
