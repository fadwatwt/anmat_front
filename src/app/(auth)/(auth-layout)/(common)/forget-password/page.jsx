"use client";

import { useState } from "react";
import { GoMail } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/redux/auth/authAPI";
import { RiUserSettingsLine } from "@remixicon/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function ForgetPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await forgotPassword({ email }).unwrap();
            router.push("/forget-password/sent");
        } catch (err) {
            setError(err.data?.message || t("Failed to send password reset link"));
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
                        {t("Forget Password")}
                    </span>
                    <span className="text-sm text-cell-secondary">
                        {t("Enter your email to got a reset link.")}
                    </span>
                </div>

                <div className="w-full">
                    <div className="flex flex-col gap-2 w-full">

                        <div className={"flex flex-col gap-2 w-full"}>
                            <label className="text-cell-primary">{t("Email Address")}</label>
                            <div className="flex bg-surface pl-2 px-2 w-full items-center border border-status-border rounded-xl">
                                <GoMail className="text-cell-secondary w-10" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("Enter your email")}
                                    className="w-full py-3 px-2 outline-none bg-transparent dark:bg-gray-800 text-cell-primary dark:text-gray-100 dark:placeholder-gray-400"
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
                                    {t("Sending...")}
                                </>
                            ) : t("Get Reset Link")}
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

export default ForgetPasswordPage;
