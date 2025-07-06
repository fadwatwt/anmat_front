import { useEffect, useState } from 'react';

export default function useDarkMode() {
    const getInitialTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        // const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        if (storedTheme) {
            return storedTheme;
        }
        return 'system';
    };

    const applyTheme = (theme) => {
        const root = document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        root.classList.remove('dark', 'light');

        if (theme === 'system') {
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    };

    const [theme, setTheme] = useState(() => {
        const initialTheme = getInitialTheme();
        applyTheme(initialTheme); // تطبيق الوضع عند التحميل
        return initialTheme;
    });

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, setTheme];
}
