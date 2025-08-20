// src/firebase.js

// --- IMPORTS ---
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // For the database

// --- CONFIGURATION ---
// Read the keys from your Netlify environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// --- DEBUGGING ---
// Print all env vars (in development only)
if (import.meta.env.MODE === "development") {
  console.log("Firebase config (dev):", firebaseConfig);
}

// --- FAIL-SAFE CHECK ---
// If any value is missing, throw a readable error instead of a white screen
if (Object.values(firebaseConfig).some((val) => !val)) {
  throw new Error("🔥 Firebase ENV vars are missing! Check Netlify settings.");
}

// --- INITIALIZATION & EXPORTS ---
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);
