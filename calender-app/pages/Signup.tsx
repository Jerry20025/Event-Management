import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthCard from "../components/AuthCard";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleSignUp() {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        name,
        email,
        password
      }, { withCredentials: true });
  
      if (response.data && response.status === 200) {
        setIsSignUp(true);
        setTimeout(() => {
          navigate("/dashboard?username="+name);
        }, 1000);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 400) {
            setError("User already exists.");
          } else {
            setError("An error occurred. Please try again.");
          }
        } else {
          // The request was made but no response was received
          setError("No response from server. Please check your network.");
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An unexpected error occurred.");
      }
    }
  }
  
  return (
    <div className="flex flex-col items-center h-screen bg-gray-200 gap-16 p-4">
        <div className="mt-8 w-full">
            <Navbar isLoggedIn={false} username="Sign Up"/>
        </div>
      <AuthCard>
        <h2 className="w-full py-2 text-black rounded-md bg-tom text-center mb-4">Sign Up Page</h2>
        <Input placeholder="Enter name......" value={name} onChange={(e) => setname(e.target.value)} />
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
        <Button text="SignUp" onClick={handleSignUp}/>
        {isSignUp && <p className="mt-2 text-center text-black">SignUp Successfull</p>}
        {error && <p className="mt-2 text-center text-red-600">{error}</p>}
        <p className="mt-2 text-center text-black">
            Already Signed Up? <Link to="/signin" className="text-blue-600 underline">SignIn</Link> here
        </p>
      </AuthCard>
    </div>
  );
};

export default Signup;
