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
    window.location.href = "/Animagrading/index.html";
  }
})
 
// CALIFICACIÓN AUTOMÁTICA
// ==========================================
const txtNota1 = document.getElementById('nota1');
const txtNota2 = document.getElementById('nota2');
const txtNota3 = document.getElementById('nota3');
const txtTotal = document.getElementById('total');

function calcularCalificacionTotal() {
    // Si la caja está vacía, toma un 0
    const n1 = parseFloat(txtNota1.value) || 0;
    const n2 = parseFloat(txtNota2.value) || 0;
    const n3 = parseFloat(txtNota3.value) || 0;

    // Se aplican los porcentajes de la rúbrica (10%, 40%, 50%)
    const resultado = (n1 * 0.10) + (n2 * 0.40) + (n3 * 0.50);

    // Muestra el resultado final
    if (txtTotal) {
        txtTotal.value = resultado.toFixed(2);
    }
}

// Escucha cuando se escribe en cada caja para actualizar el total al instante
if (txtNota1) txtNota1.addEventListener('input', calcularCalificacionTotal);
if (txtNota2) txtNota2.addEventListener('input', calcularCalificacionTotal);
if (txtNota3) txtNota3.addEventListener('input', calcularCalificacionTotal);
