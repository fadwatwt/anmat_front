"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useDarkMode from "@/Hooks/useDarkMode";
import i18n from "i18next";
import { setLanguage } from "@/functions/Days";
import Menu from "@/components/Menu"
import Header from "@/components/Header"
import "../globals.css";
import PropTypes from "prop-types";


const MainLayout = ({ children }) => {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const router = useRouter();

    const isSettingsPage = router.asPath === "/settings";
    const authToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    useDarkMode();

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
            router.push("/login");
        }
    }, [authToken]);

    return (
        <div className="flex max-w-full w-screen max-h-screen">
            <Menu
                isSlidebarOpen={isSlidebarOpen}
                taggleSlidebarOpen={toggleSlidebarOpen}
            />
            <div className="md:w-[calc(100vw-16rem)] w-screen flex-col">
                {!isSettingsPage ? (
                    <Header taggleSlidebarOpen={toggleSlidebarOpen} />
                ) : (
                    <Header
                        className="md:hidden block"
                        taggleSlidebarOpen={toggleSlidebarOpen}
                    />
                )}
                <main>{children}</main>
            </div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;
