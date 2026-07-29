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

// 
// 1. Buscamos el botón de guardar y la ventana emergente
const botonGuardar = document.querySelector('.btn-guardar');
const modalConfirmacion = document.getElementById('modal-confirmacion');

// 2. Al dar clic en guardar, encendemos la ventana
if (botonGuardar) {
    botonGuardar.addEventListener('click', (evento) => {
        evento.preventDefault(); // Evita que la página intente procesar un formulario
        if (modalConfirmacion) {
            modalConfirmacion.style.display = 'flex'; // Muestra la ventana
        }
    });
}