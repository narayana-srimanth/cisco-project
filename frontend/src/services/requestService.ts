import type { Request, RequestStatus } from '@/types';

export interface RequestService {
  getAll(params?: { status?: string; urgency?: string; pocAgencyId?: string; type?: string }): Promise<Request[]>;
  getById(id: string): Promise<Request>;
  getByTrackingId(trackingId: string): Promise<Request | null>;
  create(request: Omit<Request, 'id' | 'trackingId' | 'status' | 'notes' | 'createdAt' | 'updatedAt'>): Promise<Request>;
  updateStatus(id: string, status: RequestStatus, notes?: string): Promise<Request>;
}
