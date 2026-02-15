import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { amount, currency = "usd", email, name, phone, priceId, paymentMethodId, trialDays = 0 } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "User email is required to initialize checkout." },
                { status: 400 }
            );
        }

        // 1. Search for existing customer or create/update one
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            // Update customer if phone/name is provided and missing
            if ((phone && !customer.phone) || (name && !customer.name)) {
                customer = await stripe.customers.update(customer.id, {
                    phone: phone || customer.phone,
                    name: name || customer.name
                });
            }
        } else {
            customer = await stripe.customers.create({
                email,
                name,
                phone,
            });
        }

        // 2. Step 2: Formalize Subscription if we have a paymentMethodId and priceId
        if (paymentMethodId && priceId) {
            console.log(`Finalizing subscription for customer: ${customer.id}, price: ${priceId}`);

            // Attach the payment method to the customer
            await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });

            // Set it as the default for the customer's future invoices
            await stripe.customers.update(customer.id, {
                invoice_settings: { default_payment_method: paymentMethodId },
            });

            // Create the subscription object
            const subscriptionParams = {
                customer: customer.id,
                items: [{ price: priceId }],
                expand: ['latest_invoice.payment_intent'],
            };

            // Only add trial if trialDays is greater than 0
            if (trialDays > 0) {
                subscriptionParams.trial_period_days = trialDays;
            }

            // Create the subscription
            const subscription = await stripe.subscriptions.create(subscriptionParams);

            return NextResponse.json({
                subscriptionId: subscription.id,
                status: subscription.status,
                customerId: customer.id
            });
        }

        // 3. Step 1: Collect Card via SetupIntent (Default for subscriptions without payment method)
        if (priceId) {
            console.log(`Creating SetupIntent for customer: ${customer.id} for plan: ${priceId}`);
            const setupIntent = await stripe.setupIntents.create({
                customer: customer.id,
                payment_method_types: ['card'],
                usage: 'off_session',
                metadata: { plan_id: priceId }
            });

            return NextResponse.json({
                clientSecret: setupIntent.client_secret,
                customerId: customer.id
            });
        }

        // 4. Fallback for one-time payments (if any)
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount or priceId missing." },
                { status: 400 }
            );
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            customer: customer.id,
            payment_method_types: ['card'],
            setup_future_usage: "off_session",
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            customerId: customer.id
        });

    } catch (error) {
        console.error("Stripe Route Error:", error);
        return NextResponse.json(
            { error: `Stripe Error: ${error.message}` },
            { status: 500 }
        );
    }
}
