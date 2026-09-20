<template>
  <router-view v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </router-view>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useToastStore } from "./stores/toast";

const authStore = useAuthStore();
const toastStore = useToastStore();

onMounted(async () => {
  await authStore.init();
});
</script>

<style scope="module">
.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
