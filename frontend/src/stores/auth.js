import { defineStore } from "pinia";
import api from "../utils/http";
import router from "../router";
import { getDefaultRedirect } from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken && !!state.user,
    isReady: (state) => state.initialized,
  },

  actions: {
    async init() {
      if (this.initialized) return;
      this.loading = true;
      try {
        if (this.accessToken) {
          await this.refresh();
        } else {
          this.initialized = true;
        }
      } catch {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        this.initialized = true;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password, remember = false) {
      const { data } = await api.post("/auth/login", { email, password, remember });
      this.applyAuth(data);
      return data.user;
    },

    async register(name, username, email, password) {
      const { data } = await api.post("/auth/register", { name, username, email, password });
      this.applyAuth(data);
      return data.user;
    },

    async logout() {
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore
      } finally {
        this.clear();
      }
      router.push({ name: "Home" });
    },

    applyAuth({ accessToken, refreshToken, user }) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.user = user;
      if (typeof document !== "undefined") {
        document.cookie = `accessToken=${accessToken};path=/;max-age=31536000;SameSite=Lax${location.protocol === "https:" ? ";Secure" : ""}`;
        document.cookie = `refreshToken=${refreshToken};path=/;max-age=2592000;SameSite=Lax${location.protocol === "https:" ? ";Secure" : ""}`;
      }
    },

    clear() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      if (typeof document !== "undefined") {
        document.cookie = "accessToken=;path=/;max-age=0";
        document.cookie = "refreshToken=;path=/;max-age=0";
      }
    },

    async refresh() {
      if (!this.refreshToken) throw new Error("No refresh token");
      const { data } = await api.post("/auth/refresh", { refreshToken: this.refreshToken });
      this.applyAuth({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
      return data.user;
    },

    async fetchProfile() {
      const { data } = await api.get("/profile");
      this.user = data.user;
      return data.user;
    },

    async updateProfile(payload) {
      const { data } = await api.put("/profile", payload);
      this.user = data.user;
      return data.user;
    },

    async uploadAvatar(file) {
      const form = new FormData();
      form.append("avatar", file);
      const { data } = await api.postForm("/profile/avatar", form, { headers: { "Content-Type": "multipart/form-data" } });
      this.user = data.user;
      return data.user;
    },

    async changePassword(currentPassword, newPassword) {
      await api.post("/profile/change-password", { currentPassword, newPassword });
    },
  },
});
