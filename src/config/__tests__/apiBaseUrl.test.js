import { resolveApiBaseUrl } from "../apiBaseUrl";

test("uses the current production API when no override is configured", () => {
  expect(resolveApiBaseUrl()).toBe("https://api.anmaat.com");
  expect(resolveApiBaseUrl("  ")).toBe("https://api.anmaat.com");
});

test("corrects the obsolete deployed hostname without touching other hosts", () => {
  expect(resolveApiBaseUrl("https://api.anmat.com/")).toBe("https://api.anmaat.com");
  expect(resolveApiBaseUrl("http://api.anmat.com:80")).toBe("https://api.anmaat.com");
  expect(resolveApiBaseUrl("https://api.anmat.com.evil.example")).toBe("https://api.anmat.com.evil.example");
});

test("preserves explicit local and staging overrides", () => {
  expect(resolveApiBaseUrl("http://127.0.0.1:3000/")).toBe("http://127.0.0.1:3000");
  expect(resolveApiBaseUrl(" https://staging.example.test/api/ ")).toBe("https://staging.example.test/api");
});
