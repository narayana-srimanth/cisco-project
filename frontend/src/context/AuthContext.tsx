import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { authService } from '@/services';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((u) => {
      setUser(u);
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    // Mock login: find user by role
    const mockCredentials: Record<UserRole, { email: string; password: string }> = {
      admin: { email: 'admin@ddma.gov.in', password: 'demo' },
      poc: { email: 'sunita@cityhospital.org', password: 'demo' },
      owner: { email: 'amit@redcrossrelief.org', password: 'demo' },
    };
    const { email, password } = mockCredentials[role];
    const loggedIn = await authService.login(email, password);
    // Override role for demo flexibility
    const demoUser = { ...loggedIn, role };
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
