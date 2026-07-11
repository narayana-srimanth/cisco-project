import type { AuthService } from './authService';
import type { AgencyService } from './agencyService';
import type { ResourceService } from './resourceService';
import type { RequestService } from './requestService';

import { mockAuthService } from './mock/authMock';
import { mockAgencyService } from './mock/agencyMock';
import { mockResourceService } from './mock/resourceMock';
import { mockRequestService } from './mock/requestMock';

export const authService: AuthService = mockAuthService;
export const agencyService: AgencyService = mockAgencyService;
export const resourceService: ResourceService = mockResourceService;
export const requestService: RequestService = mockRequestService;

export type { AuthService } from './authService';
export type { AgencyService } from './agencyService';
export type { ResourceService } from './resourceService';
export type { RequestService } from './requestService';
