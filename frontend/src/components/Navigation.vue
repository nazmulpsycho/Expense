<template>
  <header class="fixed top-0 left-0 right-0 z-50 rounded-none border-b border-border/60 bg-dark/70 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
      <div class="flex items-center gap-2">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple shadow-lg shadow-neon-blue/20">
          <svg class="h-5 w-5 text-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight text-text">
          Expense<span class="text-neon-blue">Flow</span>
          <span class="text-xs font-mono font-medium text-text-dim ml-1">AI</span>
        </span>
      </div>

      <div class="hidden md:flex items-center gap-6">
        <router-link to="/dashboard" class="text-sm font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">Dashboard</router-link>
        <router-link to="/expenses" class="text-sm font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">Expenses</router-link>
        <router-link to="/reports" class="text-sm font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">Reports</router-link>
        <router-link to="/profile" class="text-sm font-medium text-text-muted transition-colors hover:text-text" active-class="text-neon-blue">Profile</router-link>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="isAuthenticated">
          <router-link to="/dashboard" class="btn btn-primary text-sm py-2 px-4 shadow-lg shadow-neon-blue/20">
            Dashboard
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/auth" class="btn btn-secondary text-sm py-2 px-4">Sign In</router-link>
          <router-link to="/auth?tab=register" class="btn btn-primary text-sm py-2 px-4 shadow-lg shadow-neon-blue/20">Get Started</router-link>
        </template>

        <button class="ml-2 md:hidden p-2 text-text-muted hover:text-text transition-colors" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <svg v-if="!mobileOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="border-t border-border/60 bg-dark/95 backdrop-blur-xl md:hidden">
        <div class="flex flex-col gap-2 px-4 py-4">
          <router-link to="/dashboard" class="rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text" active-class="text-neon-blue bg-white/5" @click="mobileOpen = false">Dashboard</router-link>
          <router-link to="/expenses" class="rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text" active-class="text-neon-blue bg-white/5" @click="mobileOpen = false">Expenses</router-link>
          <router-link to="/reports" class="rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text" active-class="text-neon-blue bg-white/5" @click="mobileOpen = false">Reports</router-link>
          <router-link to="/profile" class="rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text" active-class="text-neon-blue bg-white/5" @click="mobileOpen = false">Profile</router-link>
          <div class="mt-2 border-t border-border/60 pt-2" v-if="isAuthenticated">
            <button class="w-full rounded-xl py-3 text-sm font-medium text-neon-pink transition-colors hover:bg-neon-pink/10" @click="handleLogout">Sign Out</button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const mobileOpen = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);

function handleLogout() {
  authStore.logout();
  mobileOpen.value = false;
}
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
