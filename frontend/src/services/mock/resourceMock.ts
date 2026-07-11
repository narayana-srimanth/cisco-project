import type { Resource } from '@/types';
import type { ResourceService } from '../resourceService';
import { mockResources } from '@/data/resources';

let resources = [...mockResources];

export const mockResourceService: ResourceService = {
  async getAll(params?: { agencyId?: string; type?: string; search?: string }): Promise<Resource[]> {
    let result = [...resources];
    if (params?.agencyId) {
      result = result.filter((r) => r.agencyId === params.agencyId);
    }
    if (params?.type) {
      result = result.filter((r) => r.type === params.type);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getById(id: string): Promise<Resource> {
    const resource = resources.find((r) => r.id === id);
    if (!resource) throw new Error('Resource not found');
    return resource;
  },

  async create(resource: Omit<Resource, 'id'>): Promise<Resource> {
    const newResource: Resource = { ...resource, id: `r${resources.length + 1}` };
    resources.push(newResource);
    return newResource;
  },

  async update(id: string, updates: Partial<Resource>): Promise<Resource> {
    const idx = resources.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Resource not found');
    resources[idx] = { ...resources[idx], ...updates };
    return resources[idx];
  },

  async delete(id: string): Promise<void> {
    resources = resources.filter((r) => r.id !== id);
  },
};
