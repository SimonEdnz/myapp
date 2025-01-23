import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { HamContext } from "../HamContextProvider";
import jasmineImage from "./../assets/jasmine.png";

function Header(props) {
  const { hamActive, hamHandler } = useContext(HamContext);
  const user = JSON.parse(localStorage.getItem("whom")).userType;

  return (
    <nav
      style={{
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      className="w-full sticky top-0 z-50 h-16"
    >
      <div className="flex items-center justify-between px-6 h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-full"
            src={jasmineImage}
            alt="Jasmine Icon"
          />
          <h1
            style={{ fontFamily: "'Poppins', sans-serif" }}
            className="text-lg md:text-2xl font-bold text-white ml-4"
          >
            Rental Management System
          </h1>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={hamHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hamburger Menu */}
      {hamActive && (
        <div
          style={{
            transform: hamActive ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            background: "#f1f5f9",
            boxShadow: "2px 0 6px rgba(0, 0, 0, 0.1)",
          }}
          className="fixed top-16 left-0 w-64 h-full z-40 p-6"
        >
          <ul className="space-y-6">
            {props.forHam &&
              props.forHam.map((ele, index) => (
                <li key={index} className="text-left">
                  <NavLink
                    to={`/${user}/${ele.replace(/\s/g, "").toLowerCase()}`}
                    onClick={hamHandler}
                    className="block w-full text-sm font-medium text-gray-800 hover:text-blue-600"
                  >
                    {ele}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Header;
