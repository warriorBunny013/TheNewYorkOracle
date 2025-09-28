import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainPage from './components/MainPage';
// import BookingSlottenminutes from './components/BookingSlottenminutes';
// import BookingSlotthirtyminutes from './components/BookingSlotthirtyminutes';
// import BookingSlotfourtyfiveminutes from './components/BookingSlotfourtyfiveminutes';
// import BookingSlotMentorship from './components/BookingSlotMentorship';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CancelPayment from './components/CancelPayment';
import SameDayForm from './components/SameDayForm';
import ERROR404 from './components/ERROR404';
import ExclusiveTierForm from './components/ExclusiveTierForm';
import BookingSuccess from './components/BookingSuccess';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminpanel" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/cancelpayment" element={<CancelPayment/>} />
          <Route path="/book/:id" element={<SameDayForm/>} />
          <Route path="/book-premium/:id" element={<ExclusiveTierForm/>} />
          <Route path="/book-success/:id" element={<BookingSuccess/>} />
          <Route path="*" element={<ERROR404/>} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
