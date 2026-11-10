const PRODUCTION_API_URL = "https://api.anmaat.com";

export function resolveApiBaseUrl(configured) {
  const value = configured?.trim() || PRODUCTION_API_URL;
  const url = new URL(value);
  // Correct the obsolete hostname found in the deployed build configuration.
  // Use the same resolved base for HTTP, SSE and WebSocket clients.
  if (url.hostname === "api.anmat.com") {
    url.hostname = "api.anmaat.com";
    url.protocol = "https:";
    url.port = "";
  }
  return url.toString().replace(/\/$/, "");
}
