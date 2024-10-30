import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";

const Update=()=>{
    const [searchParams]=useSearchParams();
    const id=searchParams.get("id");
    const username=searchParams.get("username");
    const navigate=useNavigate();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [eventDate,setEventDate]=useState("");
    async function handleUpdateEvent(){
        await axios.put(`http://localhost:3000/api/v1/event/update/${id}`,{
            title,
            description,
            date:eventDate
        },{
            withCredentials:true,
        });
        navigate("/dashboard?username="+username);
    }
    return  <div className="flex flex-col items-center justify-center h-screen ">
        <div className="flex flex-col items-center justify-center w-80 p-8 bg-jerry rounded-lg shadow-lg shadow-black ">
            <Input placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
            <Input placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} />
            <Input placeholder='Date' type="date" value={eventDate} onChange={(e)=>setEventDate(e.target.value)} />
            <button onClick={handleUpdateEvent} className="bg-tom w-full text-black px-4 py-2 rounded-md">Update</button>
    </div>;
  </div>
}

export default Update;