<template>
  <div class="vista-usuario">
    <h1>Bienvenido  {{ nombreUsuario }}</h1>

    <select v-model="horarioSeleccionado">
      <option disabled value="">Selecciona un horario</option>
      <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
        {{ formatHora(hora) }}
      </option>
    </select>

    <label for="dia">Selecciona un día</label>
    <select v-model="diaSeleccionado">
      <option disabled value="">Selecciona un día</option>
      <option v-for="d in diasDisponibles" :key="d" :value="d">{{ d }}</option>
    </select>

    <button @click="guardarDisponibilidad" :disabled="!horarioSeleccionado || !diaSeleccionado">Guardar Horario</button>
    <button @click="cerrarSesion">Cerrar Sesión</button>

    <div>
      <h1>Reservas</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dia</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.id }}</td>
            <td>{{ reserva.dia }}</td>
            <td>{{ formatHora(reserva.hora) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const reservas = ref([]);
const nombreUsuario = ref()

onMounted(() => {
  const nombreGuardado = localStorage.getItem('nombreUsuario')
  if (nombreGuardado) {
    nombreUsuario.value = nombreGuardado
  }
})


const mostrarReservas = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/reservas");
    reservas.value = response.data;
  } catch (error) {
    alert("Error al cargar reservas: " + error.message);
  }
};

onMounted(() => {
  mostrarReservas();
});
const router = useRouter()



const horariosDisponibles = ref([
  "08:15:00",
  "10:30:00",
  "15:15:00",
  "17:30:00",
  "19:30:00",
])
const diasDisponibles = ref(["Viernes", "Sábado", "Domingo"])
const diaSeleccionado = ref("")
const horarioSeleccionado = ref("")


const cerrarSesion = () => {
  router.push("/")
  alert("Sesión cerrada correctamente")
}


const guardarDisponibilidad = async () => {

  if (!diaSeleccionado.value || !horarioSeleccionado.value) {
    alert("Por favor, completa todos los campos.")
    return
  }

  try {
    await axios.post("http://localhost:3000/api/reservas", {
      dia: diaSeleccionado.value,
      hora: horarioSeleccionado.value
    })

    alert("Reserva guardada con éxito.")
    // Opcional: limpiar selección
    diaSeleccionado.value = ""
    horarioSeleccionado.value = ""

  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert("Ya hay una reserva para ese día y hora.")
    } else {
      alert("Error al guardar reserva: " + error.message)
    }
  }

}



const formatHora = (hora) => {
  const date = new Date(`1970-01-01T${hora}Z`)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}


</script>

<style scoped>
select,
button {
  margin: 10px;
  padding: 8px;
  font-size: 16px;
}

table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.vista-usuario{
  text-align: center;
}
</style>