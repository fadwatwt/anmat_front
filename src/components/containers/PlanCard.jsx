import { RiCheckLine, RiCopperDiamondLine } from "@remixicon/react";
import PropTypes from "prop-types";

function PlanCard({
    isPlanBadge = false,
    planBadgeText = "Recommended",
    planBadgeClass = "bg-primary-100 text-primary-500",
    name = "",
    price = 0,
    description = "",
    features = [],
    onClick,
    interval = "month",
}) {
    return (
        <div
            className={"flex flex-col min-w-[300px] flex-1 max-w-[400px] rounded-xl border-box border border-gray-300 shadow-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"}>
            <div
                className={`w-full px-2 h-10 flex items-center justify-center ${isPlanBadge ? planBadgeClass : "bg-transparent"} text-center text-sm font-bold `}>
                {isPlanBadge ? planBadgeText : ""}
            </div>
            <div className={"pt-6 pb-8 px-8 flex flex-col w-full grow"}>
                <div className={"flex flex-col gap-3 justify-center items-center mb-6"}>
                    <div
                        className={
                            "rounded-full w-14 h-14 bg-primary-100 flex items-center justify-center"
                        }
                    >
                        <span
                            className={
                                "rounded-full p-2 bg-primary-200 flex items-center justify-center text-primary-base shadow-sm"
                            }
                        >
                            <RiCopperDiamondLine
                                size={"28"}
                            />
                        </span>
                    </div>
                    <div className="text-center">
                        <h3 className={"text-gray-900 text-xl font-bold mb-1"}>
                            {name}
                        </h3>
                        <p className={"text-gray-500 text-sm px-2"}>
                            {description}
                        </p>
                    </div>
                    <div className="flex items-baseline gap-1 mt-2">
                        <span className={"text-5xl font-extrabold text-gray-900"}>${price}</span>
                        <span className="text-gray-500 font-medium">/{interval === 'month' ? 'mth' : 'yr'}</span>
                    </div>
                </div>

                <button
                    onClick={onClick}
                    className={
                        "rounded-xl bg-primary-base w-full py-3.5 text-white font-bold shadow-lg hover:bg-primary-700 hover:shadow-primary-100 transition-all active:scale-[0.98] mb-8"
                    }
                >
                    Get started
                </button>

                <div className={"flex flex-col gap-4 justify-start items-start"}>
                    <p className={"font-bold text-gray-900 text-sm uppercase tracking-wider"}>
                        What's included:
                    </p>
                    <div className={"flex flex-col items-start gap-4"}>
                        {features.length > 0 ? (
                            features.map((feature, index) => (
                                <div key={index} className={"flex items-start gap-3 justify-start"}>
                                    <div
                                        className={
                                            "w-6 h-6 flex shrink-0 justify-center items-center bg-primary-50 rounded-full mt-0.5"
                                        }
                                    >
                                        <RiCheckLine
                                            size={"16"}
                                            className={"text-primary-base font-bold"}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <p className={"text-sm text-gray-700 font-medium"}>
                                            {feature.plan_feature?.title || feature.title}
                                        </p>
                                        {feature.properties?.map((prop, pIdx) => (
                                            <span key={pIdx} className="text-[11px] text-gray-500">
                                                {prop.key}: <span className="text-primary-base font-semibold">{prop.value}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm italic">Standard features included</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

PlanCard.propTypes = {
    isPlanBadge: PropTypes.bool,
    planBadgeText: PropTypes.string,
    planBadgeClass: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    features: PropTypes.array,
    onClick: PropTypes.func,
    interval: PropTypes.string,
}

export default PlanCard;
