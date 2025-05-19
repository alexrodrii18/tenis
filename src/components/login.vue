<template>
  <section class="login_contenedor">
    <div>
      <form @submit.prevent="login">
        <h1>Iniciar Sesion</h1>
        <input type="text" placeholder="Usuario" v-model="username" />
        <input type="password" placeholder="Contraseña" v-model="password" />
        <button type="submit">Login</button>
      </form>
    </div>

    <div>
      <form @submit.prevent="registrar">
        <h1>Registrate aqui!</h1>

        <label>
          <input type="text" v-model="usuario" placeholder="Usuario" />
        </label>

        <label>
          <input type="password" v-model="passwordFormulario" placeholder="Contraseña" />
        </label>

        <label>
          <input type="text" v-model="nombre" placeholder="Nombre" />
        </label>

        <label>
          <input type="number" v-model="division" placeholder="Division" />
        </label>

        <button type="submit">Registrar</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// Variables login
const username = ref("");
const password = ref("");

// Variables registro
const usuario = ref("");
const passwordFormulario = ref("");
const nombre = ref("");
const division = ref(null);
const rol = ref("jugador"); // Puedes dejar el rol fijo aquí

const login = async () => {
  try {
    const response = await axios.post("http://localhost:3000/api/usuarios/login", {
      usuario: username.value,
      password: password.value,
    });

    const user = response.data.user;

    localStorage.setItem("nombreUsuario", user.nombre);

    if (user.rol === "admin") {
      router.push("/admin");
    } else {
      router.push("/usuario");
    }
  } catch (error) {
    alert(error.response?.data?.error || "Error en el login");
  }
};

const registrar = async () => {
  if (!usuario.value || !passwordFormulario.value || !nombre.value || !division.value) {
    alert("Completa todos los campos");
    return;
  }

  try {
    await axios.post("http://localhost:3000/jugadores/registro", {
      usuario: usuario.value,
      password: passwordFormulario.value,
      nombre: nombre.value,
      division: division.value,
      rol: rol.value,
    });
    alert("Usuario registrado");

    // Limpiar campos
    usuario.value = "";
    passwordFormulario.value = "";
    nombre.value = "";
    division.value = null;
    rol.value = "jugador";
  } catch (error) {
    alert(error.response?.data?.error || "Error al registrar");
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

form {
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
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

.login_contenedor {
  background-image: url("/public/fondo_tennis.jpg"); /* ¡NO uses /public aquí! */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  max-height: 1080px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

</style>