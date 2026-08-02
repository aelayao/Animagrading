import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, collection, query, where, orderBy, limit, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

//variables
let logout = document.querySelector('#btn_logout');
let fechas_vacio = document.querySelector('#fechas_vacio');
let fechas_lleno = document.querySelector('#fechas_lleno');

let asign_vacio = document.querySelector('#asign_vacio');
let asign_lleno1 = document.querySelector('#asign_lleno1');
let asign_lleno2 = document.querySelector('#asign_lleno2');
let asign_lleno3 = document.querySelector('#asign_lleno3');
let asign_info = false;

obsAuth(async (user) => {
  console.log("listener tlabajando...")
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
    }
    else {
      document.getElementById('usrNombre').innerText = 'Nombre';
    }
  }
  catch (error) {
    document.getElementById('usrNombre').innerText = 'Nombre';
    console.log("Error al obtener la información.");
  }
  //querry de si maestro tiene fechas ingresadas y para ver qué fecha es la más cercana, uniendo con la query de fechas que ya teníamos jiji
  const notdocRef = collection(db, "fechas");
  const dt = new Date().toISOString().slice(0, 16);
  const fechaCerc = query(notdocRef,
    where("idMaestro", "==", uid),
    where("fechaHora", ">=", dt),
    orderBy("fechaHora", "asc"),
    limit(1)
  );
  const resultao = await getDocs(fechaCerc);
  //si resultado no está vacio, entonces encontró que el maestro ha ingresado una fecha, y la fecha más cercana
  if (!resultao.empty) {
    
    const docSnap = resultao.docs[0];
    const fechaData = docSnap.data();
    const d = new Date(fechaData.fechaHora);
    //    v no time, cuidao. lenguaje y propiedades
    let dia = d.toLocaleString('es-ES', { dateStyle: 'long' });
    let hora = d.toLocaleString('es-ES', { timeStyle: 'short' });

    document.getElementById('dia').textContent = dia;
    document.getElementById('hora').textContent = hora;
    fechas_vacio.style.display = 'none';
    fechas_lleno.style.display = 'block';
  }
  else {
    fechas_vacio.style.display = 'flex';
    fechas_lleno.style.display = 'none';
  }


  //revisar si hay información de asignaciones (preeliminar)
  if (asign_info == false) {
    asign_vacio.style.display = 'flex';
    asign_lleno1.style.display = 'none';
    asign_lleno2.style.display = 'none';
    asign_lleno3.style.display = 'none';
  }
  else { //later check individually if there is more info
    asign_vacio.style.display = 'none';
    asign_lleno1.style.display = 'grid';
    asign_lleno2.style.display = 'grid';
    asign_lleno3.style.display = 'grid';
  }

})


//log out
btnLogout();