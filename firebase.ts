import { initializeApp,getApps,getApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBEBLyE-2uFvp5IT6lQBLaXlFr7-mSpU4k",
  authDomain: "notion-clone-8467b.firebaseapp.com",
  projectId: "notion-clone-8467b",
  storageBucket: "notion-clone-8467b.firebasestorage.app",
  messagingSenderId: "1060439335003",
  appId: "1:1060439335003:web:a0aabebeadc7592a6a1f7e"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export {db}