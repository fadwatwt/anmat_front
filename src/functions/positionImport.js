export function previewPositionImport(records, existingPositions = []) {
  const existing = new Set(existingPositions.map((item) => String(item.title || "").trim().toLocaleLowerCase()));
  const seen = new Set();
  return records.map((record, index) => {
    const title = String(record.title ?? record.Title ?? record.position ?? record["المنصب"] ?? "").trim();
    const description = String(record.description ?? record.Description ?? record["الوصف"] ?? "").trim();
    const rawLevel = record.level ?? record.Level ?? record["المستوى"] ?? 1;
    const level = Number(rawLevel);
    const key = title.toLocaleLowerCase();
    let status = "ready";
    if (!/^[\p{L}\p{N}\s&-]{2,100}$/u.test(title) || description.length > 500 || !Number.isInteger(level) || level < 1 || level > 30) {
      status = "invalid";
    } else if (existing.has(key) || seen.has(key)) {
      status = "duplicate";
    }
    if (key) seen.add(key);
    return { row: index + 2, title, description, level, status };
  });
}
