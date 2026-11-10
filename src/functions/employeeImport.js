const key = (value) => String(value ?? '').trim().toLocaleLowerCase();
const text = (value) => String(value ?? '').trim();
const userData = (item) => item.user || (typeof item.user_id === 'object' && item.user_id ? item.user_id : item);
const uniqueMatch = (items, value, field) => {
  const matches = items.filter((item) => key(item[field]) === key(value));
  return matches.length === 1 ? matches[0] : null;
};

export function previewEmployeeImport(records, employees = [], departments = [], positions = []) {
  const emails = new Set(employees.map((item) => key(userData(item).email)).filter(Boolean));
  const numbers = new Set(employees.map((item) => key(item.employee_number)).filter(Boolean));
  const phones = new Set(employees.map((item) => text(userData(item).phone)).filter(Boolean));
  return records.map((record, index) => {
    const name = text(record.name);
    const email = key(record.email);
    const phone = text(record.phone);
    const password = String(record.password ?? '');
    const errors = [];
    if (name.length < 2 || name.length > 50) errors.push('name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
    if (!/^\+?\d{7,15}$/.test(phone)) errors.push('phone');
    if (password.length < 6) errors.push('password');
    const birth = text(record.date_of_birth);
    const parsedBirth = new Date(`${birth}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || !Number.isFinite(parsedBirth.getTime()) || parsedBirth.toISOString().slice(0, 10) !== birth || parsedBirth > new Date()) errors.push('date_of_birth');
    const number = text(record.employee_number);
    if (number && (!/^[A-Za-z0-9_-]+$/.test(number) || number.length > 50)) errors.push('employee_number');
    const numeric = (field, fallback, min, max = Infinity) => {
      const value = text(record[field]) === '' ? fallback : Number(record[field]);
      if (!Number.isFinite(value) || value < min || value > max) errors.push(field);
      return value;
    };
    if (text(record.salary) === '') errors.push('salary');
    const detail = {
      date_of_birth: birth, salary: numeric('salary', 0, 0),
      work_hours: numeric('work_hours', 8, 1, 24), shift_type: 'HOURS',
      yearly_day_offs: numeric('yearly_day_offs', 14, 0, 365), weekend_days: [],
      ...(number ? { employee_number: number } : {}),
    };
    const department = text(record.department) ? uniqueMatch(departments, record.department, 'name') : null;
    const position = text(record.position) ? uniqueMatch(positions, record.position, 'title') : null;
    if (text(record.department) && !department) errors.push('department');
    if (text(record.position) && !position) errors.push('position');
    if (department) detail.department_id = department._id;
    if (position) {
      const departmentPositions = department?.positions || department?.positions_ids || [];
      if (!department || !departmentPositions.some((item) => String(item._id || item) === String(position._id))) errors.push('position_department');
      detail.position_id = position._id;
    }
    const duplicate = emails.has(email) || phones.has(phone) || (number && numbers.has(key(number)));
    // Invalid rows must not reserve identifiers and block a later valid row.
    if (!errors.length && !duplicate) { emails.add(email); phones.add(phone); if (number) numbers.add(key(number)); }
    return { row: index + 2, name, email, errors, status: errors.length ? 'invalid' : duplicate ? 'duplicate' : 'ready',
      payload: { name, email, phone, password, password_confirmation: password, employee_detail: detail } };
  });
}
