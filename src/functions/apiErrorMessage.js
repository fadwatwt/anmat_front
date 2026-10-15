export const getApiErrorMessage = (error, fallback) => {
  const message = error?.data?.message ?? error?.message;
  if (Array.isArray(message)) return message.join("، ");
  return typeof message === "string" && message.trim() ? message : fallback;
};
