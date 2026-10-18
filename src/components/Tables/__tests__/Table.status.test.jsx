import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Table from '../Table';

jest.mock('@/Hooks/usePermission.js', () => ({ usePermission: () => false }));
jest.mock('@/services/exportService.js', () => ({ downloadExport: jest.fn() }));
jest.mock('@/app/(dashboard)/analytics/_components/styledAnalyticsXlsx.js', () => ({ buildStyledTableXlsx: jest.fn() }));

describe('Table status filtering', () => {
  const rows = [
    ['Active customer', <span key="active" data-status="active">Active</span>],
    ['Inactive customer', <span key="inactive" data-status="in-active">Inactive</span>],
  ];
  it('uses exact statuses and preserves original row indexes', () => {
    const onRowClick = jest.fn();
    render(<Table headers={['Name', 'Status']} rows={rows} showStatusFilter statusOptions={[{ id: 'active', name: 'Active' }, { id: 'in-active', name: 'Inactive' }]} onRowClick={onRowClick} showExport={false} isCheckInput={false} />);
    const select = screen.getByText('Status', { selector: 'option' }).parentElement;
    fireEvent.change(select, { target: { value: 'active' } });
    expect(screen.getByText('Active customer')).toBeInTheDocument();
    expect(screen.queryByText('Inactive customer')).not.toBeInTheDocument();
    fireEvent.change(select, { target: { value: 'in-active' } });
    fireEvent.click(screen.getByText('Inactive customer'));
    expect(onRowClick).toHaveBeenCalledWith(1);
    fireEvent.change(select, { target: { value: 'all' } });
    expect(screen.getByText('Active customer')).toBeInTheDocument();
  });
  it('does not display attendance choices for unspecified tables', () => {
    render(<Table headers={['Name', 'Status']} rows={rows} showStatusFilter showExport={false} />);
    expect(screen.queryByText('Absent')).not.toBeInTheDocument();
    expect(screen.queryByText('Status', { selector: 'option' })).not.toBeInTheDocument();
  });

  it('searches display text stored in nested component props', () => {
    const AccountDetails = ({ account }) => <span>{account.name}</span>;
    const departmentRows = [
      [<AccountDetails key="engineering" account={{ name: 'Engineering' }} />, '8'],
      [<AccountDetails key="finance" account={{ name: 'Finance' }} />, '3'],
    ];

    render(
      <Table
        headers={['Department', 'Employees']}
        rows={departmentRows}
        showExport={false}
        isCheckInput={false}
      />
    );

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Engineering' } });
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.queryByText('Finance')).not.toBeInTheDocument();
  });
});
