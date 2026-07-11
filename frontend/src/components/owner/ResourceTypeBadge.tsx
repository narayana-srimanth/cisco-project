import type { ResourceType } from '@/types';
import { cn } from '@/lib/utils';
import { Car, Heart, UtensilsCrossed, Home, Users, Wrench } from 'lucide-react';

const typeConfig: Record<ResourceType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  vehicle: { label: 'Vehicle', color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]', icon: <Car size={12} /> },
  medical: { label: 'Medical', color: 'text-[#0D9488]', bg: 'bg-[#CCFBF1]', icon: <Heart size={12} /> },
  food: { label: 'Food', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]', icon: <UtensilsCrossed size={12} /> },
  shelter: { label: 'Shelter', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]', icon: <Home size={12} /> },
  personnel: { label: 'Personnel', color: 'text-[#475569]', bg: 'bg-[#F1F5F9]', icon: <Users size={12} /> },
  equipment: { label: 'Equipment', color: 'text-[#DC2626]', bg: 'bg-[#FEE2E2]', icon: <Wrench size={12} /> },
};

export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const cfg = typeConfig[type];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', cfg.bg, cfg.color)}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export const resourceTypeOptions = Object.entries(typeConfig).map(([value, cfg]) => ({
  value: value as ResourceType,
  label: cfg.label,
}));
