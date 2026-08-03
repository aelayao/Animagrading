// asignaciones.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import {
    getFirestore,
    collection,
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

// Función para formatear nombres de grupo
function formatearNombreGrupo(id) {
    return id
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        location.href = "login.html";
        return;
    }
    cargarGrupos();
});

async function cargarGrupos() {
    const contenedor = document.getElementById("contenedorAsignaciones");
    
    // Mostrar mensaje de carga
    contenedor.innerHTML = '<div class="cargando">Cargando grupos...</div>';

    try {
        const querySnapshot = await getDocs(collection(db, "grupos"));
        
        // Limpiar el contenedor
        contenedor.innerHTML = "";
        
        if (querySnapshot.empty) {
            contenedor.innerHTML = `
                <div class="mensaje-vacio">
                    <p>📚 No hay grupos disponibles</p>
                    <p class="sub-mensaje">Crea grupos en la colección "grupos" en Firestore</p>
                </div>
            `;
            return;
        }

        // Array para almacenar todos los grupos
        const grupos = [];

        // Iterar sobre cada documento (cada grupo)
        querySnapshot.forEach((docSnapshot) => {
            const grupoId = docSnapshot.id;
            const data = docSnapshot.data();
            
            // Crear un objeto con los equipos del grupo
            const equipos = [];
            
            // Iterar sobre las propiedades del documento para encontrar los equipos
            for (const [key, value] of Object.entries(data)) {
                
                // Verificar si es un array (equipo)
                if (Array.isArray(value)) {
                    equipos.push({
                        nombre: key, // "equipo 1", "equipo 2", etc.
                        integrantes: value // Array de nombres
                    });
                } else if (typeof value === 'string') {
                    equipos.push({
                        nombre: key,
                        integrantes: [value]
                    });
                }
            }
          
            // Agregar el grupo
            grupos.push({
                id: grupoId,
                nombre: formatearNombreGrupo(grupoId),
                equipos: equipos
            });
        });

        // Ordenar grupos alfabéticamente
        grupos.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Verificar si hay grupos
        if (grupos.length === 0) {
            contenedor.innerHTML = `
                <div class="mensaje-vacio">
                    <p>📋 No se encontraron grupos</p>
                    <p class="sub-mensaje">Agrega documentos en la colección "grupos" en Firestore</p>
                </div>
            `;
            return;
        }

        // Crear tarjetas para cada grupo
        grupos.forEach(grupo => {
            crearBotonGrupo(grupo, contenedor);
        });

    } catch (error) {
        console.error("Error al cargar grupos:", error);
        contenedor.innerHTML = `
            <div class="mensaje-error">
                <p>❌ Error al cargar los grupos</p>
                <p class="sub-mensaje">${error.message}</p>
                <button class="btn-reintentar" onclick="location.reload()">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }
}

function crearBotonGrupo(grupo, contenedor) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjetaGrupo";

    const btn = document.createElement("button");
    btn.className = "btnGrupo";
    
    // Mostrar el nombre del grupo y cantidad de equipos
    const textoEquipos = grupo.equipos.length === 0 ? " (Sin equipos)" : ` (${grupo.equipos.length} equipos)`;
    btn.textContent = `${grupo.nombre}${textoEquipos}`;
    
    btn.dataset.id = grupo.id;
    // Guardar los equipos como JSON para pasarlos a la siguiente página
    btn.dataset.equipos = JSON.stringify(grupo.equipos);

    // Si no tiene equipos, cambiar estilo
    if (grupo.equipos.length === 0) {
        btn.style.opacity = "0.6";
        btn.title = "Este grupo no tiene equipos asignados";
    } else {
        // Tooltip con los nombres de los equipos
        const nombresEquipos = grupo.equipos.map(e => e.nombre).join(', ');
        btn.title = `Equipos: ${nombresEquipos}`;
    }

    btn.addEventListener("click", function() {
        // Si no tiene equipos, mostrar alerta
        const equipos = JSON.parse(this.dataset.equipos);
        if (equipos.length === 0) {
            alert('Este grupo no tiene equipos asignados. Agrega equipos en Firestore.');
            return;
        }
        
        // Codificar los datos para la URL
        const equiposData = encodeURIComponent(this.dataset.equipos);
        const grupoId = this.dataset.id;
        const grupoNombre = grupo.nombre;
        
        // Construir la URL con todos los parámetros
        let url = `grupos.html?idGrupo=${grupoId}&nombreGrupo=${encodeURIComponent(grupoNombre)}&equipos=${equiposData}`;
        
        if (idMateria) {
            url += `&idMateria=${idMateria}`;
        }
        
        // Redirigir a la página de grupos
        window.location.href = url;
    });

    tarjeta.appendChild(btn);
    contenedor.appendChild(tarjeta);
}