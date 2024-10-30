import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthCard from "../components/AuthCard";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const Signin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [username,setUserName]=useState("");
  async function handleSignin() {
    try {
      const response = await axios.post("https://event-management-1kjv.onrender.com/api/v1/user/signin", {
        email,
        password
      },{
        withCredentials:true,
      } );
      console.log(response.data.user.name);
      if (response.status === 400) {
        setError(response.data.error || "Invalid credentials");
      } else {
        // Assuming token is returned on successful sign-in
        localStorage.setItem("token", response.data.token);
        setError("");
        navigate("/dashboard?username="+response.data.user.name);
      }
    } catch (error: any) {
      setError("Error signing in: " + (error.response?.data?.error || "Unknown error"));
      console.error("Error signing in:", error);
    }
  }

  async function handleLogout() {
    try {
      await axios.post("https://event-management-1kjv.onrender.com/api/v1/user/logout", {});
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  
  return (
    <div className="h-screen items-center bg-gray-200 flex flex-col gap-16 p-4">
      <div className="mt-8 w-full">
        <Navbar isLoggedIn={false} username="sign In" onClick={handleLogout} />
      </div>
      <AuthCard>
        <h2 className="w-full py-2 text-black rounded-md bg-tom text-center mb-4">Sign In Page</h2>
        <Input
          placeholder="Enter email......"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password......."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="SignIn" onClick={handleSignin} />
        {error && <p className="my-2 text-center text-red-600">{error}</p>}
        
        <p className="mt-2 text-center text-black">
          New user? <Link to="/signup" className="text-blue-600 underline">Sign Up</Link> here
        </p>
      </AuthCard>
    </div>
  );
};

export default Signin;
