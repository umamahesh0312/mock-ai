import { initializeApp,getApps,getApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyA4UIHtmd4HUdCEjJEa6H9GZLdmr9VLofA",
    authDomain: "mock-interview-84f96.firebaseapp.com",
    projectId: "mock-interview-84f96",
    storageBucket: "mock-interview-84f96.firebasestorage.app",
    messagingSenderId: "162146222499",
    appId: "1:162146222499:web:503633529e53e60fd1da16",
    measurementId: "G-2WS2E7YCFB"
};

// Initialize Firebase
const app = !getApps.length?initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);



