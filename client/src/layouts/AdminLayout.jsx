// layouts/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function AdminLayout({ children, sidebarLinks }) {
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

export default AdminLayout;
