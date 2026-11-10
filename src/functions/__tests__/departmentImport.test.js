import { previewDepartmentImport } from '../departmentImport';

test('previews duplicate and unknown department positions', () => {
  const rows = previewDepartmentImport(
    [{ name: 'Design', description: 'Design team', positions: 'Designer' }, { name: 'Design', description: 'Duplicate', positions: 'Designer' }, { name: 'Sales', description: 'Sales team', positions: 'Unknown' }],
    [], [{ _id: 'position-1', title: 'Designer' }],
  );
  expect(rows.map((row) => row.status)).toEqual(['ready', 'duplicate', 'invalid']);
  expect(rows[0].positions_ids).toEqual(['position-1']);
  expect(rows[2].unknownPositions).toEqual(['Unknown']);
});
