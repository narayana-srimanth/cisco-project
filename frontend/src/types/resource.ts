export type ResourceType = 'vehicle' | 'medical' | 'food' | 'shelter' | 'personnel' | 'equipment';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  quantity: number;
  unit: string;
  agencyId: string;
  description: string;
  available: boolean;
}
