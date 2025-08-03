import { create } from 'zustand';

const useAuthStore = create((set) => ({
  authUserType: 'Employee', // Initial state
  setAuthUserType: async () => {
    // Simulate API call returning a static string
    const userType = 'Company-Manager'; // Replace with actual API call: await fetch('/api/auth')
    set({ authUserType: userType });
  },
}));

export default useAuthStore;