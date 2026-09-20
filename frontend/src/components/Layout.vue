<template>
  <div class="min-h-screen bg-dark text-text">
    <Navigation />
    <main class="pb-24 md:pb-8 pt-16">
      <slot />
    </main>
    <MobileNav v-if="isAuthenticated" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import Navigation from "./Navigation.vue";
import MobileNav from "./MobileNav.vue";

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>
