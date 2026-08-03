import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, setDoc, addDoc, collection, query, where, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let guardar = document.querySelector('#btn_guardar');
let volver = document.querySelector('#btn_azul');
let calif_total = document.querySelector('#calif_total');
let retro = document.querySelector('#retro');
let calif_inpt = document.querySelectorAll(".caja-nota");
let nota1 = document.querySelector("#nota1");
let nota2 = document.querySelector("#nota2");
let nota3 = document.querySelector("#nota3");

const modalConfirmacion = document.getElementById('modal-confirmacion');
const botonCerrarModal = document.querySelector('.btn-cerrar-modal');


//obtener información del usuario y listener
obsAuth(async (user) => {

  volver.addEventListener("click", (event) => {
    window.location.href = "./grupos.html"
  })

  const uid = user.uid;
  //si lo pongo afuera no funciona waa
  let eq_num = document.getElementById("eqpo");

  let obtnEq = new URLSearchParams(window.location.search);
  let equipo_num = obtnEq.get("equipo");
  let grupo_nom = obtnEq.get("grupo");

  eq_num.textContent = equipo_num;

  const docRef = doc(db, "rubricas", uid);
  getDoc(docRef)
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      document.querySelector('#rb1').innerText = userData.elemento1;
      document.querySelector('#rb2').innerText = userData.elemento2;
      document.querySelector('#rb3').innerText = userData.elemento3;

      document.querySelector('#vl1').innerText = userData.valor_e1;
      document.querySelector('#vl2').innerText = userData.valor_e2;
      document.querySelector('#vl3').innerText = userData.valor_e3;
    }
  }
  catch (error) {
    console.log("Error al obtener la información.");
  }

  function calcTotal() {
    let total = 0;
    calif_inpt.forEach((input) => {
      const valor = parseFloat(input.value) || 0;
      total += valor;
    });

    calif_total.value = total;
  }
  //cada que se ingresa se va actualizando..
  calif_inpt.forEach((input) => {
    input.addEventListener("input", calcTotal);
  });

  guardar.addEventListener("click", async (event) => {
    event.preventDefault();
    //btnr valor final calcular el total
    calcTotal();
    let calif_final = parseFloat(calif_total.value)
    let n1 = nota1.value;
    let n2 = nota2.value;
    let n3 = nota3.value;
    let equipo_num = obtnEq.get("equipo");
    let grupo_nom = obtnEq.get("grupo");
    let retro_text = retro.value || "";

    if (n1 == "" || n2 == "" || n3 == "") {
      alert("Por favor rellene todos los campos.")
      return;
    }

    if (calif_final > 100) {
      alert("Por favor asegurese de que los valores a revisar no sumen más de 100.");
      return;
    }
    try {
      const yesdocRef = collection(db, "users");
      const eq_alumnos = query(
        yesdocRef,
        where("grupo", "==", grupo_nom),
        where("equipo", "==", equipo_num),
        where("maestro", "==", false)
      );

      const eq_alumnoSnap = await getDocs(eq_alumnos);
      //por si acasu
      if (eq_alumnoSnap.empty) {
        alert("No se encontraron alumnos en este equipo.");
        return;
      }

      let alumnosIds = [];
      eq_alumnoSnap.forEach((doc) => {
        alumnosIds.push(doc.id);
      });

      const evalRef = collection(db, "calificaciones");
      await addDoc(evalRef, {
        idMaestro: uid,
        grupo: grupo_nom,
        equipo: equipo_num,
        calificacionTotal: calif_final,
        retroalimentacion: retro_text,
        valor_e1: n1,
        valor_e2: n2,
        valor_e3: n3,
        alumnosEvaluados: alumnosIds
      });
      if (modalConfirmacion) {
        modalConfirmacion.style.display = 'flex'; // se muestra la ventana
      }
    }
    catch (error) {
      console.log(error);
    }



    /*if (modalConfirmacion) {
                modalConfirmacion.style.display = 'flex'; // se muestra la ventana
            }*/
  })

  if (botonCerrarModal) {
    botonCerrarModal.addEventListener('click', () => {
      if (modalConfirmacion) {
        modalConfirmacion.style.display = 'none'; // se oculta la ventana
        window.location.href = "./grupos.html"
      }
    });
  }
})

//log out
btnLogout();
