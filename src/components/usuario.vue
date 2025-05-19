<template>
    <div class="vista-usuario">
      <h1>Bienvenido Usuario</h1>
  
      <select v-model="horarioSeleccionado">
        <option disabled value="">Selecciona un horario</option>
        <option v-for="hora in horariosDisponibles" :key="hora" :value="hora" :disabled="yaElegido(hora)">
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
  
      <h2>Emparejamientos en tu horario</h2>
      <table v-if="emparejamientos.length">
        <thead>
          <tr>
            <th>Jugador 1</th>
            <th>Jugador 2</th>
            <th>Horario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in emparejamientos" :key="emp.id">
            <td>{{ emp.jugador1 }}</td>
            <td>{{ emp.jugador2 }}</td>
            <td>{{ formatHora(emp.horario) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No hay emparejamientos todavía.</p>
  
      <h2>Disponibilidades de todos los jugadores</h2>
      <table v-if="todasDisponibilidades.length">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Día</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in todasDisponibilidades" :key="d.id">
            <td>{{ d.nombre_usuario }}</td>
            <td>{{ d.dia }}</td>
            <td>{{ formatHora(d.horario) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>No tienes disponibilidades registradas.</p>
    </div>
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    
    const router = useRouter()
    const user = ref({ id: 1, nombre: 'Usuario1' }) // Ajustar según login real
    
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
    const emparejamientos = ref([])
    const seleccionados = ref([])
    const disponibilidades = ref([])
    
    const cerrarSesion = () => {
      router.push("/")
      alert("Sesión cerrada correctamente")
    }
    
    const yaElegido = (hora) => {
  return seleccionados.value.includes(hora + "-" + diaSeleccionado.value)
}    
const guardarDisponibilidad = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/disponibilidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: user.value.id,
        dia: diaSeleccionado.value,
        horario: horarioSeleccionado.value
      })
    });

    const nueva = await res.json();
    disponibilidades.value.push(nueva);
    seleccionados.value.push(horarioSeleccionado.value + "-" + diaSeleccionado.value);
    horarioSeleccionado.value = "";
    diaSeleccionado.value = "";
  } catch (error) {
    console.error("Error guardando disponibilidad:", error);
  }
};


    
const obtenerEmparejamientos = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/disponibilidades/emparejamientos");
    const data = await res.json();
    emparejamientos.value = data.filter(emp => emp.jugador1 === user.value.nombre || emp.jugador2 === user.value.nombre);
  } catch (error) {
    console.error("Error obteniendo emparejamientos:", error);
  }
};

    
    const obtenerDisponibilidades = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/disponibilidades?usuario_id=${user.value.id}`)
        const data = await res.json()
        disponibilidades.value = data
        seleccionados.value = data.map(d => d.horario)
      } catch (error) {
        console.error("Error obteniendo disponibilidades:", error)
      }
    }
    
    const disponibilidadPush = (nuevo) => {
      disponibilidades.value.push(nuevo)
    }

    
    const todasDisponibilidades = ref([])

    const obtenerTodasDisponibilidades = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/disponibilidades`)
        const data = await res.json()
        todasDisponibilidades.value = data
      } catch (error) {
        console.error("Error obteniendo todas las disponibilidades:", error)
      }
}
    
    const formatHora = (hora) => {
      const date = new Date(`1970-01-01T${hora}Z`)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    }
    
    onMounted(() => {
      obtenerEmparejamientos()
      obtenerDisponibilidades()
      obtenerTodasDisponibilidades()
    })
  </script>
  
  <style scoped>
  select, button {
    margin: 10px;
    padding: 8px;
    font-size: 16px;
  }
  table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  </style>
  