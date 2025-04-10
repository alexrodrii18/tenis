<template>
<h1>LOGIN</h1>
<input type="text" placeholder="Username" v-model="username" />
<input type="password" placeholder="Password" v-model="password" />
<button @click="login">Login</button>
<p v-if="error" style="color: red;">{{ error }}</p>
<p v-if="success" style="color: green;">{{ success }}</p>
</template>


<script setup>

</script>


<style scoped>
</style>