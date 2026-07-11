export type AgencyType = 'police' | 'fire' | 'hospital' | 'ngo' | 'volunteer' | 'government';

export interface Agency {
  id: string;
  name: string;
  type: AgencyType;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}
