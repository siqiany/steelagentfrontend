<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<style>
#app {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
