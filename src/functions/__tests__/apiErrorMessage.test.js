import { describe, expect, it } from "@jest/globals";
import { getApiErrorMessage } from "../apiErrorMessage";

describe("getApiErrorMessage", () => {
  it("uses backend string and array messages", () => {
    expect(getApiErrorMessage({ data: { message: "Denied" } }, "Fallback")).toBe("Denied");
    expect(getApiErrorMessage({ data: { message: ["First", "Second"] } }, "Fallback")).toBe("First، Second");
  });

  it("uses a safe fallback for unsupported responses", () => {
    expect(getApiErrorMessage({ data: { message: { code: 500 } } }, "Fallback")).toBe("Fallback");
  });

  it("shows a safe request reference for support", () => {
    expect(getApiErrorMessage({ data: { message: "Internal server error", request_id: "a1b2c3d4-1234" } }, "Fallback"))
      .toContain("a1b2c3d4-1234");
  });
});
