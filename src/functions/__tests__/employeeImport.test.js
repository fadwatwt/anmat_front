import { previewEmployeeImport } from '../employeeImport';

const valid = { name: 'Test Employee', email: 'person@example.test', phone: '+970599123456', password: 'temporary123', date_of_birth: '1995-02-14', salary: '2000' };
test('builds the employee payload without assigning roles from a file', () => {
  const [row] = previewEmployeeImport([{ ...valid, roles_ids: 'admin', department: 'Design', position: 'Designer' }], [],
    [{ _id: 'dept', name: 'Design', positions_ids: [{ _id: 'pos' }] }], [{ _id: 'pos', title: 'Designer' }]);
  expect(row.status).toBe('ready');
  expect(row.payload.employee_detail).toEqual({ date_of_birth: '1995-02-14', salary: 2000, work_hours: 8, shift_type: 'HOURS', yearly_day_offs: 14, weekend_days: [], department_id: 'dept', position_id: 'pos' });
  expect(row.payload.password_confirmation).toBe(valid.password);
});
test('rejects impossible dates, invalid numbers, and missing required data', () => {
  const [row] = previewEmployeeImport([{ ...valid, date_of_birth: '1995-02-30', salary: '', work_hours: 'NaN', yearly_day_offs: '366', password: '' }]);
  expect(row.status).toBe('invalid');
  expect(row.errors).toEqual(expect.arrayContaining(['date_of_birth', 'salary', 'work_hours', 'yearly_day_offs', 'password']));
});
test('detects existing and in-file identities without invalid rows reserving them', () => {
  const rows = previewEmployeeImport([{ ...valid, name: '' }, valid, { ...valid, email: 'PERSON@example.test' }]);
  expect(rows.map((row) => row.status)).toEqual(['invalid', 'ready', 'duplicate']);
  expect(previewEmployeeImport([valid], [{ user: { email: valid.email } }])[0].status).toBe('duplicate');
  expect(previewEmployeeImport([valid], [{ user: { phone: valid.phone } }])[0].status).toBe('duplicate');
  expect(previewEmployeeImport([valid], [{ user_id: 'account-id', user: { email: valid.email } }])[0].status).toBe('duplicate');
});
test('rejects unknown, ambiguous and mismatched organization references', () => {
  const records = [{ ...valid, department: 'Design', position: 'Designer' }];
  const positions = [{ _id: 'pos', title: 'Designer' }];
  expect(previewEmployeeImport(records, [], [], positions)[0].errors).toContain('department');
  expect(previewEmployeeImport(records, [], [{ _id: 'd', name: 'Design', positions_ids: [] }], positions)[0].errors).toContain('position_department');
  expect(previewEmployeeImport(records, [], [{ _id: 'd', name: 'Design' }, { _id: 'd2', name: 'Design' }], positions)[0].errors).toContain('department');
});
