import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
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
let matricula = document.querySelector("#inpt_matricula");
let correo = document.querySelector("#inpt_email");
let pass = document.querySelector("#inpt_pass");
let ingresar = document.querySelector("#btn_ingresar");


ingresar.addEventListener("click", ()=>{
  /*if (matricula.length !== 8){
    alert("La matrícula debe de tener solo 8 dígitos.")
  } ...y si los maestros no tienen matrícula numerica?*/

  signInWithEmailAndPassword(auth, correo.value, pass.value)
  .then(async (userCredential) => {
    // Sesión iniciada
    const user = userCredential.user;
    
    //revisar si matrícula ingresada coincide con la del usuario
    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    const userDoc = await getDoc(docRef);
    if(userDoc.exists()){
      const userData= userDoc.data();

      //si datos de usuario coincide con matricula, llevar a pag. de inicio
      if (userData.matricula === matricula.value.trim()){
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = "inicio.html";
      }
      else{
        alert('Correo, contraseña o matrícula incorrecto.');
      }

    }
    else{
      alert('La cuenta no existe o los datos ingresados son incompletos.');
    }
    
  })
  .catch((error) => {
    // Errores al intentar iniciar sesión
    const errorCode = error.code;
    const errorMessage = error.message;

    if(errorCode==='auth/invalid-credential'){
      alert('Correo, contraseña o matrícula incorrecto.');
    }
    else{
      alert('La cuenta no existe o los datos ingresados son incompletos.');
    }
  });
  
})

