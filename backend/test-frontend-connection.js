import fetch from 'node-fetch';

async function testFrontendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection...\n');
  
  try {
    // Test the exact endpoint the frontend is calling
    const response = await fetch('http://localhost:8080/api/getreviews', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });
    
    console.log('✅ Backend Response Status:', response.status);
    console.log('✅ Backend Response Headers:', response.headers.get('access-control-allow-origin'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend Data Received:', data.length, 'reviews');
      console.log('✅ First Review:', data[0]?.clientName || 'No reviews');
    } else {
      console.log('❌ Backend Error:', response.statusText);
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
  
  console.log('\n💡 Troubleshooting Steps:');
  console.log('1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)');
  console.log('2. Check browser console for CORS errors');
  console.log('3. Try opening in incognito/private mode');
  console.log('4. Restart both frontend and backend servers');
}

testFrontendConnection(); 