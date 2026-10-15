import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import usePersistedAnalyticsFilter from '../usePersistedAnalyticsFilter';

describe('usePersistedAnalyticsFilter', () => {
  it('restores and updates a saved analytics filter', async () => {
    window.sessionStorage.setItem('analytics:test:section', 'projects');
    const { result } = renderHook(() => usePersistedAnalyticsFilter('analytics:test:section'));

    await waitFor(() => expect(result.current[0]).toBe('projects'));
    act(() => result.current[1]('tasks'));
    await waitFor(() => expect(window.sessionStorage.getItem('analytics:test:section')).toBe('tasks'));
  });
});
