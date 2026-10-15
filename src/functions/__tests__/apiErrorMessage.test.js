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
});
