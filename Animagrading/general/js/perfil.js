import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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


//obtener información del usuario y listener
obsAuth(async (user) => {
	
		const uid = user.uid;
		
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
    //mostrar graficamente la información del usuario:
    .then(async (docSnap)=>{
      if (docSnap.exists()){
        const userData= docSnap.data();
        console.log("Firestore User Data:", userData);

        document.getElementById('usrNombre').innerText=userData.nombre;
        document.getElementById('usrApellido').innerText=userData.apellidoPaterno;
        document.getElementById('usrMatr').innerText=userData.matricula;
        document.getElementById('usrCorr').innerText=userData.email;
        const imagenLink = userData.photoURL || userData.photoUrl || user.photoURL || '/Animagrading/general/imagen/user_basic.png';
        document.getElementById('usrImg').src = imagenLink;
      }
      else
      {
        //por si acaso, rellenarlos con -vacio-
        document.getElementById('usrNombre').innerText="";
        document.getElementById('usrApellido').innerText="";
        document.getElementById('usrMatr').innerText="";
        document.getElementById('usrCorr').innerText="";
        document.getElementById('usrImg').src = '/Animagrading/general/imagen/user_basic.png';
      }
    })
    .catch((error)=>{
      console.log(error);
      console.log("Error al obtener la información.");
    })
})

//log out
btnLogout();
