export function previewDepartmentImport(records, departments = [], positions = []) {
  const existing = new Set(departments.map((item) => String(item.name || '').trim().toLocaleLowerCase()));
  const positionIds = new Map(positions.map((item) => [String(item.title || '').trim().toLocaleLowerCase(), item._id]));
  const seen = new Set();
  return records.map((record, index) => {
    const name = String(record.name ?? record.Name ?? record['القسم'] ?? '').trim();
    const description = String(record.description ?? record.Description ?? record['الوصف'] ?? '').trim();
    const positionNames = String(record.positions ?? record.Positions ?? record['المناصب'] ?? '')
      .split(';').map((item) => item.trim()).filter(Boolean);
    const key = name.toLocaleLowerCase();
    const unknownPositions = positionNames.filter((item) => !positionIds.has(item.toLocaleLowerCase()));
    let status = 'ready';
    if (!/^[\p{L}\p{N}\s&-]{2,100}$/u.test(name) || description.length < 2 || description.length > 500 || !positionNames.length || unknownPositions.length) status = 'invalid';
    else if (existing.has(key) || seen.has(key)) status = 'duplicate';
    if (key) seen.add(key);
    return { row: index + 2, name, description, positionNames, positions_ids: positionNames.map((item) => positionIds.get(item.toLocaleLowerCase())).filter(Boolean), unknownPositions, status };
  });
}
