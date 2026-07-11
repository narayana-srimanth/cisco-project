import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Resource, Request } from '@/types';
import { resourceService, requestService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { ResourceTypeBadge } from '@/components/owner/ResourceTypeBadge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Package, Bell, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? '';
  const [resources, setResources] = useState<Resource[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agencyId) return;
    Promise.all([
      resourceService.getAll({ agencyId }),
      requestService.getAll(),
    ]).then(([resData, reqData]) => {
      setResources(resData);
      setRequests(reqData.filter(
        (r) => r.targetAgencyId === agencyId || r.targetAgencyId === null
      ));
      setLoading(false);
    });
  }, [agencyId]);

  const totalResources = resources.length;
  const available = resources.filter((r) => r.available).length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const fulfilledRequests = requests.filter((r) => r.status === 'fulfilled').length;

  const stats = [
    { label: 'Published Resources', value: totalResources, icon: <Package size={20} />, color: 'text-[#0D9488]', bg: 'bg-[#CCFBF1]' },
    { label: 'Available', value: available, icon: <CheckCircle2 size={20} />, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]' },
    { label: 'Incoming Requests', value: totalRequests, icon: <Bell size={20} />, color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]' },
    { label: 'Pending Action', value: pendingRequests, icon: <Clock size={20} />, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
  ];

  const recentRequests = requests.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Resource Owner Dashboard</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Your published resources and pending requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/owner/requests')} className="gap-1.5">
            <Bell size={16} />
            View Requests
          </Button>
          <Button onClick={() => navigate('/owner/resources')} className="gap-1.5">
            <Plus size={16} />
            Add Resource
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

      {/* Recent Incoming Requests */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#0F172A]">Recent Incoming Requests</h3>
          <button
            onClick={() => navigate('/owner/requests')}
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
                  No incoming requests yet
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
