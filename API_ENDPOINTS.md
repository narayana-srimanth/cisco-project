# API Endpoints — Disaster Resource Exchange Platform

> Frontend expects these endpoints. All request/response bodies are JSON.
> When the mock service is swapped for real API calls, these are the contracts.

## Authentication

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| POST | `/api/auth/login` | `{ email, password }` | `{ user: User }` | Authenticate user, return user object |

## Agencies

| Method | Endpoint | Query Params | Body | Response | Description |
|--------|----------|-------------|------|----------|-------------|
| GET | `/api/agencies` | `?type=&search=` | — | `Agency[]` | List all agencies (optional filters) |
| POST | `/api/agencies` | — | `{ name, type, contactPerson, phone, email, address }` | `Agency` | Create a new agency |
| PUT | `/api/agencies/:id` | — | `{ ...partial Agency }` | `Agency` | Update an agency |
| DELETE | `/api/agencies/:id` | — | — | `void` | Delete an agency |

## Resources

| Method | Endpoint | Query Params | Body | Response | Description |
|--------|----------|-------------|------|----------|-------------|
| GET | `/api/resources` | `?agencyId=&type=&search=` | — | `Resource[]` | List all resources (optional filters) |
| POST | `/api/resources` | — | `{ name, type, quantity, unit, agencyId, description, available }` | `Resource` | Publish a new resource |
| PUT | `/api/resources/:id` | — | `{ ...partial Resource }` | `Resource` | Update a resource |
| DELETE | `/api/resources/:id` | — | — | `void` | Remove a resource |

## Requests

| Method | Endpoint | Query Params | Body | Response | Description |
|--------|----------|-------------|------|----------|-------------|
| GET | `/api/requests` | `?status=&urgency=&pocAgencyId=&type=` | — | `Request[]` | List requests (filtered by role context) |
| POST | `/api/requests` | — | `{ citizenName, citizenPhone, resourceType, description, urgency, location, pocAgencyId, targetAgencyId? }` | `Request` | Submit a new request. `targetAgencyId` is null for shared board. |
| PUT | `/api/requests/:id` | — | `{ status, notes? }` | `Request` | Update request status (approve/decline/fulfill) |

## Tracking (Public — No Auth)

| Method | Endpoint | Body | Response | Description |
|--------|----------|------|----------|-------------|
| GET | `/api/track/:trackingId` | — | `Request` | Look up request by tracking ID for citizens |

---

## Types Reference

### User
```json
{ "id": "u1", "name": "...", "email": "...", "role": "admin" | "poc" | "owner", "agencyId": "a1" | null }
```

### Agency
```json
{ "id": "a1", "name": "...", "type": "police" | "fire" | "hospital" | "ngo" | "volunteer" | "government", "contactPerson": "...", "phone": "...", "email": "...", "address": "..." }
```

### Resource
```json
{ "id": "r1", "name": "...", "type": "vehicle" | "medical" | "food" | "shelter" | "personnel" | "equipment", "quantity": 10, "unit": "...", "agencyId": "a1", "description": "...", "available": true }
```

### Request
```json
{ "id": "req1", "trackingId": "TRK-2026-001", "citizenName": "...", "citizenPhone": "...", "resourceType": "medical", "description": "...", "urgency": "critical" | "high" | "medium" | "low", "location": "...", "pocAgencyId": "a1", "targetAgencyId": "a3" | null, "status": "pending" | "approved" | "in_progress" | "fulfilled" | "declined", "notes": "...", "createdAt": "ISO", "updatedAt": "ISO" }
```

---

## Total Endpoints: 11

When ready to integrate a backend:
1. Replace mock implementations in `src/services/mock/` with real `fetch`/`axios` calls
2. Update `src/services/index.ts` to import the real services
3. No changes needed in components, hooks, or pages
