import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, setDoc, addDoc, collection, query, where, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { obsAuth } from "/Animagrading/alumnos/js/obsrvr.js";
import { btnLogout } from "/Animagrading/alumnos/js/obsrvr.js";

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
let materia = document.querySelector('#campo-materia');
let grupo = document.querySelector('#campo-grupo');
let tipoEvaluacion = document.querySelector('#campo-tipo');
let fechaHora = document.querySelector('#campo-fecha');
let guardar = document.querySelector('#btn_guardar');
let volver = document.querySelector('#btn_volver');
let matMaestr = "";


//obtener información del usuario y listener
obsAuth(async (user) => {

  volver.addEventListener("click", (event) => {
    window.location.href = "./fechas.html"
  })

  const uid = user.uid;
  const notdocRef = doc(db, "users", uid);

  try {

    const docSnap = await getDoc(notdocRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (uid != "WdQLH3OOurbZctwW5ZfMXc30KXS2") {
        materia.value= userData.materia;
        materia.disabled = true;
      }
      else{
        materia.disabled = false;
      }

    }
  }
  catch (error) {
    console.log("Error al obtener la información.");
  }

  guardar.addEventListener("click", async (event) => {
    event.preventDefault(); //previene que se guarden datos por error al recargar

    //no trim pq son puros select
    let mat = materia.value;
    let gpo = grupo.value;
    let tipoEv = tipoEvaluacion.value;
    let fechaHr = fechaHora.value;

    if (fechaHr == "") {
      alert("Por favor llene todos los campos");
      return;
    }

    //cloud firestore crea un id con addDoc, contrario a setDoc, a ver
    const docRef = await addDoc(collection(db, "fechas"), {
      materia: mat,
      grupo: gpo,
      tipoEvaluacion: tipoEv,
      fechaHora: fechaHr,
      idMaestro: uid
    })

    alert("Fecha guardada con éxito!")
    window.location.href = "./fechas.html"
  })

})

//log out
btnLogout();
