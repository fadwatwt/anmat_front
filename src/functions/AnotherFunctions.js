export const convertToSlug = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};
