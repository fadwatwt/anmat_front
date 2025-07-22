"use client"

import { RiCheckboxCircleLine, RiFlashlightLine } from "@remixicon/react";
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

    const planFeatures = (plan) => plan.features.map((feature,index) => [
        <div key={index} className="flex items-start justify-start gap-2">
            <RiCheckboxCircleLine size={30} className="text-primary-500" />
            <span className="text-xl text-gray-700 text-start">
                {feature}
            </span>
        </div>
    ]);

    return (
        <div className="flex flex-col items-stretch justify-start gap-6">
        {pricingData.map((plan, index) => [
            <React.Fragment key={index}>
                <div className={"rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 flex flex-col gap-6 overflow-hidden"}>
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