<template>
  <h2>Listado de Jugadores</h2>

  <button @click="agregarJugador" class="btn-agregar">Añadir Jugador</button>

  <table v-if="jugadores.length > 0">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Usuario</th>
        <th>Contraseña</th>
        <th>ID de División</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="jugador in jugadores" :key="jugador.id">
        <td>{{ jugador.nombre }}</td>
        <td>{{ jugador.usuario }}</td>
        <td>{{ jugador.password }}</td>
        <td>{{ jugador.division_id }}</td>
        <td>
          <!-- Se pasa el id del jugador en lugar del usuario -->
          <button @click="editarJugador(jugador.id)">Editar</button>
          <button @click="eliminarJugador(jugador.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <p v-else>No hay jugadores disponibles.</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const jugadores = ref([]);

// Cargar jugadores cuando el componente se monte
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/jugadores');
    jugadores.value = response.data;
  } catch (error) {
    alert('Error al cargar jugadores: ' + error.message);
  }
});

// Redirige a la vista de editar jugador pasando el id como parámetro
const editarJugador = (id) => {
  router.push({ name: 'editarJugador', params: { id } });
};

// Eliminar jugador por su id
const eliminarJugador = async (id) => {
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar este jugador?');
  if (confirmacion) {
    try {
      const response = await axios.delete(`http://localhost:3000/jugadores/${id}`);
      alert(response.data.message);
      // Refrescar la lista de jugadores
      jugadores.value = jugadores.value.filter(jugador => jugador.id !== id);
    } catch (error) {
      alert('Error al eliminar jugador: ' + error.message);
    }
  }
};

// Redirige a la página de agregar jugador
const agregarJugador = () => {
  router.push('/admin/agregar-jugador');
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #007BFF;
  color: white;
}

.btn-agregar {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn-agregar:hover {
  background-color: #218838;
}
</style>
