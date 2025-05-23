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

    const user = response.data.user; // El objeto 'user' viene de tu backend y tiene user.id

    localStorage.setItem("nombreUsuario", user.nombre);
    localStorage.setItem("userId", user.id); // <--- ¡ESTA ES LA LÍNEA QUE DEBES AÑADIR!

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
h1 { /* Estilo general para H1 que ya tenías */
  color: blue;
  text-align: center;
  /* margin-top: 50px;  Quitaremos este margin-top general para H1 y lo manejaremos dentro del form */
}

h1:hover {
  color: red;
  cursor: pointer;
}

form {
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
  padding: 2.5rem; /* Aumentado un poco el padding */
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  min-width: 400px; /* Establecemos un ancho mínimo para el formulario */
  box-sizing: border-box; /* Para que el padding no aumente el min-width */
}

/* Estilo específico para los H1 dentro de los formularios */
form h1 {
  margin-top: 0; /* Quitamos el margen superior, el padding del form se encarga */
  margin-bottom: 2rem; /* Espacio debajo del título del formulario */
  font-size: 2.2em; /* Hacemos el título un poco más grande */
}

input {
  display: block;
  width: 100%; /* Hacemos que el input ocupe el ancho disponible en el form */
  padding: 14px; /* Aumentamos el padding del input para hacerlo más alto */
  font-size: 1.1em; /* Aumentamos un poco la fuente del input */
  margin-bottom: 20px; /* Espacio debajo de cada input */
  box-sizing: border-box; /* Importante cuando se usa width: 100% y padding */
  border: 1px solid #ccc; /* Añadimos un borde por defecto sutil */
  border-radius: 5px;
}

/* Labels en el form de registro (actualmente solo contienen inputs) */
label {
  display: block; /* Asegura que cada label ocupe su línea */
  width: 100%;
  /* El input dentro del label ya tiene margin-bottom, así que no es necesario aquí
     a menos que quieras espacio adicional para el label mismo si tuviera texto. */
}

button[type="submit"] { /* Aplicamos estilo más específico a los botones de submit */
  display: block;
  width: 100%; /* Hacemos que el botón ocupe el ancho disponible */
  margin-top: 10px; /* Espacio encima del botón (ajustado ya que el último input tiene margin-bottom) */
  /* margin: 20px auto; Este lo reemplazamos por width 100% y margin-top */
  padding: 14px 20px; /* Aumentamos el padding para un botón más grande */
  font-size: 1.1em; /* Fuente un poco más grande para el botón */
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box; /* Importante para width: 100% y padding */
}

button[type="submit"]:hover { /* :hover específico para botones de submit */
  background-color: #0056b3;
}

input:focus {
  outline: none;
  border: 2px solid #007BFF;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Añadimos un ligero resplandor al enfocar */
}

.login_contenedor {
  background-image: url("/fondo.jpeg"); 
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem; /* Mantenemos el gap entre formularios */
  padding: 1rem; /* Añadimos un poco de padding al contenedor general por si acaso */
  box-sizing: border-box;
}

/* Media query para pantallas más pequeñas, para que los formularios no sean demasiado anchos */
@media (max-width: 480px) {
  form {
    min-width: 100%; /* En pantallas muy pequeñas, que ocupe el ancho disponible */
    padding: 1.5rem;
  }
  form h1 {
    font-size: 1.8em;
  }
  input, button[type="submit"] {
    font-size: 1em;
    padding: 12px;
  }
}

</style>