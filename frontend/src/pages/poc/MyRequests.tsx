import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Request } from '@/types';
import { requestService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { ResourceTypeBadge } from '@/components/owner/ResourceTypeBadge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ListChecks, ChevronDown, FilePlus } from 'lucide-react';

const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'declined', label: 'Declined' },
];

export default function MyRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? '';
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const params: { pocAgencyId: string; status?: string } = { pocAgencyId: agencyId };
    if (statusFilter !== 'all') params.status = statusFilter;
    const data = await requestService.getAll(params);
    const q = search.trim().toLowerCase();
    const filtered = q
      ? data.filter(
          (r) =>
            r.citizenName.toLowerCase().includes(q) ||
            r.trackingId.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q)
        )
      : data;
    setRequests(filtered);
    setLoading(false);
  }, [statusFilter, search, agencyId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">My Requests</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Track status of all requests you have submitted</p>
        </div>
        <Button onClick={() => navigate('/poc/request/new')} className="gap-1.5">
          <FilePlus size={16} />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            placeholder="Search by name, tracking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 appearance-none rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-8 text-sm text-[#0F172A] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFC]">
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Tracking ID</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Citizen</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Resource</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Urgency</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Location</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Description</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-[#94A3B8]">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <ListChecks size={32} className="mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="text-sm text-[#64748B]">No requests found</p>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {search || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter'
                      : 'Submit your first request to get started'}
                  </p>
                  {!search && statusFilter === 'all' && (
                    <Button onClick={() => navigate('/poc/request/new')} className="mt-3 gap-1.5" size="sm">
                      <FilePlus size={14} />
                      Create Request
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-[#64748B]">{req.trackingId}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#0F172A] text-sm">{req.citizenName}</p>
                      <p className="text-[11px] text-[#94A3B8]">{req.citizenPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ResourceTypeBadge type={req.resourceType} />
                  </TableCell>
                  <TableCell>
                    <UrgencyBadge urgency={req.urgency} />
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B] max-w-[120px] truncate text-xs">
                    {req.location}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B] max-w-[180px] truncate text-xs">
                    {req.description}
                  </TableCell>
                  <TableCell className="text-xs text-[#94A3B8]">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && requests.length > 0 && (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
            <p className="text-xs text-[#94A3B8]">{requests.length} {requests.length === 1 ? 'request' : 'requests'} total</p>
          </div>
        )}
      </div>
    </div>
  );
}
