import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile, verifyBeforeUpdateEmail} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, getDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let inpt_nombre = document.querySelector('#inpt_nombre');
let inpt_apellidp = document.querySelector('#inpt_apellidp');
let email = document.querySelector('#inpt_email');
let fotoUrl = document.querySelector('#inpt_foto');
let usrImg = document.querySelector('#usrImg');

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
        document.getElementById('usrMatr').innerText=userData.matricula;
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
    window.location.href = "index.html";
  }
})

//actualizar información del perfil: nombre
guardar.addEventListener("click", async (event) => {
  event.preventDefault(); //previene que se guarden datos por error al recargar

  let user = auth.currentUser;
  let nuevoNom = inpt_nombre.value.trim();
  let nuevoAp = inpt_apellidp.value.trim();
  let nuevoEml = email.value.trim();
  let nuevaFoto = inpt_foto.value.trim();

  try{
    const updtDocRef =doc(db, "users", user.uid);

    const actFirestore = {};
    if (nuevoNom !== "") 
      {actFirestore.nombre = nuevoNom;}
    if (nuevoAp !== "") 
      {actFirestore.apellidoPaterno = nuevoAp;}
    if (nuevoEml !== "") 
      {actFirestore.email = nuevoEml;}
    if (nuevaFoto !== "") 
      {actFirestore.photoURL = nuevaFoto;}

    if(Object.keys(actFirestore).length > 0){
      await updateDoc(updtDocRef, actFirestore);
    }

    /*if (nuevoEml !== user.email) {
      await verifyBeforeUpdateEmail(user, nuevoEml);
      alert("Se ha enviado un link de verificación a tu correo electronico, por favor revisalo para realizar el cambio.");
    }*/
   if(nuevoNom == "" && nuevaFoto == "" && nuevoAp == "" && nuevoEml == ""){
    alert("No se ha ingresado información, regresando a la página anterior...");

   /*setTimeout(() =>{
      window.location.href = "perfil.html";
    }, 1000);*/
    
   }
   else{
    alert("Cambios al perfil guardados con éxito!");
   }
    window.location.href = "perfil.html";
  }
  catch (error){
    alert("Error al actualizar los datos de su perfil, íntentelo de nuevo más tarde.")
    console.log(error);
  }

})

