import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Agency, Resource, Request } from '@/types';
import { agencyService, resourceService, requestService } from '@/services';
import { AgencyTypeBadge } from '@/components/admin/AgencyTypeBadge';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Building2, Package, FileText, Clock, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      agencyService.getAll(),
      resourceService.getAll(),
      requestService.getAll(),
    ]).then(([a, r, req]) => {
      setAgencies(a);
      setResources(r);
      setRequests(req);
      setLoading(false);
    });
  }, []);

  const totalAgencies = agencies.length;
  const totalResources = resources.length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;

  const stats = [
    { label: 'Total Agencies', value: totalAgencies, icon: <Building2 size={20} />, color: 'text-[#475569]', bg: 'bg-[#F1F5F9]' },
    { label: 'Total Resources', value: totalResources, icon: <Package size={20} />, color: 'text-[#0D9488]', bg: 'bg-[#CCFBF1]' },
    { label: 'Total Requests', value: totalRequests, icon: <FileText size={20} />, color: 'text-[#1E40AF]', bg: 'bg-[#DBEAFE]' },
    { label: 'Pending', value: pendingRequests, icon: <Clock size={20} />, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
  ];

  // Agency type breakdown
  const typeCounts = agencies.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  // Request status breakdown
  const statusCounts = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Admin Dashboard</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Overview of platform activity and agency status</p>
        </div>
        <Button onClick={() => navigate('/admin/agencies')} className="gap-1.5">
          <Building2 size={16} />
          Manage Agencies
        </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Agency Breakdown */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Agencies by Type</h3>
          <div className="space-y-3">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AgencyTypeBadge type={type as Agency['type']} />
                </div>
                <span className="text-sm font-medium text-[#0F172A]">{count}</span>
              </div>
            ))}
            {Object.keys(typeCounts).length === 0 && !loading && (
              <p className="text-xs text-[#94A3B8] text-center py-4">No agencies yet</p>
            )}
          </div>
        </div>

        {/* Request Status Breakdown */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Request Status</h3>
          <div className="space-y-3">
            {['pending', 'approved', 'in_progress', 'fulfilled', 'declined'].map((status) => {
              const count = statusCounts[status] || 0;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status as Request['status']} />
                  <span className="text-sm font-medium text-[#0F172A]">{count}</span>
                </div>
              );
            })}
            {Object.keys(statusCounts).length === 0 && !loading && (
              <p className="text-xs text-[#94A3B8] text-center py-4">No requests yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Agencies */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#0F172A]">All Agencies</h3>
          <button
            onClick={() => navigate('/admin/agencies')}
            className="flex items-center gap-1 text-xs text-[#1E40AF] hover:text-[#2563EB] transition-colors"
          >
            Manage <ArrowRight size={12} />
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFC]">
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Type</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Contact</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Resources</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[#94A3B8]">
                  Loading...
                </TableCell>
              </TableRow>
            ) : agencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-[#94A3B8]">
                  No agencies yet
                </TableCell>
              </TableRow>
            ) : (
              agencies.map((agency) => {
                const resourceCount = resources.filter((r) => r.agencyId === agency.id).length;
                return (
                  <TableRow key={agency.id}>
                    <TableCell>
                      <p className="font-medium text-[#0F172A] text-sm">{agency.name}</p>
                    </TableCell>
                    <TableCell>
                      <AgencyTypeBadge type={agency.type} />
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">{agency.contactPerson}</TableCell>
                    <TableCell className="text-sm text-[#64748B]">{resourceCount}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
