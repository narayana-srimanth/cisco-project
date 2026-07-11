import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  Shield, Building2, HeartHandshake, Siren, LayoutDashboard,
  FilePlus, Search, ListChecks, Package, Bell, LogOut, Menu, X, BarChart3, MapPin,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Manage Agencies', path: '/admin/agencies', icon: <Building2 size={18} /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
  ],
  poc: [
    { label: 'Dashboard', path: '/poc/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Create Request', path: '/poc/request/new', icon: <FilePlus size={18} /> },
    { label: 'Resource Catalog', path: '/poc/resources', icon: <Search size={18} /> },
    { label: 'My Requests', path: '/poc/requests', icon: <ListChecks size={18} /> },
  ],
  owner: [
    { label: 'Dashboard', path: '/owner/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Manage Resources', path: '/owner/resources', icon: <Package size={18} /> },
    { label: 'Incoming Requests', path: '/owner/requests', icon: <Bell size={18} /> },
  ],
};

const roleConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  admin: { icon: <Shield size={16} />, label: 'Admin', color: 'bg-[#475569]' },
  poc: { icon: <Siren size={16} />, label: 'Coordinator', color: 'bg-[#1E40AF]' },
  owner: { icon: <HeartHandshake size={16} />, label: 'Resource Owner', color: 'bg-[#0D9488]' },
};

export function RoleLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const navItems = navByRole[user.role] || [];
  const config = roleConfig[user.role];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] transition-transform lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-[#1E293B] px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E40AF]">
              <MapPin size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">DREP</p>
              <p className="text-[10px] text-[#64748B]">Disaster Resource Exchange</p>
            </div>
            <button className="ml-auto lg:hidden text-[#64748B] hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Role badge */}
          <div className="px-4 py-4">
            <div className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm', config.color, 'text-white')}>
              {config.icon}
              <span className="font-medium">{config.label}</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#1E40AF] text-white'
                      : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="border-t border-[#1E293B] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E293B] text-xs font-semibold text-[#CBD5E1]">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-[#64748B] hover:bg-[#1E293B] hover:text-[#DC2626] transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-[#E2E8F0] bg-white px-5">
          <button className="lg:hidden text-[#64748B] hover:text-[#0F172A]" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-[#0F172A]">
            Disaster Resource Exchange Platform
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
