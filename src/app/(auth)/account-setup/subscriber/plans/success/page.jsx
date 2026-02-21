"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiCheckboxCircleFill, RiLoader4Line } from "@remixicon/react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetUserQuery } from "@/redux/auth/authAPI";
import { setUser, selectAuth } from "@/redux/auth/authSlice";

const SuccessPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { token } = useSelector(selectAuth);
    const [getUser] = useLazyGetUserQuery();
    const [isUpdating, setIsUpdating] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const updateUserData = async () => {
            if (!token) {
                setIsUpdating(false);
                return;
            }

            try {
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

                    console.log("User data updated locally.");
                    dispatch(setUser(userData));
                    setIsUpdating(false);
                }
            } catch (err) {
                console.error("Failed to refresh user data:", err);
                if (retryCount < 5) {
                    setTimeout(() => setRetryCount(prev => prev + 1), 2000);
                } else {
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
                    <p className="text-gray-700 font-bold text-lg italic">Finalizing your subscription...</p>
                    <p className="text-gray-400 text-sm">We're verifying your payment with our secure servers.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in text-gray-900">
            <div className="bg-green-100 p-4 rounded-full mb-6 shadow-sm">
                <RiCheckboxCircleFill className="text-green-600" size={64} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
                Thank you for your subscription. Your account is now fully active, and you have complete access to all features.
            </p>
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleGoToDashboard}
                    className="bg-primary-base text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-primary-700 transition-all transform hover:scale-105"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
