import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import EmployeeDashboard from '../_components/EmployeeDashboard';
import { useGetEmployeeAnalyticsQuery } from '@/redux/analytics/analyticsApi';

let mockAllowed = false;
jest.mock('@/Hooks/usePermission', () => ({ usePermission: () => mockAllowed }));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('@/redux/tasks/employeeTasksApi', () => ({
  useGetEmployeeTaskStatisticsStatusQuery: () => ({ data: { data: { total: 7 } } }),
  useGetEmployeeTasksQuery: () => ({ data: [] }),
}));
jest.mock('@/redux/activity-logs/activityLogsApi', () => ({ useGetEmployeeDashboardLogsQuery: () => ({ data: [] }) }));
jest.mock('@/redux/analytics/analyticsApi', () => ({ useGetEmployeeAnalyticsQuery: jest.fn(() => ({})) }));
jest.mock('@/components/Page', () => function Page({ children }) { return <main>{children}</main>; });
jest.mock('@/components/ActivityLogs', () => () => null);
jest.mock('@/components/Tables/Table', () => () => null);
jest.mock('../_components/employee/EmployeeRequests', () => () => null);
jest.mock('@/app/(dashboard)/analytics/_components/employee/TasksSummaryChart', () => () => null);
jest.mock('@/app/(dashboard)/analytics/_components/employee/TasksPerformanceChart', () => function Chart() { return <div>Performance chart</div>; });

it('skips analytics without its permission while rendering basic task statistics', () => {
  mockAllowed = false;
  render(<EmployeeDashboard />);
  expect(useGetEmployeeAnalyticsQuery).toHaveBeenLastCalledWith({ section: 'tasks' }, { skip: true });
  expect(screen.getByText('7')).toBeInTheDocument();
  expect(screen.queryByText('Performance chart')).not.toBeInTheDocument();
});

it('enables analytics for authorized employees', () => {
  mockAllowed = true;
  render(<EmployeeDashboard />);
  expect(useGetEmployeeAnalyticsQuery).toHaveBeenLastCalledWith({ section: 'tasks' }, { skip: false });
  expect(screen.getByText('Performance chart')).toBeInTheDocument();
});
