import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { amount, currency = "usd", email, name, phone, priceId } = await request.json();

        // 1. Search for existing customer or create/update one
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            // Update customer if phone is provided and missing
            if (phone && !customer.phone) {
                customer = await stripe.customers.update(customer.id, { phone, name });
            }
        } else {
            customer = await stripe.customers.create({
                email,
                name,
                phone,
            });
        }

        let clientSecret;
        let subscriptionId;

        if (priceId) {
            // 2a. Create Subscription if priceId is provided
            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    save_default_payment_method: 'on_subscription',
                },
                expand: ['latest_invoice', 'latest_invoice.payment_intent', 'pending_setup_intent'],
            });

            console.log("Subscription status:", subscription.status);
            console.log("Has Payment Intent:", !!subscription.latest_invoice?.payment_intent);
            console.log("Has Setup Intent:", !!subscription.pending_setup_intent);

            // If there's a payment intent (immediate charge)
            if (subscription.latest_invoice?.payment_intent) {
                clientSecret = subscription.latest_invoice.payment_intent.client_secret;
            }
            // If there's a setup intent (trial / collect card without immediate charge)
            else if (subscription.pending_setup_intent) {
                clientSecret = subscription.pending_setup_intent.client_secret;
            }
            else {
                console.log("Neither Payment nor Setup Intent found.");
                clientSecret = null;
            }
            subscriptionId = subscription.id;
        } else {
            // 2b. Fallback to simple PaymentIntent if no priceId (one-time payment)
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency,
                customer: customer.id,
                setup_future_usage: "off_session",
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            clientSecret = paymentIntent.client_secret;
        }

        return NextResponse.json({
            clientSecret,
            customerId: customer.id,
            subscriptionId
        });
    } catch (error) {
        console.error("Stripe Error Detail:", error);
        return NextResponse.json(
            { error: `Stripe Error: ${error.message}` },
            { status: 500 }
        );
    }
}
