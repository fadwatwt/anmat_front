"use client";

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe-client";
import CheckoutForm from "./CheckoutForm";
import { RiLoader4Line } from "@remixicon/react";

import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/authSlice";
import { RootRoute } from "@/Root.Route";

const StripePaymentWrapper = ({ amount, onFinish, userEmail, userName, userPhone, priceId, trialDays, planId }) => {
    const { token } = useSelector(selectAuth);
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create PaymentIntent or Subscription as soon as the component mounts
        setLoading(true);
        fetch(`${RootRoute}/api/subscriptions/subscriber/create-setup-intent`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then((res) => res.json())
            .then((result) => {
                const data = result.data || result;
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    setLoading(false);
                } else if (data.error || result.status === 'error') {
                    const errMsg = typeof data.error === 'string' ? data.error : (data.error?.message || result.message || "Failed to initialize secure checkout.");
                    setError(errMsg);
                    setLoading(false);
                } else {
                    setError("Failed to create a payment session.");
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError("Failed to initialize payment.");
                setLoading(false);
            });
    }, [amount, userEmail, userName, userPhone, priceId, trialDays, onFinish, token]);

    const appearance = {
        theme: "stripe",
        variables: {
            colorPrimary: "#0066FF", // Adjust to match project's primary-base
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 gap-4">
                <RiLoader4Line className="animate-spin text-primary-base" size={48} />
                <p className="text-gray-500 font-medium text-lg">Initializing secure checkout...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
                <p className="font-bold mb-2">Error</p>
                <p>{typeof error === 'string' ? error : (error.message || "An unexpected error occurred.")}</p>
            </div>
        );
    }

    return (
        <div className="stripe-wrapper">
            {clientSecret && (
                <Elements key={clientSecret} options={options} stripe={getStripe()}>
                    <CheckoutForm
                        amount={amount}
                        onFinish={onFinish}
                        clientSecret={clientSecret}
                        userName={userName}
                        userEmail={userEmail}
                        userPhone={userPhone}
                        priceId={priceId}
                        planId={planId}
                        trialDays={trialDays}
                    />
                </Elements>
            )}
        </div>
    );
};

export default StripePaymentWrapper;
