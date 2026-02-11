import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { amount, currency = "usd", email, name } = await request.json();

        // 1. Search for existing customer or create NEW one
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: email,
                name: name,
            });
        }

        // 2. Create PaymentIntent with customer and setup_future_usage
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency,
            customer: customer.id,
            setup_future_usage: "off_session", // This saves the payment method for future use
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            customerId: customer.id
        });
    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error.message}` },
            { status: 500 }
        );
    }
}
