import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import BookingSlottenminutes from './components/BookingSlottenminutes';
import BookingSlotthirtyminutes from './components/BookingSlotthirtyminutes';
import BookingSlotfourtyfiveminutes from './components/BookingSlotfourtyfiveminutes';
import BookingSlotMentorship from './components/BookingSlotMentorship';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CancelPayment from './components/CancelPayment';
import SameDayForm from './components/SameDayForm';
import ERROR404 from './components/ERROR404';
function App() {
  

    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/booking/:id/1" element={<BookingSlottenminutes />} />
                <Route path="/booking/:id/2" element={<BookingSlotthirtyminutes />} />
                <Route path="/booking/:id/3" element={<BookingSlotfourtyfiveminutes/>} />
                <Route path="/booking/:id/4" element={<BookingSlotMentorship />} />
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route path="/adminpanel" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/cancelpayment" element={<CancelPayment/>} />
                <Route path="/book/:id" element={<SameDayForm/>} />
                {/* <Route path="/book/:id/2" element={<SameDayForm/>} /> */}
                <Route path="*" element={<ERROR404/>} />
            </Routes>
        </Router>
    );
}

export default App;
