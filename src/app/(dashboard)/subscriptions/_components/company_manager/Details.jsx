"use client"
import { t } from "i18next";
import { RiVipDiamondLine } from "react-icons/ri";

function Details() {
    return (
        <div className={"md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200"}>
            <div className="flex flex-col gap-8 w-full">
                {/* header */}
                <div className="flex items-start gap-2 w-full">
                    <div className="rounded-full p-2 bg-primary-100">
                        <div className="rounded-full p-3 bg-primary-200">
                            <RiVipDiamondLine size={25} className="rounded-full text-primary-500 stroke-[2px] border-2 border-primary-500 p-1" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-1">
                        <span className="text-xl text-gray-700">
                            {t("You're subscribed on")}
                        </span>
                        <span className="text-2xl text-primary-700 font-bold">
                            {t("Professional Plan")}
                        </span>
                    </div>
                </div>

                {/* info */}
                <div className="flex items-start gap-8 justify-between w-full">
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                        <span className="text-lg text-gray-700">
                            {t("Users")}
                        </span>
                        <span className="text-lg text-gray-900 font-bold">
                            2345 of 6789 Users
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                        <span className="text-lg text-gray-700">
                            {t("Subscription end date")}
                        </span>
                        <span className="text-lg text-gray-900 font-bold">
                            May 12, 2025
                        </span>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                        <span className="text-lg text-gray-700">
                            {t("Price estimate")}
                        </span>
                        <span className="text-lg text-gray-900 font-bold">
                            $120
                        </span>
                    </div>
                </div>

                {/* actions */}
                <div className="flex items-start justify-center gap-4">
                    <button className="text-lg bg-white text-red-700 px-4 py-2 w-96 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                        {t("Cancel subscription renewal")}
                    </button>
                    <button className="text-lg bg-primary-100 text-primary-600 px-4 py-2 w-96 rounded-lg hover:bg-primary-600 hover:text-primary-100 transition-colors">
                        {t("Upgrade")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Details;