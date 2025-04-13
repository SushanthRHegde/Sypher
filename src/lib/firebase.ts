
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged, 
  User 
} from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCjPrk05XU9dTZRduNh98lV11zCNBGFc8g",
  authDomain: "sypher-8719a.firebaseapp.com",
  projectId: "sypher-8719a",
  storageBucket: "sypher-8719a.firebasestorage.app",
  messagingSenderId: "80685293386",
  appId: "1:80685293386:web:4d55f5bb42fa2055c92bb3",
  measurementId: "G-P08SE5985R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { auth, onAuthStateChanged };
