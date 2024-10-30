// src/components/Button.tsx
import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => any;
};

const Button: React.FC<ButtonProps> = ({ text, onClick}) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 text-black rounded-md bg-tom hover:bg-white"
    >
      {text}
    </button>
  );
};

export default Button;
