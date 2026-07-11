# Disaster Resource Exchange Platform (DREP)

A centralized coordination platform for disaster response. Emergency agencies (police, fire, hospitals, NGOs, volunteer groups, government) can publish resources, discover resources across agencies, submit requests, and approve/decline requests.

## Tech Stack

| Choice | Details |
|---|---|
| Framework | React 18+ with Vite, TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (uses @base-ui/react primitives) |
| Charts | MUI X Charts |
| Router | React Router v7 |
| State | React Context + hooks |
| Icons | Lucide React |

## How to Run

```bash
cd frontend
npm install
npm run dev
```

- Dev server: http://localhost:5173
- Build: `npm run build`
- Typecheck: `npx tsc --noEmit`

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (runs tsc + vite) |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Run Oxlint |

## User Roles

| Role | Access |
|---|---|
| **Admin** | Manage agencies, view analytics |
| **Coordinator (POC)** | Submit requests on behalf of citizens, browse resources, track request status |
| **Resource Owner** | Publish resources, approve/decline incoming requests |
| **Citizen** | Track request status via tracking ID at `/track` (no login required) |

## Project Structure

```
src/
├── types/              # TypeScript interfaces (Agency, Resource, Request, User)
├── services/           # Service layer (mock → swap to real API here)
│   ├── mock/           # Mock data implementations
│   └── index.ts        # Export point — swap mock for real API
├── data/               # Static mock data
├── context/            # AuthContext (useAuth hook)
├── components/
│   ├── ui/             # shadcn components
│   ├── layout/         # AuthGuard, RoleLayout (sidebar + topbar)
│   ├── StatusBadge.tsx # Request status badge
│   ├── UrgencyBadge.tsx # Request urgency badge
│   ├── admin/          # AgencyTypeBadge, AgencyFormDialog
│   └── owner/          # ResourceTypeBadge, ResourceFormDialog
└── pages/
    ├── Login.tsx
    ├── Analytics.tsx
    ├── admin/          # AdminDashboard, ManageAgencies
    ├── poc/            # POCDashboard, CreateRequest, ResourceCatalog, MyRequests
    ├── owner/          # OwnerDashboard, ManageResources, IncomingRequests
    └── citizen/        # TrackRequest
```

## Screens

| Screen | Route | Role |
|---|---|---|
| Login | `/login` | Public |
| Admin Dashboard | `/admin/dashboard` | Admin |
| Manage Agencies | `/admin/agencies` | Admin |
| Analytics | `/analytics` | Admin |
| POC Dashboard | `/poc/dashboard` | Coordinator |
| Create Request | `/poc/request/new` | Coordinator |
| Resource Catalog | `/poc/resources` | Coordinator |
| My Requests | `/poc/requests` | Coordinator |
| Owner Dashboard | `/owner/dashboard` | Resource Owner |
| Manage Resources | `/owner/resources` | Resource Owner |
| Incoming Requests | `/owner/requests` | Resource Owner |
| Track Request | `/track` | Public (no login) |

## Backend Integration

The frontend uses a service layer abstraction. To integrate a real backend:

1. Create API service files in `src/services/api/`
2. Update `src/services/index.ts` to import real services instead of mock
3. No changes needed in components, pages, or hooks

See `BACKEND_STRUCTURE.md` and `API_ENDPOINTS.md` in the project root for backend architecture and API contracts.
