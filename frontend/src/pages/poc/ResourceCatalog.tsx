import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Resource, Agency } from '@/types';
import { resourceService, agencyService } from '@/services';
import { ResourceTypeBadge, resourceTypeOptions } from '@/components/owner/ResourceTypeBadge';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, Package, Send } from 'lucide-react';

export default function ResourceCatalog() {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const agencyMap = agencies.reduce<Record<string, Agency>>((acc, a) => {
    acc[a.id] = a;
    return acc;
  }, {});

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params: { type?: string; search?: string } = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (search.trim()) params.search = search.trim();
    const [resData, agencyData] = await Promise.all([
      resourceService.getAll(params),
      agencyService.getAll(),
    ]);
    setResources(resData);
    setAgencies(agencyData);
    setLoading(false);
  }, [typeFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Resource Catalog</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Browse and request available resources across all agencies</p>
        </div>
        <Button onClick={() => navigate('/poc/request/new')} className="gap-1.5">
          <Send size={16} />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 appearance-none rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-8 text-sm text-[#0F172A] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
          >
            <option value="all">All Types</option>
            {resourceTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
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
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Type</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Agency</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Quantity</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Description</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#94A3B8]">
                  Loading resources...
                </TableCell>
              </TableRow>
            ) : resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Package size={32} className="mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="text-sm text-[#64748B]">No resources found</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Try adjusting your search or filter</p>
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <p className="font-medium text-[#0F172A] text-sm">{resource.name}</p>
                  </TableCell>
                  <TableCell>
                    <ResourceTypeBadge type={resource.type} />
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B]">
                    {agencyMap[resource.agencyId]?.name ?? 'Unknown'}
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B]">
                    {resource.quantity} {resource.unit}
                  </TableCell>
                  <TableCell>
                    {resource.available ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#16A34A] bg-[#DCFCE7]">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#DC2626] bg-[#FEE2E2]">
                        Unavailable
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B] max-w-[200px] truncate text-xs">
                    {resource.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-[#1E40AF] hover:text-[#2563EB]"
                      onClick={() => navigate('/poc/request/new')}
                      disabled={!resource.available}
                    >
                      <Send size={14} />
                      Request
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && resources.length > 0 && (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
            <p className="text-xs text-[#94A3B8]">{resources.length} {resources.length === 1 ? 'resource' : 'resources'} total</p>
          </div>
        )}
      </div>
    </div>
  );
}
