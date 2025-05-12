import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("user-info");
  if (!userInfo) return;

  if (!user) {
    userInfo.textContent = "🔒 Nu ești autentificat";
    return;
  }

  const name = user.displayName || user.email.split("@")[0];
  userInfo.textContent = ` Salut, ${name.toUpperCase()}`;
});
