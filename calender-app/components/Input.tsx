// src/components/Input.tsx
import React from "react";

type InputProps = {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ placeholder, type = "text", value, onChange }:InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 mt-2 mb-4 bg-gray-200 rounded-md"
      required
    />
  );
};

export default Input;
