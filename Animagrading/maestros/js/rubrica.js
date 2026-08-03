import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getFirestore, setDoc, addDoc, collection, query, where, getDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let guardar = document.querySelector('#btn_guardar');
let volver = document.querySelector('#btn_azul');
let rubr1 = document.querySelector('#rubr1');
let rubr2 = document.querySelector('#rubr2');
let rubr3 = document.querySelector('#rubr3');
let valr1 = document.querySelector('#valr1');
let valr2 = document.querySelector('#valr2');
let valr3 = document.querySelector('#valr3');
let materia = document.querySelector('#campo-materia');
let matMaestr = "";

//ver qué ingresó DPA
/*let matDPA = window.location.search;
let params = new URLSearchParams(matDPA);*/

//obtener información del usuario y listener
obsAuth(async (user) => {

    volver.addEventListener("click", (event) => {
        window.location.href = "./asignaciones.html"
    })

    const uid = user.uid;
    const notdocRef = doc(db, "users", uid);

    try {
        const docSnap = await getDoc(notdocRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (uid != "WdQLH3OOurbZctwW5ZfMXc30KXS2") {
                materia.value = userData.materia;
                materia.disabled = true;
            }
            else {
                materia.disabled = false;
            }
        }
    }
    catch (error) {
        console.log("Error al obtener la información.");
    }

    guardar.addEventListener("click", async (event) => {
        event.preventDefault(); //previene que se guarden datos por error al recargar

        //no trim pq son puros select
        let mat = materia.value;
        let elem1 = rubr1.value;
        let elem2 = rubr2.value;
        let elem3 = rubr3.value;
        let valor1 = Number(valr1.value);
        let valor2 = Number(valr2.value);
        let valor3 = Number(valr3.value);
        if (elem1 == "" || elem2 == "" || elem3 == "" || valor1 == "" || valor2 == "" || valor3 == "") {
            alert("Por favor llene todos los campos");
            return;
        }

        let suma = valor1 + valor2 + valor3

        if(suma != 100){
            alert("Por favor asegurese de que los valores a revisar sumen 100.");
            return;
        }

        try {
            
            const idRubrica = `${uid}`;
            const docRef = doc(db, "rubricas", idRubrica);

            //aqui si seria setDoc pq estamos usando el id del maestro y su combinación cn materia
            await setDoc(docRef, {
                elemento1: elem1,
                elemento2: elem2,
                elemento3: elem3,
                valor_e1: valor1,
                valor_e2: valor2,
                valor_e3: valor3,
                materia: mat,
                idMaestro: uid
            })

            alert("Rubrica guardada con éxito!");
            window.location.href = "./asignaciones.html";
        }
        catch (error) {
            alert("Error al actualizar su rúbrica. Por favor intente de nuevo más tarde.");
            console.log(error);
        }

    })

})

//log out
btnLogout();
