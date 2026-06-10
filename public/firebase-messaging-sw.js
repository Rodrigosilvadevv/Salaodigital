importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCyqdDgxZob4ovTjm3495LtjqFcQ11kqQ0",
  authDomain: "salao-digital-6d41e.firebaseapp.com",
  projectId: "salao-digital-6d41e",
  storageBucket: "salao-digital-6d41e.firebasestorage.app",
  messagingSenderId: "642604754439",
  appId: "1:642604754439:web:e29003d595952e4cdeaca2"
};

// Inicializa no Service Worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Detecta notificações em segundo plano
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || "Novo Agendamento! ✂️";
  const notificationOptions = {
    body: payload.notification.body || "Confira os detalhes no seu painel.",
    icon: '/icon.png' // Certifique-se de ter um ícone na pasta public se quiser usá-lo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});