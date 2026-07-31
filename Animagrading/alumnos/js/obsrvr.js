//archivo del observador de log o no log, solo lo necesario
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

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
const auth = getAuth();

//si no el usuario no ha iniciado sesión, lo devolverá a la página de inicio (index.html)
export function obsAuth(usrAuth){
  onAuthStateChanged(auth, (user) =>{
    //const loggedInUserId=localStorage.getItem('loggedInUserId');
    if (user) {
      
      //para evitar errores con la función, asi usrAuth existe antes de mandar a llamar y no explota qwq
      if (usrAuth){
        usrAuth(user);
      }
    }
    else
    {
      console.log("Logging out...")
      window.location.href = "/Animagrading/index.html";
    }
  })
}


//exportar función del botón log out
export function btnLogout(){
    //variables
    let logout = document.querySelector('#btn_logout');

    //log out, si existe el botón de logout 
    if(logout){
      logout.addEventListener("click", (event) => {
        //por si acaso, para quitar el id por si hay problemas (paranoia)
        localStorage.removeItem('loggedInUserId');

        signOut(auth)
        .then(() => {
            window.location.href = "../../index.html";
        })
        .catch((error) => {
            console.log(error);
            alert("Problemas al cerrar sesión, intentelo de nuevo más tarde");
        });
      })
    }
    
}