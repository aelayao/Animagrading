import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore(app); //inicializa cloud firestore

let logout = document.querySelector('#btn_logout');

onAuthStateChanged(auth, (user) =>{
	if (user) {
		const uid = user.uid;
		//mostrar graficamente:
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
    /*.then((docSnap)=>{
      if (docSnap.exists()){
        const userData= docSnap.data();
        document.getElementById('usrNombre').innerText=userData.nombre;
      }
      else
      {
        console.log("pero que ha pasao");
      }
    })
    .catch((error)=>{
      console.log("Error al obtener la información.");
    })*/
	}
	else
	{
    console.log("Deslog")
    window.location.href = "/Animagrading/index.html";
  }
})

// Codigo despues de esta linea 

document.addEventListener('DOMContentLoaded', () => {
    // ---- CONFIGURACIÓN PARA LA TARJETA 1 ----
    // 1. Buscamos en la memoria si hay datos para la Tarjeta 1
    const mesGuardado1 = localStorage.getItem('mesEvaluacion-1');
    const textoGuardado1 = localStorage.getItem('textoEvaluacion-1');

    // 2. Buscamos las etiquetas de la Tarjeta 1 en la pantalla actual
    const elementoMes1 = document.getElementById('mes-tarjeta-1');
    const elementoTexto1 = document.getElementById('texto-tarjeta-1');

    // 3. Si hay datos en memoria y la tarjeta existe en pantalla, actualizamos los textos
    if (mesGuardado1 && elementoMes1) {
        elementoMes1.textContent = mesGuardado1;
    }
    if (textoGuardado1 && elementoTexto1) {
        elementoTexto1.textContent = textoGuardado1;
    }


    // ---- CONFIGURACIÓN PARA LA TARJETA 2 ----
    // 4. Buscamos en la memoria si hay datos para la Tarjeta 2
    const mesGuardado2 = localStorage.getItem('mesEvaluacion-2');
    const textoGuardado2 = localStorage.getItem('textoEvaluacion-2');

    // 5. Buscamos las etiquetas de la Tarjeta 2 en la pantalla actual
    const elementoMes2 = document.getElementById('mes-tarjeta-2');
    const elementoTexto2 = document.getElementById('texto-tarjeta-2');

    // 6. Si hay datos en memoria y la tarjeta existe en pantalla, actualizamos los textos
    if (mesGuardado2 && elementoMes2) {
        elementoMes2.textContent = mesGuardado2;
    }
    if (textoGuardado2 && elementoTexto2) {
        elementoTexto2.textContent = textoGuardado2;
    }
});

//log out
logout.addEventListener("click", (event) => {
  signOut(auth).then(() => {
    window.location.href = "/Animagrading/index.html";
  }).catch((error) => {
    console.log(error);
    console.log("Problemas al cerrar sesión");
  });
})