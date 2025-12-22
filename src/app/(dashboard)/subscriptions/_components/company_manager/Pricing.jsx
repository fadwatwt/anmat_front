"use client"

import { RiCheckboxCircleLine, RiFlashlightLine } from "@remixicon/react";
import { Check, TickCircle } from "iconsax-react";
import { CheckIcon } from "lucide-react";
import React from "react";

const pricingData = [
    {
        name: "Basic Plan",
        price: "$10/mth",
        description: "All the basics to get started.",
        features: [
            "Access to core dashboard features",
            "Access to basic analytics",
            "Email support"
        ]
    },
    {
        name: "Professional Plan",
        price: "$20/mth",
        description: "Advanced features for professionals.",
        features: [
            "Everything in Basic Plan",
            "Advanced analytics",
            "Priority email support",
            "Customizable dashboard"
        ]
    },
    {
        name: "Enterprise Plan",
        price: "$50/mth",
        description: "All features for large teams.",
        features: [
            "Everything in Professional Plan",
            "Dedicated account manager",
            "24/7 support",
            "Custom integrations"
        ]
    }
]

function Pricing() {

    const planFeatures = (plan) => plan.features.map((feature, index) => [
        <div key={index} className="flex items-start justify-start gap-2">
            <div className="bg-primary-100 rounded-full p-1.5">
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.096 0.390037L3.93602 7.30004L2.03602 5.27004C1.68602 4.94004 1.13602 4.92004 0.736015 5.20004C0.346015 5.49004 0.236015 6.00004 0.476015 6.41004L2.72602 10.07C2.94602 10.41 3.32601 10.62 3.75601 10.62C4.16601 10.62 4.55602 10.41 4.77602 10.07C5.13602 9.60004 12.006 1.41004 12.006 1.41004C12.906 0.490037 11.816 -0.319963 11.096 0.380037V0.390037Z" fill="#375DFB" />
                </svg>
            </div>
            <span className="text-xl text-gray-700 text-start">
                {feature}
            </span>
        </div>
    ]);

    return (
        <div className="flex flex-col items-stretch justify-start gap-6">
            {pricingData.map((plan, index) => [
                <React.Fragment key={index}>
                    <div className={"rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 flex flex-col gap-6 overflow-hidden shadow-md"}>
                        {/* Details */}
                        <div className="flex items-center gap-4 justify-between px-8 py-8">
                            {/* Basic Info */}
                            <div className="flex flex-col items-center justify-center gap-2 w-5/12">
                                <div className="rounded-full p-2 bg-primary-100">
                                    <div className="rounded-full p-2 bg-primary-200">
                                        <RiFlashlightLine size={25} className="rounded-full text-primary-500 stroke-[5px]" />
                                    </div>
                                </div>
                                <span className="text-lg text-primary-700 font-semibold text-center">
                                    {plan.name}
                                </span>
                                <span className="text-3xl font-bold text-gray-900 text-center">
                                    {plan.price}
                                </span>
                                <span className="text-md text-gray-500 text-center">
                                    {plan.description}
                                </span>
                            </div>

                            {/* Features */}
                            <div className="flex items-center justify-start gap-4 flex-wrap">
                                {planFeatures(plan)}
                            </div>
                        </div>

                        <div className="px-8 py-4 bg-gray-50 w-full">
                            <button className="text-primary-100 bg-primary-500 hover:bg-primary-600 text-2xl font-light
                            w-full rounded-xl py-2 cursor-pointer">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            ])}
        </div>

    );
}

export default Pricing;