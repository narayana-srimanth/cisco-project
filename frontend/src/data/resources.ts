import type { Resource } from '@/types';

export const mockResources: Resource[] = [
  { id: 'r1', name: 'Ambulance', type: 'vehicle', quantity: 3, unit: 'units', agencyId: 'a1', description: 'Fully equipped ambulances with paramedic staff', available: true },
  { id: 'r2', name: 'First Aid Kits', type: 'medical', quantity: 50, unit: 'kits', agencyId: 'a1', description: 'Standard first aid kits for minor injuries', available: true },
  { id: 'r3', name: 'Portable Oxygen Cylinders', type: 'medical', quantity: 20, unit: 'cylinders', agencyId: 'a1', description: 'Emergency oxygen supply cylinders', available: true },
  { id: 'r4', name: 'Patrol Vehicles', type: 'vehicle', quantity: 5, unit: 'units', agencyId: 'a2', description: 'Police patrol vehicles for area security', available: true },
  { id: 'r5', name: 'Communication Radios', type: 'equipment', quantity: 30, unit: 'units', agencyId: 'a2', description: 'Two-way radios for field coordination', available: true },
  { id: 'r6', name: 'Emergency Food Packs', type: 'food', quantity: 500, unit: 'packs', agencyId: 'a3', description: 'Ready-to-eat meals (24hr supply per person)', available: true },
  { id: 'r7', name: 'Blankets', type: 'shelter', quantity: 200, unit: 'pieces', agencyId: 'a3', description: 'Thermal blankets for displaced families', available: true },
  { id: 'r8', name: 'Tarpaulin Sheets', type: 'shelter', quantity: 100, unit: 'sheets', agencyId: 'a3', description: 'Waterproof sheets for temporary shelter', available: true },
  { id: 'r9', name: 'Fire Trucks', type: 'vehicle', quantity: 2, unit: 'units', agencyId: 'a4', description: 'Fire engines with water tanks and rescue equipment', available: true },
  { id: 'r10', name: 'Rescue Equipment Set', type: 'equipment', quantity: 4, unit: 'sets', agencyId: 'a4', description: 'Jaws of life, ropes, helmets, and harnesses', available: true },
  { id: 'r11', name: 'Volunteer Workers', type: 'personnel', quantity: 40, unit: 'people', agencyId: 'a5', description: 'Trained disaster response volunteers', available: true },
  { id: 'r12', name: 'Water Tanker', type: 'vehicle', quantity: 2, unit: 'units', agencyId: 'a5', description: '10,000 litre water tankers for relief supply', available: true },
  { id: 'r13', name: 'Generator Sets', type: 'equipment', quantity: 6, unit: 'units', agencyId: 'a6', description: 'Diesel generators for emergency power supply', available: true },
  { id: 'r14', name: 'Relief Camp Tents', type: 'shelter', quantity: 30, unit: 'tents', agencyId: 'a6', description: 'Large family-sized tents for relief camps', available: true },
  { id: 'r15', name: 'Drinking Water Bottles', type: 'food', quantity: 1000, unit: 'bottles', agencyId: 'a6', description: '1L sealed drinking water bottles', available: true },
];
