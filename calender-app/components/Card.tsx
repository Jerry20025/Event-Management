import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  content: string;
  highlight?: string;
  buttonText?: string;
  buttonLink?: string; 
}

const Card: React.FC<CardProps> = ({ title, content, highlight, buttonText, buttonLink }) => {
  return (
    <div className="bg-jerry rounded-lg shadow-lg shadow-black p-6 max-w-md h-fit">
      <h2 className="font-semibold text-3xl">{title}</h2>
      {highlight && <p className="mt-2 text-white font-semibold">{highlight}</p>}
      <p className="mt-4 text-white">{content}</p>
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="mt-6 inline-block bg-tom text-black font-semibold py-2 px-4 rounded hover:bg-gray-300"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default Card;
