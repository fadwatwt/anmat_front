"use client";

import React, { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { RiLoader4Line } from "@remixicon/react";

const CheckoutForm = ({ amount, onFinish }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const piSecret = urlParams.get("payment_intent_client_secret");
        const siSecret = urlParams.get("setup_intent_client_secret");

        if (piSecret) {
            stripe.retrievePaymentIntent(piSecret).then(({ paymentIntent }) => {
                switch (paymentIntent.status) {
                    case "succeeded":
                        setMessage("Payment succeeded!");
                        break;
                    case "processing":
                        setMessage("Your payment is processing.");
                        break;
                    case "requires_payment_method":
                        setMessage("Your payment was not successful, please try again.");
                        break;
                    default:
                        setMessage("Something went wrong.");
                        break;
                }
            });
        } else if (siSecret) {
            stripe.retrieveSetupIntent(siSecret).then(({ setupIntent }) => {
                switch (setupIntent.status) {
                    case "succeeded":
                        setMessage("Subscription setup successful!");
                        break;
                    case "processing":
                        setMessage("Your setup is processing.");
                        break;
                    case "requires_payment_method":
                        setMessage("Setup failed, please try again.");
                        break;
                    default:
                        setMessage("Something went wrong.");
                        break;
                }
            });
        }
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/account-setup/subscriber/plans/success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
                <p className="text-gray-500">Securely pay using Stripe</p>
                <div className="mt-4 text-3xl font-extrabold text-primary-base">
                    ${amount}
                </div>
            </div>

            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className={`mt-8 w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary-base hover:bg-primary-700 shadow-lg hover:shadow-primary-100"
                    }`}
            >
                {isLoading ? (
                    <RiLoader4Line className="animate-spin" size={24} />
                ) : (
                    `Complete Subscription`
                )}
            </button>

            {message && (
                <div id="payment-message" className="mt-4 p-3 rounded-lg text-center text-sm font-medium bg-red-50 text-red-500 border border-red-100 animate-fade-in">
                    {message}
                </div>
            )}
        </form>
    );
};

export default CheckoutForm;
