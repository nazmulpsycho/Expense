import { defineStore } from "pinia";
import api from "../utils/http";
import { useToastStore } from "./toast";

export const useExpensesStore = defineStore("expenses", {
  state: () => ({
    items: [],
    pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    loading: false,
    error: null,
    categories: [],
  }),

  actions: {
    async fetch(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get("/expenses", { params });
        this.items = data.data || [];
        this.pagination = data.pagination || this.pagination;
      } catch (err) {
        this.error = err?.response?.data?.error?.message || "Failed to load expenses";
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      const toast = useToastStore();
      const { data } = await api.post("/expenses", payload);
      this.items.unshift(data.data);
      this.pagination.total += 1;
      const category = data.data.category;
      if (data.autoCategory && data.autoCategory.overridden && category !== data.autoCategory.category) {
        toast.info(`Categorized as ${category} (auto: ${data.autoCategory.category})`, "Expense added");
      } else {
        toast.success("Expense added", category);
      }
      return data.data;
    },

    async update(id, payload) {
      const toast = useToastStore();
      const { data } = await api.put(`/expenses/${id}`, payload);
      const idx = this.items.findIndex((e) => e.id === id);
      if (idx !== -1) this.items[idx] = data.data;
      if (data.autoCategory && data.autoCategory.overridden) {
        toast.info(`Categorized as ${data.data.category} (auto: ${data.autoCategory.category})`, "Expense updated");
      } else {
        toast.success("Expense updated", data.data.category);
      }
      return data.data;
    },

    async remove(id) {
      const toast = useToastStore();
      await api.delete(`/expenses/${id}`);
      this.items = this.items.filter((e) => e.id !== id);
      this.pagination.total -= 1;
      toast.success("Expense removed");
    },

    async duplicate(id) {
      const toast = useToastStore();
      const { data } = await api.post(`/expenses/${id}/duplicate`);
      this.items.unshift(data.data);
      this.pagination.total += 1;
      toast.success("Expense duplicated", data.data.category);
      return data.data;
    },

    async summary(params = {}) {
      const { data } = await api.get("/expenses/summary", { params });
      return data.data;
    },

    async fetchCategories() {
      const { data } = await api.get("/categories");
      this.categories = data.categories;
    },
  },
});
