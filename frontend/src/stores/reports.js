import { defineStore } from "pinia";
import api from "../utils/http";

export const useReportsStore = defineStore("reports", {
  state: () => ({
    daily: null,
    weekly: null,
    monthly: null,
    yearly: null,
    loading: false,
    period: "monthly",
  }),

  actions: {
    async fetch(period = "monthly", extra = {}) {
      this.loading = true;
      try {
        const { data } = await api.get(`/reports/${period}`, { params: extra });
        this[period] = data;
      } catch {
        this[period] = null;
      } finally {
        this.loading = false;
      }
    },

    setPeriod(period) {
      this.period = period;
    },
  },
});
