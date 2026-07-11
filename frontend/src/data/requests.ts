import type { Request } from '@/types';

export const mockRequests: Request[] = [
  {
    id: 'req1', trackingId: 'TRK-2026-001', citizenName: 'Meena Kumari', citizenPhone: '+91-9123456780',
    resourceType: 'medical', description: 'Elderly patient needs immediate oxygen supply',
    urgency: 'critical', location: 'Kothrud, Pune', pocAgencyId: 'a1', targetAgencyId: 'a6',
    status: 'approved', notes: 'Oxygen cylinders dispatched', createdAt: '2026-07-10T08:30:00Z', updatedAt: '2026-07-10T09:15:00Z',
  },
  {
    id: 'req2', trackingId: 'TRK-2026-002', citizenName: 'Ravi Patil', citizenPhone: '+91-9123456781',
    resourceType: 'food', description: 'Family of 5 stranded, needs food supplies',
    urgency: 'high', location: 'Hadapsar, Pune', pocAgencyId: 'a2', targetAgencyId: null,
    status: 'pending', notes: '', createdAt: '2026-07-10T09:00:00Z', updatedAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'req3', trackingId: 'TRK-2026-003', citizenName: 'Anjali Desai', citizenPhone: '+91-9123456782',
    resourceType: 'shelter', description: 'Displaced family needs temporary shelter for 4 members',
    urgency: 'high', location: 'Shivaji Nagar, Pune', pocAgencyId: 'a2', targetAgencyId: 'a3',
    status: 'in_progress', notes: 'Tarpaulin and blankets being arranged', createdAt: '2026-07-10T07:00:00Z', updatedAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'req4', trackingId: 'TRK-2026-004', citizenName: 'Suresh Yadav', citizenPhone: '+91-9123456783',
    resourceType: 'vehicle', description: 'Need vehicle to evacuate elderly residents from flooded area',
    urgency: 'critical', location: 'Wanowrie, Pune', pocAgencyId: 'a4', targetAgencyId: 'a2',
    status: 'pending', notes: '', createdAt: '2026-07-10T10:30:00Z', updatedAt: '2026-07-10T10:30:00Z',
  },
  {
    id: 'req5', trackingId: 'TRK-2026-005', citizenName: 'Farhan Shaikh', citizenPhone: '+91-9123456784',
    resourceType: 'personnel', description: 'Need volunteers for search and rescue in collapsed building area',
    urgency: 'critical', location: 'Camp, Pune', pocAgencyId: 'a4', targetAgencyId: 'a5',
    status: 'approved', notes: '15 volunteers assigned', createdAt: '2026-07-10T06:00:00Z', updatedAt: '2026-07-10T08:00:00Z',
  },
  {
    id: 'req6', trackingId: 'TRK-2026-006', citizenName: 'Kavita Joshi', citizenPhone: '+91-9123456785',
    resourceType: 'food', description: 'Community kitchen needs large water supply',
    urgency: 'medium', location: 'Deccan, Pune', pocAgencyId: 'a1', targetAgencyId: null,
    status: 'fulfilled', notes: 'Water tanker delivered', createdAt: '2026-07-09T14:00:00Z', updatedAt: '2026-07-09T18:00:00Z',
  },
  {
    id: 'req7', trackingId: 'TRK-2026-007', citizenName: 'Nikhil Gupta', citizenPhone: '+91-9123456786',
    resourceType: 'equipment', description: 'Need generators for temporary medical camp',
    urgency: 'high', location: 'Viman Nagar, Pune', pocAgencyId: 'a2', targetAgencyId: 'a6',
    status: 'declined', notes: 'All generators deployed to critical zones', createdAt: '2026-07-10T11:00:00Z', updatedAt: '2026-07-10T12:00:00Z',
  },
  {
    id: 'req8', trackingId: 'TRK-2026-008', citizenName: 'Priyanka Nair', citizenPhone: '+91-9123456787',
    resourceType: 'medical', description: 'Need first aid kits for relief camp housing 200 people',
    urgency: 'medium', location: 'Aundh, Pune', pocAgencyId: 'a1', targetAgencyId: 'a1',
    status: 'approved', notes: '20 kits allocated', createdAt: '2026-07-10T13:00:00Z', updatedAt: '2026-07-10T13:30:00Z',
  },
];
