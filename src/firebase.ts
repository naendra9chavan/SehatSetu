 import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAO0bIOqHUsAzJBSec56cy4jKx0GX9v_zI",
  authDomain: "sehatsetu-2eb27.firebaseapp.com",
  projectId: "sehatsetu-2eb27",
  storageBucket: "sehatsetu-2eb27.firebasestorage.app",
  messagingSenderId: "825772460894",
  appId: "1:825772460894:web:b3704d9bcb8798a5301dcf",
  measurementId: "G-VMW22B697G"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;