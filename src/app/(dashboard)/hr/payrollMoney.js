export const toMinorUnits = (value, digits) => {
  if (!Number.isInteger(digits) || digits < 0 || digits > 3) return null;
  const match = String(value).trim().match(/^(\d+)(?:\.(\d+))?$/);
  if (!match || (match[2] || "").length > digits) return null;
  const result = Number(match[1]) * 10 ** digits + Number((match[2] || "").padEnd(digits, "0"));
  return Number.isSafeInteger(result) && result > 0 ? result : null;
};
