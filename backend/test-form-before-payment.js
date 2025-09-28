// Test script for form-before-payment flow
const API_URL = process.env.API_URL || 'http://localhost:5000';

async function testFormBeforePaymentFlow() {
    console.log('🧪 Testing Form-Before-Payment Flow...\n');

    try {
        // Step 1: Create temporary booking with form data
        console.log('1️⃣ Creating temporary booking with form data...');
        const tempBookingResponse = await fetch(`${API_URL}/api/create-temp-booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                phone: '+1234567890',
                message: 'This is a test message for form-before-payment flow',
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

        // Step 2: Create checkout session with form data
        console.log('\n2️⃣ Creating checkout session with form data...');
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

        console.log('\n🎉 Form-before-payment flow test completed successfully!');
        console.log('📝 Next steps:');
        console.log('   - Complete the Stripe checkout process');
        console.log('   - Verify webhook processes the payment');
        console.log('   - Check that emails are sent with form data');
        console.log('   - Verify booking is marked as completed in database');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testFormBeforePaymentFlow();
