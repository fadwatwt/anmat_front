"use client"
import DropdownMenu from "@/components/Dropdowns/DropdownMenu";
import { RiMastercardFill } from "@remixicon/react";
import { t } from "i18next";
import { PiDotsThreeVerticalBold } from "react-icons/pi";

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
                    cardData.map((card, index) => {
                        return (
                            <div key={index} className={"md:p-5 p-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 w-full"}>
                                <div className="flex flex-col gap-8 w-full">
                                    {/* header */}
                                    <div className="flex items-start gap-4 justify-between w-full">
                                        <div className="flex items-start gap-2">
                                            <div className="rounded-full w-12 h-12">
                                                <RiMastercardFill size={35} className="rounded-full stroke-[2px]" />
                                            </div>
                                            <div className="flex flex-col items-start justify-start gap-1">
                                                <span className="text-lg text-gray-900 font-bold">
                                                    {t("Master Card")}
                                                </span>
                                                {(index === 0) && <div className="flex items-center justify-center gap-2 px-2 py-1 bg-[#2D9F7517] text-sm text-gray-900 rounded-md">
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.5 14.25C3.77198 14.25 0.75 11.228 0.75 7.5C0.75 3.77198 3.77198 0.75 7.5 0.75C11.228 0.75 14.25 3.77198 14.25 7.5C14.25 11.228 11.228 14.25 7.5 14.25ZM6.82703 10.2L11.5993 5.42707L10.6448 4.47263L6.82703 8.2911L4.91745 6.38153L3.963 7.33598L6.82703 10.2Z" fill="#2D9F75" />
                                                    </svg>
                                                    <span className="text-sm">
                                                        Default Card
                                                    </span>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="">
                                            <DropdownMenu
                                                button={
                                                    <PiDotsThreeVerticalBold
                                                        size={24}
                                                        className="cursor-pointer"
                                                    />
                                                }
                                                removeDefaultButtonStyling={true}
                                                content={
                                                    <div className="flex flex-col items-start justify-start gap-2 w-36">
                                                        <button
                                                            className="w-full px-3 py-3 text-sm border-b dark:border-gray-700 dark:text-gray-200 flex gap-2 items-center text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                                                        >
                                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M7.5 14.25C3.77198 14.25 0.75 11.228 0.75 7.5C0.75 3.77198 3.77198 0.75 7.5 0.75C11.228 0.75 14.25 3.77198 14.25 7.5C14.25 11.228 11.228 14.25 7.5 14.25ZM6.82703 10.2L11.5993 5.42707L10.6448 4.47263L6.82703 8.2911L4.91745 6.38153L3.963 7.33598L6.82703 10.2Z" fill="#2D9F75" />
                                                            </svg>
                                                            Set as default
                                                        </button>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* info */}
                                    <div className="flex items-start gap-8 justify-between w-full">
                                        <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                                            <span className="text-sm text-gray-700 font-bold">
                                                {t("Card Holder")}
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {card.cardHolder}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                                            <span className="text-sm text-gray-700 font-bold">
                                                {t("Card Number")}
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {card.cardNumber}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start justify-start gap-0 min-w-[15rem]">
                                            <span className="text-sm text-gray-700 font-bold">
                                                {t("Card Expiry")}
                                            </span>
                                            <span className="text-sm text-gray-900">
                                                {card.expiryDate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    <div className="flex items-start justify-center gap-4">
                                        <button className="text-sm bg-white text-red-700 px-4 py-2 w-96 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                                            {"Delete Card"}
                                        </button>
                                        <button className="text-sm bg-primary-100 text-primary-600 px-4 py-2 w-96 rounded-lg hover:bg-primary-600 hover:text-primary-100 transition-colors">
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