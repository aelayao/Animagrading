import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
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
let guardar = document.querySelector('#btn_guardar');

//obtener información del usuario y listener
onAuthStateChanged(auth, (user) =>{
  
	if (user) {
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
        console.log("pero que ha pasao");
      }
    })
    .catch((error)=>{
      console.log(error);
      console.log("Error al obtener la información.");
    })
	}
	else
	{
    console.log("Deslog")
    window.location.href = "../index.html";
  }
})

//log out
logout.addEventListener("click", (event) => {
  //localStorage.removeItem('userid');
  signOut(auth)
    .then(() => {
      window.location.href = "/Animagrading/index.html";
    }).catch((error) => {
      console.log(error);
      console.log("Problemas al cerrar sesión");
    });
})
