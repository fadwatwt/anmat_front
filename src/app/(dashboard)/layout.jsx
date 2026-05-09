"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import i18n from "i18next";
import { setLanguage } from "@/functions/Days";
import Header from "@/components/Header"
import "../globals.css";
import PropTypes from "prop-types";
import DashboardSideMenu from "@/components/DashboardSideMenu";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, loadAuthState, logout, setUser, setPermissions } from "@/redux/auth/authSlice";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { useLazyGetMyPermissionsQuery } from "@/redux/permissions/subscriberPermissionsApi";
import useDarkMode from "@/Hooks/useDarkMode";

const MainLayout = ({ children }) => {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useDarkMode();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    useEffect(() => {
        setMounted(true);
    }, []);

    const { isAuthenticated, token, user, permissionsLoaded } = useSelector(selectAuth);
    const [getUser, { isLoading: isFetchingUser }] = useLazyGetUserQuery();
    const [getMyPermissions] = useLazyGetMyPermissionsQuery();

    // التحقق مما إذا كنا في صفحة الإعدادات أو الاشتراكات
    const isSettingsPage = pathname === "/setting";
    const isSubscriptionPage = pathname === "/subscriptions";

    const toggleSlidebarOpen = () => setSlidebarOpen(!isSlidebarOpen);

    // Load auth state from localStorage on mount
    useEffect(() => {
        if (!token && typeof window !== "undefined") {
            dispatch(loadAuthState());
        }
    }, [dispatch, token]);

    // Fetch user if token exists but user data is missing
    useEffect(() => {
        const fetchUser = async () => {
            const storedToken = token || (typeof window !== "undefined" && localStorage.getItem("token"));
            if (storedToken && !user) {
                try {
                    const result = await getUser(storedToken).unwrap();
                    const userData = result?.data || result;
                    if (userData) {
                        dispatch(setUser(userData));
                        // Specific redirects
                        if (userData.type === "Subscriber") {
                            if (!userData.is_organization_registered) {
                                router.push("/account-setup/subscriber/business-selection");
                                return;
                            }
                            if (!userData.active_subscription_id) {
                                router.push("/account-setup/subscriber/plans");
                                return;
                            }
                        } else if (userData.type === "Employee") {
                            if (!userData.email_verification?.is_verified) {
                                router.push("/account-setup/employee/email/verification");
                                return;
                            }
                            if (!userData.employee_detail || !userData.is_active) {
                                router.push("/account-setup/employee");
                                return;
                            }
                        }
                    } else {
                        // If result doesn't have data, consider it invalid
                        dispatch(logout());
                        router.push("/sign-in");
                    }
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    dispatch(logout());
                    router.push("/sign-in");
                }
            } else if (user) {
                // Check status even if user is already in state
                if (user.type === "Subscriber") {
                    if (!user.is_organization_registered) {
                        router.push("/account-setup/subscriber/business-selection");
                        return;
                    }
                    if (!user.active_subscription_id) {
                        router.push("/account-setup/subscriber/plans");
                        return;
                    }
                } else if (user.type === "Employee") {
                    if (!user.email_verification?.is_verified) {
                        router.push("/account-setup/employee/email/verification");
                        return;
                    }
                    if (!user.employee_detail || !user.is_active) {
                        router.push("/account-setup/employee");
                        return;
                    }
                }
            } else if (!storedToken) {
                router.push("/sign-in");
            }
        };

        fetchUser();
    }, [token, user, getUser, dispatch, router]);

    // Fetch the authenticated user's permissions once user is loaded
    useEffect(() => {
        if (user && !permissionsLoaded) {
            getMyPermissions()
                .unwrap()
                .then((perms) => dispatch(setPermissions(perms)))
                .catch((err) => {
                    console.error("Failed to fetch permissions:", err);
                    dispatch(setPermissions([]));
                });
        }
    }, [user, permissionsLoaded, getMyPermissions, dispatch]);

    useEffect(() => {
        const updateDirectionAndFont = () => {
            const root = document.documentElement;
            document.dir = i18n.dir();

            if (i18n.language === "ar") {
                root.classList.add("font-ar");
                root.classList.remove("font-default");
            } else {
                root.classList.add("font-default");
                root.classList.remove("font-ar");
            }
        };

        updateDirectionAndFont();
        i18n.on("languageChanged", updateDirectionAndFont);
        return () => i18n.off("languageChanged", updateDirectionAndFont);
    }, []);

    useEffect(() => {
        setLanguage(i18n.language);
    }, [i18n.language]);

    // Check if redirection is needed
    const shouldRedirect = user && (
        (user.type === "Subscriber" && (!user.is_organization_registered || !user.active_subscription_id)) ||
        (user.type === "Employee" && (!user.email_verification?.is_verified || !user.employee_detail || !user.is_active))
    );

    // Show loading while fetching user or if state is being initialized or redirection is pending
    if (!mounted) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-status-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-base"></div>
                    <p className="text-cell-secondary font-medium">
                        Loading session...
                    </p>
                </div>
            </div>
        );
    }

    if (isFetchingUser || !user || shouldRedirect) {
        if (token || localStorage.getItem("token")) {
            return (
                <div className="h-screen w-screen flex items-center justify-center bg-status-bg">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-base"></div>
                        <p className="text-cell-secondary font-medium">
                            {shouldRedirect ? "Redirecting to setup..." : "Loading session..."}
                        </p>
                    </div>
                </div>
            );
        }
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex w-full h-screen overflow-hidden bg-main">
            <DashboardSideMenu
                isSlidebarOpen={isSlidebarOpen}
                toggleSlidebarOpen={toggleSlidebarOpen}
            />
            {/* Overlay for mobile when sidebar is open */}
            {isSlidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[55] md:hidden"
                    onClick={toggleSlidebarOpen}
                />
            )}
            <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden ">
                {!isSubscriptionPage && (
                    !isSettingsPage ? (
                        <Header taggleSlidebarOpen={toggleSlidebarOpen} />
                    ) : (
                        <Header
                            className="md:hidden block"
                            taggleSlidebarOpen={toggleSlidebarOpen}
                        />
                    )
                )}

                <main className="flex-1 overflow-auto bg-main p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;