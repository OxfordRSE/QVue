<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import CheckSpec from "@/components/CheckSpec.vue";
import SettingsMenu from "@/components/SettingsMenu.vue";
</script>

<template>
  <CheckSpec />
  <header class="mb-2">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/report">Check report</RouterLink>
      <SettingsMenu />
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
