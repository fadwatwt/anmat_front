import '@testing-library/jest-dom';
import { statusCell, statusConfig } from '../StatusCell';

describe('statusCell', () => {
  it('returns a React element for "active" status', () => {
    const result = statusCell('active', '1');
    expect(result.key).toBe('1_status');
  });

  it('returns element for "in-active" status', () => {
    const result = statusCell('in-active', '2');
    expect(result).toBeDefined();
  });

  it('handles "Not-paid" status', () => {
    const result = statusCell('Not-paid', '3');
    expect(result).toBeDefined();
  });

  it('handles "not-paid" lowercase status', () => {
    const result = statusCell('not-paid', '3b');
    expect(result).toBeDefined();
  });

  it('handles "not paid" spaced status', () => {
    const result = statusCell('not paid', '3c');
    expect(result).toBeDefined();
  });

  it('handles "NOT PAID" uppercase status', () => {
    const result = statusCell('NOT PAID', '3d');
    expect(result).toBeDefined();
  });

  it('handles "completed" status', () => {
    const result = statusCell('completed', '4');
    expect(result).toBeDefined();
  });

  it('handles "pending" status', () => {
    const result = statusCell('pending', '5');
    expect(result).toBeDefined();
  });

  it('handles unknown status with fallback', () => {
    const result = statusCell('unknown-status-xyz', '6');
    expect(result).toBeDefined();
  });

  it('handles null/undefined status', () => {
    const result = statusCell(null, '7');
    expect(result).toBeDefined();
    const result2 = statusCell(undefined, '8');
    expect(result2).toBeDefined();
  });
});

describe('statusConfig', () => {
  it('has all expected status keys', () => {
    const keys = Object.keys(statusConfig);
    expect(keys).toContain('active');
    expect(keys).toContain('in-active');
    expect(keys).toContain('paid');
    expect(keys).toContain('completed');
    expect(keys).toContain('cancelled');
    expect(keys).toContain('delayed');
    expect(keys).toContain('pending');
    expect(keys).toContain('approved');
    expect(keys).toContain('rejected');
    expect(keys).toContain('in-progress');
  });

  it('each config has bgColor, icon, textColor', () => {
    Object.values(statusConfig).forEach((config) => {
      expect(config).toHaveProperty('bgColor');
      expect(config).toHaveProperty('icon');
      expect(config).toHaveProperty('textColor');
    });
  });
});
