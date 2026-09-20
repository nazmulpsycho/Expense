import { defineStore } from "pinia";
import api from "../utils/http";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    stats: null,
    recent: [],
    dailySeries: [],
    categoryBreakdown: [],
    budget: null,
    dateRange: null,
    loading: false,
  }),

  actions: {
    async fetch(params = {}) {
      this.loading = true;
      try {
        const { data } = await api.get("/dashboard", { params });
        this.stats = data.stats || null;
        this.recent = data.recent || [];
        this.dailySeries = data.dailySeries || [];
        this.categoryBreakdown = data.categoryBreakdown || [];
        this.budget = data.budget || null;
        this.dateRange = data.dateRange || null;
      } catch {
        this.stats = null;
        this.recent = [];
        this.dailySeries = [];
        this.categoryBreakdown = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
