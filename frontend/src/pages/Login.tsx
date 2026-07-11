import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { Shield, Building2, HeartHandshake, ArrowRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { role: UserRole; label: string; description: string; icon: React.ReactNode; roleColor: string; hoverBorder: string }[] = [
  {
    role: 'admin',
    label: 'Admin',
    description: 'Platform administrator — manage agencies, oversee operations, view analytics',
    icon: <Shield size={28} />,
    roleColor: 'bg-[#475569]',
    hoverBorder: 'hover:border-[#475569]/40',
  },
  {
    role: 'poc',
    label: 'Coordinator (POC)',
    description: 'Point of Contact — submit citizen requests, discover resources, coordinate relief',
    icon: <Building2 size={28} />,
    roleColor: 'bg-[#1E40AF]',
    hoverBorder: 'hover:border-[#1E40AF]/40',
  },
  {
    role: 'owner',
    label: 'Resource Owner',
    description: 'NGO / Volunteer org — publish available resources, approve or decline requests',
    icon: <HeartHandshake size={28} />,
    roleColor: 'bg-[#0D9488]',
    hoverBorder: 'hover:border-[#0D9488]/40',
  },
];

const roleDemoUser: Record<UserRole, string> = {
  admin: 'Suresh Jadhav — DDMA',
  poc: 'Dr. Sunita Sharma — City Hospital',
  owner: 'Amit Patel — Red Cross Relief',
};

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleLogin = async (role: UserRole) => {
    setSelected(role);
    await login(role);
    const routes: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      poc: '/poc/dashboard',
      owner: '/owner/dashboard',
    };
    navigate(routes[role]);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#0F172A] p-12 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E40AF] mb-8">
          <MapPin size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-center leading-tight">
          Disaster Resource<br />Exchange Platform
        </h1>
        <p className="text-base text-[#94A3B8] text-center max-w-sm leading-relaxed">
          A unified coordination platform connecting emergency agencies, NGOs, and volunteers
          for faster disaster response.
        </p>
        <div className="mt-14 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-white">6+</p>
            <p className="text-xs text-[#64748B] mt-1">Agencies</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">15+</p>
            <p className="text-xs text-[#64748B] mt-1">Resources</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Real-time</p>
            <p className="text-xs text-[#64748B] mt-1">Coordination</p>
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E40AF] text-white">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-base font-bold text-[#0F172A]">DREP</p>
              <p className="text-[11px] text-[#64748B]">Disaster Resource Exchange</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Welcome back</h2>
          <p className="text-sm text-[#64748B] mb-8">Select your role to access the platform (demo mode)</p>

          {/* Role cards */}
          <div className="space-y-3">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => handleLogin(r.role)}
                disabled={isLoading && selected === r.role}
                className={cn(
                  'group w-full rounded-xl border border-[#E2E8F0] bg-white p-5 text-left transition-all shadow-sm',
                  r.hoverBorder,
                  'hover:shadow-md',
                  selected === r.role ? 'border-[#1E40AF] ring-1 ring-[#1E40AF]/20 bg-[#DBEAFE]/30' : '',
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white', r.roleColor)}>
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0F172A]">{r.label}</p>
                      {selected === r.role && isLoading && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1E40AF] border-t-transparent" />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{r.description}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1.5">
                      Demo: {roleDemoUser[r.role]}
                    </p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-[#94A3B8] group-hover:text-[#1E40AF] transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Citizen tracking link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#64748B]">
              Are you a citizen looking to track your request?{' '}
              <a href="/track" className="font-medium text-[#1E40AF] hover:text-[#2563EB] transition-colors">
                Track here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
