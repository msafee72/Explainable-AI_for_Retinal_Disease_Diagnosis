import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext/AuthContext";
import { LogIn, LogOut, UserPlus, Menu } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // Only set scrolled state for styling purposes
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/home";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-auto w-full relative">
        <nav
          className={`
          flex items-center px-6 justify-between gap-4 duration-200 py-4 lg:h-16
          ${scrolled ? "bg-background/25 backdrop-blur-lg" : "bg-transparent"}
        `}
        >
          {/* Logo with White-Silver Gradient */}
          <Link to="/" aria-label="Oculus Diagnostics Homepage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 60"
              className="w-36 md:w-48"
            >
              <defs>
                <linearGradient
                  id="grayGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#374151" /> {/* gray-900 */}
                  <stop offset="100%" stopColor="#9CA3AF" /> {/* gray-400 */}
                </linearGradient>
              </defs>
              <text
                x="100"
                y="28"
                fontFamily="'Space Grotesk', monospace"
                fontSize="24"
                fill="url(#grayGradient)"
                textAnchor="middle"
                fontWeight="700"
                letterSpacing="7"
              >
                OCULUS
              </text>
              <text
                x="100"
                y="45"
                fontFamily="'Space Grotesk', monospace"
                fontSize="10"
                fill="url(#grayGradient)"
                textAnchor="middle"
                letterSpacing="6"
              >
                DIAGNOSTICS
              </text>
            </svg>
          </Link>

          {/* Navigation Links - Lighter color with brighter hover effect */}
          <ul className="ml-3 hidden flex-grow gap-4 lg:flex">
            <li>
              <Link
                to="/home"
                className=" mono-tag px-3 py-1.5 text-sm text-gray-400  hover:text-gray-100 transition-colors duration-200"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/upload"
                className=" mono-tag px-3 py-1.5 text-sm text-gray-400  hover:text-gray-100 transition-colors duration-200"
              >
                UPLOAD
              </Link>
            </li>
            <li>
              <Link
                to="/records"
                className="mono-tag px-3 py-1.5 text-sm text-gray-400  hover:text-gray-100 transition-colors duration-200"
              >
                RECORDS
              </Link>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="flex gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="relative isolate  hover:bg-gray-300 rounded-full  hover:text-gray-900 inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 px-4 py-2 sm:text-sm gap-x-3 bg-[--btn-bg] text-[--btn-text] border-[--btn-border] hover:bg-[--btn-hover] [--btn-bg:transparent] transition-colors duration-200"
                >
                  <span
                    className="absolute   left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  ></span>
                  PROFILE
                </Link>
                <button
                  onClick={handleLogout}
                  className="relative isolate inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 px-4 py-2 sm:text-sm gap-x-3 bg-[--btn-bg] text-[--btn-text] border-[--btn-border] hover:bg-[--btn-hover] hover:bg-gray-300 rounded-full hover:text-gray-900 transition-colors duration-200"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  ></span>
                  <LogOut size={16} className="mr-2" />
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative isolate inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 px-4 py-2 sm:text-sm gap-x-3 bg-[--btn-bg] text-[--btn-text] border-[--btn-border] hover:bg-gray-300 rounded-full  hover:text-gray-900 transition-colors duration-200"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  ></span>
                  <LogIn size={16} className="mr-2" />
                  LOG IN
                </Link>
                <Link
                  to="/signup"
                  className="relative isolate inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 px-4 py-2 sm:text-sm gap-x-3 bg-[--btn-bg] text-[--btn-text] border-[--btn-border] hover:bg-gray-300 rounded-full hover:text-gray-900 transition-colors duration-200"
                >
                  <span
                    className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                    aria-hidden="true"
                  ></span>
                  <UserPlus size={16} className="mr-2" />
                  SIGN UP
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <div className="visible lg:hidden">
              <button
                type="button"
                className="relative isolate inline-flex items-center justify-center border text-base/6 uppercase font-mono tracking-widest shrink-0 focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 data-[disabled]:opacity-50 aspect-square px-4 py-2 sm:text-sm gap-x-3 bg-[--btn-bg] text-[--btn-text] border-[--btn-border] hover:bg-[--btn-hover] rounded-full [--btn-bg:transparent] [--btn-border:theme(colors.primary/30%)] [--btn-text:theme(colors.primary)] [--btn-hover:theme(colors.cyan.400/20%)] hover:text-cyan-400 transition-colors duration-200"
              >
                <span
                  className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                  aria-hidden="true"
                ></span>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Import Space Grotesk font and add mono-tag style */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap");

        .mono-tag {
          font-family: "Space Mono", monospace;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 500;
        }

        :root {
          --primary: 0 0% 100%;
          --primary-hover: 40 18% 97%;
          --secondary: 216 4% 51%;
          --secondary-hover: 213 12% 70%;
          --btn-bg: transparent;
          --btn-border: rgba(255, 255, 255, 0.3);
          --btn-text: rgb(255, 255, 255);
          --btn-hover: rgba(34, 211, 238, 0.2);
        }
      `}</style>
    </header>
  );
};

export default Navbar;
