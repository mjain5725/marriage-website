// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh7moNA3Y7USJW70UzGwgSjkWK0RN-6L4",
  authDomain: "marriage-work-website.firebaseapp.com",
  projectId: "marriage-work-website",
  storageBucket: "marriage-work-website.firebasestorage.app",
  messagingSenderId: "688169229957",
  appId: "1:688169229957:web:ff1b48d413ada4959253ec",
  measurementId: "G-7Q970VD7GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);