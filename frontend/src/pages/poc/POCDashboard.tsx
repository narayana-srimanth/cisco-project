import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Request } from '@/types';
import { requestService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { ResourceTypeBadge } from '@/components/owner/ResourceTypeBadge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FilePlus, Search, Clock, CheckCircle2, Loader2, CheckCircle, ArrowRight } from 'lucide-react';

export default function POCDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? '';
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyId) return;
    requestService.getAll({ pocAgencyId: agencyId }).then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, [agencyId]);

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const approved = requests.filter((r) => r.status === 'approved').length;
  const inProgress = requests.filter((r) => r.status === 'in_progress').length;
  const fulfilled = requests.filter((r) => r.status === 'fulfilled').length;

  const stats = [
    { label: 'Total Requests', value: total, icon: <FilePlus size={20} />, color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]' },
    { label: 'Pending', value: pending, icon: <Clock size={20} />, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
    { label: 'In Progress', value: inProgress, icon: <Loader2 size={20} />, color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]' },
    { label: 'Fulfilled', value: fulfilled, icon: <CheckCircle size={20} />, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
  ];

  const recentRequests = requests.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Coordinator Dashboard</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Your submitted requests and quick actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/poc/resources')} className="gap-1.5">
            <Search size={16} />
            Browse Resources
          </Button>
          <Button onClick={() => navigate('/poc/request/new')} className="gap-1.5">
            <FilePlus size={16} />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#0F172A]">{loading ? '—' : stat.value}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#0F172A]">Recent Requests</h3>
          <button
            onClick={() => navigate('/poc/requests')}
            className="flex items-center gap-1 text-xs text-[#1E40AF] hover:text-[#2563EB] transition-colors"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFC]">
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Tracking ID</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Citizen</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Resource</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[#94A3B8]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : recentRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-[#94A3B8]">
                  No requests yet. Create your first request.
                </TableCell>
              </TableRow>
            ) : (
              recentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <span className="font-mono text-xs text-[#64748B]">{req.trackingId}</span>
                  </TableCell>
                  <TableCell className="text-sm text-[#0F172A]">{req.citizenName}</TableCell>
                  <TableCell>
                    <ResourceTypeBadge type={req.resourceType} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-xs text-[#94A3B8]">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
