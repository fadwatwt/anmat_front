"use client";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetUserQuery, useLazyLogoutQuery } from "@/redux/auth/authAPI";
import { loginSuccess, logout as logoutAction } from "@/redux/auth/authSlice";
import { useTranslation } from "react-i18next";

function AccountSetupLayout({ children }) {
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [triggerGetUser] = useLazyGetUserQuery();
    const [triggerLogout] = useLazyLogoutQuery();
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/sign-in");
                return;
            }

            try {
                const result = await triggerGetUser(token).unwrap();
                const userData = result.data || result;

                // Security Check: Subscriber and Employee allowed in account setup
                if (!["Subscriber", "Employee"].includes(userData.type)) {
                    router.push("/dashboard");
                    return;
                }

                // Employee specific logic
                if (userData.type === "Employee") {
                    if (!userData.email_verification?.is_verified) {
                        if (!pathname.includes("/account-setup/employee/email/verification")) {
                            router.push("/account-setup/employee/email/verification");
                            return;
                        }
                    } else if (userData.employee_detail && userData.is_active) {
                        router.push("/dashboard");
                        return;
                    } else if (!pathname.includes("/account-setup/employee") || pathname.includes("/email/verification")) {
                        router.push("/account-setup/employee");
                        return;
                    }
                }

                // Subscriber specific logic
                if (userData.type === "Subscriber") {
                    // If already fully set up (Org + Subscription), go to dashboard
                    if (userData.is_organization_registered && userData.active_subscription_id) {
                        router.push("/dashboard");
                        return;
                    }

                    // Internal setup redirects
                    if (userData.is_organization_registered) {
                        if (!pathname.includes("/account-setup/subscriber/plans")) {
                            router.push("/account-setup/subscriber/plans");
                            return;
                        }
                    } else {
                        if (pathname.includes("/account-setup/subscriber/business-selection")) {
                            // Already on the right page
                        } else if (pathname.includes("/account-setup/subscriber/plans")) {
                            router.push("/account-setup/subscriber/business-selection");
                            return;
                        }
                    }
                }

                const payload = {
                    data: {
                        access_token: token,
                        user: userData
                    }
                };
                dispatch(loginSuccess(payload));
                setIsLoading(false);
            } catch (error) {
                dispatch(logoutAction());
                router.push("/sign-in");
            }
        };

        verifyAuth();
    }, [dispatch, router, triggerGetUser, pathname]);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
            if (token) {
                await triggerLogout(token).unwrap();
            }
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            dispatch(logoutAction());
            router.push("/sign-in");
        }
    };

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-main-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
                <span className="text-md text-gray-700 dark:text-gray-50">{t("Verifying access...")}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-main-900 overflow-hidden">
            <header className="flex items-center justify-between px-9 py-5 flex-shrink-0">
                <div className="flex items-center gap-2">
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
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500 dark:text-white">{t("Welcome back,")}</span>
                        <span className="text-sm text-cell-primary dark:text-white">{user?.name}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors duration-200"
                    >
                        {t("Logout")}
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto px-9 py-7">
                <div className="flex flex-col items-center justify-center w-full min-h-full">
                    {children}
                </div>
            </main>
            <footer className="h-4 bg-main-900 flex-shrink-0" />
        </div>
    );
}

export default AccountSetupLayout;