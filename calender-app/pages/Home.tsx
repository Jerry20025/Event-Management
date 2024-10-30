import React from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Card from '../components/Card';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; 
  const username = "John Doe"; 

  return (
    <div className="h-screen bg-gray-200 flex flex-col gap-16 p-4">
      <div className="mt-8 w-full">
        <Navbar isLoggedIn={isLoggedIn} username={username} onClick={() => navigate('/signin')} />
      </div>
      <div className="flex justify-center p-8 space-x-4 gap-8 items-center">
        <div className="flex flex-col gap-3">
            <Card
            title="Hey! What's up"
            highlight="See calendar and manage your schedules here and get alarm on time"
            content=""
            />
            <Card
                title="tic tic tic"
                content="Time is running"
            />
        </div>
        <Card
          title="Your Time is Precious!"
          content="We value your time! We allow to manage your time effectively. Interactive user interface & design with ease and manage your events and meeting, get alert before you set your time."
          buttonText="Here create your account to Personalize your experience"
          buttonLink="/signup" 
        />
      </div>
    </div>
  );
};

export default Home;
