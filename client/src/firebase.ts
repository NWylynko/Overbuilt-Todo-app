// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth"
import { firebaseConfig } from "./firebaseConfig"


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider)