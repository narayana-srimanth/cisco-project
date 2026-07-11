# HANDOFF.md — Disaster Resource Exchange Platform (Frontend)

> **Purpose:** This document gives a new LLM model full context to continue building the frontend.
> Read this first, then look at the referenced files.

---

## 1. Project Overview

A centralized coordination platform for disaster response. Emergency agencies (police, fire, hospitals, NGOs, volunteer groups, government) can publish resources, discover resources across agencies, submit requests, and approve/decline requests.

**3 User Roles:**
- **Admin** — Manages agencies, views analytics
- **POC (Coordinator)** — Hospital/police/fire staff. Submits requests on behalf of citizens, browses resources, requests from specific agencies
- **Resource Owner** — NGO/volunteer org. Publishes resources, approves/declines incoming requests

**Citizen** — No login. Can track request status via tracking ID at `/track`.

---

## 2. Tech Stack

| Choice | Details |
|---|---|
| Framework | React 18+ with Vite, TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (uses @base-ui/react primitives, NOT Radix) |
| Charts | MUI + MUI X Charts (for analytics later) |
| Router | React Router v7 (react-router-dom) |
| State | React Context + hooks |
| Icons | Lucide React |
| Mock Data | Static data in `src/data/`, services in `src/services/` |

**IMPORTANT: shadcn uses @base-ui/react, NOT Radix.** The Dialog, Select, Table components use `@base-ui/react` primitives. The base-ui Select component has a known issue where it shows the raw `value` attribute in the trigger instead of the item text. **Use native HTML `<select>` elements instead of the shadcn Select component for dropdowns.** See `ManageAgencies.tsx` for the pattern.

---

## 3. How to Run

```bash
cd frontend
npm install
npm run dev
```

To build: `npm run build`
To typecheck: `npx tsc --noEmit`

---

## 4. Style Guide

### Color Palette (Monochromatic black/white + blue accents)

| Token | Hex | Usage |
|---|---|---|
| Primary | `#1E40AF` | Buttons, links, active states |
| Primary Hover | `#2563EB` | Hover states |
| Primary Light | `#DBEAFE` | Active nav bg, highlights |
| Background | `#FFFFFF` | Page bg |
| Surface | `#F8FAFC` | Card bg, sidebar alt |
| Sidebar | `#0F172A` | Dark sidebar |
| Sidebar Text | `#CBD5E1` | Sidebar inactive text |
| Text Primary | `#0F172A` | Headings |
| Text Secondary | `#64748B` | Descriptions |
| Text Tertiary | `#94A3B8` | Placeholders |
| Border | `#E2E8F0` | Dividers, card borders |
| Danger | `#DC2626` | Delete, errors |
| Success | `#16A34A` | Fulfilled states |
| Warning | `#D97706` | Pending states |

### Role Colors

| Role | Color | Hex |
|---|---|---|
| Admin | Slate | `#475569` |
| POC | Deep Blue | `#1E40AF` |
| Resource Owner | Teal | `#0D9488` |

### Typography
- Font: Geist Sans (already configured via shadcn)
- H1: 20px, font-bold, `text-[#0F172A]`
- H2: 16px, font-semibold
- Body: 14px (text-sm)
- Small: 12-13px (text-xs)
- Mono: Geist Mono (for tracking IDs)

### Layout
- Page padding: `p-6`
- Card border radius: `rounded-xl` (12px)
- Card border: `border border-[#E2E8F0] bg-white shadow-sm`
- Sidebar width: 256px (w-64)
- Top bar height: 64px (h-16)

### Component Patterns

**Page header:**
```tsx
<div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-xl font-bold text-[#0F172A]">Page Title</h2>
    <p className="text-sm text-[#64748B] mt-0.5">Subtitle text</p>
  </div>
  <Button className="gap-1.5"><Plus size={16} /> Action</Button>
</div>
```

**Filter bar:**
```tsx
<div className="flex items-center gap-3 mb-4">
  <div className="relative flex-1 max-w-xs">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
    <Input placeholder="Search..." className="pl-9" />
  </div>
  {/* Native select for filters (NOT shadcn Select) */}
</div>
```

**Table container:**
```tsx
<div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
  <Table>...</Table>
  <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
    <p className="text-xs text-[#94A3B8]">X items total</p>
  </div>
</div>
```

**Type badge (pill):**
```tsx
<span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[color] text-[color]">
  {icon} {label}
</span>
```

**Form dialog:**
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Fields */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

**Status badge:**
```tsx
// Pending: text-[#D97706] bg-[#FEF3C7]
// Approved: text-[#1E40AF] bg-[#DBEAFE]
// In Progress: text-[#7C3AED] bg-[#EDE9FE]
// Fulfilled: text-[#16A34A] bg-[#DCFCE7]
// Declined: text-[#DC2626] bg-[#FEE2E2]
```

---

## 5. Architecture

### Directory Structure
```
frontend/src/
├── types/                     # TypeScript interfaces
│   ├── agency.ts              # AgencyType, Agency
│   ├── resource.ts            # ResourceType, Resource
│   ├── request.ts             # RequestStatus, Urgency, Request
│   ├── user.ts                # UserRole, User
│   └── index.ts               # Re-exports all
├── services/                  # Service layer (swap mock → real API later)
│   ├── agencyService.ts       # Interface: getAll, getById, create, update, delete
│   ├── resourceService.ts     # Interface: getAll, getById, create, update, delete
│   ├── requestService.ts      # Interface: getAll, getById, getByTrackingId, create, updateStatus
│   ├── authService.ts         # Interface: login, logout, getCurrentUser
│   ├── index.ts               # Exports mock implementations (swap here for backend)
│   └── mock/                  # Mock implementations
│       ├── agencyMock.ts
│       ├── resourceMock.ts
│       ├── requestMock.ts
│       └── authMock.ts
├── data/                      # Static mock data
│   ├── agencies.ts            # 6 agencies
│   ├── resources.ts           # 15 resources across agencies
│   ├── requests.ts            # 8 requests in various states
│   └── users.ts               # 6 users (2 admin, 2 poc, 2 owner)
├── context/
│   └── AuthContext.tsx         # useAuth() → { user, login(role), logout, isLoading }
├── components/
│   ├── ui/                    # shadcn components (button, card, dialog, table, input, etc.)
│   ├── layout/
│   │   ├── AuthGuard.tsx      # Redirects to /login if not authenticated
│   │   └── RoleLayout.tsx     # Dark sidebar + topbar + <Outlet />
│   └── admin/
│       ├── AgencyTypeBadge.tsx  # Color-coded badge + agencyTypeOptions
│       └── AgencyFormDialog.tsx # Add/edit agency modal
├── pages/
│   ├── Login.tsx              # ✅ DONE — Role selection cards
│   ├── Analytics.tsx          # 🔲 Placeholder
│   ├── admin/
│   │   ├── AdminDashboard.tsx # 🔲 Placeholder
│   │   └── ManageAgencies.tsx # ✅ DONE — Full CRUD table
│   ├── poc/
│   │   ├── POCDashboard.tsx   # 🔲 Placeholder
│   │   ├── CreateRequest.tsx  # 🔲 Placeholder
│   │   ├── ResourceCatalog.tsx# 🔲 Placeholder
│   │   └── MyRequests.tsx     # 🔲 Placeholder
│   ├── owner/
│   │   ├── OwnerDashboard.tsx # 🔲 Placeholder
│   │   ├── ManageResources.tsx# 🔲 Placeholder
│   │   └── IncomingRequests.tsx# 🔲 Placeholder
│   └── citizen/
│       └── TrackRequest.tsx   # ✅ DONE — Public tracking page
├── App.tsx                    # React Router setup with all routes
├── main.tsx                   # Entry point
└── index.css                  # Tailwind + shadcn theme (all color vars)
```

### Service Pattern (Backend-Ready)
```
Component → useAuth() / useAgencies() → authService / agencyService → mock implementation
                                                                          ↓
                                                              src/services/index.ts
                                                              (swap mock → real API here)
```

**When integrating a backend:**
1. Create real service files in `src/services/api/`
2. Update `src/services/index.ts` to import real services instead of mock
3. No changes needed in components, pages, or hooks

---

## 6. TypeScript Types

```typescript
// agency.ts
type AgencyType = 'police' | 'fire' | 'hospital' | 'ngo' | 'volunteer' | 'government';
interface Agency {
  id: string; name: string; type: AgencyType; contactPerson: string;
  phone: string; email: string; address: string;
}

// resource.ts
type ResourceType = 'vehicle' | 'medical' | 'food' | 'shelter' | 'personnel' | 'equipment';
interface Resource {
  id: string; name: string; type: ResourceType; quantity: number; unit: string;
  agencyId: string; description: string; available: boolean;
}

// request.ts
type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'fulfilled' | 'declined';
type Urgency = 'critical' | 'high' | 'medium' | 'low';
interface Request {
  id: string; trackingId: string; citizenName: string; citizenPhone: string;
  resourceType: ResourceType; description: string; urgency: Urgency;
  location: string; pocAgencyId: string; targetAgencyId: string | null;
  status: RequestStatus; notes: string; createdAt: string; updatedAt: string;
}

// user.ts
type UserRole = 'admin' | 'poc' | 'owner';
interface User {
  id: string; name: string; email: string; role: UserRole; agencyId: string | null;
}
```

---

## 7. Mock Data

### Agencies (6)
| ID | Name | Type |
|---|---|---|
| a1 | City Central Hospital | hospital |
| a2 | Pune City Police - Station 5 | police |
| a3 | Red Cross Relief Society | ngo |
| a4 | Pune Fire Station - Unit 3 | fire |
| a5 | Seva Bharti Volunteer Group | volunteer |
| a6 | District Disaster Management Authority | government |

### Users (6)
| ID | Name | Role | Agency |
|---|---|---|---|
| u1 | Suresh Jadhav | admin | a6 (DDMA) |
| u2 | Dr. Sunita Sharma | poc | a1 (Hospital) |
| u3 | Inspector Rajesh Kumar | poc | a2 (Police) |
| u4 | Amit Patel | owner | a3 (Red Cross) |
| u5 | Captain Deepak Verma | poc | a4 (Fire) |
| u6 | Priya Deshmukh | owner | a5 (Seva Bharti) |

### Resources (15)
- a1 (Hospital): Ambulance, First Aid Kits, Oxygen Cylinders
- a2 (Police): Patrol Vehicles, Communication Radios
- a3 (Red Cross): Food Packs, Blankets, Tarpaulin Sheets
- a4 (Fire): Fire Trucks, Rescue Equipment
- a5 (Seva Bharti): Volunteer Workers, Water Tanker
- a6 (DDMA): Generator Sets, Relief Camp Tents, Water Bottles

### Requests (8)
Various statuses: pending, approved, in_progress, fulfilled, declined.
POC agencies (a1, a2, a4) submit requests. Target agencies vary (some null = shared board).

---

## 8. What's Built (✅) vs What's Remaining (🔲)

### ✅ Done
1. **Project scaffolding** — Vite, Tailwind, shadcn, MUI, React Router
2. **TypeScript types** — All entity interfaces
3. **Service layer** — Mock implementations with full CRUD
4. **Auth** — AuthContext with role-based login/logout
5. **Login page** — Role selection cards, redirects to dashboards
6. **Layout** — Dark sidebar, role-based nav, topbar, mobile responsive
7. **Admin → Manage Agencies** — Full CRUD table with search, filter, add/edit/delete
8. **Citizen → Track Request** — Public tracking page (no auth)
9. **Style guide** — Blue-based palette, all colors defined

### 🔲 Remaining (build in this order)

#### Priority 1: Core Workflow
1. **Resource Owner → Manage Resources** — CRUD for publishing resources
2. **POC → Resource Catalog** — Browse/search resources across agencies, request from specific agency
3. **POC → Create Request** — Form to submit request on behalf of citizen (shared board or direct)
4. **Resource Owner → Incoming Requests** — Approve/decline requests from POCs

#### Priority 2: Dashboards
5. **POC → Dashboard** — My submitted requests, status overview, quick actions
6. **Resource Owner → Dashboard** — Published resources count, pending requests, fulfillment stats
7. **Admin → Dashboard** — Agency count, request overview, platform stats

#### Priority 3: Polish
8. **POC → My Requests** — Full list of submitted requests with status tracking
9. **Analytics** — Charts with MUI X Charts (requests over time, resource utilization, etc.)

---

## 9. Build Order for Next Screen: Resource Owner → Manage Resources

### What to build

**Files to create:**
1. `src/components/owner/ResourceTypeBadge.tsx` — Color-coded badge for resource types
2. `src/components/owner/ResourceFormDialog.tsx` — Add/edit resource modal
3. `src/pages/owner/ManageResources.tsx` — Full CRUD table page

**Files to modify:**
- None (all new files)

### ResourceTypeBadge colors
| Type | Color | Bg | Icon |
|---|---|---|---|
| vehicle | `#1E40AF` | `#DBEAFE` | `Car` |
| medical | `#0D9488` | `#CCFBF1` | `Heart` |
| food | `#D97706` | `#FEF3C7` | `UtensilsCrossed` |
| shelter | `#7C3AED` | `#EDE9FE` | `Home` |
| personnel | `#475569` | `#F1F5F9` | `Users` |
| equipment | `#DC2626` | `#FEE2E2` | `Wrench` |

### ResourceFormDialog fields
- Name (Input, required)
- Type (Native `<select>`, required) — use native select NOT shadcn Select
- Quantity (Input type=number, required)
- Unit (Input, required — e.g., "units", "kits", "people")
- Description (Textarea)
- Available (Checkbox or toggle)

### ManageResources table columns
| Column | Description |
|---|---|
| Name | Resource name (font-medium) |
| Type | ResourceTypeBadge |
| Quantity | `{quantity} {unit}` |
| Status | Available (green) / Unavailable (red) badge |
| Description | Truncated text, max-w |
| Actions | Edit (Pencil) + Delete (Trash2) buttons |

### Key behaviors
- Resources filtered by logged-in owner's `agencyId` (from `useAuth().user.agencyId`)
- Service call: `resourceService.getAll({ agencyId: user.agencyId })`
- Search by name/description
- Filter by resource type
- Add: opens empty form dialog, on save calls `resourceService.create()`
- Edit: opens pre-filled form dialog, on save calls `resourceService.update()`
- Delete: confirmation dialog, calls `resourceService.delete()`

### Reference implementation
Copy the pattern from `src/pages/admin/ManageAgencies.tsx` and adapt for resources. The structure is identical: header, filter bar, table, form dialog, delete dialog.

---

## 10. Routes

```tsx
// Public
/login          → Login page
/track          → Citizen tracking page

// Protected (inside AuthGuard + RoleLayout)
/admin/dashboard    → AdminDashboard (placeholder)
/admin/agencies     → ManageAgencies ✅
/poc/dashboard      → POCDashboard (placeholder)
/poc/request/new    → CreateRequest (placeholder)
/poc/resources      → ResourceCatalog (placeholder)
/poc/requests       → MyRequests (placeholder)
/owner/dashboard    → OwnerDashboard (placeholder)
/owner/resources    → ManageResources (placeholder)
/owner/requests     → IncomingRequests (placeholder)
/analytics          → Analytics (placeholder)

* → redirect to /login
```

---

## 11. API Endpoints (11 total)

See `API_ENDPOINTS.md` at project root for full documentation.

- `POST /api/auth/login`
- `GET /api/agencies` `?type=&search=`
- `POST /api/agencies`
- `PUT /api/agencies/:id`
- `DELETE /api/agencies/:id`
- `GET /api/resources` `?agencyId=&type=&search=`
- `POST /api/resources`
- `PUT /api/resources/:id`
- `DELETE /api/resources/:id`
- `GET /api/requests` `?status=&urgency=&pocAgencyId=&type=`
- `POST /api/requests`
- `PUT /api/requests/:id`
- `GET /api/track/:trackingId`

---

## 12. Important Notes

1. **DO NOT use shadcn Select component** — It has issues with base-ui rendering. Use native HTML `<select>` styled with Tailwind. See `ManageAgencies.tsx` line 78-91 for the pattern.

2. **All colors use hex values in Tailwind** — e.g., `text-[#1E40AF]`, `bg-[#F8FAFC]`, `border-[#E2E8F0]`. This is intentional for the style guide.

3. **Service layer is the only way to access data** — Never import from `src/data/` directly in components. Always use `agencyService`, `resourceService`, `requestService` from `@/services`.

4. **User's agencyId** — POC users have `agencyId` pointing to their agency. Resource Owner users also have `agencyId`. Use this to filter data (e.g., "show only my agency's resources").

5. **Run `npx tsc --noEmit` and `npm run build`** after making changes to verify no errors.

6. **shadcn components available:** button, card, input, label, badge, avatar, separator, sheet, dialog, table, textarea, select (DON'T USE SELECT).
