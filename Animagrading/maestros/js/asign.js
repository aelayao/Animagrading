import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, collection, query, where, orderBy, limit, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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

//variabbles
let cont_fechas = document.querySelector('#contenedor-fechas');
let matPRA = document.querySelector('#p1');
let matANA = document.querySelector('#p2');
let matSIM = document.querySelector('#p3');
let edPRA = document.querySelector('#edit1');
let edANA = document.querySelector('#edit2');
let edSIM = document.querySelector('#edit3');
matANA.style.display = 'none';
matPRA.style.display = 'none';
matSIM.style.display = 'none';
edPRA.style.display = 'none';
edANA.style.display = 'none';
edSIM.style.display = 'none';

//obtener información del usuario y listener
obsAuth(async (user) => {

    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    getDoc(docRef)
    //mostrar la materia asignada al maestro
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (uid == "WdQLH3OOurbZctwW5ZfMXc30KXS2") {
                matPRA.style.display = 'flex';
                matANA.style.display = 'flex';
                matSIM.style.display = 'flex';
                edPRA.style.display = 'inline-block';
                edANA.style.display = 'inline-block';
                edSIM.style.display = 'inline-block';
            }
            else {
                if (userData.materia === "PRA") {
                    matPRA.style.display = 'flex';
                    edPRA.style.display = 'inline-block';
                }
                else if (userData.materia === "ANA") {
                    matANA.style.display = 'flex';
                    edANA.style.display = 'inline-block';
                }
                else {
                    matSIM.style.display = 'flex';
                    edSIM.style.display = 'inline-block';
                }
            }

        }
        else {
            document.getElementById('usrNombre').innerText = 'Nombre';
        }
    }
    catch (error) {
        document.getElementById('usrNombre').innerText = 'Nombre';
        console.log("Error al obtener la información.");
    }


})

//log out
btnLogout();
