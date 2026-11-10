import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCyqdDgxZob4ovTjm3495LtjqFcQ11kqQ0",
  authDomain: "salao-digital-6d41e.firebaseapp.com",
  projectId: "salao-digital-6d41e",
  storageBucket: "salao-digital-6d41e.firebasestorage.app",
  messagingSenderId: "642604754439",
  appId: "1:642604754439:web:e29003d595952e4cdeaca2"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta o gerenciador de mensagens
export const messaging = getMessaging(app);