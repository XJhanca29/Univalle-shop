// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// REEMPLAZA ESTO CON LOS DATOS QUE COPIASTE DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDIAi0V7rW6CfJ6q9c6UvLkgIchuhBEsNI",
  authDomain: "univalle-shop.firebaseapp.com",
  projectId: "univalle-shop",
  storageBucket: "univalle-shop.firebasestorage.app",
  messagingSenderId: "680057567416",
  appId: "1:680057567416:web:594aa4c2a11c76c16f9c4d",
  measurementId: "G-7G8YMX9VWL"
};

// Inicializamos la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas de Autenticación para usarlas en React
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Opcional: Forzar a que el usuario siempre tenga que elegir su cuenta
googleProvider.setCustomParameters({
  prompt: 'select_account'
});