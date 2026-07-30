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


onAuthStateChanged(auth, (user) =>{
	if (user) {
		const uid = user.uid;
		//mostrar graficamente:
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
    .then((docSnap)=>{
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
    })
	}
	else
	{
    console.log("Deslog")
    //window.location.href = "/Animagrading/index.html";
  }
})

// codigo despues d esta linea

// Actualiza la informacion de las cajas de fechas (alumnos y maestros)
document.addEventListener('DOMContentLoaded', () => {
    const botonGuardar = document.querySelector('.btn-guardar-fecha');

    if (botonGuardar) {
        botonGuardar.addEventListener('click', () => {
            // 1. Capturamos todos los valores del formulario
            const fechaHora = document.getElementById('campo-fecha').value;
            const tipo = document.getElementById('campo-tipo').value;
            const grupo = document.getElementById('campo-grupo').value;
            const materia = document.getElementById('campo-materia').value;
            const tarjetaSeleccionada = document.getElementById('campo-tarjeta').value; // El nuevo campo

            // se valida que ningún campo se quede en blanco
            if (!fechaHora || !tipo || !grupo || !materia || !tarjetaSeleccionada) {
                alert('Por favor, llene todos los campos antes de guardar.');
                return;
            }

            // se formatea la fecha y hora para que se lea limpio
            const fechaObjeto = new Date(fechaHora);
            const dia = fechaObjeto.getDate();
            const hora = fechaObjeto.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
            const nombreMes = meses[fechaObjeto.getMonth()];

            const textoFinal = `${tipo} con el grupo ${grupo} el día ${dia} a las ${hora} para la materia de ${materia}`;

            // se guarda en la memoria usando el número de tarjeta ( mesEvaluacion-1 o textoEvaluacion-2)
            localStorage.setItem(`mesEvaluacion-${tarjetaSeleccionada}`, nombreMes);
            localStorage.setItem(`textoEvaluacion-${tarjetaSeleccionada}`, textoFinal);

            alert('¡Fecha guardada y actualizada con éxito!');
            
            // Redirecciona de vuelta a la cartelera de maestros
            window.location.href = 'fechas.html'; 
        });
    }
});