import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setPermissions,
  loadAuthState,
  setUser,
  clearError,
  selectUserId,
  selectIsAuthenticated,
  selectPermissions,
} from '../authSlice';

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  permissions: [],
  permissionsLoaded: false,
};

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('loginStart', () => {
    it('sets isLoading true and clears error', () => {
      const state = authReducer(initialState, loginStart());
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess', () => {
    const payload = {
      data: {
        access_token: 'test-token',
        user: { _id: '123', name: 'Test User', type: 'admin' },
      },
    };

    it('sets user, token, isAuthenticated', () => {
      const state = authReducer(initialState, loginSuccess(payload));
      expect(state.user).toEqual(payload.data.user);
      expect(state.token).toBe('test-token');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('saves token to localStorage', () => {
      authReducer(initialState, loginSuccess(payload));
      expect(localStorage.getItem('token')).toBe('test-token');
    });
  });

  describe('loginFailure', () => {
    it('sets error and clears loading/authenticated', () => {
      const state = authReducer(initialState, loginFailure('Invalid credentials'));
      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    const loggedInState = {
      ...initialState,
      user: { _id: '123', name: 'Test' },
      token: 'token',
      isAuthenticated: true,
      permissions: ['admin'],
      permissionsLoaded: true,
    };

    it('resets to initial state', () => {
      localStorage.setItem('token', 'token');
      localStorage.setItem('userId', '123');
      const state = authReducer(loggedInState, logout());
      expect(state).toEqual(initialState);
    });

    it('clears localStorage', () => {
      localStorage.setItem('token', 'token');
      localStorage.setItem('userId', '123');
      authReducer(loggedInState, logout());
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
    });
  });

  describe('setPermissions', () => {
    it('sets permissions and marks loaded', () => {
      const perms = ['read:users', 'write:projects'];
      const state = authReducer(initialState, setPermissions(perms));
      expect(state.permissions).toEqual(perms);
      expect(state.permissionsLoaded).toBe(true);
    });

    it('handles null payload as empty array', () => {
      const state = authReducer(initialState, setPermissions(null));
      expect(state.permissions).toEqual([]);
    });
  });

  describe('loadAuthState', () => {
    it('restores token from localStorage', () => {
      localStorage.setItem('token', 'saved-token');
      const state = authReducer(initialState, loadAuthState());
      expect(state.token).toBe('saved-token');
      expect(state.isAuthenticated).toBe(true);
    });

    it('does nothing when no token', () => {
      const state = authReducer(initialState, loadAuthState());
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setUser', () => {
    it('sets user and marks authenticated', () => {
      const user = { _id: '456', name: 'New User' };
      const state = authReducer(initialState, setUser(user));
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('sets isAuthenticated false when user is null', () => {
      const state = authReducer({ ...initialState, isAuthenticated: true }, setUser(null));
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('clears error', () => {
      const state = authReducer({ ...initialState, error: 'Some error' }, clearError());
      expect(state.error).toBeNull();
    });
  });

  describe('selectors', () => {
    const state = {
      auth: {
        user: { _id: 'abc', type: 'admin' },
        isAuthenticated: true,
        permissions: ['read'],
      },
    };

    it('selectUserId returns _id', () => {
      expect(selectUserId(state)).toBe('abc');
    });

    it('selectIsAuthenticated returns flag', () => {
      expect(selectIsAuthenticated(state)).toBe(true);
    });

    it('selectPermissions returns permissions', () => {
      expect(selectPermissions(state)).toEqual(['read']);
    });
  });
});
