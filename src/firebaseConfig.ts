// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsf6hxbvrOpkfL6VXJmYtosbcYvX0PC9k",
  authDomain: "personal-website-b97cc.firebaseapp.com",
  projectId: "personal-website-b97cc",
  storageBucket: "personal-website-b97cc.appspot.com",
  messagingSenderId: "156855584872",
  appId: "1:156855584872:web:1264374e3493e8f3ecd3dd",
  measurementId: "G-XM77FK7832"
};


const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
const auth = getAuth(app);
export { db, auth };
