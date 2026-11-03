export const getFinalPlanPrice = (pricing) => {
    const price = Number(pricing?.price) || 0;
    const discount = Number(pricing?.discount) || 0;
    return Number((price * (1 - discount / 100)).toFixed(2));
};
