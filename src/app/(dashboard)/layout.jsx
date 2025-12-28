"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import i18n from "i18next";
import { setLanguage } from "@/functions/Days";
import Header from "@/components/Header"
import "../globals.css";
import PropTypes from "prop-types";
import DashboardSideMenu from "@/components/DashboardSideMenu";

const MainLayout = ({ children }) => {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); // الحصول على المسار الحالي

    // التحقق مما إذا كنا في صفحة الإعدادات أو الاشتراكات
    const isSettingsPage = pathname === "/setting";
    const isSubscriptionPage = pathname === "/subscriptions";

    const authToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const toggleSlidebarOpen = () => setSlidebarOpen(!isSlidebarOpen);

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
        if (!authToken) {
            // router.push("/login");
        }
    }, [authToken]);

    return (
        <div className="flex max-w-full w-screen h-screen">
            <DashboardSideMenu
                isSlidebarOpen={isSlidebarOpen}
                toggleSlidebarOpen={toggleSlidebarOpen}
            />
            <div className="h-full w-screen flex-col">
                {/* الشرط الجديد:
                    إظهار الهيدر فقط إذا لم نكن في صفحة الاشتراكات
                */}
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