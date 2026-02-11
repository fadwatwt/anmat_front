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
}) {
    return (
        <div
            className={"w-1/4 h-full rounded-xl border-box border border-gray-300 shadow-md flex flex-col items-center"}>
            <div
                className={`w-full px-2 h-12 flex items-center justify-center  rounded-t-xl ${isPlanBadge ? planBadgeClass : null}  text-center font-bold `}>{isPlanBadge ? planBadgeText : null}</div>
            <div className={"pt-3 pb-8 px-6 gap-5 flex flex-col w-full"}>
                <div className={"flex flex-col gap-2 justify-center items-center "}>
                    <div
                        className={
                            "rounded-full w-12 h-12 bg-primary-100 flex items-center justify-center"
                        }
                    >
                        <span
                            className={
                                "rounded-full p-1 bg-primary-200 flex items-center justify-center"
                            }
                        >
                            <RiCopperDiamondLine
                                size={"25"}
                                className={"text-blue-700"}
                            />
                        </span>
                    </div>
                    <p className={"text-primary-700 text-2xl"}>
                        {name || "Professional plan"}
                    </p>
                    <p className={"text-4xl font-bold text-black"}>${price}/mth</p>
                    <p className={"text-gray-400 text-sm"}>
                        {description || "Enhanced features for growing teams."}
                    </p>
                </div>
                <button
                    onClick={onClick}
                    className={
                        "rounded-[10px] bg-primary-base w-full py-2.5 text-white"
                    }
                >
                    Get started
                </button>
                <div className={"flex flex-col gap-2 justify-start items-start"}>
                    <div>
                        <span className={"font-bold"}> Everything from </span> Basic plan :
                    </div>
                    <div className={"flex flex-col items-start gap-2"}>
                        <div className={"flex items-center gap-2 justify-start"}>
                            <div
                                className={
                                    "w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"
                                }
                            >
                                <RiCheckLine
                                    size={"21"}
                                    className={"text-primary-700"}
                                />
                            </div>
                            <p className={"text-sm"}>Task and team management</p>
                        </div>
                        <div className={"flex items-center gap-2 justify-start"}>
                            <div
                                className={
                                    "w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"
                                }
                            >
                                <RiCheckLine
                                    size={"21"}
                                    className={"text-primary-700"}
                                />
                            </div>
                            <p className={"text-sm"}>
                                Performance analytics for employees
                            </p>
                        </div>
                        <div className={"flex items-center gap-2 justify-start"}>
                            <div
                                className={
                                    "w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"
                                }
                            >
                                <RiCheckLine
                                    size={"21"}
                                    className={"text-primary-700"}
                                />
                            </div>
                            <p className={"text-sm"}>Up to 20 team members</p>
                        </div>
                        <div className={"flex items-center gap-2 justify-start"}>
                            <div
                                className={
                                    "w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"
                                }
                            >
                                <RiCheckLine
                                    size={"21"}
                                    className={"text-primary-700"}
                                />
                            </div>
                            <p className={"text-sm"}>50GB cloud storage per user</p>
                        </div>
                        <div className={"flex items-center gap-2 justify-start"}>
                            <div
                                className={
                                    "w-7 h-7 flex justify-center items-center p-1 bg-primary-100 rounded-full"
                                }
                            >
                                <RiCheckLine
                                    size={"21"}
                                    className={"text-primary-700"}
                                />
                            </div>
                            <p className={"text-sm"}>Priority support</p>
                        </div>
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
}

export default PlanCard;