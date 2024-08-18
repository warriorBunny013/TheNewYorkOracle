import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Appointlet from '@appointlet/appointlet.js';
import '@appointlet/appointlet.js/dist/appointlet.min.css';

const BookingSlotfourtyfiveminutes = () => {
  const { id } = useParams(); // Extract the booking ID from the URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking data from the server using the booking ID
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking/${id}`);
        if (response.ok) {
          
          setIsAuthorized(true);
          console.log("user is authorized")
          // You can also set state with booking details here
        } else {
          navigate('/'); // Redirect if booking is not found or unauthorized
        }
      } catch (error) {
        console.error(error);
        navigate('/'); // Redirect on error
      }
    };

    fetchBooking();
  }, [id, navigate]);

  useEffect(() => {
    if (isAuthorized) {
      const appointlet = new Appointlet('https://appt.link/meet-with-marina-kLDXzYpH/45-minutes-detailed-reading');
      const inlineEmbed = async () => {
        const meetingData = await appointlet.inlineEmbed(document.getElementById('appointlet-embed'));
        console.log(meetingData);
      };
      inlineEmbed();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <p>Unauthorized access. Please complete a payment first.</p>;
  }

  return <div id="appointlet-embed" style={{ height: '600px' }}></div>;
};

export default BookingSlotfourtyfiveminutes;