"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiCheckboxCircleFill, RiLoader4Line } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { setUser, selectAuth } from "@/redux/auth/authSlice";
import { RootRoute } from "@/Root.Route";

const SuccessPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const { token } = useSelector(selectAuth);
    const [getUser] = useLazyGetUserQuery();
    const [isUpdating, setIsUpdating] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const updateUserData = async () => {
            if (!token) {
                setIsUpdating(false);
                setIsConfirmed(false);
                return;
            }

            try {
                const checkoutSessionId = new URLSearchParams(window.location.search).get("session_id");
                if (checkoutSessionId) {
                    const verification = await fetch(`${RootRoute}/api/subscriptions/subscriber/verify-checkout`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ session_id: checkoutSessionId }),
                    });
                    const result = await verification.json();
                    if (!verification.ok || result.status !== "success") {
                        setIsConfirmed(false);
                        setIsUpdating(false);
                        return;
                    }
                    if (!result.data?.activated) {
                        if (retryCount < 5) setTimeout(() => setRetryCount(prev => prev + 1), 2000);
                        else setIsUpdating(false);
                        return;
                    }
                }
                console.log(`Fetching updated user data (attempt ${retryCount + 1})...`);
                const response = await getUser(token).unwrap();
                const userData = response?.data || response;

                if (userData) {
                    // Check if the subscription is recognized yet
                    if (userData.type === "Subscriber" && !userData.active_subscription_id && retryCount < 5) {
                        console.log("Subscription not found yet, retrying in 2 seconds...");
                        setTimeout(() => setRetryCount(prev => prev + 1), 2000);
                        return;
                    }

                    if (userData.type !== "Subscriber" || !userData.active_subscription_id) {
                        setIsConfirmed(false);
                        setIsUpdating(false);
                        return;
                    }

                    console.log("User data updated locally.");
                    dispatch(setUser(userData));
                    setIsConfirmed(true);
                    setIsUpdating(false);
                }
            } catch (err) {
                console.error("Failed to refresh user data:", err);
                if (retryCount < 5) {
                    setTimeout(() => setRetryCount(prev => prev + 1), 2000);
                } else {
                    setIsConfirmed(false);
                    setIsUpdating(false);
                }
            }
        };

        if (isUpdating) {
            updateUserData();
        }
    }, [token, getUser, dispatch, retryCount, isUpdating]);

    const handleGoToDashboard = () => {
        // Use hard reload to ensure all guards and states are clean
        window.location.href = "/dashboard";
    };

    if (isUpdating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
                <RiLoader4Line className="animate-spin text-primary-base" size={48} />
                <div className="space-y-2">
                    <p className="text-cell-secondary font-bold text-lg italic">{t("Finalizing your subscription...")}</p>
                    <p className="text-cell-secondary text-sm">{t("We're verifying your payment with our secure servers.")}</p>
                </div>
            </div>
        );
    }

    if (!isConfirmed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4 text-cell-primary">
                <h1 className="text-2xl font-bold">{t("Subscription activation pending")}</h1>
                <p className="text-cell-secondary max-w-md">{t("Your payment may be complete, but the subscription is not active in Anmaat yet. Please retry in a moment.")}</p>
                <button type="button" onClick={() => { setRetryCount(0); setIsUpdating(true); }} className="bg-primary-base text-white rounded-lg px-6 py-3">{t("Retry")}</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in text-cell-primary">
            <div className="bg-green-100 p-4 rounded-full mb-6 shadow-sm dark:bg-green-900/30">
                <RiCheckboxCircleFill className="text-green-600 dark:text-green-400" size={64} />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t("Payment Successful!")}</h1>
            <p className="text-cell-secondary text-lg mb-8 max-w-md">
                {t("Thank you for your subscription. Your account is now fully active, and you have complete access to all features.")}
            </p>
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleGoToDashboard}
                    className="bg-primary-base dark:bg-primary-200 text-white dark:text-black px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-primary-700 transition-all transform hover:scale-105"
                >
                    {t("Go to Dashboard")}
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
