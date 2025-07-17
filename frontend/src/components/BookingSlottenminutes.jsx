// import SEO from "./SEO";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import Appointlet from '@appointlet/appointlet.js';
import '@appointlet/appointlet.js/dist/appointlet.min.css';
import { API_URL } from "../utils/apiConfig";

const BookingSlottenminutes = () => {
  const { id } = useParams(); // Extract the booking ID from the URL
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booking data from the server using the booking ID
    const fetchBooking = async () => {
      try {
        const response = await fetch(`${API_URL}/api/booking/${id}`);
        if (response.ok) {
          
          setIsAuthorized(true);
          // User is authorized
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
      // const appointlet = new Appointlet('https://appt.link/meet-with-marina-kLDXzYpH/web-conference');
      const inlineEmbed = async () => {
        // const meetingData = await appointlet.inlineEmbed(document.getElementById('appointlet-embed'));
        // Meeting data loaded
      };
      inlineEmbed();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <p>Unauthorized access. Please complete a payment first.</p>;
  }

  return <div id="appointlet-embed" style={{ height: '600px' }}></div>;
};

export default BookingSlottenminutes;