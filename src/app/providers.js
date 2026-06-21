"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next'
import i18n from '../../public/lib/i18n'
import PropTypes from "prop-types";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { selectIsMutating } from "@/redux/ui/processingSlice";
import NotificationListener from '@/components/NotificationListener';
import ProcessingOverlay from '@/components/Feedback/ProcessingOverlay';
import NavigationProgress from '@/components/Feedback/NavigationProgress';
import { setLanguage } from "@/functions/Days";

const updateHtmlAttributes = (lang) => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = i18n.dir();
    if (lang === "ar") {
        root.classList.add("font-ar");
        root.classList.remove("font-default");
    } else {
        root.classList.add("font-default");
        root.classList.remove("font-ar");
    }
};

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

const ProcessingProvider = ({ children }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState(null);

    // Automatically true whenever any (non-silent) RTK Query mutation is in
    // flight, so every write request shows the overlay without manual wiring.
    const isMutating = useSelector(selectIsMutating);

    // Delay the auto overlay slightly so very fast mutations don't flash it.
    const [showAutoOverlay, setShowAutoOverlay] = useState(false);
    useEffect(() => {
        if (!isMutating) {
            setShowAutoOverlay(false);
            return;
        }
        const timer = setTimeout(() => setShowAutoOverlay(true), 250);
        return () => clearTimeout(timer);
    }, [isMutating]);

    const showProcessing = (message) => {
        setProcessingMessage(message);
        setIsProcessing(true);
    };

    const hideProcessing = () => {
        setIsProcessing(false);
        setProcessingMessage(null);
    };

    // Manual message takes priority; otherwise fall back to a generic label.
    const overlayOpen = isProcessing || showAutoOverlay;
    const overlayMessage = isProcessing ? processingMessage : null;

    return (
        <ProcessingContext.Provider value={{ showProcessing, hideProcessing, isProcessing }}>
            {children}
            <ProcessingOverlay isOpen={overlayOpen} message={overlayMessage} />
        </ProcessingContext.Provider>
    );
};

const Providers = ({ children }) => {
    useEffect(() => {
        updateHtmlAttributes(i18n.language);
        setLanguage(i18n.language);
        i18n.on("languageChanged", (lng) => {
            updateHtmlAttributes(lng);
            setLanguage(lng);
        });
        return () => i18n.off("languageChanged");
    }, []);

    return (
        <Provider store={store}>
            <NavigationProgress />
            <NotificationListener />
            <ThemeProvider>
                <ProcessingProvider>
                    <I18nextProvider i18n={i18n}>
                        {children}
                    </I18nextProvider>
                </ProcessingProvider>
            </ThemeProvider>
        </Provider>
    );
};

Providers.propTypes = {
    children: PropTypes.node.isRequired,
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

ProcessingProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Providers;