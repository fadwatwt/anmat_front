"use client";
import * as Iconsax from "iconsax-react";
import Link from "next/link";
import { useGetIndustriesForSubscribersQuery } from "@/redux/industries/industriesApi";
import { useTranslation } from "react-i18next";
import { setSelectedIndustryId } from "@/redux/industries/industriesSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const SelectYourBusiness = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data: industriesResponse, isLoading } = useGetIndustriesForSubscribersQuery();
    const [selectedId, setSelectedId] = useState(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const username = useSelector((state) => state.auth.user?.name) || 'Subscriber';
    const router = useRouter();

    const industries = industriesResponse?.data || industriesResponse || [];

    const handleNext = () => {
        if (!selectedId) return;
        setIsNavigating(true);
        dispatch(setSelectedIndustryId(selectedId));
        router.push("/account-setup/subscriber/org-profile-setup");
    };

    const isBusy = isLoading || isNavigating;

    const typeCard = (id, icon_name, title) => {
        const IconComponent = Iconsax[icon_name] || Iconsax.Category2;
        const isSelected = selectedId === id;

        return (
            <div
                key={id}
                onClick={() => !isBusy && setSelectedId(id)}
                className={`flex items-center justify-start gap-3 px-4 py-5 rounded-xl w-[20rem] shadow-sm group transition-all duration-200 border-2
                ${isBusy ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
                ${isSelected
                        ? "bg-primary-500 text-primary-50 border-primary-500 shadow-md transform scale-[1.02]"
                        : "bg-white dark:bg-gray-800 text-primary-500 dark:text-gray-50 border-transparent hover:bg-primary-50 dark:hover:bg-gray-700 hover:border-primary-100"
                    }`}
            >
                <div className={`${isSelected ? "text-primary-50" : "text-primary-500 group-hover:text-primary-600"}`}>
                    <IconComponent size={24} color="currentColor" variant={isSelected ? "Bold" : "Bulk"} />
                </div>
                <span className={`text-xl transition-colors ${isSelected ? "text-primary-50" : "text-gray-900 group-hover:text-primary-600"}`}>
                    {title}
                </span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
                    <span className="text-gray-500">{t("Loading industries...")}</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start gap-8 p-8 w-full overflow-hidden">
                <div className="flex flex-col items-center justify-start gap-6 w-full">
                    <div className="flex flex-col items-center justify-start gap-4 text-center">
                        <span className="text-3xl text-gray-900">
                            {t("Welcome, {{name}}! What kind of work do you do?", { name: username })}
                        </span>
                        <span className="text-md text-gray-500 max-w-2xl">
                            {t("Choose the best fit for your project or team. We'll help you get started.")}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center md:w-full max-w-[65rem]">
                        {industries.map(industry => typeCard(industry._id, industry.icon_name || industry.logo, industry.name))}
                    </div>
                </div>
                <div className="flex gap-8">
                    <button
                        onClick={handleNext}
                        disabled={!selectedId || isBusy}
                        className={`bg-primary-500 text-primary-50 text-sm w-32 py-2 rounded-xl border border-primary-400 transition-all
                        ${(!selectedId || isBusy) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600 cursor-pointer'}`}
                    >
                        {isNavigating ? t("Loading...") : t("Next")}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SelectYourBusiness;
