import gsap from "gsap";

export function fadeInUp(el, delay = 0, duration = 0.6) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      clearProps: "transform",
    }
  );
}

export function scaleIn(el, delay = 0, duration = 0.5) {
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.92 },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: "back.out(1.7)",
      clearProps: "transform",
    }
  );
}

export function countUp(el, target, duration = 1.2, decimals = 0) {
  if (!el) return;
  const start = gsap.getProperty(el, "textContent") || 0;
  const nums = new gsap.timeline().to(el, {
    textContent: target,
    duration,
    ease: "power2.out",
    snap: { textContent: { digits: decimals } },
    onUpdate: () => {
      // keep formatting
    },
  });
  return nums;
}

export function staggerChildren(parent, selector = "> *", delay = 0.08, duration = 0.5) {
  gsap.from(`${parent} ${selector}`, {
    opacity: 0,
    y: 20,
    duration,
    stagger: delay,
    ease: "power2.out",
    clearProps: "transform",
  });
}

export function glowPulse(el, color = "#00E5FF", duration = 2.5) {
  gsap.to(el, {
    boxShadow: `0 0 18px ${color}66`,
    duration: duration * 0.5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
}
