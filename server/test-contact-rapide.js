import fetch from 'node-fetch';

const testContactRapide = async () => {
  try {
    console.log('🧪 Test du formulaire de contact rapide...');
    
    const response = await fetch('http://localhost:5000/api/v1/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Contact Rapide',
        email: 'contact.rapide@test.com',
        message: 'Message envoyé via le formulaire de contact rapide',
        subject: 'Message via contact rapide'
      })
    });

    const data = await response.json();
    console.log('✅ Response Contact Rapide:', data);
    
    if (data.success) {
      console.log('🎉 Le formulaire de contact rapide fonctionne parfaitement !');
    } else {
      console.log('❌ Erreur dans le formulaire de contact rapide');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

testContactRapide();
