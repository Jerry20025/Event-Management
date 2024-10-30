import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Signup from '../pages/Signup';
import Signin from '../pages/Signin';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import AddEvent from '../pages/AddEvent';
import Update from '../pages/Update';
function App() {
    return <>
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-event" element={<AddEvent />} />
                <Route path="/update" element={<Update />} />
            </Routes>
        </BrowserRouter>
    </>
}

export default App
