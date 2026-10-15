import { useEffect, useState } from "react";

export default function usePersistedAnalyticsFilter(key, defaultValue = "") {
  const [value, setValue] = useState(defaultValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(key);
      if (saved !== null) setValue(saved);
    } catch {
      // Storage may be unavailable in privacy-restricted browsers.
    } finally {
      setReady(true);
    }
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // The filter still works for the current page even if it cannot be saved.
    }
  }, [key, ready, value]);

  return [value, setValue];
}
