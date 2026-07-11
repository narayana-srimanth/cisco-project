import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResourceType, Urgency, Agency } from '@/types';
import { requestService, agencyService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { resourceTypeOptions } from '@/components/owner/ResourceTypeBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, FilePlus, CheckCircle2, Copy } from 'lucide-react';

export default function CreateRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    citizenName: '',
    citizenPhone: '',
    resourceType: 'medical' as ResourceType,
    description: '',
    urgency: 'medium' as Urgency,
    location: '',
    targetAgencyId: '',
  });

  useEffect(() => {
    agencyService.getAll().then(setAgencies);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.agencyId) return;
    setSaving(true);
    try {
      const result = await requestService.create({
        citizenName: form.citizenName,
        citizenPhone: form.citizenPhone,
        resourceType: form.resourceType,
        description: form.description,
        urgency: form.urgency,
        location: form.location,
        pocAgencyId: user.agencyId,
        targetAgencyId: form.targetAgencyId || null,
      });
      setSuccess(result.trackingId);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const copyTrackingId = () => {
    if (success) navigator.clipboard.writeText(success);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7] mx-auto mb-4">
          <CheckCircle2 size={32} className="text-[#16A34A]" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] mb-2">Request Submitted</h2>
        <p className="text-sm text-[#64748B] mb-6">Share this tracking ID with the citizen</p>
        <div className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 mb-6">
          <span className="font-mono text-lg font-semibold text-[#1E40AF]">{success}</span>
          <button onClick={copyTrackingId} className="text-[#64748B] hover:text-[#1E40AF] transition-colors" title="Copy">
            <Copy size={16} />
          </button>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => navigate('/poc/requests')}>
            View My Requests
          </Button>
          <Button onClick={() => { setSuccess(null); setForm({ citizenName: '', citizenPhone: '', resourceType: 'medical', description: '', urgency: 'medium', location: '', targetAgencyId: '' }); }}>
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0F172A]">Create Resource Request</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Submit a resource request on behalf of a citizen</p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="citizenName">Citizen Name</Label>
              <Input
                id="citizenName"
                value={form.citizenName}
                onChange={(e) => setForm({ ...form, citizenName: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="citizenPhone">Phone</Label>
              <Input
                id="citizenPhone"
                value={form.citizenPhone}
                onChange={(e) => setForm({ ...form, citizenPhone: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Resource Type</Label>
              <div className="relative">
                <select
                  value={form.resourceType}
                  onChange={(e) => setForm({ ...form, resourceType: e.target.value as ResourceType })}
                  className="flex h-8 w-full appearance-none items-center rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-8 text-sm text-[#0F172A] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
                >
                  {resourceTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <div className="relative">
                <select
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value as Urgency })}
                  className="flex h-8 w-full appearance-none items-center rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-8 text-sm text-[#0F172A] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Kothrud, Pune"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Target Agency (optional)</Label>
            <div className="relative">
              <select
                value={form.targetAgencyId}
                onChange={(e) => setForm({ ...form, targetAgencyId: e.target.value })}
                className="flex h-8 w-full appearance-none items-center rounded-lg border border-[#E2E8F0] bg-white pl-3 pr-8 text-sm text-[#0F172A] focus:border-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20"
              >
                <option value="">Shared Board (all agencies)</option>
                {agencies.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            </div>
            <p className="text-[11px] text-[#94A3B8]">Leave empty to post on the shared resource board</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the resource need in detail"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="gap-1.5">
              <FilePlus size={16} />
              {saving ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
