import axios from 'axios';

// Simulate the frontend API call
const testFrontendAPI = async () => {
  try {
    console.log('Testing frontend API call...');
    console.log('URL: http://localhost:8080/api/getreviews');
    
    const response = await axios.get('http://localhost:8080/api/getreviews', {
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Data length:', response.data.length);
    console.log('First review:', response.data[0]?.clientName);
    
  } catch (error) {
    console.error('❌ Error:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
  }
};

testFrontendAPI(); 