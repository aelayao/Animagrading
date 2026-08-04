import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, validatePassword } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, setDoc, collection, query, where, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let grupo = document.querySelector("#slct_grupo");
//reglas de regex? para la contraseñia: por lo menos una letra minus, un dígito, un caracter especial y de tamaño min 7
let passlimit = /^(?=.*[a-z])(?=.*\d)(?=.*[@.#$!%*?&]).{7,20}$/;

//otro regex para nombre y apellido
let nomletr = /^[a-zA-ZáíúéóüñÁÍÚÉÓÜÑ]+$/;


registrar.addEventListener("click", async (event) => {

  let email = correo.value;
  let password = pass.value;
  let ap = apllidp.value;
  let nom = nombre.value;
  let mat = matricula.value;
  let gpo = grupo.value;

  //revisar si matrícula tiene 2, ya que así se manejan las matrículas de la unipoli (?)
  if (!mat.startsWith('2')) {
    alert("La matrícula debe de iniciar con el número 2. Por favor ingrese una matrícula válida.");
    return;
  }

  //revisar si matrícula es menor a 8 números
  if (mat.length < 8) {
    alert("La matrícula debe de tener 8 números.")
    return;
  }

  if (!passlimit.test(password)) {
    //la contraseña no pudó ser validada, no se cumplen los criterios

    alert("La contraseña debe tener por lo menos una letra mínuscula, un número, un símbolo especial y un tamaño de 7 carácteres.")
    return;
  }

  //revisar que nombre y apellido sean escritos solo con letras
  if (!nomletr.test(nom.trim())) {
    alert("Su nombre debe de ser ingresado solo con letras.")
    return;
  }
  if (!nomletr.test(ap.trim())) {
    alert("Su nombre debe de ser ingresado solo con letras.")
    return;
  }

  try {
    //revisar si en usuarios hay alguien ya con una matrícula como la ingresada, aqui docRef no ocupa el uid (pq no hay nadie ingresado¿)
    //no doc pq doc ocupa el uid!!
    const notdocRef = collection(db, "users");
    const matigl = query(notdocRef, where("matricula", "==", mat));
    const resultao = await getDocs(matigl);

    //si resultado no está vacio, entonces encontró la matrícula en la colección
    if (!resultao.empty) {
      alert("Esta matrícula ya está registrada, ingresa una diferente. Si cree que ésto es un error, contactese con Animagrading.");
      return;
    }

    // autenticación correo y contraseña/login de cuenta
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //registro exitoso https://www.youtube.com/watch?v=_Xczf06n6x0

    const user = userCredential.user;
    const userData = {
      nombre: nom,
      apellidoPaterno: ap,
      matricula: mat,
      email: email,
      grupo: gpo,
      maestro: false,
      photoURL: "https://icons.iconarchive.com/icons/custom-icon-design/silky-line-user/128/user2-edit-icon.png"
    }

    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, userData);
    window.location.href = "../../alumnos/paginas/inicio.html";
    /*.then(() => {
    })
    .catch((error) => {
      console.error("error en document", error);
    })
    //error de registro
    .catch((error) => {})*/
  }
  catch (error) {
    console.log("auxilio", error)
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode == 'auth/email-already-in-use') {
      alert('Correo ya registrado. Por favor ingrese uno diferente. Si cree que ésto es un error, contactese con Animagrading.');
    }
    else {
      alert('No se pudo crear usuario. Inténtelo de nuevo más tarde');
    }
  }
})