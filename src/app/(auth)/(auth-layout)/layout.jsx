"use client";
import { RiGlobalLine } from "@remixicon/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { loginSuccess } from "@/redux/auth/authSlice";
import { useTranslation } from "react-i18next";

function AuthLayout({ children }) {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const [triggerGetUser] = useLazyGetUserQuery();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const result = await triggerGetUser(token).unwrap();
                // Reconstruct the payload expected by loginSuccess
                const payload = {
                    data: {
                        access_token: token,
                        user: result.data || result
                    }
                };
                dispatch(loginSuccess(payload));
                router.push("/dashboard");
            } catch {
                localStorage.removeItem("token");
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, [dispatch, router, triggerGetUser]);

    const toggleLanguage = () => {
        const newLang = i18n.language === "ar" ? "en" : "ar";
        i18n.changeLanguage(newLang);
    };

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12">
                    <Image
                        className="w-12 h-12 rounded-full"
                        src="/images/logo.png"
                        alt="Company Logo"
                        width={48}
                        height={48}
                    />
                </div>
                <span className="text-md text-gray-700 dark:text-gray-50">{t("Loading ...")}</span>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-start py-1 bg-white dark:bg-[#161922]">
            <div className="flex flex-col w-full md:w-[50%] lg:w-[40%] h-screen overflow-hidden gap-8 px-4 sm:px-6 md:px-9 py-4 sm:py-7 bg-transparent">
                {/* Logo Section */}
                <div className="flex items-center justify-start gap-2 mb-4 md:mb-8">
                    <Image
                        className="w-10 h-10 rounded-full"
                        src="/images/logo.png"
                        alt="Company Logo"
                        width={40}
                        height={40}
                    />
                    <div className="flex flex-col gap-1 justify-center">
                        <p className="text-sm text-cell-primary dark:text-white">{t("Employees Management")}</p>
                        <p className="text-xs text-gray-500 dark:text-white">{t("Employees & HR Management")}</p>
                    </div>
                </div>

                {/* Placeholder for login form (this should be a Client Component) */}
                <div className="w-full flex flex-col items-center gap-8 justify-between h-full overflow-auto">
                    <div className="w-full px-4 sm:px-6 md:px-12">{children}</div>
                </div>

                <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                    <button onClick={toggleLanguage} className="flex gap-2 items-center bg-transparent">
                        <RiGlobalLine size={20} className="text-cell-secondary" />
                        <span className="text-md text-cell-secondary">{i18n.language === "ar" ? t("English") : t("Arabic")}</span>
                    </button>
                </div>
            </div>

            {/* Right Side Image/Placeholder */}
            <div className="hidden md:flex flex-col justify-center flex-1 rounded-xl bg-status-bg relative overflow-hidden m-2">
                <div className="absolute top-12 left-36 w-full">
                    <img
                        src="/images/LandingPage/dashboardImage.png"
                        alt="image"
                        className="w-full"
                    />
                </div>
                <div className="h-[75vh]"></div>
                <div className="flex flex-col items-center justify-center gap-2 text-center px-4">
                    <span className="text-xl lg:text-2xl text-cell-primary">
                        {t("The Ultimate Management Dashboard")}
                    </span>
                    <span className="text-sm lg:text-lg text-cell-secondary">
                        {t("Everything you require for teamwork, analysis, and making decisions all in a single location.")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
