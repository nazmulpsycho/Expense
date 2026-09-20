<template>
  <div class="relative min-h-screen bg-dark text-text">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute left-1/2 top-0 h-72 w-96 -translate-x-1/2 rounded-full bg-neon-blue/8 blur-[120px]"></div>
      <div class="absolute right-0 bottom-0 h-72 w-96 rounded-full bg-neon-purple/8 blur-[120px]"></div>
    </div>

    <div class="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8">
      <div class="order-1 flex w-full flex-col items-center md:w-1/2">
        <div class="mb-10 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple shadow-lg shadow-neon-blue/20">
            <svg class="h-6 w-6 text-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <span class="text-2xl font-bold tracking-tight text-text">
            Expense<span class="text-neon-blue">Flow</span>
            <span class="text-xs font-mono font-medium text-text-dim ml-1">AI</span>
          </span>
        </div>

        <div class="mx-auto max-w-md text-center md:text-left">
          <h1 class="text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
            Your money,<br />
            <span class="gradient-text text-neon-glow">intelligently organized</span>
          </h1>
          <p class="mt-4 text-lg leading-relaxed text-text-muted">
            Add an expense with just a name and amount. ExpenseFlow AI detects the category,
            logs the time, and feeds your dashboard in real time.
          </p>
          <ul class="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <li class="flex items-center gap-3 rounded-xl bg-dark-card/50 border border-border/60 px-4 py-3">
              <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-neon-blue/15 text-neon-blue">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span class="text-sm font-medium text-text">AI category detection</span>
            </li>
            <li class="flex items-center gap-3 rounded-xl bg-dark-card/50 border border-border/60 px-4 py-3">
              <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-neon-purple/15 text-neon-purple">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span class="text-sm font-medium text-text">Real-time analytics</span>
            </li>
            <li class="flex items-center gap-3 rounded-xl bg-dark-card/50 border border-border/60 px-4 py-3">
              <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-neon-green/15 text-neon-green">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span class="text-sm font-medium text-text">Budget tracking</span>
            </li>
            <li class="flex items-center gap-3 rounded-xl bg-dark-card/50 border border-border/60 px-4 py-3">
              <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-neon-purple/15 text-neon-purple">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span class="text-sm font-medium text-text">Beautiful reports</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="order-2 flex w-full flex-col items-center md:w-1/2">
        <div class="mx-auto w-full max-w-sm">
          <div class="animate-fade-in rounded-2xl border border-border/60 bg-dark-card/70 p-8 shadow-2xl backdrop-blur-xl">
            <div class="flex flex-col gap-1">
              <h2 class="text-2xl font-bold text-text">Hello, again.</h2>
              <p class="text-sm text-text-muted">Sign in to continue to your dashboard.</p>
            </div>

            <form class="mt-6 flex flex-col gap-4" @submit.prevent="handleLogin">
              <div class="flex flex-col gap-1">
                <label for="email" class="text-sm font-medium text-text">Email address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  autocomplete="email"
                  class="input"
                  :class="{ 'ring-2 ring-neon-blue border-neon-blue focus:ring-neon-blue': focused === 'email' }"
                  @focus="focused = 'email'"
                  @blur="focused = ''"
                />
                <p v-if="errors.email" class="text-xs text-error">{{ errors.email }}</p>
              </div>

              <div class="flex flex-col gap-1">
                <label for="password" class="text-sm font-medium text-text">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    class="input pr-10"
                    :class="{ 'ring-2 ring-neon-blue border-neon-blue focus:ring-neon-blue': focused === 'password' }"
                    @focus="focused = 'password'"
                    @blur="focused = ''"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 flex h-full items-center pr-3 text-text-muted transition-colors hover:text-text"
                    @click="showPassword = !showPassword"
                  >
                    <svg v-if="showPassword" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.08a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <p v-if="errors.password" class="text-xs text-error">{{ errors.password }}</p>
              </div>

              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none">
                  <input
                    v-model="form.remember"
                    type="checkbox"
                    class="h-4 w-4 rounded border-border bg-dark-card accent-neon-blue"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" class="text-sm text-neon-blue hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                class="btn-primary h-11 w-full text-center text-sm font-semibold"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                  <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in...
                </span>
                <span v-else>Sign in</span>
              </button>
            </form>

            <p class="mt-6 text-center text-sm text-text-muted">
              Don't have an account?
              <button type="button" class="font-medium text-neon-blue hover:underline" @click="toRegister = true">
                Create one
              </button>
            </p>

            <p v-if="message" class="mt-4 text-center text-sm text-error">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>

    <Transition name="slide-up">
      <AuthView v-if="toRegister" @close="toRegister = false" />
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Toast from "../components/ToastContainer.vue";

const emit = defineEmits(["close"]);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toRegister = ref(false);

const showPassword = ref(false);
const focused = ref("");
const loading = ref(false);
const message = ref("");

const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const errors = reactive({
  email: "",
  password: "",
});

function validate() {
  errors.email = "";
  errors.password = "";

  if (!form.email.trim()) {
    errors.email = "Email is required";
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address";
    return false;
  }
  if (!form.password) {
    errors.password = "Password is required";
    return false;
  }
  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    return false;
  }
  return true;
}

async function handleLogin() {
  if (!validate()) return;

  loading.value = true;
  message.value = "";

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      message.value = data.message || "Invalid email or password";
      return;
    }

    authStore.setUser(data.user, data.token);
    const returnTo = route.query.returnTo || "/dashboard";
    router.push(returnTo);
  } catch {
    message.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
