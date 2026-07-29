import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAWNa6Bk-nw5vbsR6izejn44V-C90bV2ik",
    authDomain: "ad-c668f.firebaseapp.com",
    projectId: "ad-c668f",
    storageBucket: "ad-c668f.firebasestorage.app",
    messagingSenderId: "478756211511",
    appId: "1:478756211511:web:e2dcb8d9d070792d4168b2",
    measurementId: "G-RW1BW7LCEB"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth();
const db = getFirestore(app);

// RECIBE LA MATERIA DESDE LA PÁGINA ANTERIOR
const parametros = new URLSearchParams(window.location.search);
const idMateria = parametros.get("idMateria");

// DATOS DE PRUEBA (BORRAR CUANDO ESTÉ LA BD)
const AsignacionesPrueba = [
    {
        id: "grupo1",
        nombre: "Grupo A"
    },
    {
        id: "grupo2",
        nombre: "Grupo B"
    },
    {
        id: "grupo3",
        nombre: "Grupo C"
    }
];

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.href = "login.html";
        return;
    }
    cargarGrupos();
});

async function cargarGrupos() {
    const contenedor = document.getElementById("contenedorAsignaciones");
    contenedor.innerHTML = "";

    // DATOS DE PRUEBA
    AsignacionesPrueba.forEach(grupo => {
        crearBotonGrupo(grupo, contenedor);
    });

    // CUANDO ESTÉ LA BD, DESCOMENTAR ESTO Y BORRAR LO DE ARRIBA
    /*
    const consulta = query(
        collection(db, "grupos"),
        where("materia", "==", idMateria)
    );

    const resultado = await getDocs(consulta);

    resultado.forEach((docGrupo) => {
        const grupo = docGrupo.data();
        crearBotonGrupo({
            id: docGrupo.id,
            nombre: grupo.nombre
        }, contenedor);
    });
    */
}

function crearBotonGrupo(grupo, contenedor) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjetaGrupo";

    const btn = document.createElement("button");
    btn.className = "btnGrupo";
    btn.textContent = grupo.nombre;
    btn.dataset.id = grupo.id; // Guardamos el ID del grupo

    // Al hacer clic, redirige a la página de alumnos con el ID del grupo
    btn.addEventListener("click", function() {
        // Redirige a grupos.html con el ID del grupo como parámetro
        window.location.href = `grupos.html?idGrupo=${this.dataset.id}&idMateria=${idMateria}`;
    });

    tarjeta.appendChild(btn);
    contenedor.appendChild(tarjeta);
}