<template>
  <h1>LOGIN</h1>
  <input type="text" placeholder="Usuario" v-model="username" />
  <input type="password" placeholder="Contraseña" v-model="password" />
  <button @click="login">Login</button>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import {onMounted} from 'vue'
const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");

// login.vue
const login = async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/usuarios/login", {
    usuario: username.value,
    password: password.value
    });
    
    const user = response.data.user;

    if (user.rol === "admin") {
      router.push("/admin");
    } else {
      router.push("/usuario");
    }
  } catch (error) {
    alert(error.response?.data?.error || "Error en el login");
  }
};


</script>


<style scoped>
h1 {
  color: blue;
  text-align: center;
  margin-top: 50px;
}
h1:hover {
  color: red;
  cursor: pointer;
}
input {
  display: block;
  margin: 20px auto;
  padding: 10px;
  font-size: 16px;
  width: 200px;
}
button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
input:focus {
  outline: none;
  border: 2px solid #007BFF;
}

</style>