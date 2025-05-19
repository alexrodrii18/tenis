<template>
    <h2>Añadir Jugador</h2>
    <form @submit.prevent="agregarJugador">
      <input v-model="nombre" placeholder="Nombre" required />
      <input v-model="usuario" placeholder="Usuario" required />
      <input v-model="password" placeholder="Contraseña" required />
      <input v-model="division_id" placeholder="División" required />
      <button type="submit">Añadir</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const nombre = ref('')
  const usuario = ref('')
  const division_id = ref('')
  const password = ref('')
  const router = useRouter()
  
  const agregarJugador = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/jugadores", {
        nombre: nombre.value,
        usuario: usuario.value,
        password: password.value,
        division_id: division_id.value
      })
      alert("Jugador añadido con éxito.")
      router.push('/admin')
    } catch (error) {
      alert("Error al añadir jugador: " + error.message)
    }
  }
  </script>
  