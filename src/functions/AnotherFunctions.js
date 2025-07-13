export const convertToSlug = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

export const capitalize = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);
