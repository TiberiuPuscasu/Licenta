import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // ✅ Login (Autentificare)
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert("Autentificat cu succes!");
                    window.location.href = "dashboard.html";
                })
                .catch(error => alert(error.message));
        });
    }

    // ✅ Register (Înregistrare)
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert("Cont creat cu succes!");
                    window.location.href = "dashboard.html";
                })
                .catch(error => alert(error.message));
        });
    }

    // ✅ Logout (Delogare)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                alert("Te-ai deconectat cu succes!");
                window.location.href = "login.html"; // Redirecționare la pagina de login
            }).catch(error => {
                alert("Eroare la delogare: " + error.message);
            });
        });
    }

    // ✅ Protejarea Dashboard-ului - redirecționează utilizatorii neautentificați
    onAuthStateChanged(auth, (user) => {
        if (!user && window.location.pathname.includes("dashboard.html")) {
            window.location.href = "login.html";
        }
    });
});
