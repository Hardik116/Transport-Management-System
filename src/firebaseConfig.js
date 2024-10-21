// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "atlan-2255d.firebaseapp.com",
  projectId: "atlan-2255d",
  storageBucket: "atlan-2255d.appspot.com",
  messagingSenderId: "442347716076",
  appId: "1:442347716076:web:c5c0ea9f7aa0bce08394c9",
  measurementId: "G-0GFQTSVVJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Ensure auth is initialized
const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { auth ,googleProvider}; // Export auth for use in other components
