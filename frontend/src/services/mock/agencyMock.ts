import type { Agency } from '@/types';
import type { AgencyService } from '../agencyService';
import { mockAgencies } from '@/data/agencies';

let agencies = [...mockAgencies];

export const mockAgencyService: AgencyService = {
  async getAll(params?: { type?: string; search?: string }): Promise<Agency[]> {
    let result = [...agencies];
    if (params?.type) {
      result = result.filter((a) => a.type === params.type);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.contactPerson.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getById(id: string): Promise<Agency> {
    const agency = agencies.find((a) => a.id === id);
    if (!agency) throw new Error('Agency not found');
    return agency;
  },

  async create(agency: Omit<Agency, 'id'>): Promise<Agency> {
    const newAgency: Agency = { ...agency, id: `a${agencies.length + 1}` };
    agencies.push(newAgency);
    return newAgency;
  },

  async update(id: string, updates: Partial<Agency>): Promise<Agency> {
    const idx = agencies.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Agency not found');
    agencies[idx] = { ...agencies[idx], ...updates };
    return agencies[idx];
  },

  async delete(id: string): Promise<void> {
    agencies = agencies.filter((a) => a.id !== id);
  },
};
