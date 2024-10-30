import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CalenderCard from '../components/CalenderCard';
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
}

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    const username=searchParams.get('username');
    const [isEvent, setIsEvent] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [todayEvent,setTodayEvent]=useState<Event[]>([]);
    const navigate=useNavigate();
    useEffect(() => {
        const fetchEvents = async () => {  
            const response = await axios.get("https://event-management-1kjv.onrender.com/api/v1/event/allevent", {
              withCredentials:true,
            });
            setEvents(response.data);
        };
        fetchEvents();
    }, []);
    const completeDate = new Date();
    const todayString = completeDate.toLocaleDateString();
    
    useEffect(() => {
        const todaysEvents = events.filter(event => 
            new Date(event.date).toLocaleDateString() === todayString
        );
        
        if (todaysEvents.length > 0) {
            setTodayEvent(todaysEvents);
            setIsEvent(true);
        }
    }, [events, todayString]);

    const date = new Date().getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[new Date().getMonth()];
    const day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dayOfWeek=day[new Date().getDay()];
    events.map((event)=>{
      if(event.date===completeDate.toLocaleDateString()){
        setIsEvent(true);
        console.log("Yes We Have Event",event.date);
      }
    })
    async function handleLogout(){
      try {
        await axios.post('https://event-management-1kjv.onrender.com/api/v1/user/logout', {}, {
          withCredentials: true 
        });
        localStorage.removeItem("token");
        navigate("/");
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  return (
    <div className='min-h-screen bg-gray-200 flex flex-col gap-8 lg:gap-16 overflow-y-auto p-4'>
      <div className='w-full'>
        <Navbar isLoggedIn={true} username={username || "nothing"} onClick={()=>handleLogout()}/>
      </div>
    
        <div className='flex flex-col lg:flex-row items-center justify-center gap-8 w-full'>
          
          <div className=' flex flex-col  gap-4 '>
          <div className='flex flex-col gap-4  bg-jerry p-4 rounded-md shadow-lg shadow-black'>
            {isEvent ? 
                  <div className='text-black  bg-tom px-4 py-2 rounded-md'>Hey! You have an event today</div> 
                  : 
                  <div className='text-black bg-tom px-4 py-2 rounded-md'>Today is No Event</div>
                }
            <div className='text-center sm:text-left p-2 max-h-[200px] overflow-y-scroll w-[300px]'>
                {isEvent && <BarSide events={todayEvent} />}
              </div>
          </div>
            <div className='flex justify-center items-center'>
            <CalenderCard/>
            </div> 
         </div>

        <div className='flex flex-col gap-4 w-full lg:w-auto'>
          <div className='bg-jerry flex flex-col sm:flex-row p-4 rounded-md justify-between w-full lg:w-[1020px] md:w-[700px] sm:w-[400px] shadow-md shadow-black space-y-4 sm:space-y-0'>
            <div className='items-center gap-2 text-black bg-tom px-4 py-2 rounded-md text-center sm:text-left'>
              {dayOfWeek}, {month} {date}
            </div>
            
          </div>
          <div className='w-full'>
            <EventCard children={<BarSide events={events} username={username || undefined} />} onclick={()=>navigate("/add-event?username="+username)} />               
          </div>
        </div>
      </div>
    </div>
  )
}
function BarSide({ events,username }: { events: Event[],username?:string }) {
  const navigate=useNavigate();
  async function handleDelete(id:number){
    console.log(id);
    const response=await axios.delete(`https://event-management-1kjv.onrender.com/api/v1/event/delete/${id}`,{
      withCredentials:true,
    });
    window.location.reload();
    console.log(response.data);
  }
  return (
      <div className="flex flex-col gap-4 w-full">
          {events.map((event) => (
              <div key={event.id} className="w-full">
                  <div className="bg-gray-100 p-4 rounded-md shadow-md shadow-black">
                      <div>
                          <p className="text-gray-600 font-bold break-words">{new Date(event.date).toLocaleDateString()}</p>
                          <hr className='border-1 border-black'/>
                          <h3 className="font-bold break-words">{event.title}</h3>
                          <p className="break-words">{event.description}</p>
                      </div>
                      <hr className='border-1 border-black'/>
                      <div className='flex flex-row gap-4 mt-2 flex-wrap'>
                          <button className='bg-tom text-black px-4 py-2 rounded-md hover:bg-gray-300' 
                                  onClick={()=>handleDelete(event.id)}>Delete</button>
                          <button className='bg-tom text-black px-4 py-2 rounded-md hover:bg-gray-300' 
                                  onClick={()=>navigate(`/update?id=${event.id}+&username=+${username}`)}>Edit</button>
                      </div>
                  </div>
              </div>
          ))}
          {events.length === 0 && (
              <div className="text-gray-500 text-center">No events found</div>
          )}
      </div>
  );
}

export default Dashboard
