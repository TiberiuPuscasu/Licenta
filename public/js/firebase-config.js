import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDA4AD13doiixXKz8RikSiTR_-KnGNjG9g",
    authDomain: "aplicatiewebbaschet.firebaseapp.com",
    projectId: "aplicatiewebbaschet",
    storageBucket: "aplicatiewebbaschet.appspot.com",
    messagingSenderId: "862570047985",
    appId: "1:862570047985:web:d8f8bd6a72019f4140bc50",
    measurementId: "G-J9SG63C3PD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("User signed in with Google:", user);
        return user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw error;
    }
};

export { auth };
