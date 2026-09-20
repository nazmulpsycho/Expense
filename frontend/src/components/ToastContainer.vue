<template>
  <Teleport to="body">
    <div class="fixed right-6 bottom-6 z-[100] flex flex-col gap-3 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto toast-item" :class="toastClass">
          <div class="flex items-start gap-3 p-4 glass-strong rounded-xl border">
            <div class="flex-shrink-0 mt-0.5">
              <slot :toast="toast" />
            </div>
            <div class="flex-1 min-w-0">
              <p v-if="toast.title" class="text-xs font-semibold text-text-muted uppercase tracking-wider">{{ toast.title }}</p>
              <p class="text-sm text-text leading-relaxed">{{ toast.message }}</p>
            </div>
            <button v-if="toast.duration !== 0" class="flex-shrink-0 text-text-dim hover:text-text transition-colors p-1" @click="remove(toast.id)" aria-label="Dismiss">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { useToastStore } from "../stores/toast";

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);

const toastClass = computed(() => ({
  "border-neon-green/30 bg-neon-green/8": toastStore.toasts[0]?.type === "success",
}));

const remove = (id) => toastStore.remove(id);
</script>

<style scoped>
.toast-item {
  animation: slide-in-right 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-enter-active {
  animation: slide-in-right 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.toast-leave-active {
  animation: slide-out-right 0.25s ease-in forwards;
}
.toast-move {
  transition: transform 0.25s ease;
}
</style>
