<template>
<h1>LOGIN</h1>
<input type="text" placeholder="Username" v-model="username" />
<input type="password" placeholder="Password" v-model="password" />
<button @click="login">Login</button>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";

const username = ref("");
const password = ref("");

const login = async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/usuarios/login", {
      usuario: username.value,
      password: password.value
    });

    alert("Bienvenido " + response.data.user.nombre);
    // Aquí podrías guardar el usuario en localStorage, etc.
  } catch (error) {
    alert(error.response?.data?.error || "Error en el login");
  }
};

</script>


<style scoped>
</style>