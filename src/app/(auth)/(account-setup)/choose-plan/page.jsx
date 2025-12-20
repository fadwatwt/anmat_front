"use client"
import {useState} from "react";
import Switch2 from "@/components/Form/Switch2";
import {RiBuilding4Line, RiCheckLine, RiCopperDiamondLine, RiFlashlightLine} from "@remixicon/react";
import PlanCard from "@/components/containers/PlanCard";

function Page() {
    const [isOnSwitch,setIsOnSwitch] = useState(false);
    return (
        <div className={"flex flex-col items-start w-full gap-7 mb-4"}>
            <div className="flex flex-col items-center text-center justify-start gap-7 w-full">
                <div className={"flex flex-col items-center text-center justify-start gap-2 w-full"}>
                    <span className={"text-primary-500"}>Pricing</span>
                    <span className="text-2xl text-gray-900">
                    {`Plans tailored for your team`}
                </span>
                    <span className="text-sm text-gray-500 ">
                    Simple&#44; flexible pricing for your dashboard. Choose the plan that suits your needs and start optimizing today.
                    </span>
                </div>
                <div className={"flex gap-3 w-full justify-center items-center"}>
                    <div className={"flex gap-3 items-center"}>
                        <span>Pay Monthly </span>
                        <Switch2 isOn={isOnSwitch} handleToggle={() => setIsOnSwitch(!isOnSwitch)}/>
                        <span>Pay Monthly  </span>
                    </div>
                    <div className={"bg-primary-100 text-primary-500 p-1 rounded-md text-sm font-semibold  "}>
                        Save 25%
                    </div>
                </div>
            </div>
            <div className={"w-full flex grow border-box  justify-center items-center gap-5 "}>
                <PlanCard  />
                <PlanCard isplanBadge={true} planBadgeText={"Recommended"} planBadgeColor={""} />
                <PlanCard  />
            </div>
        </div>
    );
}

export default Page;