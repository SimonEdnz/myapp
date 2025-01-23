import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ links }) {
  return (
    <aside className="bg-blue-700 text-white w-64 min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <nav className="space-y-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg ${
                isActive ? "bg-blue-500" : "hover:bg-blue-600"
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
