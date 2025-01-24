import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import TenantDetails from "./components/TenantDetails";
import ComplaintsViewer from "./components/ComplaintsViewer";
import BranchList from "./components/BranchList";
import CreateBranch from "./components/CreateBranch";
import UpdateDeleteBranch from "./components/UpdateDeleteBranch";
import RoomList from "./components/RoomList";
import InvoiceList from "./components/InvoiceList";
import LeaseAgreementList from "./components/LeaseAgreementList";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import Expenses from "./components/Expenses";
import RoomDetailsOwner from "./components/RoomDetailsOwner"; // Import RoomDetailsOwner component
import ErrorPage from "./ErrorPage";

// Sidebar configuration for admin routes
const adminRoutes = [
  { name: "Dashboard", path: "/admin", icon: "📊" },
  { name: "Tenant Details", path: "/admin/tenantdetails", icon: "👤" },
  { name: "Complaints", path: "/admin/complaints", icon: "📋" },
  { name: "Branches", path: "/admin/branches", icon: "🌿" },
  { name: "Rooms", path: "/admin/rooms", icon: "🛏️" },
  { name: "Invoices", path: "/admin/invoices", icon: "💵" },
  { name: "Lease Agreements", path: "/admin/leaseagreements", icon: "📜" },
  { name: "Notifications", path: "/admin/notifications", icon: "🔔" },
  { name: "Settings", path: "/settings", icon: "⚙️" },
  { name: "Expenses", path: "/expenses", icon: "💸" },
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
  { name: "Complaints", path: "/tenant/complaints", icon: "📋" },
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
                <Route path="complaints" element={<ComplaintsViewer />} />
                <Route path="branches" element={<BranchList />} />
                <Route path="createbranch" element={<CreateBranch />} />
                <Route path="updatebranch" element={<UpdateDeleteBranch />} />
                <Route path="rooms" element={<RoomList />} />
                <Route path="invoices" element={<InvoiceList />} />
                <Route path="leaseagreements" element={<LeaseAgreementList />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="expenses" element={<Expenses />} />
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
                <Route path="complaints" element={<ComplaintsViewer />} />
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
                <Route path="complaints" element={<ComplaintsViewer />} />
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
                <Route path="tenantdetails" element={<RoomDetailsOwner />} />
                <Route path="roomdetails" element={<RoomDetailsOwner />} />
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