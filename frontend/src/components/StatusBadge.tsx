import type { RequestStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const statusConfig: Record<RequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-[#D97706] bg-[#FEF3C7]', icon: <Clock size={12} /> },
  approved: { label: 'Approved', color: 'text-[#1E40AF] bg-[#DBEAFE]', icon: <CheckCircle2 size={12} /> },
  in_progress: { label: 'In Progress', color: 'text-[#7C3AED] bg-[#EDE9FE]', icon: <Loader2 size={12} /> },
  fulfilled: { label: 'Fulfilled', color: 'text-[#16A34A] bg-[#DCFCE7]', icon: <CheckCircle2 size={12} /> },
  declined: { label: 'Declined', color: 'text-[#DC2626] bg-[#FEE2E2]', icon: <XCircle size={12} /> },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', cfg.color)}>
      {cfg.icon} {cfg.label}
    </span>
  );
}
