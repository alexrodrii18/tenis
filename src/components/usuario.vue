<template>
  <div class="vista-usuario-contenedor">
    <div class="content-card">
      <h1>Bienvenido {{ nombreUsuario }}</h1>

      <div class="form-group">
        <label for="horario">Selecciona un horario:</label>
        <select id="horario" v-model="horarioSeleccionado">
          <option disabled value="">Selecciona un horario</option>
          <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
            {{ formatHora(hora) }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="dia">Selecciona un día:</label>
        <select id="dia" v-model="diaSeleccionado">
          <option disabled value="">Selecciona un día</option>
          <option v-for="d in diasDisponibles" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="pista">Selecciona una pista:</label>
        <select id="pista" v-model="pistaSeleccionada">
          <option disabled :value="null">Selecciona una pista</option>
          <option v-for="pista_num in pistasDisponibles" :key="pista_num" :value="pista_num">
            {{ pista_num }}
          </option>
        </select>
      </div>
      <button @click="guardarDisponibilidad" :disabled="!horarioSeleccionado || !diaSeleccionado || !pistaSeleccionada">Guardar Horario</button>
      <button @click="cerrarSesion" class="button-secondary">Cerrar Sesión</button>
    </div>

    <div class="content-card">
      <h1>Reservas</h1>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre jugador</th>
              <th>Día</th>
              <th>Hora</th>
              <th>Pista</th> </tr>
          </thead>
          <tbody>
            <tr v-if="reservas.length === 0">
              <td colspan="4">No hay reservas para mostrar.</td> </tr>
            <tr v-for="reserva in reservas" :key="reserva.id">
              <td>{{ reserva.nombre_jugador }}</td>
              <td>{{ reserva.dia }}</td>
              <td>{{ formatHora(reserva.hora) }}</td>
              <td>Pista {{ reserva.numero_pista }}</td> </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter(); // Movido aquí arriba para consistencia

const reservas = ref([]);
const nombreUsuario = ref()

// Refs para el formulario de reserva
const horariosDisponibles = ref([
  "08:15:00",
  "10:30:00",
  "15:15:00",
  "17:30:00",
  "19:30:00",
]);
const diasDisponibles = ref(["Viernes", "Sábado", "Domingo"]);
const diaSeleccionado = ref(""); // Debería ser null si usas la opción disabled con :value="null"
const horarioSeleccionado = ref(""); // Debería ser null si usas la opción disabled con :value="null"

// --- Refs para Pistas (ya las tenías en tu código pegado) ---
const pistasDisponibles = ref([1,2,3]);
const pistaSeleccionada = ref(null);
// --- Fin Refs para Pistas ---


onMounted(async () => { // Hacemos onMounted async ya que llama a mostrarReservas que es async
  const nombreGuardado = localStorage.getItem('nombreUsuario');
  if (nombreGuardado) {
    nombreUsuario.value = nombreGuardado;
  }
  await mostrarReservas(); // Esperar a que las reservas se carguen al montar
});


const mostrarReservas = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/reservas");
    reservas.value = response.data; // Asumimos que response.data ahora incluye numero_pista
  } catch (error) {
    alert("Error al cargar reservas: " + error.message);
    // Considera también loguear el error en la consola para más detalles
    console.error("Error al cargar reservas:", error.response || error);
  }
};

// Ya tienes un onMounted que llama a mostrarReservas, no necesitas un segundo onMounted(mostrarReservas)

const cerrarSesion = () => {
  localStorage.removeItem('userId'); // Es buena práctica borrar el userId al cerrar sesión
  localStorage.removeItem('nombreUsuario');
  router.push("/");
  alert("Sesión cerrada correctamente");
};


const guardarDisponibilidad = async () => {
  // Validar que todos los campos estén seleccionados
  if (!diaSeleccionado.value || !horarioSeleccionado.value || !pistaSeleccionada.value) {
    alert("Por favor, completa todos los campos (día, hora y pista).");
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert("Error: No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
    return;
  }

  try {
    await axios.post("http://localhost:3000/api/reservas", {
      dia: diaSeleccionado.value,
      hora: horarioSeleccionado.value,
      usuario_id: parseInt(userId, 10),
      numero_pista: pistaSeleccionada.value 
    });

    alert("Reserva guardada con éxito.");
    
    // Limpiar campos después de guardar
    diaSeleccionado.value = ""; // O null si la opción disabled es :value="null"
    horarioSeleccionado.value = ""; // O null
    pistaSeleccionada.value = null; 
    
    await mostrarReservas(); // Actualizar la lista de reservas
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert(error.response.data.message || "Este horario y pista ya están reservados.");
    } else {
      alert("Error al guardar reserva: " + (error.response?.data?.message || error.message));
      console.error("Error al guardar reserva:", error.response || error);
    }
  }
};

const formatHora = (hora) => {
  if (!hora) return ''; // Manejar casos donde la hora podría ser undefined o null
  try {
    const date = new Date(`1970-01-01T${hora}Z`); // Asumir que la hora es UTC si no tiene offset
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (e) {
    console.error("Error formateando hora:", hora, e);
    return hora; // Devolver la hora original si hay error
  }
};
</script>

<style scoped>
h1 {
  color: blue; /* Azul como en el original */
  text-align: center;
  margin-top: 20px; /* Reducido un poco ya que está dentro de una tarjeta */
  margin-bottom: 30px;
}

h1:hover {
  color: red;
  cursor: pointer;
}

/* Estilo para el contenedor principal, similar a login_contenedor */
.vista-usuario-contenedor {
  background-image: url("/fondo.jpeg"); /* Asegúrate que esta ruta es correcta */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh; /* Usar min-height para asegurar que cubra la pantalla pero pueda crecer */
  width: 100vw;
  display: flex;
  flex-direction: column; /* Para apilar las tarjetas verticalmente */
  justify-content: flex-start; /* Alinea las tarjetas arriba */
  align-items: center;
  gap: 2rem; /* Espacio entre las tarjetas */
  padding: 2rem; /* Espacio alrededor del contenido */
  box-sizing: border-box; /* Para que el padding no aumente el tamaño total */
}

/* Estilo para las "tarjetas" de contenido, similar a los 'form' del original */
.content-card {
  background: rgba(255, 255, 255, 0.9); /* Un poco más opaco para legibilidad */
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.35);
  text-align: center;
  width: 100%;
  max-width: 700px; /* Ancho máximo para las tarjetas */
  margin-bottom: 1rem; /* Espacio si no se usa flex-gap */
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}

select {
  display: block;
  margin: 0 auto 15px auto; /* Centrado, con margen inferior */
  padding: 10px;
  font-size: 16px;
  width: 80%; /* Ancho relativo a la tarjeta */
  max-width: 300px; /* Ancho máximo para los selects */
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

select:focus {
  outline: none;
  border: 2px solid #007BFF; /* Color de foco como en los inputs originales */
}

button {
  display: inline-block; /* Permite que estén en la misma línea si hay espacio */
  margin: 10px 5px; /* Margen reducido para botones en línea */
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007BFF; /* Color primario */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3; /* Oscurecer al pasar el ratón */
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Estilo para un botón secundario, como el de cerrar sesión */
button.button-secondary {
  background-color: #6c757d; /* Un gris para secundario */
}

button.button-secondary:hover {
  background-color: #5a6268;
}

.table-responsive {
  overflow-x: auto; /* Para que la tabla sea responsive en pantallas pequeñas */
}

table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

th,
td {
  border: 1px solid #ddd; /* Bordes más suaves */
  padding: 12px; /* Más padding para legibilidad */
  text-align: left;
}

th {
  background-color: #007BFF; /* Cabecera con el color primario */
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9; /* Zebra striping para filas pares */
}

tr:hover {
  background-color: #f1f1f1; /* Efecto hover en filas */
}

/* Media query para mejorar la disposición en pantallas pequeñas */
@media (max-width: 768px) {
  .vista-usuario-contenedor {
    padding: 1rem;
    gap: 1rem;
  }
  .content-card {
    padding: 1.5rem;
  }
  h1 {
    font-size: 1.8rem; /* Ajustar tamaño de fuente */
  }
  select, button {
    font-size: 15px;
    padding: 8px 15px;
  }
  select {
    width: 90%;
  }
}
</style>