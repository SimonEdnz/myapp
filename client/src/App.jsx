import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Auth from "./components/Auth";
import OwnerDetails from "./components/OwnerDetails";
import TenantDetails from "./components/TenantDetails";
import CreatingOwner from "./components/CreatingOwner";
import CreatingParkingSlot from "./components/CreatingParkingSlot";
import ComplaintsViewer from "./components/ComplaintsViewer";
import RaisingComplaints from "./components/RaisingComplaints";
import ParkingSlot from "./components/ParkingSlot";
import PayMaintenance from "./components/PayMaintenance";
import CreatingTenant from "./components/CreatingTenant";
import RoomDetails from "./components/RoomDetails";
import ErrorPage from "./ErrorPage";
import ComplaintsViewerOwner from "./components/ComplaintsViewerOwner";
import RoomDetailsOwner from "./components/RoomDetailsOwner";

function App() {
  // Sidebar configuration
  const routesConfig = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: "📊" },
      { name: "Tenant Details", path: "/admin/tenantdetails", icon: "👤" },
      { name: "Owner Details", path: "/admin/ownerdetails", icon: "🏠" },
      { name: "Create Owner", path: "/admin/createowner", icon: "➕" },
      { name: "Allot Parking Slot", path: "/admin/allottingparkingslot", icon: "🅿️" },
      { name: "Complaints", path: "/admin/complaints", icon: "📋" },
      { name: "Logout", path: "/", icon: "🚪" },
    ],
    employee: [
      { name: "Dashboard", path: "/employee", icon: "📊" },
      { name: "Complaints", path: "/employee/complaints", icon: "📋" },
      { name: "Logout", path: "/", icon: "🚪" },
    ],
    tenant: [
      { name: "Dashboard", path: "/tenant", icon: "📊" },
      { name: "Raise Complaints", path: "/tenant/raisingcomplaints", icon: "📋" },
      { name: "Parking Slot", path: "/tenant/allotedparkingslot", icon: "🅿️" },
      { name: "Pay Maintenance", path: "/tenant/paymaintenance", icon: "💳" },
      { name: "Logout", path: "/", icon: "🚪" },
    ],
    owner: [
      { name: "Dashboard", path: "/owner", icon: "📊" },
      { name: "Tenant Details", path: "/owner/tenantdetails", icon: "👤" },
      { name: "Complaints", path: "/owner/complaint", icon: "📋" },
      { name: "Create Tenant", path: "/owner/createtenant", icon: "➕" },
      { name: "Room Details", path: "/owner/roomdetails", icon: "🛏️" },
      { name: "Logout", path: "/", icon: "🚪" },
    ],
  };

  return (
    <div className="App font-mons bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/admin/*"
          element={
            <MainLayout sidebarLinks={routesConfig.admin}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="tenantdetails" element={<TenantDetails />} />
                <Route path="ownerdetails" element={<OwnerDetails />} />
                <Route path="createowner" element={<CreatingOwner />} />
                <Route path="allottingparkingslot" element={<CreatingParkingSlot />} />
                <Route path="complaints" element={<ComplaintsViewer />} />
              </Routes>
            </MainLayout>
          }
        />
        <Route
          path="/employee/*"
          element={
            <MainLayout sidebarLinks={routesConfig.employee}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="complaints" element={<ComplaintsViewer />} />
              </Routes>
            </MainLayout>
          }
        />
        <Route
          path="/tenant/*"
          element={
            <MainLayout sidebarLinks={routesConfig.tenant}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="raisingcomplaints" element={<RaisingComplaints />} />
                <Route path="allotedparkingslot" element={<ParkingSlot />} />
                <Route path="paymaintenance" element={<PayMaintenance />} />
              </Routes>
            </MainLayout>
          }
        />
        <Route
          path="/owner/*"
          element={
            <MainLayout sidebarLinks={routesConfig.owner}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="tenantdetails" element={<RoomDetailsOwner />} />
                <Route path="complaint" element={<ComplaintsViewerOwner />} />
                <Route path="createtenant" element={<CreatingTenant />} />
                <Route path="roomdetails" element={<RoomDetails />} />
              </Routes>
            </MainLayout>
          }
        />
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

// Main layout with modern sidebar and header
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

export default App;
