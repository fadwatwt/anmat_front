export const countLatestReactionPerUser = (reactions = []) => {
  const latestReactionByUser = new Map();

  reactions.forEach((reaction, index) => {
    const userId = reaction.user?._id || reaction.user;
    const userKey = userId ? String(userId) : `unknown-user-${index}`;
    latestReactionByUser.set(userKey, reaction.emoji);
  });

  return Array.from(latestReactionByUser.values()).reduce((counts, emoji) => {
    counts[emoji] = (counts[emoji] || 0) + 1;
    return counts;
  }, {});
};
