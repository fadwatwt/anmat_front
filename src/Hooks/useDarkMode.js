import {useEffect, useState} from "react";

export default function useDarkMode() {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (typeof window !== "undefined") {
            applyTheme("light");
            localStorage.setItem("theme", "light");
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            applyTheme("light");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const applyTheme = () => {
        if (typeof window === "undefined") return;
        const root = document.documentElement;
        root.classList.remove("dark");
        root.classList.add("light");
    };

    return [theme, setTheme];
}
