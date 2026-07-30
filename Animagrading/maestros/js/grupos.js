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

//FIREBASE

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

// RECIBE LA MATERIA DESDE LA PÁGINA "ASIGNACIONES"

// Cuando tu compañero termine la otra página, ésta recibirá algo como:
// grupos.html?idMateria=MAT001

const parametros = new URLSearchParams(window.location.search);
const idMateria = parametros.get("idMateria");

console.log("Materia recibida:", idMateria);

// DATOS DE PRUEBA
//Borrar todo este arreglo cuando ya exista la base de datos y descomentar la consulta de firestore mas abajo

const gruposPrueba = [

    {
        id: "grupo1",
        nombre: "IAEV #1",
       alumnos:[

    {
        id:"A001",
        nombre:"Juan Pérez"
    },

    {
        id:"A002",
        nombre:"María López"
    },

    {
        id:"A003",
        nombre:"Carlos Ruiz"
    },

    {
        id:"A004",
        nombre:"Ana Torres"
    }

]
    },

    {
        id: "grupo2",
        nombre: "IAEV #2",
      alumnos:[

    {
        id:"A001",
        nombre:"Juan Pérez"
    },

    {
        id:"A002",
        nombre:"María López"
    },

    {
        id:"A003",
        nombre:"Carlos Ruiz"
    },

    {
        id:"A004",
        nombre:"Ana Torres"
    }

]
    },

    {
        id: "grupo3",
        nombre: "IAEV #3",
      alumnos:[

    {
        id:"A001",
        nombre:"Juan Pérez"
    },

    {
        id:"A002",
        nombre:"María López"
    },

    {
        id:"A003",
        nombre:"Carlos Ruiz"
    },

    {
        id:"A004",
        nombre:"Ana Torres"
    }

]
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

    const contenedor = document.getElementById("contenedorGrupos");

    contenedor.innerHTML = "";

    // DATOS DE PRUEBA

    gruposPrueba.forEach(grupo => {

        crearTarjetaGrupo(grupo, contenedor);

    });

    // Cuando ya este la BD, borrar todo el bloque anterior y descomentar este codigo

    /*
    const consulta = query(
        collection(db, "grupos"),
        where("materia", "==", idMateria)
    );

    const resultado = await getDocs(consulta);

    resultado.forEach((docGrupo)=>{

        const grupo = docGrupo.data();

        crearTarjetaGrupo({
            id: docGrupo.id,
            nombre: grupo.nombre
        }, contenedor);

        cargarAlumnosFirestore(docGrupo.id);

    });
    */

}


function crearTarjetaGrupo(grupo, contenedor){

    const tarjeta = document.createElement("div");

    tarjeta.className = "tarjetaGrupo";

    tarjeta.innerHTML = `

        <button class="btnGrupo">
            ${grupo.nombre} ▼
        </button>

        <div class="listaAlumnos" style="display:none;">

        </div>

    `;

    contenedor.appendChild(tarjeta);

    const lista = tarjeta.querySelector(".listaAlumnos");

    // DATOS DE PRUEBA

    if(grupo.alumnos){

        let html="<ol>";

      grupo.alumnos.forEach(alumno=>{

    html+=`

    <li>

        <a class="alumnoLink"
        href="calificar.html?idAlumno=${alumno.id}&nombre=${encodeURIComponent(alumno.nombre)}">

            ${alumno.nombre}

        </a>

    </li>

    `;

});

        html+="</ol>";

        lista.innerHTML=html;

    }

}

async function cargarAlumnosFirestore(idGrupo){

    const lista=document.getElementById(idGrupo);

    const consulta=query(
        collection(db,"alumnos"),
        where("grupo","==",idGrupo)
    );

    const resultado=await getDocs(consulta);

    let html="<ol>";

    resultado.forEach((doc)=>{

        html+=`<li>${doc.data().nombre}</li>`;

    });

    html+="</ol>";

    lista.innerHTML=html;

}


document.addEventListener("click",(e)=>{

    if(!e.target.classList.contains("btnGrupo")) return;

    const lista=e.target.nextElementSibling;

    if(lista.style.display==="none"){

        lista.style.display="block";
        e.target.innerHTML=e.target.innerHTML.replace("▼","▲");

    }else{

        lista.style.display="none";
        e.target.innerHTML=e.target.innerHTML.replace("▲","▼");

    }

});