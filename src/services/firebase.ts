import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Determinar si estamos en modo local (para no romper el entorno de desarrollo)
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('192.168') || window.location.hostname.includes('127.0.0.1'));

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  // Truco maestro para ITP de Apple: Usamos el mismo dominio exacto donde corre la app en producción
  authDomain: isLocal ? (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-domain") : (typeof window !== 'undefined' ? window.location.host : "demo-domain"),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "demo-sender",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-appId"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
