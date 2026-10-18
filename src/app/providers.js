"use client"
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { I18nextProvider } from 'react-i18next'
import i18n from '../../public/lib/i18n'
import PropTypes from "prop-types";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/store";
import { selectIsMutating } from "@/redux/ui/processingSlice";
import NotificationListener from '@/components/NotificationListener';
import ProcessingOverlay from '@/components/Feedback/ProcessingOverlay';
import NavigationProgress from '@/components/Feedback/NavigationProgress';
import CallProvider from '@/components/Call/CallProvider';
import GroupCallProvider from '@/components/Call/GroupCallProvider';
import { setLanguage } from "@/functions/Days";
import { Toaster } from "react-hot-toast";

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

const applyThemeToDocument = (selectedTheme) => {
    const root = window.document.documentElement;
    const actualTheme = selectedTheme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : selectedTheme;

    root.classList.toggle("dark", actualTheme === "dark");
    root.classList.toggle("light", actualTheme !== "dark");
};

const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState("light");

    useEffect(() => {
        setThemeState(localStorage.getItem("theme") || "light");
    }, []);

    const setTheme = useCallback((nextTheme) => {
        const requestedTheme = typeof nextTheme === "function" ? nextTheme(theme) : nextTheme;
        if (!["light", "dark", "system"].includes(requestedTheme) || requestedTheme === theme) return;

        const commitTheme = () => {
            applyThemeToDocument(requestedTheme);
            flushSync(() => setThemeState(requestedTheme));
        };
        const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (document.startViewTransition && !reduceMotion) {
            document.startViewTransition(commitTheme);
            return;
        }

        const root = document.documentElement;
        if (!reduceMotion) root.classList.add("theme-transition");
        commitTheme();
        if (!reduceMotion) {
            window.setTimeout(() => root.classList.remove("theme-transition"), 400);
        }
    }, [theme]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        applyThemeToDocument(theme);
        localStorage.setItem("theme", theme);

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = () => applyThemeToDocument("system");
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
        const handleLanguageChanged = (lng) => {
            updateHtmlAttributes(lng);
            setLanguage(lng);
            localStorage.setItem("i18nextLng", lng);
            document.cookie = `i18next=${lng}; path=/; max-age=31536000; SameSite=Lax`;
        };
        i18n.on("languageChanged", handleLanguageChanged);
        updateHtmlAttributes(i18n.language);
        setLanguage(i18n.language);

        const storedLang = localStorage.getItem("i18nextLng");
        const cookieLang = document.cookie.match(/(?:^|;\s*)i18next=([^;]+)/)?.[1];
        const preferredLang = storedLang || cookieLang || navigator.language;
        const nextLang = preferredLang?.toLowerCase().startsWith("ar") ? "ar" : "en";
        // Let React finish hydrating the server-rendered English shell before
        // restoring the saved browser language. Changing i18n synchronously in
        // this effect can update client text while hydration is still walking
        // the page, which produces a mismatch for returning Arabic users.
        const restoreLanguage = () => {
            if (nextLang !== i18n.language) i18n.changeLanguage(nextLang);
        };
        const languageIdleCallback = window.requestIdleCallback
            ? window.requestIdleCallback(restoreLanguage, { timeout: 2000 })
            : null;
        const languageTimer = languageIdleCallback === null
            ? window.setTimeout(restoreLanguage, 500)
            : null;

        return () => {
            if (languageTimer !== null) window.clearTimeout(languageTimer);
            if (languageIdleCallback !== null) window.cancelIdleCallback(languageIdleCallback);
            i18n.off("languageChanged", handleLanguageChanged);
        };
    }, []);

    return (
        <Provider store={store}>
            <NavigationProgress />
            <NotificationListener />
            <ThemeProvider>
                <ProcessingProvider>
                    <I18nextProvider i18n={i18n}>
                        <CallProvider>
                            <GroupCallProvider>
                                {children}
                            </GroupCallProvider>
                        </CallProvider>
                    </I18nextProvider>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "#1f2937",
                                color: "#f9fafb",
                                zIndex: 99999,
                            },
                        }}
                    />
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
