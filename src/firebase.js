// src/firebase.js

// --- IMPORTS ---
// Make sure all of these are at the top
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // For the database

// --- CONFIGURATION ---
// This part reads the keys from your Netlify settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// --- DEBUGGING ---
// This line helps us check if the keys are loading correctly
console.log("Firebase API Key from Netlify:", import.meta.env.VITE_FIREBASE_API_KEY);


// --- INITIALIZATION & EXPORTS ---
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);
