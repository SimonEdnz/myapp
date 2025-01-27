import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import TenantDetails from "./components/TenantDetails";
import BranchList from "./components/BranchManagement";
import UpdateDeleteBranch from "./components/UpdateDeleteBranch";
import RoomList from "./components/RoomList";
import BranchManagement from './components/BranchManagement';
import BranchDetails from './components/BranchDetails';
import Settings from "./components/Settings";
import Complaints from "./components/ComplaintsManagement";
import TenantManagement from "./components/TenantManagement";
import ErrorPage from "./ErrorPage";
import ComplaintsManagement from "./components/ComplaintsManagement";

// Sidebar configuration for admin routes
const adminRoutes = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Tenant Details", path: "/admin/tenantdetails", icon: "👤" },
  { name: "Branches", path: "/admin/branches", icon: "🌿" },
  {name: "Complaints", path: "/admin/complaints", icon: "📋"},
  { name: "Rooms", path: "/admin/rooms", icon: "🛏️" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
  { name: "Logout", path: "/", icon: "🚪" },
];

// Sidebar configuration for employee routes
const employeeRoutes = [
  { name: "Dashboard", path: "/employee", icon: "📊" },
  { name: "Complaints", path: "/employee/complaints", icon: "📋" },
  { name: "Logout", path: "/", icon: "🚪" },
];

// Sidebar configuration for tenant routes
const tenantRoutes = [
  { name: "Dashboard", path: "/tenant", icon: "📊" },
  {name: "Complaints", path: "/tenant/complaints", icon: "📋"},
  { name: "Logout", path: "/", icon: "🚪" },
];

// Sidebar configuration for owner routes
const ownerRoutes = [
  { name: "Dashboard", path: "/owner", icon: "📊" },
  { name: "Tenant Details", path: "/owner/tenantdetails", icon: "👤" },
  { name: "Complaints", path: "/owner/complaints", icon: "📋" },
  { name: "Room Details", path: "/owner/roomdetails", icon: "🛏️" },
  { name: "Logout", path: "/", icon: "🚪" },
];

// Main layout with sidebar and header
function MainLayout({ sidebarLinks, children }) {
  return (
    <div className="flex">
      <Sidebar links={sidebarLinks} />
      <div className="flex-grow">
        <Header />
        <main className="p-5">{children}</main>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <div className="App font-mons bg-gray-100 min-h-screen">
      <Routes>
        {/* Authentication Route */}
        <Route path="/" element={<Auth />} />

        {/* Admin Dashboard and Routes */}
        <Route
          path="/admin/*"
          element={
            <MainLayout sidebarLinks={adminRoutes}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="tenantdetails" element={<TenantDetails />} />
                <Route path="branches" element={<BranchManagement />} />
                <Route path="branches/:branchId/details" element={<BranchDetails />} />
                <Route path="branches/:branchId/details/tenants" element={<TenantManagement />} />
                <Route path="updatebranch" element={<UpdateDeleteBranch />} />
                <Route path="rooms" element={<RoomList />} />
                <Route path="complaints" element={<ComplaintsManagement />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <MainLayout sidebarLinks={employeeRoutes}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </MainLayout>
          }
        />

        {/* Tenant Routes */}
        <Route
          path="/tenant/*"
          element={
            <MainLayout sidebarLinks={tenantRoutes}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </MainLayout>
          }
        />

        {/* Owner Routes */}
        <Route
          path="/owner/*"
          element={
            <MainLayout sidebarLinks={ownerRoutes}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </MainLayout>
          }
        />

        {/* 404 Error Route */}
        <Route
          path="*"
          element={
            <main>
              <ErrorPage />
            </main>
          }
        />
      </Routes>
    </div>
  );
}

export default App;