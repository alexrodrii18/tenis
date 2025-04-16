<template>
    <h2>Editar Jugador</h2>
    <form v-if="cargado" @submit.prevent="editarJugador">
      <input v-model="nombre" placeholder="Nombre" required />
      <input v-model="usuario" placeholder="Usuario" required />
      <input v-model="password" placeholder="Contraseña" required />
      <input v-model="division_id" placeholder="ID de división" required />
      <button type="submit">Actualizar</button>
    </form>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const route = useRoute()
  const id = route.params.id
  
  const nombre = ref('')
  const usuario = ref('')
  const division_id = ref('')
  const password = ref('')

  const cargado = ref(false)
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:3000/jugadores/${id}`)
      const jugador = response.data
      nombre.value = jugador.nombre
      usuario.value = jugador.usuario
      password: password.value,
      division_id.value = jugador.division_id
      cargado.value = true
    } catch (error) {
      alert("Error al cargar jugador: " + error.message)
      router.push('/admin')
    }
  })
  
  const editarJugador = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/jugadores/${id}`, {
        nombre: nombre.value,
        usuario: usuario.value,
        division_id: division_id.value
      })
      alert("Jugador editado con éxito.")
      router.push('/admin')
    } catch (error) {
      alert("Error al editar jugador: " + error.message)
    }
  }
  </script>
  