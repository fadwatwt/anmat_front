export const MONEY_RECEIVING_TYPES = [
    { value: "stripe", label: "Stripe" },
    { value: "paypal", label: "PayPal" },
    { value: "hyperpay", label: "HyperPay" },
    { value: "moyasar", label: "Moyasar" },
    { value: "paytabs", label: "PayTabs" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "wallet", label: "Wallet" },
    { value: "other", label: "Other" },
];

export const getMoneyReceivingTypeLabel = (type) => {
    const found = MONEY_RECEIVING_TYPES.find((item) => item.value === type);
    return found ? found.label : type;
};
