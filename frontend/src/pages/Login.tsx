import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { Shield, Building2, HeartHandshake, ArrowRight, ArrowLeft, MapPin, Info } from 'lucide-react';
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

const demoCredentials: Record<UserRole, { email: string; password: string; name: string }> = {
  admin: { email: 'admin@ddma.gov.in', password: 'demo', name: 'Suresh Jadhav' },
  poc: { email: 'sunita@cityhospital.org', password: 'demo', name: 'Dr. Sunita Sharma' },
  owner: { email: 'amit@redcrossrelief.org', password: 'demo', name: 'Amit Patel' },
};

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'login'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
    setStep('login');
  };

  const handleBack = () => {
    setStep('role');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    await login(selectedRole);
    const routes: Record<UserRole, string> = {
      admin: '/admin/dashboard',
      poc: '/poc/dashboard',
      owner: '/owner/dashboard',
    };
    navigate(routes[selectedRole]);
  };

  const selectedConfig = selectedRole ? roles.find((r) => r.role === selectedRole) : null;

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

          {step === 'role' ? (
            <>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Welcome back</h2>
              <p className="text-sm text-[#64748B] mb-8">Select your role to access the platform</p>

              {/* Role cards */}
              <div className="space-y-3">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className={cn(
                      'group w-full rounded-xl border border-[#E2E8F0] bg-white p-5 text-left transition-all shadow-sm',
                      r.hoverBorder,
                      'hover:shadow-md',
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white', r.roleColor)}>
                        {r.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A]">{r.label}</p>
                        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{r.description}</p>
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
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                Back to role selection
              </button>

              {/* Role badge */}
              {selectedConfig && (
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg text-white', selectedConfig.roleColor)}>
                    {selectedConfig.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A]">Sign In</h2>
                    <p className="text-xs text-[#64748B]">Logging in as {selectedConfig.label}</p>
                  </div>
                </div>
              )}

              {/* Login form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors',
                    selectedConfig?.roleColor || 'bg-[#1E40AF]',
                    'hover:opacity-90 disabled:opacity-50',
                  )}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Demo credentials card */}
              <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-[#64748B]" />
                  <p className="text-xs font-medium text-[#64748B]">Demo Credentials</p>
                </div>
                <div className="space-y-1.5 text-xs text-[#94A3B8]">
                  <p><span className="font-medium text-[#64748B]">Admin:</span> admin@ddma.gov.in</p>
                  <p><span className="font-medium text-[#64748B]">POC:</span> sunita@cityhospital.org</p>
                  <p><span className="font-medium text-[#64748B]">Owner:</span> amit@redcrossrelief.org</p>
                  <p className="pt-1"><span className="font-medium text-[#64748B]">Password:</span> demo</p>
                </div>
                <p className="mt-3 text-[11px] text-[#D97706] bg-[#FEF3C7] rounded px-2 py-1">
                  This is a demo application. No real authentication is used.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
