import './App.css'
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import AppRoute from "./Routes/AppRoute.jsx";
import {useEffect, useState} from "react";
import {useLocation} from "react-router";
import useDarkMode from "./Hooks/useDarkMode.js";
import "/i18n.js"
import i18n from "i18next";
import {setLanguage} from "./functions/Days.js";

function App() {
    const [isSlidebarOpen, setSlidebarOpen] = useState(false);
    const location = useLocation();
    const isSettingsPage = location.pathname === "/settings";
    const taggleSlidebarOpen = () => {
        setSlidebarOpen(!isSlidebarOpen);
        console.log("bilal")
    }

    useEffect(() => {
        const updateDirectionAndFont = () => {
            const root = document.documentElement;
            window.document.dir = i18n.dir();
            const lang = localStorage.getItem("i18nextLng")

            if (i18n.language === "ar") {
                root.classList.add("font-ar");
                root.classList.remove("font-default");
            } else {
                root.classList.add("font-default");
                root.classList.remove("font-ar");
            }
        };

        updateDirectionAndFont();

        i18n.on('languageChanged', updateDirectionAndFont);

        return () => {
            i18n.off('languageChanged', updateDirectionAndFont);
        };
    }, []);
    setLanguage(i18n.language);

    useDarkMode();
    return (
        <div className={`flex max-w-full w-screen max-h-screen`}>
            <Menu isSlidebarOpen={ isSlidebarOpen } taggleSlidebarOpen={ taggleSlidebarOpen} />
            <div className={"md:w-[calc(100vw-16rem)] w-screen  flex-col"}>
                {!isSettingsPage ? (
                    <Header taggleSlidebarOpen={taggleSlidebarOpen} />)
                    : (<Header className="md:hidden block" taggleSlidebarOpen={taggleSlidebarOpen} />)
                }
                <AppRoute />
            </div>
        </div>
    )
}

export default App;
