
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoJJGUrBzGmBHV5W6riKgjG_x3nON-0l8",
  authDomain: "herodex-72322.firebaseapp.com",
  projectId: "herodex-72322",
  storageBucket: "herodex-72322.firebasestorage.app",
  messagingSenderId: "335453408913",
  appId: "1:335453408913:web:0fb91043d66c1b49b1b930",
  measurementId: "G-HVFH0C84NS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
