"use client"
import { RiMastercardFill } from "@remixicon/react";
import { t } from "i18next";

function PaymentMethods() {
    const cardData = [
        {
            cardHolder: 'Mai Haggag',
            cardNumber: '**** **** **** 9800',
            expiryDate: 'May 12, 2025',
            cardType: 'Master card',
        },
        {
            cardHolder: 'John Doe',
            cardNumber: '**** **** **** 4500',
            expiryDate: 'June 15, 2025',
            cardType: 'Visa',
        },
        {
            cardHolder: 'Alice Smith',
            cardNumber: '**** **** **** 7200',
            expiryDate: 'April 10, 2025',
            cardType: 'Master card',
        },
    ];

    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                {
                    cardData.map(card => {
                        return (
                            <div className={"md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200"}>
                                <div className="flex flex-col gap-8 w-full">
                                    {/* header */}
                                    <div className="flex items-start gap-2 w-full">
                                        <div className="rounded-full w-12 h-12">
                                            <RiMastercardFill size={35} className="rounded-full stroke-[2px]" />
                                        </div>
                                        <div className="flex flex-col items-start justify-start gap-1">
                                            <span className="text-2xl text-gray-900 font-bold">
                                                {t("Master Card")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* info */}
                                    <div className="flex items-start gap-8 justify-between w-full">
                                        <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                                            <span className="text-lg text-gray-700">
                                                {t("Card Holder")}
                                            </span>
                                            <span className="text-lg text-gray-900 font-bold">
                                                {card.cardHolder}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                                            <span className="text-lg text-gray-700">
                                                {t("Card Number")}
                                            </span>
                                            <span className="text-lg text-gray-900 font-bold">
                                                {card.cardNumber}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                                            <span className="text-lg text-gray-700">
                                                {t("Card Expiry")}
                                            </span>
                                            <span className="text-lg text-gray-900 font-bold">
                                                {card.expiryDate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    <div className="flex items-start justify-center gap-4">
                                        <button className="text-lg bg-white text-red-700 px-4 py-2 w-96 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                                            {"Delete Card"}
                                        </button>
                                        <button className="text-lg bg-primary-100 text-primary-600 px-4 py-2 w-96 rounded-lg hover:bg-primary-600 hover:text-primary-100 transition-colors">
                                            {"Change"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default PaymentMethods;