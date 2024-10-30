import { useState } from "react";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
}
const AddEvent = () => {
    const navigate=useNavigate();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [eventDate,setEventDate]=useState("");
    const [events,setEvents]=useState<Event[]>([]);
    const [searchParams] = useSearchParams();
    const username=searchParams.get('username');            
    async function handleAddEvent(){
        try {
            const response = await axios.post("https://event-management-1kjv.onrender.com/api/v1/event/create", {
                title,
                description, 
                date: eventDate
            }, {
                withCredentials: true
            });
            setEvents([...events, response.data]);
            navigate("/dashboard?username="+username);
        } catch(err) {
            console.error(err);
        }
    }
  return <div className="flex flex-col items-center justify-center h-screen ">
    <div className="flex flex-col items-center justify-center w-80 p-8 bg-jerry rounded-lg shadow-lg shadow-black ">
        <Input placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
        <Input placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} />
        <Input placeholder='Date' type="date" value={eventDate} onChange={(e)=>setEventDate(e.target.value)} />
        <button onClick={handleAddEvent} className="bg-tom hover:bg-gray-300 w-full text-black px-4 py-2 rounded-md">Add</button>
  </div>;
  </div>
};

export default AddEvent;


