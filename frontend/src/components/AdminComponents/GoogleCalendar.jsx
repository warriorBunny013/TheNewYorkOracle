// import React, { useEffect } from 'react';
// import { gapi } from 'gapi-script';

// const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// const GoogleCalendar = () => {
//   useEffect(() => {
//     const initClient = () => {
//       gapi.client.init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
//         scope: SCOPES,
//       }).then(() => {
//         gapi.auth2.getAuthInstance().signIn().then(() => {
//           loadCalendar();
//         });
//       });
//     };

//     gapi.load('client:auth2', initClient);
//   }, []);

//   const loadCalendar = () => {
//     gapi.client.calendar.events.list({
//       'calendarId': 'primary',
//       'timeMin': (new Date()).toISOString(),
//       'showDeleted': false,
//       'singleEvents': true,
//       'maxResults': 10,
//       'orderBy': 'startTime'
//     }).then(response => {
//       const events = response.result.items;
//       if (events.length > 0) {
//         let eventList = events.map(event => (
//           <li key={event.id}>{event.summary} - {event.start.dateTime || event.start.date}</li>
//         ));
//         document.getElementById('events').innerHTML = `<ul>${eventList}</ul>`;
//       } else {
//         document.getElementById('events').innerHTML = 'No upcoming events found.';
//       }
//     });
//   };

//   return (
//     <div>
//       <h2>Upcoming Events</h2>
//       <div id="events">Loading...</div>
//     </div>
//   );
// };

// export default GoogleCalendar;
