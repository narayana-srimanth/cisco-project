import type { User } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Suresh Jadhav', email: 'admin@ddma.gov.in', role: 'admin', agencyId: 'a6' },
  { id: 'u2', name: 'Dr. Sunita Sharma', email: 'sunita@cityhospital.org', role: 'poc', agencyId: 'a1' },
  { id: 'u3', name: 'Inspector Rajesh Kumar', email: 'rajesh@punepolice.gov.in', role: 'poc', agencyId: 'a2' },
  { id: 'u4', name: 'Amit Patel', email: 'amit@redcrossrelief.org', role: 'owner', agencyId: 'a3' },
  { id: 'u5', name: 'Captain Deepak Verma', email: 'deepak@punefire.gov.in', role: 'poc', agencyId: 'a4' },
  { id: 'u6', name: 'Priya Deshmukh', email: 'priya@sevabharti.org', role: 'owner', agencyId: 'a5' },
];
