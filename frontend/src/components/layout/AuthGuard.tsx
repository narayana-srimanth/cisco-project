import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const roleDashboard: Record<string, string> = {
  admin: '/admin/dashboard',
  poc: '/poc/dashboard',
  owner: '/owner/dashboard',
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleDashboard[user.role] || '/login'} replace />;
}
