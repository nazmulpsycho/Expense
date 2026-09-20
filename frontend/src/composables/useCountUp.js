import { ref, onMounted, watch } from "vue";
import gsap from "gsap";

export function useCountUp(targetValue, options = {}) {
  const el = ref(null);
  const value = ref(0);
  const { decimals = 0, duration = 1.2, ease = "power2.out", prefix = "", suffix = "" } = options;

  onMounted(() => {
    if (el.value) {
      gsap.to(el.value, {
        textContent: targetValue,
        duration,
        ease,
        snap: { textContent: { digits: decimals } },
        onUpdate() {
          value.value = parseFloat(el.value.textContent) || 0;
        },
      });
    } else {
      value.value = targetValue;
    }
  });

  watch(targetValue, (newVal) => {
    if (el.value) {
      gsap.to(el.value, {
        textContent: newVal,
        duration,
        ease,
        snap: { textContent: { digits: decimals } },
      });
    } else {
      value.value = newVal;
    }
  });

  return { el, value };
}
