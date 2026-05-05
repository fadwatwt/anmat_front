"use client";

import React, { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { RiLoader4Line } from "@remixicon/react";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/authSlice";
import { RootRoute } from "@/Root.Route";

const CheckoutForm = ({ amount, onFinish, clientSecret, userName, userEmail, userPhone, priceId, planId, trialDays }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { token } = useSelector(selectAuth);

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [elementReady, setElementReady] = useState(false);

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
            console.error("Stripe.js or Elements has not loaded.");
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            // 1. Determine which confirmation method to use
            const isSetupIntent = clientSecret && clientSecret.startsWith("seti_");
            console.log(`Submitting ${isSetupIntent ? 'Setup' : 'Payment'} confirmation for secret prefix: ${clientSecret.substring(0, 8)}...`);

            // 2. Check current intent status FIRST to avoid confirming an already-succeeded intent
            let currentStatus = null;
            let currentIntent = null;

            if (isSetupIntent) {
                const { setupIntent, error: retrieveError } = await stripe.retrieveSetupIntent(clientSecret);
                if (retrieveError) {
                    throw new Error(retrieveError.message);
                }
                currentStatus = setupIntent.status;
                currentIntent = setupIntent;
            } else if (clientSecret) {
                const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(clientSecret);
                if (retrieveError) {
                    throw new Error(retrieveError.message);
                }
                currentStatus = paymentIntent.status;
                currentIntent = paymentIntent;
            }

            // 3. Confirm only if it hasn't succeeded yet
            if (currentStatus !== 'succeeded') {
                const confirmParams = {
                    return_url: `${window.location.origin}/account-setup/subscriber/plans/success`,
                };

                // Only add billing_details if we have at least one field and it's a string
                const billing_details = {};
                if (userName && typeof userName === 'string') billing_details.name = userName;
                if (userEmail && typeof userEmail === 'string') billing_details.email = userEmail;
                if (userPhone && typeof userPhone === 'string') billing_details.phone = userPhone;

                if (Object.keys(billing_details).length > 0) {
                    confirmParams.payment_method_data = { billing_details };
                }

                // Call Stripe confirmation
                const result = await (isSetupIntent
                    ? stripe.confirmSetup({
                        elements,
                        confirmParams,
                        redirect: 'if_required'
                    })
                    : stripe.confirmPayment({
                        elements,
                        confirmParams,
                        redirect: 'if_required'
                    }));

                if (result.error) {
                    console.error("Stripe SDK Error:", result.error);
                    setMessage(result.error.message || "Confirmation failed. Please check your card information.");
                    setIsLoading(false);
                    return; // Stop execution
                }

                currentIntent = isSetupIntent ? result.setupIntent : result.paymentIntent;
                currentStatus = currentIntent?.status;
                console.log(`Confirmation successful! Status: ${currentStatus}`);
            } else {
                console.log("Intent already succeeded in a previous attempt, skipping confirmation step.");
            }

            // 4. IF IT IS A SETUP INTENT, WE MUST FINALIZE THE SUBSCRIPTION NOW via Backend
            if (isSetupIntent && currentStatus === 'succeeded' && priceId) {
                console.log("Card collected successfully, now finalizing subscription via backend...");
                const finalizeRes = await fetch(`${RootRoute}/api/subscriptions/subscriber/subscribe`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        plan_id: planId,
                        price_id: priceId,
                        stripe_payment_method_id: currentIntent.payment_method
                    }),
                });

                const result = await finalizeRes.json();
                const finalizeData = result.data || result;

                if (finalizeData.error || result.status === 'error') {
                    throw new Error(finalizeData.error || result.message || "Finalization failed.");
                }
                console.log("Subscription finalized successfully via backend.");
            }

                // 6. Direct user to success page
                router.push('/account-setup/subscriber/plans/success');
        } catch (err) {
            console.error("JavaScript Error in handleSubmit:", err);
            setMessage(err.message || "A system error occurred. Please refresh and try again.");
            setIsLoading(false);
        }
    };

    const paymentElementOptions = {
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
        },
        fields: {
            billingDetails: {
                name: 'never',
                email: 'never',
                phone: 'never',
                address: 'auto',
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {!elementReady && (
                <div className="flex flex-col items-center justify-center p-12 gap-4">
                    <RiLoader4Line className="animate-spin text-primary-base" size={40} />
                    <p className="text-gray-400 font-medium italic">Loading secure card form...</p>
                </div>
            )}

            <form
                id="payment-form"
                onSubmit={handleSubmit}
                className={`p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-opacity duration-300 ${elementReady ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
            >
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
                    <p className="text-gray-500">Securely pay using Stripe</p>
                    <div className="mt-4 text-3xl font-extrabold text-primary-base">
                        ${amount}
                    </div>
                </div>

                <PaymentElement
                    id="payment-element"
                    options={paymentElementOptions}
                    onReady={() => setElementReady(true)}
                />

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
        </div>
    );
};

export default CheckoutForm;
