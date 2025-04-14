    <template>
        <h1>Bienvenido Usuario</h1>
        <button @click="cerrarSesion">Cerrar Sesion</button>

    </template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { onMounted } from 'vue'
const user = ref({});

const router = useRouter();
const route = useRoute();
const cerrarSesion = () => {
    router.push("/");
    alert("Sesion cerrada correctamente");
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

</style>