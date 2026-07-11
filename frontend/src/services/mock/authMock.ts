import type { User } from '@/types';
import type { AuthService } from '../authService';
import { mockUsers } from '@/data/users';

export const mockAuthService: AuthService = {
  async login(_email: string, _password: string): Promise<User> {
    // In mock mode, return the first admin user for demo
    // Real implementation will validate credentials against backend
    return mockUsers[0];
  },

  async loginAsRole(role: User['role']): Promise<User> {
    const user = mockUsers.find((u) => u.role === role);
    if (!user) throw new Error(`No mock user found for role: ${role}`);
    return user;
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
