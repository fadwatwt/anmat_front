"use client";

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe-client";
import CheckoutForm from "./CheckoutForm";
import { RiLoader4Line } from "@remixicon/react";

const StripePaymentWrapper = ({ amount, onFinish, userEmail, userName, userPhone, priceId }) => {
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create PaymentIntent or Subscription as soon as the component mounts
        setLoading(true);
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount,
                email: userEmail,
                name: userName,
                phone: userPhone,
                priceId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                    setLoading(false);
                } else if (data.error) {
                    setError(data.error);
                    setLoading(false);
                } else if (data.subscriptionId) {
                    // This case means no clientSecret was returned by the API
                    // We'll show an error because we want to force card collection
                    setError("Unable to initialize secure card collection. Please verify plan details.");
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
    }, [amount, userEmail, userName, userPhone, priceId, onFinish]);

    const appearance = {
        theme: "stripe",
        variables: {
            colorPrimary: "#0066FF", // Adjust to match project's primary-base
        },
    };

    const options = {
        clientSecret,
        appearance,
        // Add default values to pre-fill the form
        defaultValues: {
            billingDetails: {
                email: userEmail,
                name: userName,
                phone: userPhone,
            },
        },
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
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="stripe-wrapper">
            {clientSecret && (
                <Elements options={options} stripe={getStripe()}>
                    <CheckoutForm amount={amount} onFinish={onFinish} />
                </Elements>
            )}
        </div>
    );
};

export default StripePaymentWrapper;
