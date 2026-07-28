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

//variables
let logout = document.querySelector('#btn_logout');
let fechas_vacio = document.querySelector('#fechas_vacio');
let fechas_lleno = document.querySelector('#fechas_lleno');
let fechas_info = true; //si no hay fechas... (ir al if)

let asign_vacio = document.querySelector('#asign_vacio');
let asign_lleno1= document.querySelector('#asign_lleno1');
let asign_lleno2= document.querySelector('#asign_lleno2');
let asign_lleno3= document.querySelector('#asign_lleno3');
let asign_info = true; //si no hay asignaciones a revisar...

//revisar si hay información de fechas (preeliminar)
if (fechas_info == false){
  fechas_vacio.style.display = 'flex';
  fechas_lleno.style.display = 'none';
}
else{
  fechas_vacio.style.display = 'none';
  fechas_lleno.style.display = 'block';
}

//revisar si hay información de asignaciones (preeliminar)
if (fechas_info == false){
  asign_vacio.style.display = 'flex';
  asign_lleno1.style.display = 'none';
  asign_lleno2.style.display = 'none';
  asign_lleno3.style.display = 'none';
}
else{ //later check individually if there is more info
  asign_vacio.style.display = 'none';
  asign_lleno1.style.display = 'grid';
  asign_lleno2.style.display = 'grid';
  asign_lleno3.style.display = 'grid';
}


onAuthStateChanged(auth, (user) =>{
	if (user) {
		const uid = user.uid;
		
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
    //mostrar graficamente el nombre:
    .then(async (docSnap)=>{
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
    console.log("Logging out...")
    window.location.href = "../index.html";
  }
})

//log out
logout.addEventListener("click", (event) => {
  signOut(auth).then(() => {
    window.location.href = "/Animagrading/index.html";
  }).catch((error) => {
    console.log(error);
    console.log("Problemas al cerrar sesión");
  });
})

