import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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

//variables
let matricula = document.querySelector("#inpt_matricula");
let correo = document.querySelector("#inpt_email");
let pass = document.querySelector("#inpt_pass");
let ingresar = document.querySelector("#btn_ingresar");


ingresar.addEventListener("click", ()=>{
  signInWithEmailAndPassword(auth, correo.value, pass.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;

    localStorage.setItem('loggedInUserId', user.uid);
    window.location.href = "main.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    if(errorCode==='auth/invalid-credential'){
      alert('Correo o contraseña incorrecto');
    }
    else{
      alert('La cuenta no existe');
    }
  });
  
})

onAuthStateChanged(auth, (user) =>{
	if (user) {
		const uid = user.uid;
		//mostrar graficamente
	}
	else
	{
    console.log("Deslog")
    window.location.href = "index.html";
  }
})