"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next'
import i18n from '../../public/lib/i18n'
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "light";
        }
        return "light";
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const root = window.document.documentElement;

        const applyTheme = (t) => {
            let actualTheme = t;
            if (t === "system") {
                actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }

            if (actualTheme === "dark") {
                root.classList.add("dark");
                root.classList.remove("light");
            } else {
                root.classList.add("light");
                root.classList.remove("dark");
            }
        };

        applyTheme(theme);
        localStorage.setItem("theme", theme);

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyTheme("system");
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {children}
        </ThemeContext.Provider>
    );
};

const Providers = ({ children }) => {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <I18nextProvider i18n={i18n}>
                    {children}
                </I18nextProvider>
            </ThemeProvider>
        </Provider>
    );
};

Providers.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Providers;