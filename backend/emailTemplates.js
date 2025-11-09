// Email Templates for Resend Integration

export const getClientEmailTemplate = (name, email, phone, message, readingtype) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #e5e5e5; 
              background: linear-gradient(135deg, #08070c 0%, #1a1a1a 50%, #08070c 100%);
              background-attachment: fixed;
          }
          .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background: rgba(8, 7, 12, 0.95);
              border: 1px solid rgba(236, 72, 153, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(236, 72, 153, 0.1);
              backdrop-filter: blur(10px);
          }
          .header { 
              background: linear-gradient(135deg, #ec4899 0%, #ef4444 50%, #be185d 100%); 
              padding: 50px 30px; 
              text-align: center;
              position: relative;
              overflow: hidden;
          }
          .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
              animation: pulse 4s ease-in-out infinite;
          }
          @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.1); }
          }
          .header-content { position: relative; z-index: 1; }
          .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 36px; 
              font-weight: 600;
              letter-spacing: 2px;
              text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .content { 
              padding: 50px 40px; 
              background: transparent;
          }
          .success-section {
              text-align: center;
              margin-bottom: 40px;
          }
          .main-title {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 15px;
              text-align: center;
          }
          .subtitle {
              color: #b0b0b0;
              font-size: 17px;
              text-align: center;
              margin-bottom: 35px;
              font-weight: 300;
          }
          .greeting {
              color: #e5e5e5;
              font-size: 18px;
              margin-bottom: 25px;
              line-height: 1.8;
          }
          .greeting strong {
              color: #ec4899;
              font-weight: 600;
          }
          .info-box { 
              background: rgba(236, 72, 153, 0.1); 
              border-left: 4px solid #ec4899; 
              padding: 22px; 
              margin: 25px 0; 
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(236, 72, 153, 0.15);
              backdrop-filter: blur(10px);
          }
          .info-box strong {
              color: #ec4899;
              font-weight: 600;
          }
          .booking-details { 
              background: rgba(255, 255, 255, 0.05); 
              border-radius: 16px; 
              padding: 35px; 
              margin: 30px 0;
              border: 1px solid rgba(236, 72, 153, 0.2);
              backdrop-filter: blur(10px);
          }
          .booking-details h3 { 
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 25px; 
              font-size: 22px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 10px;
          }
          .detail-row { 
              display: flex; 
              margin-bottom: 18px;
              padding: 15px 0;
              border-bottom: 1px solid rgba(236, 72, 153, 0.15);
          }
          .detail-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
          }
          .detail-label { 
              font-weight: 600; 
              color: #ec4899; 
              min-width: 150px;
              font-size: 15px;
          }
          .detail-value { 
              color: #d0d0d0;
              font-size: 15px;
              flex: 1;
          }
          .next-steps {
              margin: 40px 0;
          }
          .next-steps h3 {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 25px;
          }
          .steps-list {
              list-style: none;
              padding: 0;
          }
          .steps-list li {
              color: #d0d0d0;
              line-height: 2;
              margin-bottom: 15px;
              padding-left: 30px;
              position: relative;
              font-size: 16px;
          }
          .steps-list li::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #ec4899;
              font-weight: bold;
              font-size: 18px;
          }
          .review-section {
              margin: 45px 0;
              padding: 35px;
              background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(239, 68, 68, 0.15));
              border-radius: 16px;
              border: 1px solid rgba(236, 72, 153, 0.3);
              text-align: center;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(236, 72, 153, 0.2);
          }
          .review-section h3 {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 15px;
          }
          .review-section h4 {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 21px;
              font-weight: 700;
              margin-bottom: 15px;
          }
          .review-section p {
              color: #d0d0d0;
              font-size: 16px;
              margin-bottom: 25px;
              line-height: 1.8;
          }
          .review-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #ec4899, #ef4444); 
              color: white; 
              padding: 18px 40px; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 10px 0;
              font-weight: 600;
              font-size: 17px;
              box-shadow: 0 6px 25px rgba(236, 72, 153, 0.4);
              transition: all 0.3s ease;
              border: none;
          }
          .review-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 35px rgba(236, 72, 153, 0.5);
          }
          .cta-section {
              text-align: center;
              margin: 40px 0;
              padding: 30px;
              background: rgba(255, 255, 255, 0.03);
              border-radius: 16px;
              border: 1px solid rgba(236, 72, 153, 0.2);
          }
          .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #ec4899, #ef4444); 
              color: white; 
              padding: 16px 35px; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 20px 0;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 6px 25px rgba(236, 72, 153, 0.4);
          }
          .footer { 
              background: rgba(8, 7, 12, 0.9); 
              padding: 35px; 
              text-align: center;
              color: #ffffff;
              border-top: 1px solid rgba(236, 72, 153, 0.2);
          }
          .footer p { 
              margin: 10px 0; 
              color: #b0b0b0;
              font-size: 15px;
          }
          .footer a {
              color: #ec4899;
              text-decoration: none;
              transition: color 0.3s ease;
          }
          .footer a:hover {
              color: #ef4444;
          }
          .copyright {
              margin-top: 25px;
              padding-top: 25px;
              border-top: 1px solid rgba(236, 72, 153, 0.2);
              font-size: 13px;
              color: #808080;
          }
          @media (max-width: 600px) {
              .content { padding: 30px 20px; }
              .header { padding: 35px 20px; }
              .header h1 { font-size: 28px; }
              .detail-row { flex-direction: column; gap: 8px; }
              .detail-label { min-width: auto; }
              .review-section { padding: 25px 20px; }
              .main-title { font-size: 26px; }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <div class="header-content">
                  <h1>Booking Confirmation</h1>
              </div>
          </div>

          <div class="content">
              <div class="success-section">
                  <h2 class="main-title">Booking Confirmed!</h2>
                  <p class="subtitle">Your spiritual journey with Marina begins now</p>
              </div>
              
              <p class="greeting">Dear <strong>${name}</strong>,</p>
              
              <p class="greeting">Thank you for choosing Marina's professional tarot reading services! Your booking has been successfully received and confirmed. I'm excited to work with you on your spiritual journey and provide you with the guidance you seek.</p>
              
              <div class="info-box">
                  <strong>📧 Important:</strong> All further communication regarding your reading will be sent to this email address. Please ensure you check your inbox regularly and add our email to your contacts to avoid missing important updates.
              </div>
              
              <div class="booking-details">
                  <h3>📋 Booking Details</h3>
                  <div class="detail-row">
                      <span class="detail-label">Name:</span>
                      <span class="detail-value">${name}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Email:</span>
                      <span class="detail-value">${email}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Phone:</span>
                      <span class="detail-value">${phone || "Not provided"}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Reading Type:</span>
                      <span class="detail-value">${readingtype}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Your Message:</span>
                      <span class="detail-value">${message}</span>
                  </div>
              </div>
              
              <div class="next-steps">
                  <h3>🌟 What to Expect Next</h3>
                  <ul class="steps-list">
                      <li>For live readings: Scheduling information will be provided based on Marina's availability</li>
                      <li>For pre-recorded readings: Your personalized reading will be delivered to this email address</li>
                      <li>If you have any questions, feel free to reply to this email</li>
                  </ul>
              </div>

              <div class="review-section">
                  <h4>⭐ Share Your Experience</h4>
                  <p>Your feedback is incredibly valuable to us! After your reading, we'd love to hear about your experience. Your review helps us continue to provide magical and transformative guidance.</p>
                  <a href="https://www.soulsticetarot.com/bookings/sendfeedbacks" class="review-button">Send Your Review</a>
              </div>
          </div>
          
          <div class="footer">
              <p><strong>Marina Smargiannakis</strong></p>
              <p>The New York Oracle™</p>
              <p>Email: info@soulsticetarot.com</p>
              <p>Website: <a href="https://www.soulsticetarot.com">www.soulsticetarot.com</a></p>
              <div class="copyright">
                  © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
};

export const getMarinaEmailTemplate = (name, email, phone, message, readingtype) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Notification</title>
      <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #e5e5e5; 
              background: linear-gradient(135deg, #08070c 0%, #1a1a1a 50%, #08070c 100%);
              background-attachment: fixed;
          }
          .email-container { 
              max-width: 650px; 
              margin: 0 auto; 
              background: rgba(8, 7, 12, 0.95);
              border: 1px solid rgba(236, 72, 153, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(236, 72, 153, 0.1);
              backdrop-filter: blur(10px);
          }
          .header { 
              background: linear-gradient(135deg, #ec4899 0%, #ef4444 50%, #be185d 100%); 
              padding: 50px 30px; 
              text-align: center;
              position: relative;
              overflow: hidden;
          }
          .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
              animation: pulse 4s ease-in-out infinite;
          }
          @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.1); }
          }
          .header-content { position: relative; z-index: 1; }
          .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 36px; 
              font-weight: 600;
              letter-spacing: 2px;
              text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          .content { 
              padding: 50px 40px; 
              background: transparent;
          }
          .notification-section {
              text-align: center;
              margin-bottom: 40px;
          }
          .notification-icon { 
              width: 90px; 
              height: 90px; 
              background: linear-gradient(135deg, #ec4899, #ef4444); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 0 auto 25px;
              box-shadow: 0 6px 25px rgba(236, 72, 153, 0.4);
          }
          .notification-icon svg { 
              width: 40px; 
              height: 40px; 
              color: white;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          }
          .main-title {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 15px;
              text-align: center;
          }
          .subtitle {
              color: #b0b0b0;
              font-size: 17px;
              text-align: center;
              margin-bottom: 35px;
              font-weight: 300;
          }
          .priority-box { 
              background: rgba(236, 72, 153, 0.15); 
              border-left: 4px solid #ec4899; 
              padding: 22px; 
              margin: 25px 0; 
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(236, 72, 153, 0.2);
              backdrop-filter: blur(10px);
          }
          .priority-box strong {
              color: #ec4899;
              font-weight: 600;
          }
          .booking-details { 
              background: rgba(255, 255, 255, 0.05); 
              border-radius: 16px; 
              padding: 35px; 
              margin: 30px 0;
              border: 1px solid rgba(236, 72, 153, 0.2);
              backdrop-filter: blur(10px);
          }
          .booking-details h3 { 
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 25px; 
              font-size: 22px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 10px;
          }
          .detail-row { 
              display: flex; 
              margin-bottom: 18px;
              padding: 15px 0;
              border-bottom: 1px solid rgba(236, 72, 153, 0.15);
          }
          .detail-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
          }
          .detail-label { 
              font-weight: 600; 
              color: #ec4899; 
              min-width: 150px;
              font-size: 15px;
          }
          .detail-value { 
              color: #d0d0d0;
              font-size: 15px;
              flex: 1;
          }
          .next-steps {
              margin: 40px 0;
          }
          .next-steps h3 {
              background: linear-gradient(135deg, #ec4899, #ef4444);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 25px;
          }
          .steps-list {
              list-style: none;
              padding: 0;
          }
          .steps-list li {
              color: #d0d0d0;
              line-height: 2;
              margin-bottom: 15px;
              padding-left: 30px;
              position: relative;
              font-size: 16px;
          }
          .steps-list li::before {
              content: '→';
              position: absolute;
              left: 0;
              color: #ec4899;
              font-weight: bold;
              font-size: 18px;
          }
          .status-box {
              background: rgba(236, 72, 153, 0.1);
              border-left: 4px solid #ec4899;
              padding: 22px;
              margin: 25px 0;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(236, 72, 153, 0.15);
              backdrop-filter: blur(10px);
          }
          .status-box strong {
              color: #ec4899;
              font-weight: 600;
          }
          .footer { 
              background: rgba(8, 7, 12, 0.9); 
              padding: 35px; 
              text-align: center;
              color: #ffffff;
              border-top: 1px solid rgba(236, 72, 153, 0.2);
          }
          .footer p { 
              margin: 10px 0; 
              color: #b0b0b0;
              font-size: 15px;
          }
          .footer a {
              color: #ec4899;
              text-decoration: none;
              transition: color 0.3s ease;
          }
          .footer a:hover {
              color: #ef4444;
          }
          .copyright {
              margin-top: 25px;
              padding-top: 25px;
              border-top: 1px solid rgba(236, 72, 153, 0.2);
              font-size: 13px;
              color: #808080;
          }
          @media (max-width: 600px) {
              .content { padding: 30px 20px; }
              .header { padding: 35px 20px; }
              .header h1 { font-size: 28px; }
              .detail-row { flex-direction: column; gap: 8px; }
              .detail-label { min-width: auto; }
              .main-title { font-size: 26px; }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <div class="header-content">
                  <h1>New Booking Notification</h1>
              </div>
          </div>

          <div class="content">
              <div class="notification-section">
                  <div class="notification-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                  </div>
                  
                  <h2 class="main-title">New Booking INFO</h2>
                  <p class="subtitle">A new client has completed their booking</p>
              </div>
              
              <div class="priority-box">
                  <strong>⚡ Action Required:</strong> A new client has completed their booking and form submission. Please review the details below and process their reading request within 24-72 hours.
              </div>
              
              <div class="booking-details">
                  <h3>📋 Client Information</h3>
                  <div class="detail-row">
                      <span class="detail-label">Client Name:</span>
                      <span class="detail-value">${name}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Email Address:</span>
                      <span class="detail-value">${email}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Phone Number:</span>
                      <span class="detail-value">${phone || "Not provided"}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Reading Type:</span>
                      <span class="detail-value">${readingtype}</span>
                  </div>
                  <div class="detail-row">
                      <span class="detail-label">Client Message:</span>
                      <span class="detail-value">${message}</span>
                  </div>
              </div>
              
              <div class="next-steps">
                  <h3>🎯 Next Steps</h3>
                  <ul class="steps-list">
                      <li>Review the client's message and reading type carefully</li>
                      <li>For pre-recorded readings: Prepare and deliver within 24-72 hours</li>
                      <li>For live readings: Contact client to schedule the session</li>
                      <li>Send confirmation email to client with specific instructions</li>
                      <li>Update booking status in your system</li>
                  </ul>
              </div>

              <div class="status-box">
                  <strong>✅ Status:</strong> This booking has been automatically confirmed. The client has already received a confirmation email with their booking details.
              </div>
          </div>
          
          <div class="footer">
              <p><strong>Marina Smargiannakis</strong></p>
              <p>The New York Oracle™</p>
              <p>Email: info@soulsticetarot.com</p>
              <p>Website: <a href="https://www.soulsticetarot.com">www.soulsticetarot.com</a></p>
              <div class="copyright">
                  © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
              </div>
          </div>
      </div>
  </body>
  </html>
  `;
};
