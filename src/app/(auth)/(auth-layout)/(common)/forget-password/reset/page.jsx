"use client";

import { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/auth/authAPI";
import { RiUserSettingsLine } from "@remixicon/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function ResetPasswordPage() {
    const { t } = useTranslation();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [token, setResetToken] = useState("");
    const [error, setError] = useState("");
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const router = useRouter();

    useEffect(() => {
        setResetToken(new URLSearchParams(window.location.search).get("token") || "");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!token) {
            setError(t("Invalid or expired password reset link"));
            return;
        }
        if (password !== passwordConfirmation) {
            setError(t("Passwords must match"));
            return;
        }
        try {
            await resetPassword({
                token,
                password,
                password_confirmation: passwordConfirmation,
            }).unwrap();
            router.push("/sign-in?passwordReset=success");
        } catch (err) {
            setError(err.data?.message || t("Failed to reset password"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="loginForm flex flex-col gap-3">
            <div className="flex flex-col items-center gap-3">
                <div className="flex w-20 h-20 justify-center items-center rounded-full bg-status-bg">
                    <div className="flex w-12 h-12 justify-center items-center rounded-full bg-surface shadow-md">
                        <RiUserSettingsLine size={30} className="text-cell-primary" />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <span className="text-2xl text-cell-primary">
                        {t("Reset Password")}
                    </span>
                    <span className="text-sm text-cell-secondary">
                        {t("Enter your new password")}
                    </span>
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-2 w-full">

                        <div className={"flex flex-col gap-2 w-full"}>
                            <label className="text-cell-primary">{t("New Password")}</label>
                            <div className="flex bg-surface pl-2 px-2 w-full items-center border border-status-border rounded-xl">
                                <IoIosLock className="text-cell-secondary w-10" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8}
                                    placeholder="*"
                                    className="w-full py-3 px-2 outline-none bg-transparent dark:bg-gray-800 text-cell-primary dark:text-gray-100"
                                    required
                                />
                            </div>
                        </div>
                        <div className={"flex flex-col gap-2 w-full"}>
                            <label className="text-cell-primary">{t("Confirm New Password")}</label>
                            <div className="flex bg-surface pl-2 px-2 w-full items-center border border-status-border rounded-xl">
                                <IoIosLock className="text-cell-secondary w-10" size={18} />
                                <input
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8}
                                    placeholder="*"
                                    className="w-full py-3 px-2 outline-none bg-transparent dark:bg-gray-800 text-cell-primary dark:text-gray-100"
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full min-h-11 rounded-lg bg-primary-base dark:bg-primary-200 text-white dark:text-black py-1.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
                                    {t("Resetting...")}
                                </>
                            ) : t("Reset")}
                        </button>
                        <Link
                            href="/sign-in"
                            className="w-full rounded-lg text-end text-primary-base hover:text-primary-600"
                        >
                            {t("Return to login")}
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ResetPasswordPage;
