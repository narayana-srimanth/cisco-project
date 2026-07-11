import type { AgencyType } from '@/types';
import { cn } from '@/lib/utils';
import {
  Shield, Flame, Heart, HandHelping, Users, Landmark,
} from 'lucide-react';

const typeConfig: Record<AgencyType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  police: { label: 'Police', color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]', icon: <Shield size={12} /> },
  fire: { label: 'Fire Dept', color: 'text-[#DC2626]', bg: 'bg-[#FEE2E2]', icon: <Flame size={12} /> },
  hospital: { label: 'Hospital', color: 'text-[#0D9488]', bg: 'bg-[#CCFBF1]', icon: <Heart size={12} /> },
  ngo: { label: 'NGO', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]', icon: <HandHelping size={12} /> },
  volunteer: { label: 'Volunteer', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]', icon: <Users size={12} /> },
  government: { label: 'Government', color: 'text-[#475569]', bg: 'bg-[#F1F5F9]', icon: <Landmark size={12} /> },
};

export function AgencyTypeBadge({ type }: { type: AgencyType }) {
  const cfg = typeConfig[type];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', cfg.bg, cfg.color)}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export const agencyTypeOptions = Object.entries(typeConfig).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));
