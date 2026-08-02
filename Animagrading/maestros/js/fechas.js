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
let txt_nada = document.querySelector('#txt_nada');

//obtener información del usuario y listener
obsAuth(async (user) => {

  const uid = user.uid;
  const docRef = collection(db, "fechas");
  const idMaestro = query(docRef, where("idMaestro", "==", uid));
  const resultao = await getDocs(idMaestro);

  //si resultado no está vacio, entonces encontró que el maestro ha ingresado una fecha
  if (!resultao.empty) {

    //para cada resultado, hará una tarjeta nueva
    resultao.forEach(docSnap => {
      const fechaData = docSnap.data();
      const d = new Date(fechaData.fechaHora);
      //    v no time, cuidao. lenguaje y propiedades, en este caso mes
      let mes = d.toLocaleString('es-ES', { month: 'long' });
      let dia = d.toLocaleString('es-ES', {dateStyle: 'long'});
      let hora = d.toLocaleString('es-ES', {timeStyle: 'short'});

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
            <p><span>${fechaData.tipoEvaluacion}</span> con el grupo <span>${fechaData.grupo}</span> 
            el día <span>${dia}</span> a las <span>${hora}</span> para la materia de <span>${mat}</span></p>
          </div>
        </div>
      `
      cont_fechas.innerHTML += tarjeta;
      txt_nada.style.display = 'none';
    });


    /* el individual que se usaba para cada tarjeta, en su lugar mejor insertar html para c/u
    document.getElementById('tipo1').textContent= fechaData.tipoEvaluacion;
    document.getElementById('gpo1').textContent= fechaData.grupo;
    document.getElementById('fecha1').textContent= fechaData.fechaHora;
    document.getElementById('mes1').textContent = mes;
    if(fechaData.materia == "PRA"){
      document.getElementById('mat1').textContent= "Producción Audiovisual";
    }
    else if (fechaData.materia == "ANA"){
      document.getElementById('mat1').textContent= "Animación avanzada";
    }
    else{
      document.getElementById('mat1').textContent= "Simulación 3D";
    } */
  }
  else {
    cont_fechas.style.display = 'none';
    txt_nada.style.display = 'flex';
  }

})

//log out
btnLogout();
