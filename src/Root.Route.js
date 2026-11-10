// Keep production as the default while allowing local/E2E builds to target the
// backend that was started for that environment.
import { resolveApiBaseUrl } from "./config/apiBaseUrl";

export const RootRoute = resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
// export const RootRoute = "http://127.0.0.1:3000";

// export const RootRoute = "https://anmat-backend-system-2.onrender.com";
export const ExternalServer = "https://twitter.anmaat.com/api/v1";
// export const ExternalServer = "http://localhost:8000/api/v1";
export const defaultPhoto = "https://ui-avatars.com/api/?name=John+Doe";
