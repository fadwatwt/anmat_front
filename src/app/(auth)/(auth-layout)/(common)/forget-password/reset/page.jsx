"use client";

import { useState } from "react";
import { IoIosLock } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/auth/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "@/redux/auth/authSlice";
import { RiUserSettingsLine } from "@remixicon/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function ResetPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const { error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login({ email, password }).unwrap();
            dispatch(loginSuccess(response));
            if (typeof window !== 'undefined') {
                localStorage.setItem("token", response.token);
            }
            router.push("/dashboard");
        } catch (err) {
            dispatch(loginFailure(err.data?.message || t("Login failed")));
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            className="w-full rounded-lg bg-primary-base dark:bg-primary-200 text-white dark:text-black py-1.5"
                        >
                            {isLoading ? t("Loading...") : t("Reset")}
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
