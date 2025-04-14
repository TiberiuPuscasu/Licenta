import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Test: Adaugă un document în Firestore
async function testFirestore() {
    const testRef = doc(db, "test", "testDocument");

    // Scrie un document
    await setDoc(testRef, { mesaj: "Conexiunea funcționează!" });
    console.log("Document scris cu succes!");

    // Citește documentul
    const docSnap = await getDoc(testRef);
    if (docSnap.exists()) {
        console.log("Document citit:", docSnap.data());
    } else {
        console.log("Documentul nu există!");
    }
}

testFirestore();