import { defineStore } from "pinia";
import api from "../utils/http";
import { useToastStore } from "./toast";

export const useBudgetStore = defineStore("budget", {
  state: () => ({
    data: null,
    loading: false,
  }),

  actions: {
    async fetch() {
      this.loading = true;
      try {
        const { data } = await api.get("/budget");
        this.data = data.data;
      } catch {
        this.data = null;
      } finally {
        this.loading = false;
      }
    },

    async update(payload) {
      const toast = useToastStore();
      const { data } = await api.post("/budget", payload);
      this.data = data.data;
      toast.success("Budget updated");
      return data.data;
    },
  },
});
