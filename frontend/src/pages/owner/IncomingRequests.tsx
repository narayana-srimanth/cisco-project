import { useState, useEffect, useCallback } from 'react';
import type { Request, RequestStatus } from '@/types';
import { requestService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { ResourceTypeBadge } from '@/components/owner/ResourceTypeBadge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Search, Bell, ChevronDown, CheckCircle2, XCircle, Loader2, CheckCircle } from 'lucide-react';

const statusOptions: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'declined', label: 'Declined' },
];

interface ActionDialog {
  request: Request;
  action: RequestStatus;
}

export default function IncomingRequests() {
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? '';
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionDialog, setActionDialog] = useState<ActionDialog | null>(null);
  const [notes, setNotes] = useState('');
  const [acting, setActing] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const params: { status?: string } = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    const all = await requestService.getAll(params);
    const filtered = all.filter(
      (r) => r.targetAgencyId === agencyId || r.targetAgencyId === null
    );
    const q = search.trim().toLowerCase();
    const searched = q
      ? filtered.filter(
          (r) =>
            r.citizenName.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.trackingId.toLowerCase().includes(q) ||
            r.location.toLowerCase().includes(q)
        )
      : filtered;
    setRequests(searched);
    setLoading(false);
  }, [statusFilter, search, agencyId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async () => {
    if (!actionDialog) return;
    setActing(true);
    await requestService.updateStatus(actionDialog.request.id, actionDialog.action, notes || undefined);
    setActing(false);
    setActionDialog(null);
    setNotes('');
    fetchRequests();
  };

  const openAction = (request: Request, action: RequestStatus) => {
    setNotes('');
    setActionDialog({ request, action });
  };

  const actionButtons = (req: Request) => {
    if (req.status === 'pending') {
      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openAction(req, 'approved')}
            title="Approve"
          >
            <CheckCircle2 size={14} className="text-[#16A34A]" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => openAction(req, 'declined')}
            title="Decline"
          >
            <XCircle size={14} className="text-[#DC2626]" />
          </Button>
        </div>
      );
    }
    if (req.status === 'approved') {
      return (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => openAction(req, 'in_progress')}
          title="Mark In Progress"
        >
          <Loader2 size={14} className="text-[#7C3AED]" />
        </Button>
      );
    }
    if (req.status === 'in_progress') {
      return (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => openAction(req, 'fulfilled')}
          title="Mark Fulfilled"
        >
          <CheckCircle size={14} className="text-[#16A34A]" />
        </Button>
      );
    }
    return null;
  };

  const actionTitle: Record<string, string> = {
    approved: 'Approve Request',
    declined: 'Decline Request',
    in_progress: 'Mark as In Progress',
    fulfilled: 'Mark as Fulfilled',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0F172A]">Incoming Requests</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Review and respond to resource requests from coordinators</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            placeholder="Search by name, tracking ID, location..."
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
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider text-right">Actions</TableHead>
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
                  <Bell size={32} className="mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="text-sm text-[#64748B]">No incoming requests</p>
                  <p className="text-xs text-[#94A3B8] mt-1">No requests are currently targeting your agency</p>
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
                  <TableCell className="text-right">
                    {actionButtons(req)}
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

      {/* Action Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => { if (!open) setActionDialog(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{actionDialog ? actionTitle[actionDialog.action] : ''}</DialogTitle>
            <DialogDescription>
              {actionDialog?.request.citizenName} — {actionDialog?.request.trackingId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-[#64748B]">{actionDialog?.request.description}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#0F172A]">Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={acting}>
              {acting ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
