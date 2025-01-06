import React from "react";
import { NavLink, Link } from "react-router-dom";
import NavItem from "./NavItem";

const Navbar = () => {
  return (
    <header className="w-full lg:bg-white ">
      <nav className="container mx-0 px-4 py-2">
        <div className="hidden lg:flex items-center justify-between h-12">
          {/* Logo Container */}
          <div className="flex-shrink-0 w-48">
            <Link to="home">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 60"
                className="w-full"
              >
                <defs>
                  <linearGradient
                    id="blueGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" style={{ stopColor: "#0077B6" }} />
                    <stop offset="100%" style={{ stopColor: "#023E8A" }} />
                  </linearGradient>
                </defs>

                <text
                  x="100"
                  y="28"
                  fontFamily="Poppins, Arial, sans-serif"
                  fontSize="24"
                  fill="url(#blueGradient)"
                  textAnchor="middle"
                  fontWeight="750"
                  letterSpacing="7"
                >
                  OCULUS
                </text>

                <text
                  x="100"
                  y="45"
                  fontFamily="Poppins, Arial, sans-serif"
                  fontSize="10"
                  fill="url(#blueGradient)"
                  textAnchor="middle"
                  letterSpacing="6"
                >
                  DIAGNOSTICS
                </text>
              </svg>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            <NavItem to="home" label="Home"/>
            <NavItem to="profile" label="Profile"/>
            <NavItem to="result" label = "results"/>
          </div>

          <div className="flex space-x-2 items-center justify-center">
            <Link to="login">
              <div className="login-buttons ring-1 px-3 w-28 text-center py-3">
                Login
              </div>
            </Link>

            <Link to="signup">
              <div className="login-buttons ring-1 px-3 w-28 text-center py-3">
                SignUp
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
