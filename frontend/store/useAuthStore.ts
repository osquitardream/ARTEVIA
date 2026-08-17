import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('artevia_token', token);
      localStorage.setItem('artevia_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artevia_token');
      localStorage.removeItem('artevia_user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('artevia_token');
      const userStr = localStorage.getItem('artevia_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch {
          localStorage.removeItem('artevia_token');
          localStorage.removeItem('artevia_user');
        }
      }
    }
  },
}));
