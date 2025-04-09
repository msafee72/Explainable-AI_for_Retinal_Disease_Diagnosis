import React from "react";

export default function AuthButton({ text, onClick }) {
  return (
    <button onClick={onClick} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition">
      {text}
    </button>
  );
}
