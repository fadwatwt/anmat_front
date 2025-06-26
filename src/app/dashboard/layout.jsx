"use client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useDarkMode from "@/hooks/useDarkMode";
import i18n from "i18next";
import { setLanguage } from "@/functions/Days";
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import "../globals.css";

const MainLayout = ({ children }) => {
  const [isSlidebarOpen, setSlidebarOpen] = useState(false);
  const router = useRouter();
  const isSettingsPage = router.asPath === "/settings";
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [theme, setTheme] = useDarkMode();

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

export default MainLayout;
