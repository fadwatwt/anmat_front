import "./App.css";
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import AppRoute from "./Routes/AppRoute.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import useDarkMode from "./Hooks/useDarkMode.js";
import "/i18n.js";
import i18n from "i18next";
import { setLanguage } from "./functions/Days.js";
import { useSelector } from "react-redux";

function App() {
  const [isSlidebarOpen, setSlidebarOpen] = useState(false);
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const isSettingsPage = location.pathname === "/settings";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Because there is a need to allow more pages without the main header
  const pagesWithoutHeader = ["/settings", "/subscription"];

  const taggleSlidebarOpen = () => {
    setSlidebarOpen(!isSlidebarOpen);
  };

  useEffect(() => {
    const updateDirectionAndFont = () => {
      const root = document.documentElement;
      window.document.dir = i18n.dir();
      const lang = localStorage.getItem("i18nextLng");

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

    return () => {
      i18n.off("languageChanged", updateDirectionAndFont);
    };
  }, []);
  setLanguage(i18n.language);

  useDarkMode();

  if (isAuthPage) {
    return <AppRoute />;
  }

  return (
    <div className={`flex max-w-full w-screen max-h-screen`}>
      {token && (
        <Menu
          isSlidebarOpen={isSlidebarOpen}
          taggleSlidebarOpen={taggleSlidebarOpen}
        />
      )}
      <div className={`${token ? "md:w-[calc(100vw-16rem)]" : "w-screen"} flex-col`}>
        {token && !pagesWithoutHeader.includes(location.pathname) ? (
          <Header taggleSlidebarOpen={taggleSlidebarOpen} />
        ) : token && (
          <Header
            className="md:hidden block"
            taggleSlidebarOpen={taggleSlidebarOpen}
          />
        )}
        <AppRoute />
      </div>
    </div>
  );
}

export default App;
