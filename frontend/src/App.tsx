import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard, RoleRedirect } from '@/components/layout/AuthGuard';
import { RoleLayout } from '@/components/layout/RoleLayout';
import Login from '@/pages/Login';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManageAgencies from '@/pages/admin/ManageAgencies';

// POC
import POCDashboard from '@/pages/poc/POCDashboard';
import CreateRequest from '@/pages/poc/CreateRequest';
import ResourceCatalog from '@/pages/poc/ResourceCatalog';
import MyRequests from '@/pages/poc/MyRequests';

// Resource Owner
import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import ManageResources from '@/pages/owner/ManageResources';
import IncomingRequests from '@/pages/owner/IncomingRequests';

// Shared
import Analytics from '@/pages/Analytics';
import TrackRequest from '@/pages/citizen/TrackRequest';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/track" element={<TrackRequest />} />

          {/* Protected routes — role-based layout */}
          <Route
            element={
              <AuthGuard>
                <RoleLayout />
              </AuthGuard>
            }
          >
            {/* Root redirect */}
            <Route index element={<RoleRedirect />} />

            {/* Admin */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/agencies" element={<ManageAgencies />} />

            {/* POC / Coordinator */}
            <Route path="poc/dashboard" element={<POCDashboard />} />
            <Route path="poc/request/new" element={<CreateRequest />} />
            <Route path="poc/resources" element={<ResourceCatalog />} />
            <Route path="poc/requests" element={<MyRequests />} />

            {/* Resource Owner */}
            <Route path="owner/dashboard" element={<OwnerDashboard />} />
            <Route path="owner/resources" element={<ManageResources />} />
            <Route path="owner/requests" element={<IncomingRequests />} />

            {/* Shared */}
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
