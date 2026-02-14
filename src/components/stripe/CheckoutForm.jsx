"use client";

import React, { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { RiLoader4Line } from "@remixicon/react";

import { useRouter } from "next/navigation";

const CheckoutForm = ({ amount, onFinish, clientSecret, userName, userEmail, userPhone, priceId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

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

            // 2. Prepare confirmation parameters
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

            // 3. Call Stripe confirmation
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

            // 4. Handle Result
            if (result.error) {
                console.error("Stripe SDK Error:", result.error);
                setMessage(result.error.message || "Confirmation failed. Please check your card information.");
                setIsLoading(false);
            } else {
                const intent = isSetupIntent ? result.setupIntent : result.paymentIntent;
                const status = intent?.status;
                console.log(`Confirmation successful! Status: ${status}`);

                // 5. IF IT IS A SETUP INTENT, WE MUST FINALIZE THE SUBSCRIPTION NOW
                if (isSetupIntent && status === 'succeeded' && priceId) {
                    console.log("Card collected successfully, now finalizing subscription...");
                    const finalizeRes = await fetch("/api/create-payment-intent", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: userEmail,
                            priceId: priceId,
                            paymentMethodId: intent.payment_method
                        }),
                    });

                    const finalizeData = await finalizeRes.json();
                    if (finalizeData.error) {
                        throw new Error(finalizeData.error);
                    }
                    console.log("Subscription finalized successfully.");
                }

                // 6. Direct user to success page
                router.push('/account-setup/subscriber/plans/success');
            }
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
