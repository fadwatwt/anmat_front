"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next'
import i18n from '../../public/lib/i18n'
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import NotificationListener from '@/components/NotificationListener';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ThemeContext = createContext();
export const ProcessingContext = createContext();

export const useTheme = () => useContext(ThemeContext);
export const useProcessing = () => useContext(ProcessingContext);

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

import ProcessingOverlay from '@/components/Feedback/ProcessingOverlay';

const ProcessingProvider = ({ children }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState(null);

    const showProcessing = (message) => {
        setProcessingMessage(message);
        setIsProcessing(true);
    };

    const hideProcessing = () => {
        setIsProcessing(false);
        setProcessingMessage(null);
    };

    return (
        <ProcessingContext.Provider value={{ showProcessing, hideProcessing, isProcessing }}>
            {children}
            <ProcessingOverlay isOpen={isProcessing} message={processingMessage} />
        </ProcessingContext.Provider>
    );
};

const Providers = ({ children }) => {
    return (
        <Provider store={store}>
            <NotificationListener />
            <ThemeProvider>
                <ProcessingProvider>
                    <I18nextProvider i18n={i18n}>
                        {children}
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={i18n.language === 'ar'}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </I18nextProvider>
                </ProcessingProvider>
            </ThemeProvider>
        </Provider>
    );
};

Providers.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Providers;