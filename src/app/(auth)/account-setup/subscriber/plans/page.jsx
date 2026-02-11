"use client"
import { useState } from "react";
import Switch2 from "@/components/Form/Switch2";
import PlanCard from "@/components/containers/PlanCard";
import Modal from "@/components/Modal/Modal";
import StripePaymentWrapper from "@/components/stripe/StripePaymentWrapper";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";

function Page() {
    const user = useSelector(selectUser);
    const [isOnSwitch, setIsOnSwitch] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const plans = [
        {
            name: "Basic",
            price: isOnSwitch ? 10 * 12 : 10,
            description: "Essential features for small teams.",
            isPlanBadge: false,
        },
        {
            name: "Professional",
            price: isOnSwitch ? 30 * 12 : 30,
            description: "Enhanced features for growing teams.",
            isPlanBadge: true,
            planBadgeText: "Recommended",
        },
        {
            name: "Enterprise",
            price: isOnSwitch ? 100 * 12 : 100,
            description: "Advanced features for large organizations.",
            isPlanBadge: false,
        }
    ];

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
                        <Switch2 isOn={isOnSwitch} handleToggle={() => setIsOnSwitch(!isOnSwitch)} />
                        <span>Pay Yearly </span>
                    </div>
                    <div className={"bg-primary-100 text-primary-500 p-1 rounded-md text-sm font-semibold  "}>
                        Save 25%
                    </div>
                </div>
            </div>
            <div className={"w-full flex grow border-box  justify-center items-center gap-5 "}>
                {plans.map((plan, index) => (
                    <PlanCard
                        key={index}
                        name={plan.name}
                        price={plan.price}
                        description={plan.description}
                        isPlanBadge={plan.isPlanBadge}
                        planBadgeText={plan.planBadgeText}
                        onClick={() => handlePlanSelect(plan)}
                    />
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={"Secure Checkout"}
                className={"lg:w-[500px] md:w-10/12 w-11/12 p-0"}
            >
                {selectedPlan && (
                    <div className="p-6">
                        <StripePaymentWrapper
                            amount={selectedPlan.price}
                            onFinish={() => setIsModalOpen(false)}
                            userEmail={user?.email}
                            userName={user?.name}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Page;