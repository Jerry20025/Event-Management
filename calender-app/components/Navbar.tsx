import React from "react";

type NavbarProps = {
  isLoggedIn: boolean;
  username?: string;
  onClick?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, username,onClick }) => {
    const date = new Date().getDate();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[new Date().getMonth()];
    const day=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const dayOfWeek=day[new Date().getDay()];
    return (
        <nav className="flex justify-between p-4 px-10 bg-jerry rounded-md shadow-md shadow-black">
        <div className="text-black px-6 py-2 rounded-md bg-tom text-lg">
            {isLoggedIn ?"Hii... "+username+" Have a nice Day!" : `${dayOfWeek}, ${month}'${date} `}
        </div>
        <button onClick={onClick} className="text-black bg-tom hover:bg-gray-300 px-6 py-2 rounded-md">
            {isLoggedIn ? "Logout" : "Login"}
        </button>
        </nav>
    );
};

export default Navbar;
