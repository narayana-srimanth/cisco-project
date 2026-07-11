import type { Agency } from '@/types';

export interface AgencyService {
  getAll(params?: { type?: string; search?: string }): Promise<Agency[]>;
  getById(id: string): Promise<Agency>;
  create(agency: Omit<Agency, 'id'>): Promise<Agency>;
  update(id: string, agency: Partial<Agency>): Promise<Agency>;
  delete(id: string): Promise<void>;
}
