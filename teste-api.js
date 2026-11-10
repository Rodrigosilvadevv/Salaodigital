import fs from 'fs';

const fetchInstance = async () => {
  try {
    const url = 'https://evolution-api-production-f602.up.railway.app/instance/create'; // Confira se esta URL é a atual do Railway
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '193467281434131969c'
      },
      body: JSON.stringify({
        instanceName: "salao-digital-v10.26",
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });

    const text = await response.text();
    console.log("Status HTTP:", response.status);
    console.log("Resposta do servidor:", text.substring(0, 300)); // Imprime os primeiros 300 caracteres

  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};

fetchInstance();