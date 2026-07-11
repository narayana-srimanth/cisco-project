import { useState, useEffect, useCallback } from 'react';
import type { Resource } from '@/types';
import { resourceService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { ResourceTypeBadge, resourceTypeOptions } from '@/components/owner/ResourceTypeBadge';
import { ResourceFormDialog } from '@/components/owner/ResourceFormDialog';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Search, Pencil, Trash2, Package, ChevronDown } from 'lucide-react';

export default function ManageResources() {
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? '';
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    const params: { agencyId: string; type?: string; search?: string } = { agencyId };
    if (typeFilter !== 'all') params.type = typeFilter;
    if (search.trim()) params.search = search.trim();
    const data = await resourceService.getAll(params);
    setResources(data);
    setLoading(false);
  }, [typeFilter, search, agencyId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await resourceService.delete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    fetchResources();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Manage Resources</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Add, update, or remove your resource listings</p>
        </div>
        <Button
          onClick={() => { setEditResource(null); setFormOpen(true); }}
          className="gap-1.5"
        >
          <Plus size={16} />
          Add Resource
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
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Quantity</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider">Description</TableHead>
              <TableHead className="text-[#64748B] font-medium text-xs uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-[#94A3B8]">
                  Loading resources...
                </TableCell>
              </TableRow>
            ) : resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
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
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => { setEditResource(resource); setFormOpen(true); }}
                        title="Edit"
                      >
                        <Pencil size={14} className="text-[#64748B]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(resource)}
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
        {!loading && resources.length > 0 && (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
            <p className="text-xs text-[#94A3B8]">{resources.length} {resources.length === 1 ? 'resource' : 'resources'} total</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <ResourceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        resource={editResource}
        agencyId={agencyId}
        onSaved={fetchResources}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
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
