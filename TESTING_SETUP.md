# Testing Setup Guide

## Environment Configuration

### Backend Environment Variables (Render)

For your test environment, set these in your Render dashboard:

```
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_your_test_stripe_key_here
STRIPE_PUBLIC_KEY=pk_test_your_test_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_test_webhook_secret_here
RESEND_API_KEY=your_resend_key_here
EMAIL_USER=your_email@domain.com
MONGO_URL=your_mongodb_url_here
JWT_SECRET=your_jwt_secret_here
```

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```
# Test Environment
REACT_APP_TEST_MODE=true
REACT_APP_API_PUBLIC_KEY_TEST=pk_test_your_test_stripe_key_here
REACT_APP_API_URL_TEST=https://your-test-app.onrender.com
REACT_APP_API_PUBLIC_KEY=pk_test_your_test_stripe_key_here
```

## Testing Commands

### 1. Test Environment Configuration
```bash
curl https://your-test-app.onrender.com/api/debug-env
```

### 2. Test Email Functionality
```bash
curl -X POST https://your-test-app.onrender.com/api/test-resend
```

### 3. Test Booking Email
```bash
curl -X POST https://your-test-app.onrender.com/sendemail \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-email@gmail.com",
    "phone": "555-1234",
    "message": "Test emergency booking",
    "readingtype": "Emergency Reading"
  }'
```

### 4. Test Emergency Booking
```bash
curl -X POST https://your-test-app.onrender.com/api/test-emergency-booking
```

## Stripe Test Cards

Use these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Insufficient funds:** 4000 0000 0000 9995

## Webhook Setup

1. Go to Stripe Dashboard → Webhooks
2. Create new endpoint: `https://your-test-app.onrender.com/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to environment variables

## Testing Flow

1. Deploy development branch to test Render service
2. Configure environment variables
3. Set up Stripe webhook
4. Test email functionality with curl commands
5. Test complete payment flow with test cards
6. Verify emails are received
7. Check Render logs for any errors

## Success Indicators

✅ Environment variables are set correctly
✅ Email tests return success
✅ Payment flow works with test cards
✅ Booking form appears after payment
✅ Emails are sent and received
✅ No errors in Render logs
