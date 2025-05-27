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


    <div class="content-card">
    <h1>Cambiar contraseña</h1>
    <div class="form-group">
      <label for="contrasenaActual">Contraseña actual:</label>
      <input type="password" id="contrasenaActual" v-model="contrasenaActual" />
    </div>

    <div class="form-group">
      <label for="nuevaContrasena">Nueva contraseña:</label>
      <input type="password" id="nuevaContrasena" v-model="nuevaContrasena" />
    </div>

    <button @click="cambiarContrasena">Actualizar contraseña</button>
  </div>
  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue3-toastify';



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
const diaSeleccionado = ref(""); 
const horarioSeleccionado = ref(""); 


const pistasDisponibles = ref([1,2,3]);
const pistaSeleccionada = ref(null);



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
    reservas.value = response.data; 
  } catch (error) {
    toast.error("Error al cargar reservas: " + error.message);
    console.error("Error al cargar reservas:", error.response || error);
  }
};


const cerrarSesion = () => {
  localStorage.removeItem('userId'); 
  localStorage.removeItem('nombreUsuario');
  router.push("/");
  toast.success("Sesión cerrada correctamente");
};


const guardarDisponibilidad = async () => {

  if (!diaSeleccionado.value || !horarioSeleccionado.value || !pistaSeleccionada.value) {
    toast.error("Por favor, completa todos los campos (día, hora y pista).");
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    toast.error("Error: No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
    return;
  }

  try {
    await axios.post("http://localhost:3000/api/reservas", {
      dia: diaSeleccionado.value,
      hora: horarioSeleccionado.value,
      usuario_id: parseInt(userId, 10),
      numero_pista: pistaSeleccionada.value 
    });


    toast.success("Reserva guardada con éxito.");
    
    // Limpiar campos después de guardar
    diaSeleccionado.value = ""; 
    horarioSeleccionado.value = ""; 
    pistaSeleccionada.value = null; 
    
    await mostrarReservas(); // Actualizar la lista de reservas
  } catch (error) {
    if (error.response && error.response.status === 409) {
      toast.error(error.response.data.message || "Este horario y pista ya están reservados.");
    } else {
      toast.error("Error al guardar reserva: " + (error.response?.data?.message || error.message));
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



const cambiarContrasena = async () => {
  const userId = localStorage.getItem('userId');

  if (!contrasenaActual.value || !nuevaContrasena.value) {
    toast.error("Por favor completa ambos campos.");
    return;
  }

  try {
    await axios.put(`http://localhost:3000/api/usuarios/${userId}/contrasena`, {
      actual: contrasenaActual.value,
      nueva: nuevaContrasena.value,
    });

    toast.success("Contraseña actualizada correctamente.");
    contrasenaActual.value = "";
    nuevaContrasena.value = "";
  } catch (error) {
    toast.error("Error al cambiar la contraseña: " + (error.response?.data?.message || error.message));
    console.error("Error cambiando contraseña:", error);
  }
};
</script>

<style scoped>
h1 {
  color: blue; 
  text-align: center;
  margin-top: 20px; 
  margin-bottom: 30px;
}

h1:hover {
  color: red;
  cursor: pointer;
}
.vista-usuario-contenedor {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh; 
  width: 100vw;
  display: flex;
  flex-direction: column; 
  justify-content: flex-start;
  align-items: center;
  gap: 2rem; 
  padding: 2rem; 
  box-sizing: border-box; 
}


.content-card {
  background: rgba(255, 255, 255, 0.9); 
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.35);
  text-align: center;
  width: 100%;
  max-width: 700px; 
  margin-bottom: 1rem; 
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
  margin: 0 auto 15px auto; 
  padding: 10px;
  font-size: 16px;
  width: 80%; 
  max-width: 300px; 
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

select:focus {
  outline: none;
  border: 2px solid #007BFF; 
}

button {
  display: inline-block; 
  margin: 10px 5px; 
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007BFF; 
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3; 
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}


button.button-secondary {
  background-color: #6c757d; 
}

button.button-secondary:hover {
  background-color: #5a6268;
}

.table-responsive {
  overflow-x: auto; 
}

table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

th,
td {
  border: 1px solid #ddd; 
  padding: 12px; 
  text-align: left;
}

th {
  background-color: #007BFF; 
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9; 
}

tr:hover {
  background-color: #f1f1f1; 
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
    font-size: 1.8rem; 
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