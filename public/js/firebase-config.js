import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
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

export { auth };
