import { useState, useEffect } from 'react';
import type { Agency, Resource, Request } from '@/types';
import { agencyService, resourceService, requestService } from '@/services';
import {
  Building2, Package, FileText, Users, CheckCircle2, Clock, XCircle,
} from 'lucide-react';

export default function Analytics() {
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

  // Agency stats
  const agencyTypeCounts = agencies.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  // Resource stats
  const resourceTypeCounts = resources.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});
  const availableResources = resources.filter((r) => r.available).length;
  const totalQuantity = resources.reduce((sum, r) => sum + r.quantity, 0);

  // Request stats
  const statusCounts = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const urgencyCounts = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.urgency] = (acc[r.urgency] || 0) + 1;
    return acc;
  }, {});
  const resourceTypeRequestCounts = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.resourceType] = (acc[r.resourceType] || 0) + 1;
    return acc;
  }, {});

  const statusList = [
    { key: 'pending', label: 'Pending', color: 'bg-[#D97706]', textColor: 'text-[#D97706]', icon: <Clock size={16} /> },
    { key: 'approved', label: 'Approved', color: 'bg-[#1E40AF]', textColor: 'text-[#1E40AF]', icon: <CheckCircle2 size={16} /> },
    { key: 'in_progress', label: 'In Progress', color: 'bg-[#7C3AED]', textColor: 'text-[#7C3AED]', icon: <Clock size={16} /> },
    { key: 'fulfilled', label: 'Fulfilled', color: 'bg-[#16A34A]', textColor: 'text-[#16A34A]', icon: <CheckCircle2 size={16} /> },
    { key: 'declined', label: 'Declined', color: 'bg-[#DC2626]', textColor: 'text-[#DC2626]', icon: <XCircle size={16} /> },
  ];

  const typeLabels: Record<string, string> = {
    police: 'Police', fire: 'Fire', hospital: 'Hospital', ngo: 'NGO', volunteer: 'Volunteer', government: 'Government',
    vehicle: 'Vehicle', medical: 'Medical', food: 'Food', shelter: 'Shelter', personnel: 'Personnel', equipment: 'Equipment',
    critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0F172A]">Analytics & Reporting</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Platform-wide metrics and performance insights</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F5F9] text-[#475569] mb-3">
            <Building2 size={20} />
          </span>
          <p className="text-2xl font-bold text-[#0F172A]">{loading ? '—' : agencies.length}</p>
          <p className="text-xs text-[#64748B] mt-0.5">Total Agencies</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#CCFBF1] text-[#0D9488] mb-3">
            <Package size={20} />
          </span>
          <p className="text-2xl font-bold text-[#0F172A]">{loading ? '—' : resources.length}</p>
          <p className="text-xs text-[#64748B] mt-0.5">Total Resources</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#1E40AF] mb-3">
            <FileText size={20} />
          </span>
          <p className="text-2xl font-bold text-[#0F172A]">{loading ? '—' : requests.length}</p>
          <p className="text-xs text-[#64748B] mt-0.5">Total Requests</p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#16A34A] mb-3">
            <Users size={20} />
          </span>
          <p className="text-2xl font-bold text-[#0F172A]">{loading ? '—' : totalQuantity.toLocaleString()}</p>
          <p className="text-xs text-[#64748B] mt-0.5">Total Quantity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Request Status Distribution */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Request Status Distribution</h3>
          <div className="space-y-3">
            {statusList.map((s) => {
              const count = statusCounts[s.key] || 0;
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={s.textColor}>{s.icon}</span>
                      <span className="text-sm text-[#0F172A]">{s.label}</span>
                    </div>
                    <span className="text-sm font-medium text-[#0F172A]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color} transition-all`}
                      style={{ width: `${requests.length > 0 ? (count / requests.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agencies by Type */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Agencies by Type</h3>
          <div className="space-y-3">
            {Object.entries(agencyTypeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#0F172A]">{typeLabels[type] || type}</span>
                  <span className="text-sm font-medium text-[#0F172A]">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#475569] transition-all"
                    style={{ width: `${agencies.length > 0 ? (count / agencies.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(agencyTypeCounts).length === 0 && !loading && (
              <p className="text-xs text-[#94A3B8] text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Resources by Type */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Resources by Type</h3>
          <div className="space-y-3">
            {Object.entries(resourceTypeCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#0F172A]">{typeLabels[type] || type}</span>
                  <span className="text-sm font-medium text-[#0F172A]">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0D9488] transition-all"
                    style={{ width: `${resources.length > 0 ? (count / resources.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            {Object.keys(resourceTypeCounts).length === 0 && !loading && (
              <p className="text-xs text-[#94A3B8] text-center py-4">No data yet</p>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Available / Total</span>
              <span className="font-medium text-[#0F172A]">{availableResources} / {resources.length}</span>
            </div>
          </div>
        </div>

        {/* Requests by Urgency */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Requests by Urgency</h3>
          <div className="space-y-3">
            {['critical', 'high', 'medium', 'low'].map((urgency) => {
              const count = urgencyCounts[urgency] || 0;
              const colors: Record<string, string> = {
                critical: 'bg-[#DC2626]', high: 'bg-[#D97706]', medium: 'bg-[#1E40AF]', low: 'bg-[#64748B]',
              };
              return (
                <div key={urgency}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#0F172A]">{typeLabels[urgency]}</span>
                    <span className="text-sm font-medium text-[#0F172A]">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[urgency]} transition-all`}
                      style={{ width: `${requests.length > 0 ? (count / requests.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-[#E2E8F0]">
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Requests by Resource Type</h4>
            <div className="space-y-2">
              {Object.entries(resourceTypeRequestCounts).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-xs text-[#0F172A]">{typeLabels[type] || type}</span>
                  <span className="text-xs font-medium text-[#0F172A]">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
