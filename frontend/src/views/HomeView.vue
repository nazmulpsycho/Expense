<template>
  <div class="relative min-h-screen overflow-hidden bg-dark text-text selection:bg-neon-blue/30">
    <!-- Three.js scene -->
    <div ref="sceneContainer" class="pointer-events-none absolute inset-0 z-0"></div>

    <!-- Ambient blobs -->
    <div class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div class="absolute -left-40 top-20 h-96 w-96 rounded-full bg-neon-blue/10 blur-[120px]"></div>
      <div class="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-neon-purple/12 blur-[120px]"></div>
      <div class="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-green/6 blur-[100px]"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-32 sm:pt-36 sm:pb-40">
      <div class="mx-auto max-w-4xl text-center">
        <!-- badge -->
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-blue/20 bg-neon-blue/8 px-4 py-1.5 text-xs font-medium text-neon-blue shadow-sm animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-neon-blue"></span>
          </span>
          Intelligent expense tracking, powered by AI
        </div>

        <!-- eyebrow -->
        <p class="mb-4 text-sm font-mono uppercase tracking-[0.3em] text-text-dim">Next-gen personal finance</p>

        <!-- headline -->
        <h1 class="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Know where your<br />
          <span class="gradient-text text-neon-glow">money goes</span>
        </h1>

        <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
          ExpenseFlow AI categorizes your spending automatically, turns your habits into insight,
          and gives you a dashboard that feels like the future of money.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <router-link to="/auth?tab=register" class="btn btn-primary text-base px-8 py-4 shadow-2xl shadow-neon-blue/30 animate-scale-in">
            Start free
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
          <router-link to="/auth?tab=login" class="btn btn-secondary text-base px-8 py-4">Sign in</router-link>
        </div>

        <!-- social proof line -->
        <p class="mt-10 text-sm text-text-dim">No credit card required · 30 expense categories · Auto-categorization</p>

        <!-- Feature cards -->
        <div class="mt-20 grid gap-6 sm:mt-28 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(feat, i) in features" :key="i" class="group relative overflow-hidden rounded-2xl border border-border/70 bg-dark-card/60 p-6 transition-all duration-300 hover:border-neon-blue/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]">
            <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-blue/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <div class="relative z-10">
              <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neon-blue/10 text-neon-blue">
                <component :is="feat.icon" class="h-5 w-5" />
              </div>
              <h3 class="text-lg font-semibold text-text">{{ feat.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-text-muted">{{ feat.description }}</p>
            </div>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="mt-20 rounded-3xl border border-border/70 bg-dark-card/40 p-8 backdrop-blur-md">
          <div class="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <div v-for="(stat, i) in stats" :key="i" class="stat-value text-3xl font-extrabold text-neon-blue">{{ stat.value }}</div>
          </div>
         <span class="flex items-center gap-1.5">
  <span class="relative flex h-1.5 w-1.5">
    <span class="absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
  </span>
  Auto category
</span>

<span class="flex items-center gap-1.5">
  <span class="relative flex h-1.5 w-1.5">
    <span class="absolute inline-flex h-full w-full rounded-full bg-neon-purple opacity-75"></span>
  </span>
  Live analytics
</span>

<span class="flex items-center gap-1.5">
  <span class="relative flex h-1.5 w-1.5">
    <span class="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
  </span>
  30 categories
</span>
        </div>

        <!-- Footer CTA -->
        <div class="mt-16 text-center">
          <p class="text-text-dim">Ready to see your finances differently?</p>
          <router-link to="/auth?tab=register" class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neon-blue transition-colors hover:underline">
            Create your free account
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Bottom fade -->
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark to-transparent"></div>

    <!-- Loading overlay while scene mounts -->
    <Transition name="fade">
      <div v-if="loading" class="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-dark/60 backdrop-blur-sm">
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-6 backdrop-blur-md">
          <div class="flex items-center gap-4">
            <div class="relative h-10 w-10 animate-spin">
              <div class="absolute inset-0 rounded-full border-2 border-neon-blue/30 border-t-neon-blue"></div>
            </div>
            <span class="text-sm font-medium text-text-muted">Loading expense universe...</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { createFinanceScene, animateFinanceScene } from "../utils/threeScene";
import { CheckCircleIcon, CogIcon, ChartBarIcon, ShieldCheckIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const sceneContainer = ref(null);
const loading = ref(true);

const features = [
  {
    title: "AI auto-categorization",
    description: "Just type the name and amount — we figure out the category, date, and time for you.",
    icon: CheckCircleIcon,
  },
  {
    title: "Futuristic dashboard",
    description: "Animated charts, heatmaps, and count-up stats that make sense of your spending.",
    icon: ChartBarIcon,
  },
  {
    title: "Smart calendar",
    description: "See spending intensity across days, weeks, months, and years at a glance.",
    icon: CogIcon,
  },
  {
    title: "Budget control",
    description: "Set daily, weekly, or monthly budgets and get warned before you overspend.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Reports & exports",
    description: "Daily, weekly, monthly, and yearly reports ready to export as PDF, Excel, or CSV.",
    icon: ChartBarIcon,
  },
  {
    title: "Private & secure",
    description: "JWT auth, hashed passwords, rate limiting, and encrypted sessions by default.",
    icon: ShieldCheckIcon,
  },
];

const stats = [
  { value: "30+" },
  { value: "8" },
  { value: "5" },
  { value: "1" },
];

let animationFrameId = null;
let clock = null;
let sceneCtx = null;

onMounted(async () => {
  // Animate headline
  await gsap.from(".text-5xl, .text-6xl, .text-7xl", {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.15,
    clearProps: "transform",
  });
  await gsap.from(".gradient-text", {
    opacity: 0,
    x: -20,
    duration: 0.8,
    ease: "power2.out",
    delay: 0.3,
    clearProps: "transform",
  });
  await gsap.from("h3", { opacity: 0, y: 16, duration: 0.6, stagger: 0.08, ease: "power2.out", clearProps: "transform" });
  await gsap.from("p", { opacity: 0, y: 12, duration: 0.5, stagger: 0.06, ease: "power2.out", clearProps: "transform" });

  // Three.js scene
  if (sceneContainer.value) {
    try {
      const ctx = createFinanceScene(sceneContainer.value, {
        particleCount: 160,
        speed: 0.18,
        colorA: "#00E5FF",
        colorB: "#A855F7",
      });
      sceneCtx = ctx;
      ctx.handleMouseMove = (e) => ctx.handleMouseMove?.(e);

      window.addEventListener("mousemove", (e) => {
        if (ctx.handleMouseMove) ctx.handleMouseMove(e);
      });

      clock = { getElapsedTime: () => performance.now() / 1000 };

      const tick = () => {
        animateFinanceScene(ctx, clock);
        animationFrameId = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      console.warn("Three.js scene failed to initialize:", err);
    }
  }

  loading.value = false;
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (sceneCtx) sceneCtx.dispose();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
