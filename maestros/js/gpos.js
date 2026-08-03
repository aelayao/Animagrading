import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, collection, query, where, orderBy, limit, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let contenedor = document.getElementById('contenedorGrupos');
let cont_editar = document.getElementById('alumnos_info');
let matMaestro = "";
let grupos = [];
let grupo = 0;

//obtener información del usuario y listener
obsAuth(async (user) => {

    const uid = user.uid;

    const fechasRef = collection(db, "fechas");
    const fechMaestro = query(fechasRef, where("idMaestro", "==", uid));
    const result = await getDocs(fechMaestro);

    result.forEach((doc) => {
        let dataGpos = doc.data();
        if (dataGpos.grupo && !grupos.includes(dataGpos.grupo)) {
            grupos.push(dataGpos.grupo);
        }
    })
    //console.log(grupos)

    for (grupo of grupos) {
        // Query students in this group
        const docRef = collection(db, "users");
        const alumno = query(
            docRef,
            where("grupo", "==", grupo),
            where("maestro", "==", false)
        );
        const alumnoSnap = await getDocs(alumno);
        let alumnos = [];

        alumnoSnap.forEach((doc) => {
            alumnos.push(doc.data());
        });
        detailsxgpo(contenedor, grupo, alumnos);
    }

    function detailsxgpo(contenedor, grupo, alumnos) {
        let divxgpo = document.createElement("div");
        divxgpo.classList.add("grupo");

        const equipos = {};

        alumnos.forEach((alumno) => {
            let eqI = alumno.equipo || "Sin equipo";

            if (!equipos[eqI]) {
                equipos[eqI] = [];
            }
            equipos[eqI].push(alumno);
        });

        let eq_mostr = "";

        if (Object.keys(equipos).length === 0) {
            eq_mostr = "<p>No hay alumnos en este grupo</p>";
        } else {
            for (const [eqI, miembros] of Object.entries(equipos)) {

                const nomb_eq = eqI.startsWith("eq")
                    ? `Equipo ${eqI.replace("eq", "")}`
                    : eqI;


                const lista_miem = miembros
                    .map((s) => `<li>${s.nombre} ${s.apellidoPaterno || ""}</li>`)
                    .join("");

                eq_mostr += `
        <div class="equipo-block">
          <strong>
            <a href="evaluar.html?grupo=${encodeURIComponent(grupo)}&equipo=${encodeURIComponent(eqI)}" class="eq_link">
              ${nomb_eq}. Participantes:
            </a>
          </strong>
          <ul>
            ${lista_miem}
          </ul>
        </div>
      `;
            }
        }

        divxgpo.innerHTML = `
    <details>
      <summary>
        <span>${grupo}</span>
      </summary>
      <div class="info">
        ${eq_mostr}
      </div>
    </details>
    <a class="btn_editar" href="editar_equipos.html?grupo=${encodeURIComponent(grupo)}">editar equipos</a>
  `;

        contenedor.appendChild(divxgpo);
        /*const studentListHTML = alumnos.length > 0
            ? alumnos.map(s => `<li>${s.nombre} ${s.apellidoPaterno || ''}</li>`).join('')
            : '<li>No hay alumnos en este grupo</li>';

        contenedor.appendChild(divxgpo);*/
    }



    /*const docRef = doc(db, "users", uid);
    getDoc(docRef)
    //mostrar la materia asignada al maestro
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            userData.materia = matMaestro;
 
        }
        else {
        }
    }
    catch (error) {
    }*/


})

//log out
btnLogout();
