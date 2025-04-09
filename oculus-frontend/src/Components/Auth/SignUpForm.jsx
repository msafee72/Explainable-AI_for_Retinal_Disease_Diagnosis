import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext/AuthContext";
import InputField from "./InputField"; // Import the reusable component

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await signup({ username, email, password, first_name: firstName, last_name: lastName });
      navigate("/home");
    } // SignUpForm.js (handleSubmit catch block)
catch (err) {
  if (err.response && err.response.data) {
    const errors = err.response.data;
    // Handle specific field errors
    if (errors.username) {
      setError(errors.username);
    } else if (errors.email) {
      setError(errors.email);
    } else if (errors.password) {
      setError(errors.password);
    } else {
      setError("Failed to sign up. Please check your inputs.");
    }
  } else {
    setError("Failed to sign up. Please try again.");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 to-white px-4">
      <div className="bg-white shadow-lg rounded-lg lg:p-8 p-4  text-center  w-2/4">
       <Link to="/" className="mb-6 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 60"
                  className="w-40"
                >
                  <defs>
                    <linearGradient
                      id="grayGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#111827" />
                      <stop offset="50%" stopColor="#4B5563" />
                      <stop offset="100%" stopColor="#9CA3AF" />
                    </linearGradient>
                  </defs>
                  <text
                    x="100"
                    y="28"
                    fontFamily="Poppins, Arial, sans-serif"
                    fontSize="24"
                    fill="url(#grayGradient)"
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
                    fill="url(#grayGradient)"
                    textAnchor="middle"
                    letterSpacing="6"
                  >
                    DIAGNOSTICS
                  </text>
                </svg>
              </Link>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <InputField
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="Enter username"
            // validate={validateUsername}
            errorMessage="Username can only contain letters, digits, and @/./+/-/_"
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField type="text" value={firstName} onChange={setFirstName} placeholder="First Name" />
            <InputField  type="text" value={lastName} onChange={setLastName} placeholder="Last Name" />
          </div>
          <InputField  type="email" value={email} onChange={setEmail} placeholder="Email" />

          <div className="grid grid-cols-2 gap-4">
            <InputField  type="password" value={password} onChange={setPassword} placeholder="Password" />
            <InputField  type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm Password" />
          </div>

          <button type="submit" className="w-full py-2 rounded-sm text-white font-semibold bg-gray-800 hover:bg-gray-700" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
