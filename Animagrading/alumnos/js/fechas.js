import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, collection, query, where, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let cont_fechas = document.querySelector('#contenedor-fechas');
let mat = "";
let gpo = "";
let txt_nada = document.querySelector('#txt_nada');

//obtener información del usuario y listener
obsAuth(async (user) => {
  const uid = user.uid;
  const docRef = doc(db, "users", uid);
  getDoc(docRef)
  //mostrar graficamente el nombre:
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      gpo = userData.grupo;
    }
  }
  catch (error) {
    console.log("Error al obtener la información.");
  }

  //querry de fechas asignadas a grupo
  const notdocRef = collection(db, "fechas");
  const grupoFech = query(notdocRef, where("grupo", "==", gpo));
  const resultao = await getDocs(grupoFech);

  //si resultado no está vacio, entonces encontró que el maestro ha ingresado una fecha
  if (!resultao.empty) {

    //para cada resultado, hará una tarjeta nueva
    resultao.forEach(notdocSnap => {
      const fechaData = notdocSnap.data();
      const d = new Date(fechaData.fechaHora);
      //    v no time, cuidao. lenguaje y propiedades, en este caso mes
      let mes = d.toLocaleString('es-ES', { month: 'long' });
      let dia = d.toLocaleString('es-ES', { dateStyle: 'long' });
      let hora = d.toLocaleString('es-ES', { timeStyle: 'short' });

      if (fechaData.materia == "PRA") {
        mat = "Producción Audiovisual";
      }
      else if (fechaData.materia == "ANA") {
        mat = "Animación avanzada";
      }
      else {
        mat = "Simulación 3D";
      }
      //código que estaba en el html
      let tarjeta = `
          <div class="tarjeta-mes">
            <div class="encabezado-mes"><span>${mes}</span></div>
            <div class="cuerpo-mes">
              <p><span>${fechaData.tipoEvaluacion}</span>
              el día <span>${dia}</span> a las <span>${hora}</span> para la materia de <span>${mat}</span></p>
            </div>
          </div>
        `
      cont_fechas.innerHTML += tarjeta;
      txt_nada.style.display = 'none';
    });
  }
  else {
    cont_fechas.style.display = 'none';
    txt_nada.style.display = 'flex';
  }
})

//log out
btnLogout();
