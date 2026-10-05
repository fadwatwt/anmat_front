/* global describe, expect, it */
import { countLatestReactionPerUser } from "../reactionUtils";

describe("countLatestReactionPerUser", () => {
  it("counts only the latest reaction from each account", () => {
    expect(countLatestReactionPerUser([
      { user: "user-1", emoji: "👍" },
      { user: "user-1", emoji: "❤️" },
      { user: "user-2", emoji: "❤️" },
    ])).toEqual({ "❤️": 2 });
  });

  it("supports populated user objects", () => {
    expect(countLatestReactionPerUser([
      { user: { _id: "user-1" }, emoji: "👏" },
      { user: { _id: "user-2" }, emoji: "👍" },
    ])).toEqual({ "👏": 1, "👍": 1 });
  });
});
