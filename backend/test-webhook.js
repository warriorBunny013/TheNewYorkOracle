// Test script to verify webhook and email functionality
const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testWebhookAndEmail() {
    console.log('🧪 Testing Webhook and Email Functionality...\n');

    try {
        // Step 1: Create a test booking with form data
        console.log('1️⃣ Creating test booking with form data...');
        const tempBookingResponse = await fetch(`${API_URL}/api/create-temp-booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                phone: '+1234567890',
                message: 'This is a test message for webhook testing',
                readingtype: 'Pre-recorded session ($395)',
                productName: 'Test Premium Reading',
                price: 395,
                productType: 'premium'
            })
        });

        const tempBooking = await tempBookingResponse.json();
        console.log('✅ Temporary booking created:', tempBooking);

        if (!tempBooking.success) {
            throw new Error('Failed to create temporary booking');
        }

        // Step 2: Create checkout session
        console.log('\n2️⃣ Creating checkout session...');
        const checkoutResponse = await fetch(`${API_URL}/api/create-checkout-session-with-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: 'Test Premium Reading',
                userPrice: 395,
                tempBookingId: tempBooking.tempBookingId,
                productType: 'premium'
            })
        });

        const checkout = await checkoutResponse.json();
        console.log('✅ Checkout session created:', checkout);

        if (checkout.error) {
            throw new Error('Failed to create checkout session: ' + checkout.error);
        }

        // Step 3: Simulate webhook call (for testing purposes)
        console.log('\n3️⃣ Testing webhook simulation...');
        console.log('📝 To test the webhook:');
        console.log('   1. Complete the Stripe checkout with session ID:', checkout.id);
        console.log('   2. Check server logs for webhook processing');
        console.log('   3. Verify emails are sent to test@example.com and info@soulsticetarot.com');
        console.log('   4. Check that booking status is updated to "completed"');

        console.log('\n🔍 Debugging steps:');
        console.log('   - Check if webhook endpoint is accessible');
        console.log('   - Verify STRIPE_WEBHOOK_SECRET is set correctly');
        console.log('   - Check if RESEND_API_KEY is configured');
        console.log('   - Verify EMAIL_USER is set');
        console.log('   - Check server console for error messages');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testWebhookAndEmail();
