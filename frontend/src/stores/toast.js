import { defineStore } from "pinia";

let toastId = 0;

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [],
  }),

  actions: {
    success(message, title) {
      this.add({ type: "success", message, title });
    },
    error(message, title) {
      this.add({ type: "error", message, title, duration: 6000 });
    },
    info(message, title) {
      this.add({ type: "info", message, title });
    },
    warning(message, title) {
      this.add({ type: "warning", message, title });
    },
    add({ type = "info", message, title, duration = 4000 }) {
      this.toasts.push({ id: ++toastId, type, message, title, duration });
      if (duration > 0) {
        setTimeout(() => this.remove(toastId), duration);
      }
    },
    remove(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});
