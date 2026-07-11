import type { Request, RequestStatus } from '@/types';
import type { RequestService } from '../requestService';
import { mockRequests } from '@/data/requests';

let requests = [...mockRequests];

export const mockRequestService: RequestService = {
  async getAll(params?: { status?: string; urgency?: string; pocAgencyId?: string; type?: string }): Promise<Request[]> {
    let result = [...requests];
    if (params?.status) {
      result = result.filter((r) => r.status === params.status);
    }
    if (params?.urgency) {
      result = result.filter((r) => r.urgency === params.urgency);
    }
    if (params?.pocAgencyId) {
      result = result.filter((r) => r.pocAgencyId === params.pocAgencyId);
    }
    if (params?.type) {
      result = result.filter((r) => r.resourceType === params.type);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Request> {
    const req = requests.find((r) => r.id === id);
    if (!req) throw new Error('Request not found');
    return req;
  },

  async getByTrackingId(trackingId: string): Promise<Request | null> {
    return requests.find((r) => r.trackingId === trackingId) ?? null;
  },

  async create(data: Omit<Request, 'id' | 'trackingId' | 'status' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<Request> {
    const now = new Date().toISOString();
    const trackingId = `TRK-2026-${String(requests.length + 1).padStart(3, '0')}`;
    const newReq: Request = {
      ...data,
      id: `req${requests.length + 1}`,
      trackingId,
      status: 'pending',
      notes: '',
      createdAt: now,
      updatedAt: now,
    };
    requests.push(newReq);
    return newReq;
  },

  async updateStatus(id: string, status: RequestStatus, notes?: string): Promise<Request> {
    const idx = requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    requests[idx] = {
      ...requests[idx],
      status,
      notes: notes ?? requests[idx].notes,
      updatedAt: new Date().toISOString(),
    };
    return requests[idx];
  },
};
