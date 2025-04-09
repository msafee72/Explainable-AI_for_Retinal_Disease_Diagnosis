import React, { useState } from "react";

export default function InputField({  type, value, onChange, placeholder, validate, errorMessage }) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    
    if (validate) {
      const validationError = validate(inputValue);
      setError(validationError);
    }
  };

  return (
    <div className="w-full">
      
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-sm border-gray-200"
      />
      {error && <p className="text-red-500 text-sm">{errorMessage || error}</p>}
    </div>
  );
}
