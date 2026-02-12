"use client"
import { useState } from "react";
import Switch2 from "@/components/Form/Switch2";
import PlanCard from "@/components/containers/PlanCard";
import Modal from "@/components/Modal/Modal";
import StripePaymentWrapper from "@/components/stripe/StripePaymentWrapper";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/auth/authSlice";
import { useGetSubscriberSubscriptionPlansQuery } from "@/redux/plans/subscriptionPlansApi";
import { RiLoader4Line } from "@remixicon/react";

function Page() {
    const user = useSelector(selectUser);
    const { data: plansData, isLoading, error: plansError } = useGetSubscriberSubscriptionPlansQuery();

    const [isOnSwitch, setIsOnSwitch] = useState(false);
    const [selectedPlanInfo, setSelectedPlanInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePlanSelect = (plan, pricingIndex) => {
        setSelectedPlanInfo({
            plan,
            price: plan.pricing[pricingIndex].price,
            priceId: plan.stripe_price_ids[pricingIndex],
        });
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
                <RiLoader4Line className="animate-spin text-primary-base" size={48} />
                <p className="text-gray-500 font-medium">Loading subscription plans...</p>
            </div>
        );
    }

    if (plansError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
                    <p className="font-bold text-lg mb-2">Error Loading Plans</p>
                    <p>{plansError?.data?.message || "Something went wrong while fetching plans."}</p>
                </div>
            </div>
        );
    }

    // Filter active plans
    const activePlans = plansData?.filter(plan => plan.is_active) || [];

    return (
        <div className={"flex flex-col items-start w-full gap-10 mb-8"}>
            <div className="flex flex-col items-center text-center justify-start gap-6 w-full max-w-2xl mx-auto">
                <div className={"flex flex-col items-center text-center justify-start gap-3 w-full"}>
                    <span className={"text-primary-base font-bold uppercase tracking-widest text-xs"}>Pricing Plans</span>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {`Flexible plans for every team`}
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed">
                        Choose the plan that suits your team size and requirements. All plans include 30 days free trial.
                    </p>
                </div>
                <div className={"flex flex-col sm:flex-row gap-6 w-full justify-center items-center mt-2"}>
                    <div className={"flex gap-4 items-center bg-gray-50 p-2 rounded-2xl border border-gray-100"}>
                        <span className={`text-sm font-semibold transition-colors ${!isOnSwitch ? 'text-primary-base' : 'text-gray-400'}`}>Monthly</span>
                        <Switch2 isOn={isOnSwitch} handleToggle={() => setIsOnSwitch(!isOnSwitch)} />
                        <span className={`text-sm font-semibold transition-colors ${isOnSwitch ? 'text-primary-base' : 'text-gray-400'}`}>Yearly</span>
                    </div>
                    <div className={"bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Save up to 25% on yearly plans
                    </div>
                </div>
            </div>

            <div className={"w-full flex flex-wrap justify-center items-stretch gap-8 px-4"}>
                {activePlans.map((plan, index) => {
                    // Logic to pick which pricing object to use
                    // For now, if isOnSwitch is true (Yearly), we try to find a 'year' interval, 
                    // else we use the second index as a fallback if it exists, otherwise first.
                    const pricingIndex = isOnSwitch && plan.pricing.length > 1 ? 1 : 0;
                    const currentPricing = plan.pricing[pricingIndex];

                    return (
                        <PlanCard
                            key={plan._id}
                            name={plan.name}
                            price={currentPricing.price}
                            interval={currentPricing.interval}
                            description={plan.description}
                            features={plan.features}
                            isPlanBadge={index === 1} // Mark second plan as recommended by default or logic
                            onClick={() => handlePlanSelect(plan, pricingIndex)}
                        />
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={"Secure Subscription Checkout"}
                className={"lg:w-[500px] md:w-10/12 w-11/12 p-0 overflow-hidden"}
            >
                {selectedPlanInfo && (
                    <div className="p-0">
                        <div className="bg-gray-50 p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-primary-base uppercase tracking-wider mb-1">Selected Plan</p>
                                    <h3 className="text-xl font-bold text-gray-900">{selectedPlanInfo.plan.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900">${selectedPlanInfo.price}</p>
                                    <p className="text-xs text-gray-500 font-medium">Billed recurringly</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <StripePaymentWrapper
                                amount={selectedPlanInfo.price}
                                priceId={selectedPlanInfo.priceId}
                                onFinish={() => setIsModalOpen(false)}
                                userEmail={user?.email}
                                userName={user?.name}
                                userPhone={user?.phone}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Page;
