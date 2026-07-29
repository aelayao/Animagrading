import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let nombre = document.querySelector("#inpt_nombre");
let apllidp = document.querySelector("#inpt_apllidp");
let correo = document.querySelector("#inpt_email");
let pass = document.querySelector("#inpt_pass");
let registrar = document.querySelector("#btn_regis");

const signUp = document.getElementById('submitSignUp');

registrar.addEventListener("click", (event) => {

  let email = correo.value;
  let password = pass.value;
  let ap = apllidp.value;
  let nom = nombre.value;
  let mat = matricula.value;


  // autenticación correo y contraseña/login de cuenta
  createUserWithEmailAndPassword(auth, email, password)
    //registro exitoso https://www.youtube.com/watch?v=_Xczf06n6x0
    .then((userCredential) => {
      const user = userCredential.user;
      const userData={
        nombre: nom,
        apellidoPaterno: ap,
        matricula: mat,
        email: email
      }
      
      const docRef=doc(db, "users", user.uid);
      setDoc(docRef, userData)
      .then(()=>{
        window.location.href = "/alumnos/paginas/inicio.html";

      })
      .catch((error) =>{
        console.error("error en document", error);
      })

    })
    //error de registro
    .catch((error) => {
      alert("Ha habido un error, por favor intentelo de nuevo");

      const errorCode = error.code;
      const errorMessage = error.message;

      if(errorCode=='auth/email-already-in-use'){
        alert('Correo ya registrado!');
      }
      else{
        alert('No se pudo crear usuario');
      }
    })

})