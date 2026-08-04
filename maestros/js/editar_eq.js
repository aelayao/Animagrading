import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, collection, query, where, orderBy, limit, getDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { obsAuth } from "../../alumnos/js/obsrvr.js";
import { btnLogout } from "../../alumnos/js/obsrvr.js";

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

//variabbles

let btnGuardar = document.getElementById('btn_guardar');
let btnVolver = document.getElementById('btn_azul');

//obtener información del usuario y listener
obsAuth(async (user) => {

    //si lo pongo afuera no funciona waa
    let gpoNom = document.getElementById("grupo_nom");
    let alumnosCont = document.getElementById("alumnos_info");

    let obtnGpo = new URLSearchParams(window.location.search);
    let grupo_nomb = obtnGpo.get("grupo");

    gpoNom.textContent = grupo_nomb;

    const uid = user.uid;

    btnVolver.addEventListener("click", (event) => {
        window.location.href = "./grupos.html"
    })

    //query de alumnos con el grupo
    const docRef = collection(db, "users");
    const alumnos = query(
        docRef,
        where("grupo", "==", grupo_nomb),
        where("maestro", "==", false)
    );
    const alumnoSnap = await getDocs(alumnos);

    alumnoSnap.forEach((docmnt) => {
        let alumno = docmnt.data();
        let alumnoId = docmnt.id; //para sacar el id y gaurdarlo despues en su equipo

        const alumnoxfila = document.createElement("div");
        alumnoxfila.classList.add("alumnos");

        // Dynamic Select HTML (pre-selects existing team if student already has one)
        alumnoxfila.innerHTML = `
      <span>${alumno.nombre} ${alumno.apellidoPaterno}</span>
      <select class="cosis_select" data-uid="${alumnoId}">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map(
                    (num) => `
          <option value="eq${num}" ${alumno.equipo === `eq${num}` ? "selected" : ""}>
            Equipo ${num}
          </option>
        `
                )
                .join("")}
      </select>
    `;

        alumnosCont.appendChild(alumnoxfila);
    });
    
    btnGuardar.addEventListener("click", async (event) => {
        event.preventDefault();
        let cosis_slct = document.querySelectorAll(".cosis_select");

        try {
            //para cada opción del select
            for (const select of cosis_slct) {
                const alumnoid_g = select.dataset.uid;
                const equipoSlct = select.value;

                // Update the 'equipo' field inside each student's document in 'users'
                const notDocRef = doc(db, "users", alumnoid_g);
                await updateDoc(notDocRef, {
                    equipo: equipoSlct,
                });
            }

            alert("¡Equipos guardados correctamente!");
            window.location.href = "./grupos.html"
        }
        catch (error) {
            alert("Hubo un error al guardar los equipos.");
        }


    })

})

//log out
btnLogout();
