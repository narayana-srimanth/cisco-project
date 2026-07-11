import { useState } from 'react';
import { MapPin, Search, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { requestService } from '@/services';
import type { Request } from '@/types';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-[#D97706] bg-[#FEF3C7]', icon: <Clock size={14} /> },
  approved: { label: 'Approved', color: 'text-[#1E40AF] bg-[#DBEAFE]', icon: <CheckCircle2 size={14} /> },
  in_progress: { label: 'In Progress', color: 'text-[#7C3AED] bg-[#EDE9FE]', icon: <Loader2 size={14} /> },
  fulfilled: { label: 'Fulfilled', color: 'text-[#16A34A] bg-[#DCFCE7]', icon: <CheckCircle2 size={14} /> },
  declined: { label: 'Declined', color: 'text-[#DC2626] bg-[#FEE2E2]', icon: <XCircle size={14} /> },
};

export default function TrackRequest() {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<Request | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    const req = await requestService.getByTrackingId(trackingId.trim());
    if (req) {
      setResult(req);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E40AF]">
          <MapPin size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0F172A]">DREP</p>
          <p className="text-[10px] text-[#64748B]">Disaster Resource Exchange</p>
        </div>
      </div>

      <h1 className="text-xl font-bold text-[#0F172A] mb-1">Track Your Request</h1>
      <p className="text-sm text-[#64748B] mb-6">Enter the tracking ID provided by your point of contact</p>

      {/* Search */}
      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          placeholder="e.g. TRK-2026-001"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#1E40AF] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2563EB] transition-colors disabled:opacity-50"
        >
          <Search size={16} />
          Track
        </button>
      </div>

      {/* Results */}
      {notFound && (
        <div className="mt-6 w-full max-w-md rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]">
          No request found with tracking ID "{trackingId}". Please check and try again.
        </div>
      )}

      {result && (
        <div className="mt-6 w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-[#64748B]">{result.trackingId}</p>
            {(() => {
              const s = statusConfig[result.status];
              return (
                <span className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium', s.color)}>
                  {s.icon} {s.label}
                </span>
              );
            })()}
          </div>
          <h3 className="text-base font-semibold text-[#0F172A] mb-1">{result.description}</h3>
          <p className="text-xs text-[#64748B] mb-4">
            Resource: <span className="font-medium capitalize text-[#0F172A]">{result.resourceType}</span> &middot; Urgency: <span className="font-medium capitalize text-[#0F172A]">{result.urgency}</span>
          </p>
          <div className="text-[11px] text-[#94A3B8] space-y-1">
            <p>Submitted: {new Date(result.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(result.updatedAt).toLocaleString()}</p>
            {result.notes && <p className="mt-2 text-[#64748B]">Note: {result.notes}</p>}
          </div>
          <a href="/login" className="mt-5 block text-center text-sm text-[#1E40AF] hover:text-[#2563EB] transition-colors">
            Back to Login
          </a>
        </div>
      )}

      {!result && !notFound && !loading && (
        <>
          <p className="mt-8 text-xs text-[#94A3B8] mb-3">Enter a tracking ID to see your request status</p>

          <div className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold text-[#0F172A] mb-3">Try these sample tracking IDs:</p>
            <div className="space-y-2">
              {[
                { id: 'TRK-2026-001', name: 'Meena Kumari', desc: 'Oxygen supply', status: 'approved' },
                { id: 'TRK-2026-002', name: 'Ravi Patil', desc: 'Food supplies', status: 'pending' },
                { id: 'TRK-2026-003', name: 'Anjali Desai', desc: 'Temporary shelter', status: 'in_progress' },
                { id: 'TRK-2026-004', name: 'Suresh Yadav', desc: 'Evacuation vehicle', status: 'pending' },
                { id: 'TRK-2026-005', name: 'Farhan Shaikh', desc: 'Search & rescue volunteers', status: 'approved' },
                { id: 'TRK-2026-006', name: 'Kavita Joshi', desc: 'Water supply', status: 'fulfilled' },
                { id: 'TRK-2026-007', name: 'Nikhil Gupta', desc: 'Generators', status: 'declined' },
                { id: 'TRK-2026-008', name: 'Priyanka Nair', desc: 'First aid kits', status: 'approved' },
              ].map((item) => {
                const s = statusConfig[item.status];
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTrackingId(item.id);
                      setNotFound(false);
                      setResult(null);
                      setLoading(true);
                      requestService.getByTrackingId(item.id).then((req) => {
                        if (req) setResult(req);
                        else setNotFound(true);
                        setLoading(false);
                      });
                    }}
                    className="w-full flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-left hover:border-[#1E40AF] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-medium text-[#0F172A]">{item.id}</span>
                      <span className="text-[11px] text-[#64748B]">{item.name} — {item.desc}</span>
                    </div>
                    <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', s.color)}>
                      {s.icon} {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
