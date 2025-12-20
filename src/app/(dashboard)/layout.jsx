"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import i18n from "i18next";
import { setLanguage } from "@/functions/Days";
import Header from "@/components/Header"
import "../globals.css";
import PropTypes from "prop-types";
import DashboardSideMenu from "@/components/DashboardSideMenu";


const MainLayout = ({ children }) => {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const router = useRouter();

    const isSettingsPage = router.asPath === "/setting";
    const authToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // useDarkMode();

    console.log("Render MainLayout");


    const toggleSlidebarOpen = () => setSlidebarOpen(!isSlidebarOpen);

    // تغيير اتجاه الصفحة والخط حسب اللغة
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

    // تعيين اللغة للتواريخ وغيرها
    useEffect(() => {
        setLanguage(i18n.language);
    }, [i18n.language]);

    // التوجيه إلى صفحة تسجيل الدخول في حال عدم وجود التوكن
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
                {!isSettingsPage ? (
                    <Header taggleSlidebarOpen={toggleSlidebarOpen} />
                ) : (
                    <Header
                        className="md:hidden block"
                        taggleSlidebarOpen={toggleSlidebarOpen}
                    />
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
