import fs from 'fs';

const fetchInstance = async () => {
try {
const response = await fetch('evolution-api-production-f602.up.railway.app', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'apikey': '193467281434131969c'
},
body: JSON.stringify({
instanceName: "salao-digital-v7", // Mude o nome para criar uma nova instância sem erro
qrcode: true,
integration: "WHATSAPP-BAILEYS"
})
});

const data = await response.json();

// O QR Code vem dentro de data.qrcode.base64
if (data.qrcode && data.qrcode.base64) {
const base64Data = data.qrcode.base64.split(';base64,').pop();
fs.writeFileSync('qrcode.png', base64Data, { encoding: 'base64' });
console.log("Sucesso! O arquivo 'qrcode.png' foi criado na pasta do projeto.");
} else {
console.log("Resposta da API (verifique se já está conectado):", data);
}
} catch (error) {
console.error("Erro:", error);
}
};

fetchInstance();
