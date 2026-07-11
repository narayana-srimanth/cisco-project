export type UserRole = 'admin' | 'poc' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agencyId: string | null;
}
