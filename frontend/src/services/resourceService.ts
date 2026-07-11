import type { Resource } from '@/types';

export interface ResourceService {
  getAll(params?: { agencyId?: string; type?: string; search?: string }): Promise<Resource[]>;
  getById(id: string): Promise<Resource>;
  create(resource: Omit<Resource, 'id'>): Promise<Resource>;
  update(id: string, resource: Partial<Resource>): Promise<Resource>;
  delete(id: string): Promise<void>;
}
