import { RootRoute } from "@/Root.Route";

/**
 * Downloads a file from the backend export endpoint.
 *
 * @param {Object} options
 * @param {string[]} options.headers  - Column header labels
 * @param {string[][]} options.rows   - Cell data (strings)
 * @param {"csv"|"xlsx"|"pdf"|"docx"} options.format  - Target file format
 * @param {string} [options.fileName]  - Base file name (without extension)
 * @param {string} token              - JWT bearer token
 */
export async function downloadExport({ headers, rows, format, fileName }, token) {
  const response = await fetch(`${RootRoute}/api/subscriber/organization/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ headers, rows, format, fileName }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    throw new Error(errBody?.message || `Export failed (${response.status})`);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");

  let filename = null;
  // Prefer the RFC 5987 UTF-8 filename (supports Arabic and other scripts).
  const starMatch = disposition?.match(/filename\*=UTF-8''([^;]+)/i);
  if (starMatch) {
    try {
      filename = decodeURIComponent(starMatch[1].trim());
    } catch {
      filename = null;
    }
  }
  if (!filename) {
    const plainMatch = disposition?.match(/filename="?([^";]+)"?/i);
    filename = plainMatch?.[1];
  }

  const finalName = filename || `${fileName || "export"}.${format}`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = finalName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
