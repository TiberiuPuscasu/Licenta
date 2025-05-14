import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { db } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: function (info) {
      alert('Exercițiu: ' + info.event.title + '\nCategorie: ' + info.event.extendedProps.categorie);
    }
  });

  calendar.render();

  const auth = getAuth();
  let ziuaSelectata = new Date().toLocaleDateString('fr-CA');

  calendar.on('dateClick', function (info) {
    ziuaSelectata = info.dateStr;
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const exercitiiRef = collection(db, "exercitii");
    const q = query(exercitiiRef, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    snapshot.forEach(doc => {
      const data = doc.data();
      calendar.addEvent({
        title: data.title,
        start: data.date,
        classNames: [data.categorie],
        extendedProps: {
          categorie: data.categorie
        }
      });
    });
  });

  document.getElementById('analizeaza').addEventListener('click', function () {
    const dataVizibila = calendar.getDate(); 
    const ziua = new Date(dataVizibila).toLocaleDateString('fr-CA');

    const events = calendar.getEvents();
    const categoriiPeZi = {};

    events.forEach(event => {
      const dataEvent = event.startStr;
      const cat = event.extendedProps.categorie?.toLowerCase();
      if (dataEvent === ziua && cat) {
        categoriiPeZi[cat] = (categoriiPeZi[cat] || 0) + 1;
      }
    });

    const toateCategorii = ["dribling", "aruncari", "aparare", "conditie"];
    let rezultat = `<strong>Ai efectuat în ${ziua}:</strong><br>`;

    toateCategorii.forEach(cat => {
      const nume = cat.charAt(0).toUpperCase() + cat.slice(1);
      const count = categoriiPeZi[cat] || 0;
      rezultat += `• ${nume}: ${count} exercițiu${count === 1 ? '' : 'e'}<br>`;
    });

    document.getElementById('sugestii').innerHTML = rezultat;
  });

  document.getElementById('reseteaza-ziua')?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;

    const exercitiiRef = collection(db, "exercitii");
    const q = query(exercitiiRef, where("uid", "==", user.uid), where("date", "==", ziuaSelectata));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert(`Nu există exerciții în ${ziuaSelectata} de șters.`);
      return;
    }

    const confirmare = confirm(`Ești sigur că vrei să ștergi toate exercițiile din ${ziuaSelectata}?`);
    if (!confirmare) return;

    const stergeri = [];
    snapshot.forEach(doc => {
      stergeri.push(deleteDoc(doc.ref));
    });

    await Promise.all(stergeri);
    alert("✔️ Exercițiile au fost șterse!");
    window.location.reload();
  });

});
