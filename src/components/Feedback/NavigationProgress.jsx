"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// A thin top-of-screen progress bar shown during client-side route changes,
// so users get immediate feedback that a navigation is in progress.
//
// It starts when a navigation begins (Link click or router.push, both of which
// go through history.pushState/replaceState) and completes once the new route
// has committed AND the bar has been visible for a minimum time, so even
// instant (prefetched) navigations still flash the bar.
const MIN_VISIBLE_MS = 500;

function NavigationProgressInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    const timersRef = useRef([]);
    const startedAtRef = useRef(0);
    const activeRef = useRef(false);
    const firstRenderRef = useRef(true);

    const clearTimers = () => {
        timersRef.current.forEach((id) => clearTimeout(id));
        timersRef.current = [];
    };

    const start = () => {
        clearTimers();
        activeRef.current = true;
        startedAtRef.current = Date.now();
        setVisible(true);
        setProgress(8);
        const steps = [
            [80, 30],
            [200, 55],
            [500, 72],
            [1000, 85],
            [2000, 93],
        ];
        steps.forEach(([delay, value]) => {
            timersRef.current.push(
                setTimeout(() => setProgress((p) => Math.max(p, value)), delay)
            );
        });
    };

    const finish = () => {
        if (!activeRef.current) return;
        activeRef.current = false;
        clearTimers();

        const elapsed = Date.now() - startedAtRef.current;
        const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

        timersRef.current.push(
            setTimeout(() => {
                setProgress(100);
                timersRef.current.push(
                    setTimeout(() => {
                        setVisible(false);
                        setProgress(0);
                    }, 220)
                );
            }, wait)
        );
    };

    // Patch history methods once so we detect the *start* of every client nav,
    // including programmatic router.push/replace (Next routes through these).
    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const origPush = window.history.pushState;
        const origReplace = window.history.replaceState;

        const maybeStart = (url) => {
            try {
                const next = new URL(String(url), window.location.href);
                if (
                    next.pathname !== window.location.pathname ||
                    next.search !== window.location.search
                ) {
                    start();
                }
            } catch {
                start();
            }
        };

        window.history.pushState = function patchedPush(...args) {
            if (args?.[2] != null) maybeStart(args[2]);
            return origPush.apply(this, args);
        };
        window.history.replaceState = function patchedReplace(...args) {
            if (args?.[2] != null) maybeStart(args[2]);
            return origReplace.apply(this, args);
        };

        const onPopState = () => start();
        window.addEventListener("popstate", onPopState);

        // Also catch plain anchor / Link clicks as an early start signal, in
        // case a navigation is slow to reach pushState.
        const onClick = (e) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }
            const anchor = e.target?.closest?.("a[href]");
            if (!anchor) return;
            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("#") || anchor.target === "_blank") return;
            try {
                const next = new URL(href, window.location.href);
                if (next.origin !== window.location.origin) return;
                if (next.pathname !== window.location.pathname || next.search !== window.location.search) {
                    start();
                }
            } catch {
                /* ignore */
            }
        };
        document.addEventListener("click", onClick, true);

        return () => {
            window.history.pushState = origPush;
            window.history.replaceState = origReplace;
            window.removeEventListener("popstate", onPopState);
            document.removeEventListener("click", onClick, true);
            clearTimers();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Route committed: the new segment rendered. Skip the very first render
    // (initial page load) so the bar only reacts to real navigations.
    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        finish();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[10001] h-1 pointer-events-none">
            <div
                className="h-full bg-primary-500 shadow-[0_0_10px_rgba(55,93,251,0.8)] transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

// useSearchParams must be wrapped in Suspense in the App Router.
export default function NavigationProgress() {
    return (
        <Suspense fallback={null}>
            <NavigationProgressInner />
        </Suspense>
    );
}
