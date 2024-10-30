// src/components/AuthCard.tsx
import React from "react";

type AuthCardProps = {
  children: React.ReactNode;
};

const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="w-80 p-8 bg-jerry rounded-lg shadow-lg shadow-black">
      {children}
    </div>
  );
};

export default AuthCard;
