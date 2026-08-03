// grupos.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    getFirestore
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

// RECIBIR PARÁMETROS DE LA URL
const parametros = new URLSearchParams(window.location.search);
const idGrupo = parametros.get("idGrupo");
const nombreGrupo = parametros.get("nombreGrupo");
const equiposParam = parametros.get("equipos");
const idMateria = parametros.get("idMateria");

console.log("Grupo ID:", idGrupo);
console.log("Nombre Grupo:", nombreGrupo);
console.log("Equipos recibidos:", equiposParam);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.href = "login.html";
        return;
    }
    cargarEquipos();
});

// 🔥 FUNCIÓN PARA EXTRAER EL NÚMERO DEL NOMBRE DEL EQUIPO
function extraerNumeroEquipo(nombre) {
    // Busca cualquier número en el string
    const numeros = nombre.match(/\d+/);
    if (numeros) {
        return parseInt(numeros[0]);
    }
    // Si no tiene número, buscar al final (ej: "equipo 10" -> 10)
    const partes = nombre.split(' ');
    const ultimaParte = partes[partes.length - 1];
    const numero = parseInt(ultimaParte);
    if (!isNaN(numero)) {
        return numero;
    }
    return 0; // Si no encuentra número, lo pone al final
}

function cargarEquipos() {
    const contenedor = document.getElementById("contenedorGrupos");
    contenedor.innerHTML = "";

    if (!equiposParam) {
        contenedor.innerHTML = `
            <div class="mensaje-vacio">
                <p>❌ No se recibieron datos del grupo</p>
                <p class="sub-mensaje">Por favor, regresa a la página anterior</p>
            </div>
        `;
        return;
    }

    try {
        let equipos = JSON.parse(decodeURIComponent(equiposParam));

        // 🔥 ORDENAR EQUIPOS DE MAYOR A MENOR (numéricamente)
        equipos.sort((a, b) => {
            const numA = extraerNumeroEquipo(a.nombre);
            const numB = extraerNumeroEquipo(b.nombre);
            return numB - numA; // Mayor a menor
        });

        console.log("Equipos ordenados:", equipos);

        if (equipos.length === 0) {
            contenedor.innerHTML = `
                <div class="mensaje-vacio">
                    <p>📭 No hay equipos en este grupo</p>
                    <p class="sub-mensaje">Agrega equipos a este grupo en Firestore</p>
                </div>
            `;
            return;
        }

        // Crear una tarjeta para CADA EQUIPO (como en tu diseño original)
        equipos.forEach((equipo, index) => {
            crearTarjetaEquipo(equipo, index + 1, contenedor);
        });

    } catch (error) {
        console.error("Error al mostrar equipos:", error);
        contenedor.innerHTML = `
            <div class="mensaje-error">
                <p>❌ Error al cargar los equipos</p>
                <p class="sub-mensaje">${error.message}</p>
            </div>
        `;
    }
}

function crearTarjetaEquipo(equipo, numero, contenedor) {
    // Crear la tarjeta del equipo (igual que en tu diseño original)
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjetaGrupo";

    // Botón del equipo (con el nombre del equipo)
    const btn = document.createElement("button");
    btn.className = "btnGrupo";
    btn.textContent = `${equipo.nombre} ▼`; // Mismo formato que tu diseño original

    // Lista de alumnos (inicialmente oculta)
    const listaAlumnos = document.createElement("div");
    listaAlumnos.className = "listaAlumnos";
    listaAlumnos.style.display = "none";

    // Agregar alumnos a la lista
    if (equipo.integrantes && equipo.integrantes.length > 0) {
        let html = "<ol>";
        equipo.integrantes.forEach((alumno, index) => {
            // Crear enlace para calificar (igual que en tu diseño original)
            html += `
                <li>
                    <a class="alumnoLink" 
                       href="calificar.html?idAlumno=${index + 1}&nombre=${encodeURIComponent(alumno)}">
                        ${alumno}
                    </a>
                </li>
            `;
        });
        html += "</ol>";
        listaAlumnos.innerHTML = html;
    } else {
        listaAlumnos.innerHTML = "<p class='sin-alumnos'>No hay alumnos en este equipo</p>";
    }

    // Agregar elementos a la tarjeta
    tarjeta.appendChild(btn);
    tarjeta.appendChild(listaAlumnos);
    contenedor.appendChild(tarjeta);
}

// Misma lógica de toggle que en tu diseño original
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btnGrupo")) return;
    
    const lista = e.target.nextElementSibling;
    
    if (lista.style.display === "none") {
        lista.style.display = "block";
        e.target.innerHTML = e.target.innerHTML.replace("▼", "▲");
    } else {
        lista.style.display = "none";
        e.target.innerHTML = e.target.innerHTML.replace("▲", "▼");
    }
});