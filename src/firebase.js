// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDZBzDCPt35_YUue-O-LiLIO5tfs92b3qk",
  authDomain: "network-game-d37e5.firebaseapp.com",
  projectId: "network-game-d37e5",
  storageBucket: "network-game-d37e5.firebasestorage.app",
  messagingSenderId: "329897685229",
  appId: "1:329897685229:web:0881e7c10a3fc031741ce4"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);