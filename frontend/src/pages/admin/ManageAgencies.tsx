import { useState, useEffect, useCallback } from 'react';
import type { Agency } from '@/types';
import { agencyService } from '@/services';
import { AgencyTypeBadge, agencyTypeOptions } from '@/components/admin/AgencyTypeBadge';
import { AgencyFormDialog } from '@/components/admin/AgencyFormDialog';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2, Building2, ChevronDown } from 'lucide-react';

export default function ManageAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editAgency, setEditAgency] = useState<Agency | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Agency | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    const params: { type?: string; search?: string } = {};
    if (typeFilter !== 'all') params.type = typeFilter;
    if (search.trim()) params.search = search.trim();
    const data = await agencyService.getAll(params);
    setAgencies(data);
    setLoading(false);
  }, [typeFilter, search]);

  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await agencyService.delete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    fetchAgencies();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Manage Agencies</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Add, edit, or remove disaster-response organizations</p>
        </div>
        <Button
          onClick={() => { setEditAgency(null); setFormOpen(true); }}
          className="gap-1.5"
        >
          <Plus size={16} />
          Add Agency
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            placeholder="Search agencies..."
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
            {agencyTypeOptions.map((opt) => (
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
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Contact Person</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Phone</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Email</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Address</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-[#94A3B8]">
                  Loading agencies...
                </TableCell>
              </TableRow>
            ) : agencies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Building2 size={32} className="mx-auto mb-2 text-[#CBD5E1]" />
                  <p className="text-sm text-[#64748B]">No agencies found</p>
                  <p className="text-xs text-[#94A3B8] mt-1">Try adjusting your search or filter</p>
                </TableCell>
              </TableRow>
            ) : (
              agencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell>
                    <p className="font-medium text-[#0F172A] text-sm">{agency.name}</p>
                  </TableCell>
                  <TableCell>
                    <AgencyTypeBadge type={agency.type} />
                  </TableCell>
                  <TableCell className="text-sm text-[#64748B]">{agency.contactPerson}</TableCell>
                  <TableCell className="text-sm text-[#64748B] font-mono text-xs">{agency.phone}</TableCell>
                  <TableCell className="text-sm text-[#64748B] text-xs">{agency.email}</TableCell>
                  <TableCell className="text-sm text-[#64748B] max-w-[180px] truncate text-xs">{agency.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => { setEditAgency(agency); setFormOpen(true); }}
                        title="Edit"
                      >
                        <Pencil size={14} className="text-[#64748B]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(agency)}
                        title="Delete"
                      >
                        <Trash2 size={14} className="text-[#DC2626]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && agencies.length > 0 && (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
            <p className="text-xs text-[#94A3B8]">{agencies.length} {agencies.length === 1 ? 'agency' : 'agencies'} total</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <AgencyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        agency={editAgency}
        onSaved={fetchAgencies}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Agency</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
