import { useState, useEffect } from 'react';
import type { Resource, ResourceType } from '@/types';
import { resourceService } from '@/services';
import { resourceTypeOptions } from './ResourceTypeBadge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';

interface ResourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource | null;
  agencyId: string;
  onSaved: () => void;
}

const emptyForm = {
  name: '',
  type: 'vehicle' as ResourceType,
  quantity: 1,
  unit: 'units',
  description: '',
  available: true,
};

export function ResourceFormDialog({ open, onOpenChange, resource, agencyId, onSaved }: ResourceFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (resource) {
      setForm({
        name: resource.name,
        type: resource.type,
        quantity: resource.quantity,
        unit: resource.unit,
        description: resource.description,
        available: resource.available,
      });
    } else {
      setForm(emptyForm);
    }
  }, [resource, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (resource) {
        await resourceService.update(resource.id, { ...form, agencyId });
      } else {
        await resourceService.create({ ...form, agencyId });
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{resource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Resource Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ambulance, First Aid Kits"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Resource Type</Label>
            <div className="relative">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })}
                className="flex h-8 w-full appearance-none items-center rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-8 text-sm text-[#0F172A] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
              >
                {resourceTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="e.g. units, kits, people"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description of the resource"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="h-4 w-4 rounded border-[#E2E8F0] text-[#1E40AF] focus:ring-[#1E40AF]/20"
            />
            <Label htmlFor="available" className="text-sm font-normal">Available for requests</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : resource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
