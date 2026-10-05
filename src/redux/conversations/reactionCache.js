export const applyReactionToMessagesCache = (
  draft,
  { messageId, userId, emoji },
) => {
  if (!messageId || !userId || !emoji) return false;

  const messages = Array.isArray(draft) ? draft : draft?.data;
  if (!Array.isArray(messages)) return false;

  const message = messages.find(
    (item) => item._id?.toString() === messageId.toString(),
  );
  if (!message) return false;

  const normalizedUserId = userId.toString();
  message.reactions = (message.reactions || []).filter((reaction) => {
    const reactionUserId = reaction.user?._id || reaction.user;
    return reactionUserId?.toString() !== normalizedUserId;
  });
  message.reactions.push({ user: userId, emoji });
  return true;
};
