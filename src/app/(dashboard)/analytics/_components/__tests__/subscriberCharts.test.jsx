import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import DistributionBars from '../charts/DistributionBars';
import GaugeChart from '../charts/GaugeChart';
import AnalyticsCard from '../AnalyticsCard';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }));

describe('subscriber analytics readability', () => {
  it('shows counts and percentages without requiring hover', () => {
    render(<DistributionBars data={[{name:'On Time',value:3,color:'green'},{name:'Late',value:1,color:'orange'}]} />);
    expect(screen.getByRole('img', {name:'On Time: 3 (75%)'})).toBeTruthy();
    expect(screen.getByRole('img', {name:'Late: 1 (25%)'})).toBeTruthy();
  });
  it('distinguishes missing data from a measured zero percentage', () => {
    render(<DistributionBars data={[]} />);
    expect(screen.getByText('No data available')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });
  it('keeps an over-quota indicator within its visual bounds', () => {
    render(<GaugeChart compact percentage={140} label="Employees" />);
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
    expect(screen.getByText('140%')).toBeTruthy();
  });
  it('gives each filter a stable accessible name', () => {
    render(<AnalyticsCard title="Attendance" showDropdowns dropdown1Label="Employee" timeRangeOptions={[{value:'6m',label:'Last 6 Months'}]} selectedTimeRange="6m" />);
    expect(screen.getByRole('combobox', {name:'Employee'})).toBeTruthy();
    expect(screen.getByRole('combobox', {name:'Time Range'})).toBeTruthy();
  });
});
