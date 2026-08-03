import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, collection, query, where, orderBy, limit, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let logout = document.querySelector('#btn_logout');
let fechas_vacio = document.querySelector('#fechas_vacio');
let fechas_lleno = document.querySelector('#fechas_lleno');
let gpo = "";

let asign_vacio = document.querySelector('#asign_vacio');
let asign_lleno1 = document.querySelector('#asign_lleno1');
let asign_lleno2 = document.querySelector('#asign_lleno2');
let asign_lleno3 = document.querySelector('#asign_lleno3');

let asignCU = [asign_lleno1, asign_lleno2, asign_lleno3];
let materiaNombres = {
  "PRA": "Producción Audiovisual",
  "ANA": "Animación avanzada",
  "SIM": "Simulación 3D"
};

obsAuth(async (user) => {

  //no necesita volver a autenticar
  const uid = user.uid;
  const docRef = doc(db, "users", uid);
  getDoc(docRef)
  //mostrar graficamente el nombre:
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      //get element by id es más rápido(?) 
      document.getElementById('usrNombre').innerText = userData.nombre;
      gpo = userData.grupo;
    }
    else {
      document.getElementById('usrNombre').innerText = 'Nombre';
    }
  }
  catch (error) {
    document.getElementById('usrNombre').innerText = 'Nombre';
    console.log("Error al obtener la información.");
  }

  //querry de si grupo tiene fechas asignadas y para ver qué fecha es la más cercana, uniendo con la query de fechas que ya teníamos jiji
  const notdocRef = collection(db, "fechas");
  const dt = new Date().toISOString().slice(0, 16);
  const fechaCerc = query(notdocRef,
    where("grupo", "==", gpo),
    where("fechaHora", ">=", dt),
    orderBy("fechaHora", "asc")
  );
  const resultao = await getDocs(fechaCerc);
  //si resultado no está vacio, entonces encontró que el maestro ha ingresado una fecha, y la fecha más cercana
  if (!resultao.empty) {

    const notdocSnap = resultao.docs[0];
    const fechaData = notdocSnap.data();
    const d = new Date(fechaData.fechaHora);
    //    v no time, cuidao. lenguaje y propiedades
    let dia = d.toLocaleString('es-ES', { dateStyle: 'long' });
    let hora = d.toLocaleString('es-ES', { timeStyle: 'short' });

    document.getElementById('dia').textContent = dia;
    document.getElementById('hora').textContent = hora;
    fechas_vacio.style.display = 'none';
    asign_vacio.style.display = 'none';
    fechas_lleno.style.display = 'block';

    resultao.docs.forEach((docSnap, i) => {
      if (i < asignCU.length && asignCU[i]) {
        const fechaData = docSnap.data();

        const nombreMat = materiaNombres[fechaData.materia] || fechaData.materia || "Materia";

        const span = asignCU[i].querySelector("h2 span");
        if (span) span.textContent = nombreMat;

        asignCU[i].style.display = 'grid';
      }
    });
    for (let y = resultao.docs.length; y < asignCU.length; y++) {
      if (asignCU[y]) asignCU[y].style.display = "none";
    }
  }
  else {
    fechas_vacio.style.display = 'flex';
    fechas_lleno.style.display = 'none';
    asign_vacio.style.display = 'flex';
    asign_lleno1.style.display = 'none';
    asign_lleno2.style.display = 'none';
    asign_lleno3.style.display = 'none';
  }



})


//log out
btnLogout();