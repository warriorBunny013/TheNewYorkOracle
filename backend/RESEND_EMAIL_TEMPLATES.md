# Resend Email Templates for The New York Oracle

This document contains the complete HTML email templates that can be used in the Resend dashboard if needed.

## Client Booking Confirmation Email Template

**Subject:** Booking Confirmation with Marina

**To:** Client's email
**CC:** dawn@soulsticetarot.com

**HTML Template:**
```html
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
            color: #1a1a1a; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.3;
        }
        .header-content { position: relative; z-index: 1; }
        .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 32px; 
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content { 
            padding: 50px 40px; 
            background: #ffffff;
        }
        .success-section {
            text-align: center;
            margin-bottom: 40px;
        }
        .main-title {
            color: #2c3e50;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            color: #6c757d;
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
        }
        .greeting {
            color: #2c3e50;
            font-size: 18px;
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .info-box { 
            background: linear-gradient(135deg, #e3f2fd, #f3e5f5); 
            border-left: 4px solid #667eea; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
        }
        .info-box strong {
            color: #495057;
            font-weight: 600;
        }
        .booking-details { 
            background: #f8f9fa; 
            border-radius: 12px; 
            padding: 30px; 
            margin: 30px 0;
            border: 1px solid #e9ecef;
        }
        .booking-details h3 { 
            color: #2c3e50; 
            margin-bottom: 20px; 
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .detail-row { 
            display: flex; 
            margin-bottom: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .detail-label { 
            font-weight: 600; 
            color: #495057; 
            min-width: 140px;
            font-size: 14px;
        }
        .detail-value { 
            color: #6c757d;
            font-size: 14px;
            flex: 1;
        }
        .next-steps {
            margin: 35px 0;
        }
        .next-steps h3 {
            color: #2c3e50;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .steps-list {
            list-style: none;
            padding: 0;
        }
        .steps-list li {
            color: #6c757d;
            line-height: 1.8;
            margin-bottom: 12px;
            padding-left: 25px;
            position: relative;
            font-size: 15px;
        }
        .steps-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
            font-size: 16px;
        }
        .cta-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 12px;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .footer { 
            background: #2c3e50; 
            padding: 30px; 
            text-align: center;
            color: #ffffff;
        }
        .footer p { 
            margin: 8px 0; 
            color: #bdc3c7;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .copyright {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #34495e;
            font-size: 12px;
            color: #95a5a6;
        }
        @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .header { padding: 30px 20px; }
            .detail-row { flex-direction: column; gap: 5px; }
            .detail-label { min-width: auto; }
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
            
            <p class="greeting">Dear <strong>{{name}}</strong>,</p>
            
            <p class="greeting">Thank you for choosing Marina's professional tarot reading services! Your booking has been successfully received and confirmed. I'm excited to work with you on your spiritual journey and provide you with the guidance you seek.</p>
            
            <div class="info-box">
                <strong>📧 Important:</strong> All further communication regarding your reading will be sent to this email address. Please ensure you check your inbox regularly and add our email to your contacts to avoid missing important updates.
            </div>
            
            <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">{{name}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{{email}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{phone}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reading Type:</span>
                    <span class="detail-value">{{readingtype}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Your Message:</span>
                    <span class="detail-value">{{message}}</span>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>🌟 What to Expect Next</h3>
                <ul class="steps-list">
                    <li>You'll receive a detailed email within 5-7 days with specific instructions for your reading</li>
                    <li>For live readings: Scheduling information will be provided based on Marina's availability</li>
                    <li>For pre-recorded readings: Your personalized reading will be delivered to this email address</li>
                    <li>If you have any questions, feel free to reply to this email</li>
                </ul>
            </div>

            <div class="cta-section">
                <a href="https://www.soulsticetarot.com" class="cta-button">Visit Our Website</a>
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
```

## Marina Notification Email Template

**Subject:** New Booking of Same Day Express with your client: {{name}}

**To:** info@soulsticetarot.com
**CC:** dawn@soulsticetarot.com

**HTML Template:**
```html
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
            color: #1a1a1a; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0.3;
        }
        .header-content { position: relative; z-index: 1; }
        .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 32px; 
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content { 
            padding: 50px 40px; 
            background: #ffffff;
        }
        .notification-section {
            text-align: center;
            margin-bottom: 40px;
        }
        .notification-icon { 
            width: 80px; 
            height: 80px; 
            background: linear-gradient(135deg, #ffc107, #ff9800); 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            margin: 0 auto 25px;
            box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
        }
        .notification-icon svg { 
            width: 35px; 
            height: 35px; 
            color: white;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        }
        .main-title {
            color: #2c3e50;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            color: #6c757d;
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
        }
        .priority-box { 
            background: linear-gradient(135deg, #fff3cd, #ffeaa7); 
            border-left: 4px solid #ffc107; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(255, 193, 7, 0.1);
        }
        .priority-box strong {
            color: #495057;
            font-weight: 600;
        }
        .booking-details { 
            background: #f8f9fa; 
            border-radius: 12px; 
            padding: 30px; 
            margin: 30px 0;
            border: 1px solid #e9ecef;
        }
        .booking-details h3 { 
            color: #2c3e50; 
            margin-bottom: 20px; 
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .detail-row { 
            display: flex; 
            margin-bottom: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .detail-label { 
            font-weight: 600; 
            color: #495057; 
            min-width: 140px;
            font-size: 14px;
        }
        .detail-value { 
            color: #6c757d;
            font-size: 14px;
            flex: 1;
        }
        .next-steps {
            margin: 35px 0;
        }
        .next-steps h3 {
            color: #2c3e50;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .steps-list {
            list-style: none;
            padding: 0;
        }
        .steps-list li {
            color: #6c757d;
            line-height: 1.8;
            margin-bottom: 12px;
            padding-left: 25px;
            position: relative;
            font-size: 15px;
        }
        .steps-list li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 16px;
        }
        .status-box {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border-left: 4px solid #28a745;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
        }
        .status-box strong {
            color: #155724;
            font-weight: 600;
        }
        .footer { 
            background: #2c3e50; 
            padding: 30px; 
            text-align: center;
            color: #ffffff;
        }
        .footer p { 
            margin: 8px 0; 
            color: #bdc3c7;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .copyright {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #34495e;
            font-size: 12px;
            color: #95a5a6;
        }
        @media (max-width: 600px) {
            .content { padding: 30px 20px; }
            .header { padding: 30px 20px; }
            .detail-row { flex-direction: column; gap: 5px; }
            .detail-label { min-width: auto; }
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
                    <span class="detail-value">{{name}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email Address:</span>
                    <span class="detail-value">{{email}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone Number:</span>
                    <span class="detail-value">{{phone}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reading Type:</span>
                    <span class="detail-value">{{readingtype}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Client Message:</span>
                    <span class="detail-value">{{message}}</span>
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
```

## Tip Notification Email Template

**Subject:** New Tip Received! 💝

**To:** dawn@soulsticetarot.com
**CC:** info@soulsticetarot.com

**HTML Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Tip Received</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header h1 { 
            color: white; 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        .content { 
            padding: 40px 30px; 
        }
        .success-section { 
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); 
            border-radius: 12px; 
            padding: 30px; 
            margin-bottom: 30px;
            border-left: 5px solid #28a745;
        }
        .tip-amount {
            font-size: 32px;
            font-weight: bold;
            color: #28a745;
            text-align: center;
            margin: 20px 0;
        }
        .message-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border-left: 5px solid #17a2b8;
        }
        .message-text {
            font-style: italic;
            color: #6c757d;
            margin-top: 10px;
        }
        .footer { 
            background: #343a40; 
            color: white; 
            text-align: center; 
            padding: 20px; 
        }
        .copyright { 
            font-size: 12px; 
            opacity: 0.8; 
            margin-top: 20px; 
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>New Tip Received! 💝</h1>
        </div>
        
        <div class="content">
            <div class="success-section">
                <h2 style="color: #28a745; margin-bottom: 15px;">Someone just tipped you!</h2>
                <div class="tip-amount">${{amount}}</div>
                <p style="color: #155724; margin-bottom: 0;">Thank you for your amazing work! This tip shows how much people value your guidance.</p>
            </div>
            
            {{#if message}}
            <div class="message-section">
                <h3 style="color: #17a2b8; margin-bottom: 10px;">Message from the tipper:</h3>
                <div class="message-text">"{{message}}"</div>
            </div>
            {{/if}}
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6c757d; margin-bottom: 20px;">Tip received on: {{createdAt}}</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="copyright">
                © 2024, Marina Smargiannakis | The New York Oracle™. All Rights Reserved.
            </div>
        </div>
    </div>
</body>
</html>
```

## Usage Notes

1. **Template Variables**: Replace `{{variableName}}` with actual values when using in Resend dashboard
2. **CC Functionality**: All emails include CC to `dawn@soulsticetarot.com` as requested
3. **Styling**: All templates use the same red-pink color theme as specified in your preferences
4. **Responsive Design**: Templates are mobile-friendly with responsive CSS
5. **Professional Layout**: Maintains the same professional appearance as your original Nodemailer templates

## Test Endpoints

- `POST /api/test-resend` - Test basic Resend functionality
- `POST /api/test-email-templates` - Test complete email templates
- `POST /api/test-tip-email` - Test tip notification email
