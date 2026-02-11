"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiCheckboxCircleFill } from "@remixicon/react";

const SuccessPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard after 5 seconds
        const timer = setTimeout(() => {
            router.push("/dashboard");
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <div className="bg-green-100 p-4 rounded-full mb-6">
                <RiCheckboxCircleFill className="text-green-600" size={64} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 text-lg mb-8">
                Thank you for your subscription. Your account is now being set up.
            </p>
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-primary-base text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all"
                >
                    Go to Dashboard
                </button>
                <p className="text-sm text-gray-400">
                    Redirecting automatically in a few seconds...
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;
