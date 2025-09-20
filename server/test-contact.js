import fetch from 'node-fetch';

const testContact = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User Debug',
        email: 'test@debug.com',
        subject: 'Test Debug BD',
        message: 'Test pour vérifier l\'enregistrement en base de données'
      })
    });

    const data = await response.json();
    console.log('✅ Response:', data);
    
    // Vérifier si le message a été sauvegardé
    const checkResponse = await fetch('http://localhost:5000/api/v1/admin/messages', {
      headers: {
        'Authorization': 'Bearer mock-admin-token'
      }
    });
    
    const messages = await checkResponse.json();
    console.log('📊 Messages en BD:', messages);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testContact();
