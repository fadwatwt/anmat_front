/* global jest, describe, it, expect, require */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../page';

jest.mock('react-redux', () => ({ useSelector: () => 'Subscriber' }));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('@/redux/auth/authSlice', () => ({ selectUserType: () => 'Subscriber' }));
jest.mock('react-icons/im', () => ({ ImSpinner2: () => null }));
jest.mock('next/dynamic', () => () => {
  const React = require('react');
  return function MockDashboard() {
    React.useEffect(() => {
      globalThis.dashboardMounts += 1;
    }, []);
    return React.createElement('div', null, 'Dashboard content');
  };
});

describe('DashboardPage', () => {
  it('keeps the selected dashboard mounted across parent renders', () => {
    globalThis.dashboardMounts = 0;
    const { rerender } = render(<DashboardPage />);
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    expect(globalThis.dashboardMounts).toBe(1);

    rerender(<DashboardPage />);
    expect(globalThis.dashboardMounts).toBe(1);
  });
});
