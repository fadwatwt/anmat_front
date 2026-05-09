import { create } from "zustand";

/**
 * Tracks how many Alert/ApiResponseAlert/ApprovalAlert modals are currently
 * open. When the count is > 0, regular Modals hide themselves so the alert
 * is the only thing on screen. Counter (not boolean) so nested or
 * back-to-back alerts don't prematurely flip the flag.
 */
export const useAlertStore = create((set) => ({
    openCount: 0,
    open: () => set((s) => ({ openCount: s.openCount + 1 })),
    close: () =>
        set((s) => ({ openCount: Math.max(0, s.openCount - 1) })),
}));

export const useIsAlertOpen = () =>
    useAlertStore((s) => s.openCount > 0);
