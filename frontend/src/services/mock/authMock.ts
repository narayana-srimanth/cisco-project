import type { User } from '@/types';
import type { AuthService } from '../authService';
import { mockUsers } from '@/data/users';

export const mockAuthService: AuthService = {
  async login(_email: string, _password: string): Promise<User> {
    return mockUsers[0];
  },

  async logout(): Promise<void> {
    // Mock: clear local storage
    localStorage.removeItem('currentUser');
  },

  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  },
};
