// Debug script for email flow issues
const API_URL = process.env.API_URL || 'http://localhost:5000';

async function debugEmailFlow() {
    console.log('🔍 Debugging Email Flow Issues...\n');

    try {
        // Step 1: Test basic email configuration
        console.log('1️⃣ Testing basic email configuration...');
        const basicEmailTest = await fetch(`${API_URL}/api/test-resend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const basicResult = await basicEmailTest.json();
        console.log('Basic email test result:', basicResult);
        
        if (!basicResult.success) {
            console.error('❌ Basic email test failed:', basicResult.error);
            return;
        }
        
        console.log('✅ Basic email configuration is working\n');

        // Step 2: Test form email templates
        console.log('2️⃣ Testing form email templates...');
        const formEmailTest = await fetch(`${API_URL}/api/test-form-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Debug Test User',
                email: 'debug@example.com',
                phone: '+1234567890',
                message: 'This is a debug test message',
                readingtype: 'Pre-recorded session ($395)'
            })
        });
        
        const formResult = await formEmailTest.json();
        console.log('Form email test result:', formResult);
        
        if (!formResult.success) {
            console.error('❌ Form email test failed:', formResult.error);
            return;
        }
        
        console.log('✅ Form email templates are working\n');

        // Step 3: Test complete flow
        console.log('3️⃣ Testing complete form-before-payment flow...');
        
        // Create temporary booking
        const tempBookingResponse = await fetch(`${API_URL}/api/create-temp-booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Debug Flow User',
                email: 'debugflow@example.com',
                phone: '+1234567890',
                message: 'Complete flow debug test',
                readingtype: 'Pre-recorded session ($395)',
                productName: 'Debug Premium Reading',
                price: 395,
                productType: 'premium'
            })
        });

        const tempBooking = await tempBookingResponse.json();
        console.log('Temporary booking created:', tempBooking);

        if (!tempBooking.success) {
            throw new Error('Failed to create temporary booking');
        }

        // Create checkout session
        const checkoutResponse = await fetch(`${API_URL}/api/create-checkout-session-with-form`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productName: 'Debug Premium Reading',
                userPrice: 395,
                tempBookingId: tempBooking.tempBookingId,
                productType: 'premium'
            })
        });

        const checkout = await checkoutResponse.json();
        console.log('Checkout session created:', checkout);

        if (checkout.error) {
            throw new Error('Failed to create checkout session: ' + checkout.error);
        }

        console.log('\n🎯 Next Steps:');
        console.log('1. Complete the Stripe checkout with this session ID:', checkout.id);
        console.log('2. Check server logs for webhook processing');
        console.log('3. Verify emails are sent to debugflow@example.com and info@soulsticetarot.com');
        console.log('4. Check that booking status is updated to "completed"');

        console.log('\n📋 Debug Checklist:');
        console.log('□ Webhook endpoint is accessible');
        console.log('□ Stripe webhook is configured correctly');
        console.log('□ Environment variables are set (RESEND_API_KEY, EMAIL_USER, STRIPE_WEBHOOK_SECRET)');
        console.log('□ Server logs show webhook processing');
        console.log('□ Booking is found and updated');
        console.log('□ Form data is present in booking');
        console.log('□ Emails are sent successfully');

    } catch (error) {
        console.error('❌ Debug test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the debug
debugEmailFlow();
