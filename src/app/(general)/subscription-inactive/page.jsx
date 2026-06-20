"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/auth/authSlice";
import { RiLockLine } from "react-icons/ri";

// Shown to employees whose organization's subscription has lapsed. They are
// fully blocked from the dashboard until the organization owner (subscriber)
// renews. Subscribers themselves are sent to the plans page instead.
function SubscriptionInactive() {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(logout());
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        router.push("/sign-in");
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 max-w-md text-center mt-16">
            <div className="flex w-20 h-20 justify-center items-center rounded-full bg-status-bg">
                <div className="flex w-12 h-12 justify-center items-center rounded-full bg-surface shadow-md">
                    <RiLockLine size={28} className="text-red-500" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-cell-primary">
                    {t("Subscription Inactive")}
                </h1>
                <p className="text-sm text-cell-secondary leading-relaxed">
                    {t(
                        "Your organization's subscription has expired. Please contact your organization administrator to renew the subscription and restore access.",
                    )}
                </p>
            </div>

            <button
                onClick={handleSignOut}
                className="w-full rounded-lg bg-primary-base dark:bg-primary-200 text-white dark:text-black py-2"
            >
                {t("Sign Out")}
            </button>
        </div>
    );
}

export default SubscriptionInactive;
