import type { ResourceType } from './resource';

export type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'fulfilled' | 'declined';
export type Urgency = 'critical' | 'high' | 'medium' | 'low';

export interface Request {
  id: string;
  trackingId: string;
  citizenName: string;
  citizenPhone: string;
  resourceType: ResourceType;
  description: string;
  urgency: Urgency;
  location: string;
  pocAgencyId: string;
  targetAgencyId: string | null;
  status: RequestStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
