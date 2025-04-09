import React from "react";

export default function AuthLogo() {
  return (
    <div className="mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" className="w-40 mx-auto">
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "#0077B6" }} />
            <stop offset="100%" style={{ stopColor: "#023E8A" }} />
          </linearGradient>
        </defs>

        <text x="100" y="28" fontFamily="Poppins, Arial, sans-serif" fontSize="24" fill="url(#blueGradient)" textAnchor="middle" fontWeight="750" letterSpacing="7">
          OCULUS
        </text>

        <text x="100" y="45" fontFamily="Poppins, Arial, sans-serif" fontSize="10" fill="url(#blueGradient)" textAnchor="middle" letterSpacing="6">
          DIAGNOSTICS
        </text>
      </svg>
    </div>
  );
}
