import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function testOriginalConfig() {
  console.log('🔍 Testing Original PayPal Configuration...\n');
  
  // Check environment
  console.log('📋 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
  console.log('PAYPAL_API_BASE:', process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com');
  console.log('PAYPAL_CLIENT_ID_LIVE:', process.env.PAYPAL_CLIENT_ID_LIVE ? '✅ Set' : '❌ NOT SET');
  console.log('PAYPAL_CLIENT_SECRET_LIVE:', process.env.PAYPAL_CLIENT_SECRET_LIVE ? '✅ Set' : '❌ NOT SET');
  
  if (!process.env.PAYPAL_CLIENT_ID_LIVE || !process.env.PAYPAL_CLIENT_SECRET_LIVE) {
    console.log('\n❌ PayPal credentials not configured!');
    return;
  }
  
  // Test OAuth
  console.log('\n🧪 Testing PayPal OAuth...');
  
  try {
    const apiBase = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";
    const response = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID_LIVE}:${process.env.PAYPAL_CLIENT_SECRET_LIVE}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });
    
    console.log('Response Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! PayPal OAuth successful');
      console.log('Token Type:', data.token_type);
      console.log('Expires In:', data.expires_in, 'seconds');
    } else {
      const errorData = await response.text();
      console.log('❌ FAILED:', errorData);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
}

testOriginalConfig(); 