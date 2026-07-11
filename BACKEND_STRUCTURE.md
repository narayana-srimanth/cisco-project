# Backend Structure Guide — Disaster Resource Exchange Platform

> This document outlines how to structure a backend API that matches the frontend's service layer contracts.

---

## Recommended Tech Stack

| Choice | Details |
|---|---|
| Runtime | Node.js 18+ (or any language you prefer) |
| Framework | Express.js / Fastify / NestJS |
| Database | PostgreSQL (recommended) or MongoDB |
| ORM | Prisma (recommended) or Drizzle |
| Auth | JWT + bcrypt (simple) or Passport.js |
| Validation | Zod (matches TypeScript types cleanly) |

---

## Database Schema

### agencies

```sql
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('police','fire','hospital','ngo','volunteer','government')),
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('admin','poc','owner')),
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### resources

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('vehicle','medical','food','shelter','personnel','equipment')),
  quantity INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  description TEXT DEFAULT '',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### requests

```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(30) UNIQUE NOT NULL,
  citizen_name VARCHAR(255) NOT NULL,
  citizen_phone VARCHAR(50) NOT NULL,
  resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('vehicle','medical','food','shelter','personnel','equipment')),
  description TEXT NOT NULL,
  urgency VARCHAR(10) NOT NULL CHECK (urgency IN ('critical','high','medium','low')),
  location VARCHAR(255) NOT NULL,
  poc_agency_id UUID NOT NULL REFERENCES agencies(id),
  target_agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  status VARCHAR(15) DEFAULT 'pending' CHECK (status IN ('pending','approved','in_progress','fulfilled','declined')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Project Structure (Node.js/Express + Prisma)

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script (populate mock data)
├── src/
│   ├── index.ts               # Entry point (Express app setup)
│   ├── routes/
│   │   ├── auth.routes.ts     # POST /api/auth/login
│   │   ├── agency.routes.ts   # CRUD /api/agencies
│   │   ├── resource.routes.ts # CRUD /api/resources
│   │   └── request.routes.ts  # CRUD /api/requests + /api/track/:trackingId
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── agency.controller.ts
│   │   ├── resource.controller.ts
│   │   └── request.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── agency.service.ts
│   │   ├── resource.service.ts
│   │   └── request.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── role.middleware.ts   # Role-based access control
│   │   └── validate.middleware.ts # Zod validation
│   ├── lib/
│   │   └── prisma.ts           # Prisma client singleton
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── package.json
├── tsconfig.json
└── .env                        # DATABASE_URL, JWT_SECRET
```

---

## API Endpoints (Matching Frontend Contracts)

### Authentication

| Method | Endpoint | Auth | Body | Response | Notes |
|--------|----------|------|------|----------|-------|
| POST | `/api/auth/login` | No | `{ email, password }` | `{ user: { id, name, email, role, agencyId } }` | Return JWT in cookie or header |
| GET | `/api/auth/me` | Yes | — | `{ user: User }` | Get current user from JWT |

### Agencies

| Method | Endpoint | Auth | Query | Body | Response |
|--------|----------|------|-------|------|----------|
| GET | `/api/agencies` | Yes | `?type=&search=` | — | `Agency[]` |
| GET | `/api/agencies/:id` | Yes | — | — | `Agency` |
| POST | `/api/agencies` | Admin | — | `{ name, type, contactPerson, phone, email, address }` | `Agency` |
| PUT | `/api/agencies/:id` | Admin | — | `{ ...partial Agency }` | `Agency` |
| DELETE | `/api/agencies/:id` | Admin | — | — | `void` |

### Resources

| Method | Endpoint | Auth | Query | Body | Response |
|--------|----------|------|-------|------|----------|
| GET | `/api/resources` | Yes | `?agencyId=&type=&search=` | — | `Resource[]` |
| GET | `/api/resources/:id` | Yes | — | — | `Resource` |
| POST | `/api/resources` | Owner | — | `{ name, type, quantity, unit, agencyId, description, available }` | `Resource` |
| PUT | `/api/resources/:id` | Owner | — | `{ ...partial Resource }` | `Resource` |
| DELETE | `/api/resources/:id` | Owner | — | — | `void` |

**Owner restriction:** Can only CRUD resources where `resource.agencyId === user.agencyId`.

### Requests

| Method | Endpoint | Auth | Query | Body | Response |
|--------|----------|------|-------|------|----------|
| GET | `/api/requests` | Yes | `?status=&urgency=&pocAgencyId=&type=` | — | `Request[]` |
| GET | `/api/requests/:id` | Yes | — | — | `Request` |
| POST | `/api/requests` | POC | — | `{ citizenName, citizenPhone, resourceType, description, urgency, location, pocAgencyId, targetAgencyId? }` | `Request` |
| PUT | `/api/requests/:id` | Yes | — | `{ status, notes? }` | `Request` |

**POC restriction:** `pocAgencyId` must match the requesting user's agency.
**Status update rules:**
- `pending` → `approved` or `declined` (Resource Owner)
- `approved` → `in_progress` (Resource Owner)
- `in_progress` → `fulfilled` (Resource Owner)

### Tracking (Public — No Auth)

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/track/:trackingId` | — | `Request` |

---

## Role-Based Access Control

```typescript
// Middleware pattern
function requireRole(...roles: string[]) {
  return (req, res, next) => {
    const user = req.user; // from JWT
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
router.post('/agencies', requireRole('admin'), createAgency);
router.post('/resources', requireRole('owner'), createResource);
router.put('/requests/:id', requireRole('owner', 'poc'), updateRequest);
```

---

## Request Validation (Zod)

```typescript
import { z } from 'zod';

export const createRequestSchema = z.object({
  citizenName: z.string().min(1).max(255),
  citizenPhone: z.string().min(1).max(50),
  resourceType: z.enum(['vehicle', 'medical', 'food', 'shelter', 'personnel', 'equipment']),
  description: z.string().min(1),
  urgency: z.enum(['critical', 'high', 'medium', 'low']),
  location: z.string().min(1).max(255),
  pocAgencyId: z.string().uuid(),
  targetAgencyId: z.string().uuid().nullable().optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'in_progress', 'fulfilled', 'declined']),
  notes: z.string().optional(),
});
```

---

## Tracking ID Generation

```typescript
import crypto from 'crypto';

function generateTrackingId(): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TRK-${year}-${random}`;
}
```

---

## CORS Configuration

```typescript
// Allow frontend dev server
app.use(cors({
  origin: 'http://localhost:5173',  // Vite dev server
  credentials: true,               // Allow cookies
}));
```

---

## Frontend Integration Steps

1. **Create the backend** following the structure above
2. **Update `src/services/index.ts`** to import real API services:

```typescript
// Instead of:
import { mockAgencyService } from './mock/agencyMock';
export const agencyService = mockAgencyService;

// Use:
import { apiAgencyService } from './api/agencyApi';
export const agencyService = apiAgencyService;
```

3. **Create API service files** in `src/services/api/`:

```typescript
// src/services/api/agencyApi.ts
import type { Agency } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiAgencyService = {
  async getAll(params?: { type?: string; search?: string }): Promise<Agency[]> {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/api/agencies?${query}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch agencies');
    return res.json();
  },
  // ... other methods
};
```

4. **No changes needed** in any components, pages, or hooks — the service layer abstraction handles it.

---

## Environment Variables

```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/drep
JWT_SECRET=your-super-secret-key
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

---

## Seed Data

Use the existing mock data from `frontend/src/data/` to seed the database:
- `agencies.ts` — 6 agencies
- `users.ts` — 6 users (passwords should be bcrypt-hashed)
- `resources.ts` — 15 resources
- `requests.ts` — 8 requests

This ensures the frontend works identically with the real backend.
