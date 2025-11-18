// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkuK9X9q76YYOslieWgBiT__hSBxE8Td4",
  authDomain: "shree-raaga-swaad-ghar.firebaseapp.com",
  projectId: "shree-raaga-swaad-ghar",
  storageBucket: "shree-raaga-swaad-ghar.firebasestorage.app",
  messagingSenderId: "934443263767",
  appId: "1:934443263767:web:36aaca35ddaad8a030f952",
  measurementId: "G-NJB70Y8PQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;