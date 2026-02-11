"use client";

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe-client";
import CheckoutForm from "./CheckoutForm";
import { RiLoader4Line } from "@remixicon/react";

const StripePaymentWrapper = ({ amount, onFinish, userEmail, userName }) => {
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create PaymentIntent as soon as the component mounts
        setLoading(true);
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, email: userEmail, name: userName }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else if (data.error) {
                    setError(data.error);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to initialize payment.");
                setLoading(false);
            });
    }, [amount, userEmail, userName]);

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
