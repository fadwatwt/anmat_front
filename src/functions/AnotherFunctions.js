export const convertToSlug = (text) => {
  if (typeof text !== "string") {
    return "";
  }
  // Unicode-aware: keeps Arabic and other letters (old [^\w-] stripped them,
  // producing empty slugs like "<id>-/details" for Arabic titles).
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Details URL for a task. Falls back to bare "<id>" when the title yields
// no slug characters — the details page accepts both "id-title" and "id".
export const taskDetailsPath = (task) => {
  if (!task?._id) return null;
  const slug = convertToSlug(task.title);
  return slug ? `/tasks/${task._id}-${slug}/details` : `/tasks/${task._id}/details`;
};

export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};
