import React from 'react';
const EventCard = ({children,onclick}:{children:React.ReactNode,onclick:()=>void}) => {
  return (
    <div className='bg-jerry flex flex-col max-h-[400px] overflow-y-scroll p-4 rounded-md shadow-md shadow-black lg:w-[1020px] md:w-[700px] sm:w-[400px] gap-4'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-2xl font-bold'>Events</h1>
          <button className='bg-tom text-black px-4 rounded-md hover:bg-tom' onClick={onclick}>Add Event+</button>
        </div>
        {children}
    </div>
  )
}

export default EventCard
