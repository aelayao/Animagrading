import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, setDoc, addDoc, collection, query, where, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { obsAuth } from "./obsrvr.js";
import { btnLogout } from "./obsrvr.js";

//identificadores de firebase
const firebaseConfig = {
  apiKey: "AIzaSyAWNa6Bk-nw5vbsR6izejn44V-C90bV2ik",
  authDomain: "ad-c668f.firebaseapp.com",
  projectId: "ad-c668f",
  storageBucket: "ad-c668f.firebasestorage.app",
  messagingSenderId: "478756211511",
  appId: "1:478756211511:web:e2dcb8d9d070792d4168b2",
  measurementId: "G-RW1BW7LCEB"
};

//Inicializar firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); //inicializa cloud firestore

//variables
let dtls_1 = document.querySelector('#dtls_1');
let dtls_2 = document.querySelector('#dtls_2');
let materiaNom = "";

obsAuth(async (user) => {

  let container = document.getElementById('dropdown');
  //no necesita volver a autenticar
  const uid = user.uid;

  try {
    // querry de obtener evaluaciones
    const docRef = collection(db, "calificaciones");
    const calif = query(
      docRef,
      where("alumnosEvaluados", "array-contains", uid)
    );

    const califSnap = await getDocs(calif);

    if (califSnap.empty) {
      console.log("Aún no tienes evaluaciones registradas.");
      container.innerHTML = "<p>Aún no tienes evaluaciones registradas.</p>";
      return;
    }
    if (container) container.innerHTML = "";

    

    for (const califDoc of califSnap.docs) {
      const evaluacioData = califDoc.data();
      let rubricaData = {};
      if (evaluacioData.idMaestro) {
        const rubricaDocRef = doc(db, "rubricas", evaluacioData.idMaestro);
        const rubricaSnap = await getDoc(rubricaDocRef);
        if (rubricaSnap.exists()) {
          rubricaData = rubricaSnap.data();
        }
      }

      let mater = rubricaData.materia || "Materia sin nombre";
      if (rubricaData.materia == "PRA") {
        materiaNom = "Producción Audiovisual";
      }
      else if (rubricaData.materia == "ANA") {
        materiaNom = "Animación avanzada";
      }
      else if (rubricaData.materia == "SIM") {
        materiaNom = "Simulación 3D";
      }

      const card = document.createElement("div");
      card.classList.add("dropdown");

      card.innerHTML = `
        <details>
          <summary>Materia - <span>${materiaNom}</span></summary>
          <div class="info">
            <h2>Rúbrica</h2>
            <h3>Puntos obtenidos:</h3>
            <ul>
              <li>
                <span>${rubricaData.elemento1 || "Elemento 1"}</span> - 
                Valor: <span>${evaluacioData.valor_e1 ?? 0}</span>% / 
                <span class="calif">${rubricaData.valor_e1 || 0}%</span>
              </li>
              <li>
                <span>${rubricaData.elemento2 || "Elemento 2"}</span> - 
                Valor: <span>${evaluacioData.valor_e2 ?? 0}</span>% / 
                <span class="calif">${rubricaData.valor_e2 || 0}%</span>
              </li>
              <li>
                <span>${rubricaData.elemento3 || "Elemento 3"}</span> - 
                Valor: <span>${evaluacioData.valor_e3 ?? 0}</span>% / 
                <span class="calif">${rubricaData.valor_e3 || 0}%</span>
              </li>
            </ul>

            <h2>Calificación total del proyecto final:</h2>
            <span class="calif">${evaluacioData.calificacionTotal ?? 0}</span>

            <h2>Retroalimentación:</h2>
            <span>${evaluacioData.retroalimentacion || "Sin comentarios."}</span>
          </div>
        </details>
      `;

      container.appendChild(card);
    }

    /* if (idmaest) {
      const rubricaDocRef = doc(db, "rubricas", idmaest);
      const rubricaSnap = await getDoc(rubricaDocRef);

      if (rubricaSnap.exists()) {
        rubricaData = rubricaSnap.data();
      }
    }
    if (rubricaData.materia) {
      if (rubricaData.materia == "PRA") {
        document.getElementById("materia1").textContent = "Producción Audiovisual";
      }
      else if (rubricaData.materia == "ANA") {
        document.getElementById("materia1").textContent = "Animación avanzada";
      }
      else if (rubricaData.materia == "SIM"){
        document.getElementById("materia1").textContent = "Simulación 3D";
      }
    }

    document.getElementById("m1_rbc1").textContent = rubricaData.elemento1 || "Elemento 1";
    document.getElementById("m1_rbc2").textContent = rubricaData.elemento2 || "Elemento 2";
    document.getElementById("m1_rbc3").textContent = rubricaData.elemento3 || "Elemento 3";

    document.getElementById("m1_vlr1").textContent = rubricaData.valor_e1 || "#";
    document.getElementById("m1_vlr2").textContent = rubricaData.valor_e2 || "#";
    document.getElementById("m1_vlr3").textContent = rubricaData.valor_e3 || "#";

    document.getElementById("m1_calif_vlr1").textContent = evaluacioData.valor_e1 ?? "0";
    document.getElementById("m1_calif_vlr2").textContent = evaluacioData.valor_e2 ?? "0";
    document.getElementById("m1_calif_vlr3").textContent = evaluacioData.valor_e3 ?? "0";

    document.getElementById("m1_calif_total").textContent = evaluacioData.calificacionTotal ?? "0";
    document.getElementById("m1_retro").textContent = evaluacioData.retroalimentacion || "N/A"; */

  }
  catch (error) {
    console.log(error);
  }

})

//log out
btnLogout();