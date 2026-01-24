import { create } from 'zustand';

const useAuthStore = create((set) => ({
  authUserType: 'Subscriber', // Initial state
  setAuthUserType: async () => {
    // Simulate API call returning a static string
    const userType = ''; // Replace with actual API call: await fetch('/api/auth')
    set({ authUserType: userType });
  },
}));

export default useAuthStore;