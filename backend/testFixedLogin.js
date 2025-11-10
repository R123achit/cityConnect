const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('\n🧪 Testing Login with Fixed Password...\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'neelkesarani@gmail.com',
      password: '123456'
    });

    if (response.data.success) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('📧 Email:', response.data.data.email);
      console.log('👤 Name:', response.data.data.name);
      console.log('🎭 Role:', response.data.data.role);
      console.log('🔑 Token received:', response.data.data.token.substring(0, 20) + '...');
    }
  } catch (error) {
    console.error('❌ LOGIN FAILED!');
    console.error('Error:', error.response?.data || error.message);
  }
};

testLogin();
