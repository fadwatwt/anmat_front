import { RiCopperDiamondLine, RiCheckboxCircleFill } from "@remixicon/react";
import PropTypes from "prop-types";
import { useState } from "react";

function PlanCard({
    name = "",
    description = "",
    features = [],
    pricing = [],
    trial = { is_active: false, trial_days: 0 },
    onSelectPlan, // callback when plan is selected with specific price
    onSelectPrice,
    initialPricingIndex = 0,
}) {
    // Keep track of which original pricing items are active
    const pricingWithOptions = pricing.map((item, originalIndex) => ({
        ...item,
        originalIndex
    })).filter(p => p.is_active !== false);

    const [selectedLocalIndex, setSelectedLocalIndex] = useState(0);

    const handlePriceChange = (localIndex) => {
        setSelectedLocalIndex(localIndex);
        if (onSelectPrice) {
            onSelectPrice(pricingWithOptions[localIndex].originalIndex);
        }
    };

    return (
        <div
            className={"flex flex-col min-w-[320px] flex-1 max-w-[420px] rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white transition-all duration-500 hover:shadow-2xl hover:border-primary-100 group relative"}>

            {trial.is_active && (
                <div className="absolute top-4 right-8 z-10">
                    <div className="bg-orange-100 text-orange-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-orange-200 shadow-sm flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        {trial.trial_days} DAYS FREE TRIAL
                    </div>
                </div>
            )}

            <div className={"pt-8 pb-6 px-8 flex flex-col w-full"}>
                <div className={"flex items-start justify-between mb-4"}>
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={"text-gray-900 text-2xl font-black group-hover:text-primary-base transition-colors"}>
                                {name}
                            </h3>
                        </div>
                        <p className={"text-gray-500 text-sm leading-relaxed"}>
                            {description}
                        </p>
                    </div>
                    <div
                        className={
                            "rounded-2xl w-12 h-12 bg-primary-50 flex items-center justify-center text-primary-base group-hover:bg-primary-base group-hover:text-white transition-all duration-300 shadow-inner shrink-0"
                        }
                    >
                        <RiCopperDiamondLine size={"24"} />
                    </div>
                </div>

                {/* Pricing Selection */}
                <div className="flex flex-col gap-3 mb-8">
                    <p className={"font-bold text-gray-900 text-xs uppercase tracking-widest"}>
                        Choose your plan:
                    </p>
                    <div className="flex flex-col gap-2">
                        {pricingWithOptions.map((item, index) => (
                            <label
                                key={index}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedLocalIndex === index
                                    ? "border-primary-base bg-primary-50/30"
                                    : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name={`pricing-${name}`}
                                            className="sr-only"
                                            checked={selectedLocalIndex === index}
                                            onChange={() => handlePriceChange(index)}
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedLocalIndex === index ? "border-primary-base" : "border-gray-300"
                                            }`}>
                                            {selectedLocalIndex === index && <div className="w-2.5 h-2.5 rounded-full bg-primary-base animate-in zoom-in-50 duration-200" />}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold capitalize ${selectedLocalIndex === index ? "text-primary-base" : "text-gray-700"}`}>
                                            {item.interval_count > 1 ? `${item.interval_count} ` : ""}{item.interval}ly
                                        </span>
                                        {item.discount > 0 && (
                                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                                                Save {item.discount}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-lg font-black text-gray-900">
                                        ${item.price}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium">
                                        /{item.interval === 'month' ? 'mth' : 'yr'}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full mb-8" />

                <div className={"flex flex-col gap-6 justify-start items-start"}>
                    <p className={"font-bold text-gray-900 text-xs uppercase tracking-widest"}>
                        Whats included:
                    </p>
                    <div className={"flex flex-col items-start gap-5 w-full"}>
                        {features.length > 0 ? (
                            features.map((feature, index) => (
                                <div key={index} className={"flex items-start gap-4 justify-start w-full"}>
                                    <RiCheckboxCircleFill
                                        size={"22"}
                                        className={"text-primary-base shrink-0 mt-0.5"}
                                    />
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <div className="flex flex-col">
                                            <p className={"text-sm text-gray-800 font-bold"}>
                                                {feature.plan_feature?.title || feature.title || feature.feature_type?.title || "Premium Feature"}
                                            </p>
                                            {(feature.plan_feature?.details || feature.details || feature.feature_type?.details) && (
                                                <p className="text-xs text-gray-500 leading-normal">
                                                    {feature.plan_feature?.details || feature.details || feature.feature_type?.details}
                                                </p>
                                            )}
                                        </div>

                                        {feature.properties && feature.properties.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {feature.properties.map((prop, pIdx) => (
                                                    <div key={pIdx} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-[10px] text-gray-600 border border-gray-200/50">
                                                        <span className="font-medium mr-1">{prop.key}:</span>
                                                        <span className="text-primary-base font-bold">{prop.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic">Standard features included</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 pt-0 mt-auto">
                <button
                    onClick={() => onSelectPlan && onSelectPlan(pricingWithOptions[selectedLocalIndex].originalIndex)}
                    className={
                        "rounded-xl bg-primary-base w-full py-4 text-white font-bold shadow-xl shadow-primary-500/10 hover:bg-primary-700 hover:shadow-primary-500/20 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    }
                >
                    Get started with {name}
                </button>
            </div>
        </div>
    );
}

PlanCard.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    features: PropTypes.array,
    pricing: PropTypes.array,
    trial: PropTypes.object,
    onSelectPlan: PropTypes.func,
    onSelectPrice: PropTypes.func,
    initialPricingIndex: PropTypes.number,
}


export default PlanCard;
