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
import { selectAuth, loadAuthState } from "@/redux/auth/authSlice";

const MainLayout = ({ children }) => {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const { isAuthenticated, token } = useSelector(selectAuth);

    // التحقق مما إذا كنا في صفحة الإعدادات أو الاشتراكات
    const isSettingsPage = pathname === "/setting";
    const isSubscriptionPage = pathname === "/subscriptions";

    const toggleSlidebarOpen = () => setSlidebarOpen(!isSlidebarOpen);

    // Load auth state on mount if not already loaded
    useEffect(() => {
        if (!isAuthenticated && typeof window !== "undefined") {
            dispatch(loadAuthState());
        }
    }, [dispatch, isAuthenticated]);

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

    useEffect(() => {
        // Only redirect if we are SURE the user is not authenticated
        // This is simplified; you might want a more complex check
        if (!isAuthenticated && !localStorage.getItem("token")) {
            router.push("/sign-in");
        }
    }, [isAuthenticated, router]);

    // If we have a token but aren't authenticated in Redux yet, show a loader
    // If we're not authenticated and have no token, the useEffect will redirect
    if (!isAuthenticated && (typeof window !== "undefined" && localStorage.getItem("token"))) {
        return <div className="h-screen w-screen flex items-center justify-center">Loading session...</div>;
    }

    if (!isAuthenticated) {
        return null; // or redirecting...
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

                <main className="h-[calc(100vh-72px)] overflow-auto tab-content dark:bg-gray-900">
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