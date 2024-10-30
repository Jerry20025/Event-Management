import { useState } from 'react';

const CalendarCard = () => {
    const [displayDate, setDisplayDate] = useState(new Date());
    const currentDate = new Date();
    const currentMonth = displayDate.getMonth();
    const currentYear = displayDate.getFullYear();
    
    // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Get last date of the month
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const months = ["January", "February", "March", "April", "May", "June", 
                   "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create calendar grid
    const calendar: (number | null)[][] = [];
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
        const week: (number | null)[] = [];
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDayOfMonth) {
                week.push(null);
            } else if (dayCount > lastDateOfMonth) {
                week.push(null);
            } else {
                week.push(dayCount);
                dayCount++;
            }
        }
        calendar.push(week);
    }

    const handlePrevMonth = () => {
        setDisplayDate(new Date(currentYear, currentMonth - 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(currentYear, currentMonth + 1));
    };

    return (
        <div className="bg-jerry rounded-lg shadow-lg p-4 w-[300px] shadow-black">
            <div className="flex justify-between items-center mb-4 bg-white rounded-md">
                <button 
                    onClick={handlePrevMonth}
                    className="px-2 py-1 rounded hover:bg-tom"
                >
                    &lt;
                </button>
                <div className="text-center font-bold ">
                    {months[currentMonth]} {currentYear}
                </div>
                <button 
                    onClick={handleNextMonth}
                    className="px-2 py-1 rounded hover:bg-tom"
                >
                    &gt;
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 bg-white rounded-md">
                {days.map(day => (
                    <div key={day} className="text-center text-sm font-semibold">
                        {day}
                    </div>
                ))}
                {calendar.map((week, weekIndex) => (
                    week.map((day, dayIndex) => (
                        <div 
                            key={`${weekIndex}-${dayIndex}`}
                            className={`text-center p-1 ${
                                day === currentDate.getDate() && 
                                currentMonth === currentDate.getMonth() && 
                                currentYear === currentDate.getFullYear() ? 
                                'bg-tom text-black rounded-full' : 
                                'hover:bg-white'
                            }`}
                        >
                            {day}
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default CalendarCard;