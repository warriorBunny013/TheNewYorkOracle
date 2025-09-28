# Debugging Email Issues - Form Before Payment

## Problem
Emails are not being sent after payment completion in the form-before-payment flow.

## Debugging Steps

### 1. Check Webhook Configuration
```bash
# Check if webhook endpoint is accessible
curl -X POST http://localhost:5000/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "webhook"}'
```

### 2. Test Email Configuration
```bash
# Test basic Resend functionality
curl -X POST http://localhost:5000/api/test-resend \
  -H "Content-Type: application/json"
```

### 3. Test Form Email Templates
```bash
# Test form-before-payment email templates
curl -X POST http://localhost:5000/api/test-form-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "message": "Test message",
    "readingtype": "Pre-recorded session ($395)"
  }'
```

### 4. Check Environment Variables
Make sure these are set in your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_USER=your-email@domain.com
```

### 5. Check Server Logs
Look for these log messages in your server console:
- `=== WEBHOOK RECEIVED ===`
- `Webhook event type: checkout.session.completed`
- `Found booking: Yes/No`
- `Processing form-before-payment booking with form data`
- `Form-before-payment emails sent successfully!`

### 6. Common Issues

#### Issue 1: Webhook Not Being Called
- **Symptom**: No "WEBHOOK RECEIVED" logs
- **Solution**: Check Stripe webhook configuration in Stripe Dashboard
- **URL**: Should be `https://yourdomain.com/webhook`

#### Issue 2: Booking Not Found
- **Symptom**: "No booking found for session ID" logs
- **Solution**: Check if sessionId is being saved correctly in create-checkout-session-with-form

#### Issue 3: Form Data Missing
- **Symptom**: "Booking status updated to completed" (no form data processing)
- **Solution**: Check if formData is being saved in create-temp-booking

#### Issue 4: Email Service Error
- **Symptom**: "Error sending form-before-payment emails" logs
- **Solution**: Check RESEND_API_KEY and EMAIL_USER configuration

### 7. Manual Testing Flow

1. **Start the server**:
   ```bash
   cd backend
   npm start
   ```

2. **Test the complete flow**:
   ```bash
   node test-webhook.js
   ```

3. **Complete a test payment**:
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

4. **Check logs** for webhook processing

### 8. Stripe Webhook Testing

Use Stripe CLI to test webhooks locally:
```bash
# Install Stripe CLI
# Forward webhooks to local server
stripe listen --forward-to localhost:5000/webhook

# Trigger a test event
stripe trigger checkout.session.completed
```

### 9. Database Verification

Check if the booking was created correctly:
```javascript
// In MongoDB or your database client
db.bookings.findOne({ status: "completed" })
```

Look for:
- `formData` field with user information
- `productType` field set correctly
- `status` field set to "completed"

### 10. Email Service Verification

Check Resend dashboard for:
- Email delivery status
- Bounce/complaint reports
- API usage logs

## Quick Fixes

### Fix 1: Ensure Webhook URL is Correct
- In Stripe Dashboard → Webhooks
- Update endpoint URL to: `https://yourdomain.com/webhook`
- Select events: `checkout.session.completed`

### Fix 2: Verify Environment Variables
```bash
# Check if variables are loaded
node -e "console.log(process.env.RESEND_API_KEY ? 'Set' : 'Not Set')"
node -e "console.log(process.env.EMAIL_USER ? 'Set' : 'Not Set')"
node -e "console.log(process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Not Set')"
```

### Fix 3: Test Email Templates
The email templates might have issues. Test them individually:
```bash
curl -X POST http://localhost:5000/api/test-form-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"123","message":"test","readingtype":"test"}'
```

## Expected Log Output

When working correctly, you should see:
```
=== WEBHOOK RECEIVED ===
Webhook event type: checkout.session.completed
Processing completed checkout session: cs_test_...
Found booking: Yes
Booking details: { bookingId: '...', status: 'pending', hasFormData: true, productType: 'premium' }
Processing form-before-payment booking with form data
Form data: { name: '...', email: '...', ... }
Sending emails to: { name: '...', email: '...', readingtype: '...' }
Form-before-payment emails sent successfully!
```
