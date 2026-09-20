import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import DashboardView from "../views/DashboardView.vue";
import ExpensesView from "../views/ExpensesView.vue";
import ReportsView from "../views/ReportsView.vue";
import ProfileView from "../views/ProfileView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthView,
    meta: { requiresGuest: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/expenses",
    name: "Expenses",
    component: ExpensesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/reports",
    name: "Reports",
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: "Auth", query: { returnTo: to.fullPath } });
    }
  }
  if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      return next({ name: "Dashboard" });
    }
  }
  next();
});

export default router;

export function getDefaultRedirect() {
  return "/dashboard";
}
