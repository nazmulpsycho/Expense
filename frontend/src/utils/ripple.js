import { createApp, Directive } from "vue";

const ripple: Directive = {
  mounted(el) {
    el.addEventListener("pointerdown", (e) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 0.6;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      el.style.setProperty("--x", `${(x / rect.width) * 100}%`);
      el.style.setProperty("--y", `${(y / rect.height) * 100}%`);
    });
  },
};

const app = createApp({});
app.directive("ripple", ripple);
