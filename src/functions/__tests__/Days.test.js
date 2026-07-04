import dayjs from 'dayjs';
import { setLanguage, translateTime, translateDate, getTimeDifference } from '../Days';

describe('setLanguage', () => {
  it('sets dayjs locale', () => {
    setLanguage('en');
    expect(dayjs.locale()).toBe('en');
  });

  it('switches to Arabic locale', () => {
    setLanguage('ar');
    expect(dayjs.locale()).toBe('ar');
    setLanguage('en');
  });
});

describe('translateTime', () => {
  it('returns relative time string', () => {
    setLanguage('en');
    const result = translateTime(new Date());
    expect(typeof result).toBe('string');
  });
});

describe('translateDate', () => {
  it('formats date as D MMMM، YYYY', () => {
    const date = new Date('2025-01-15');
    const result = translateDate(date);
    expect(result).toContain('2025');
    expect(result).toContain('15');
  });
});

describe('getTimeDifference', () => {
  it('shows days, hours, and minutes when all non-zero', () => {
    setLanguage('en');
    const result = getTimeDifference('2025-01-15T16:00:00', '2025-01-13T13:00:00');
    expect(result).toContain('days');
    expect(result).toContain('hours');
    expect(result).toContain('minutes');
  });

  it('shows only minutes when diff is less than an hour', () => {
    setLanguage('en');
    const date = '2025-01-15T10:00:00';
    const result = getTimeDifference(date, date);
    expect(result).toBe('0 minutes late');
  });

  it('shows hours and minutes when diff is less than a day', () => {
    setLanguage('en');
    const result = getTimeDifference('2025-01-15T12:00:00', '2025-01-15T09:30:00');
    expect(result).toContain('hours');
    expect(result).toContain('minutes');
    expect(result).not.toContain('days');
  });

  it('shows minutes with leading zero formatting', () => {
    setLanguage('en');
    const result = getTimeDifference('2025-01-15T09:05:00', '2025-01-15T09:00:00');
    expect(result).toBe('5 minutes late');
  });
});
