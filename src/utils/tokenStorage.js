const TOKEN_KEY = "token";

const COOKIE_MAX_AGE_REMEMBER = 30 * 24 * 60 * 60; // 30 days

function readCookie() {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${TOKEN_KEY}=`));
    if (!match) return null;
    return decodeURIComponent(match.slice(TOKEN_KEY.length + 1)) || null;
  } catch {
    return null;
  }
}

function writeCookie(token, remember = true) {
  if (typeof document === "undefined") return;
  try {
    const isHttps =
      typeof window !== "undefined" &&
      window.location &&
      window.location.protocol === "https:";
    let cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
    if (remember) {
      cookie += `; Max-Age=${COOKIE_MAX_AGE_REMEMBER}`;
    }
    if (isHttps) {
      cookie += "; Secure";
    }
    document.cookie = cookie;
  } catch {
    // cookie unavailable — localStorage remains the source of truth
  }
}

function deleteCookie() {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${TOKEN_KEY}=; path=/; Max-Age=0; SameSite=Lax`;
  } catch {
    // ignore
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.localStorage.getItem(TOKEN_KEY) ||
      window.sessionStorage.getItem(TOKEN_KEY) ||
      readCookie()
    );
  } catch {
    return readCookie();
  }
}

export function setToken(token, remember = true) {
  if (typeof window === "undefined") return;
  clearToken();
  try {
    if (remember) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.sessionStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // storage unavailable (private mode / quota) — session stays in memory only
  }
  // Mirror to a readable cookie so Next middleware (server) can do early redirect.
  //Detailed validation stays in (dashboard)/layout.jsx via backend /me.
  writeCookie(token, remember);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
  deleteCookie();
}

// One-time migration: users with a token in storage but no cookie (pre-middleware)
// get the cookie rewritten so they are not wrongly redirected once.
export function syncAuthCookie() {
  if (typeof window === "undefined") return;
  try {
    if (readCookie()) return;
    const stored =
      window.localStorage.getItem(TOKEN_KEY) ||
      window.sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      const persistent = !!window.localStorage.getItem(TOKEN_KEY);
      writeCookie(stored, persistent);
    }
  } catch {
    // ignore
  }
}
