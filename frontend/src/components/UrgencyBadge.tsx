import type { Urgency } from '@/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

const urgencyConfig: Record<Urgency, { label: string; color: string; icon: React.ReactNode }> = {
  critical: { label: 'Critical', color: 'text-[#DC2626] bg-[#FEE2E2]', icon: <AlertTriangle size={12} /> },
  high: { label: 'High', color: 'text-[#D97706] bg-[#FEF3C7]', icon: <ArrowUp size={12} /> },
  medium: { label: 'Medium', color: 'text-[#1E40AF] bg-[#DBEAFE]', icon: <Minus size={12} /> },
  low: { label: 'Low', color: 'text-[#64748B] bg-[#F1F5F9]', icon: <ArrowDown size={12} /> },
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const cfg = urgencyConfig[urgency];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', cfg.color)}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
