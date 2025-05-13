import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const registerBtn = document.getElementById("register-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // ✅ Toast Notification (Notificare Toast)
    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.className = "toast";
        }, 3000);
    }

    // ✅ Login (Autentificare)
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    showToast("Autentificat cu succes!", "success");
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                })
                .catch((error) => {
                        const errorCode = error.code;
                        let message = "A apărut o eroare. Încearcă din nou.";

                        switch (errorCode) {
                            case "auth/user-not-found":
                                message = "Acest cont nu există.";
                                break;
                            case "auth/wrong-password":
                                message = "Parola introdusă este greșită.";
                                break;
                            case "auth/invalid-email":
                                message = "Adresa de email este invalidă.";
                                break;
                           
    }

    showToast(message, "error");
});

        });
    }

    // ✅ Register (Înregistrare)
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    showToast("Cont creat cu succes!", "success");
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                })
                .catch(error => showToast(error.message, "error"));
        });
    }

    // ✅ Logout (Delogare)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                showToast("Te-ai deconectat cu succes!", "success");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);
            }).catch(error => {
                showToast("Eroare la delogare: " + error.message, "error");
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
