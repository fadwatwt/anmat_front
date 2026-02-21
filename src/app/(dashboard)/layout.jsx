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
import { selectAuth, loadAuthState, logout, setUser } from "@/redux/auth/authSlice";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";

const MainLayout = ({ children }) => {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const { isAuthenticated, token, user } = useSelector(selectAuth);
    const [getUser, { isLoading: isFetchingUser }] = useLazyGetUserQuery();

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
        (user.type === "Employee" && (!user.employee_detail || !user.is_active))
    );

    // Show loading while fetching user or if state is being initialized or redirection is pending
    if (isFetchingUser || !user || shouldRedirect) {
        if (token || (typeof window !== "undefined" && localStorage.getItem("token"))) {
            return (
                <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
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
        <div className="flex max-w-full w-screen h-screen">
            <DashboardSideMenu
                isSlidebarOpen={isSlidebarOpen}
                toggleSlidebarOpen={toggleSlidebarOpen}
            />
            <div className="h-full w-screen flex-col">
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

                <main className="h-[calc(100vh-72px)] overflow-auto max-w-[100vw] tab-content dark:bg-gray-900">
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