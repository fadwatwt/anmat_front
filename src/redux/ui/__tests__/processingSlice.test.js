import processingReducer, {
  mutationStarted,
  mutationSettled,
  selectIsMutating,
} from '../processingSlice';

const initialState = {
  pendingCount: 0,
};

describe('processingSlice', () => {
  it('should return initial state', () => {
    const state = processingReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('mutationStarted', () => {
    it('increments pendingCount', () => {
      const state = processingReducer(initialState, mutationStarted());
      expect(state.pendingCount).toBe(1);
    });

    it('increments from non-zero count', () => {
      const state = processingReducer({ pendingCount: 3 }, mutationStarted());
      expect(state.pendingCount).toBe(4);
    });
  });

  describe('mutationSettled', () => {
    it('decrements pendingCount', () => {
      const state = processingReducer({ pendingCount: 2 }, mutationSettled());
      expect(state.pendingCount).toBe(1);
    });

    it('does not go below 0', () => {
      const state = processingReducer(initialState, mutationSettled());
      expect(state.pendingCount).toBe(0);
    });
  });

  describe('selectIsMutating', () => {
    it('returns true when pendingCount > 0', () => {
      const result = selectIsMutating({ processing: { pendingCount: 1 } });
      expect(result).toBe(true);
    });

    it('returns false when pendingCount is 0', () => {
      const result = selectIsMutating({ processing: { pendingCount: 0 } });
      expect(result).toBe(false);
    });
  });
});
