/* global describe, expect, it */
import { applyReactionToMessagesCache } from "../reactionCache";

describe("applyReactionToMessagesCache", () => {
  it("replaces the current account reaction immediately", () => {
    const response = {
      data: [{
        _id: "message-1",
        reactions: [
          { user: "user-1", emoji: "👍" },
          { user: "user-2", emoji: "👏" },
        ],
      }],
    };

    expect(applyReactionToMessagesCache(response, {
      messageId: "message-1",
      userId: "user-1",
      emoji: "❤️",
    })).toBe(true);
    expect(response.data[0].reactions).toEqual([
      { user: "user-2", emoji: "👏" },
      { user: "user-1", emoji: "❤️" },
    ]);
  });

  it("supports message arrays returned without an API wrapper", () => {
    const messages = [{ _id: "message-1", reactions: [] }];

    expect(applyReactionToMessagesCache(messages, {
      messageId: "message-1",
      userId: "user-1",
      emoji: "😂",
    })).toBe(true);
    expect(messages[0].reactions).toEqual([{ user: "user-1", emoji: "😂" }]);
  });
});
