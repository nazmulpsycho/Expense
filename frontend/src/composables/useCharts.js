import { ref, onMounted, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { CATEGORY_COLORS } from "../utils/format";

Chart.register(...registerables);

function gradient(ctx, colorTop = "rgba(0,229,255,0.45)", colorBottom = "rgba(0,229,255,0.02)") {
  const g = ctx.createLinearGradient(0, ctx.height, 0, 0);
  g.addColorStop(0, colorTop);
  g.addColorStop(1, colorBottom);
  return g;
}

export function useLineChart(containerRef, data, options = {}) {
  const chartRef = ref(null);
  let chart = null;

  const { respond = true, animate = true, tension = 0.35 } = options;

  function build() {
    if (!containerRef.value) return;
    nextTick(() => {
      const ctx = containerRef.value.getContext("2d");
      if (!ctx) return;
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Spending",
              data: data.map((d) => ({ x: d.x, y: d.y })),
              borderColor: "#00E5FF",
              backgroundColor: (ctx) => gradient(ctx),
              fill: true,
              tension,
              pointRadius: 3,
              pointBackgroundColor: "#00E5FF",
              pointBorderColor: "#050816",
              pointBorderWidth: 2,
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: respond,
          maintainAspectRatio: false,
          animation: animate ? { duration: 1200, easing: "easeOutQuart" } : false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0A0F24",
              titleColor: "#FFFFFF",
              bodyColor: "#D1D5DB",
              borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 10,
            },
          },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8B93A7" } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8B93A7" } },
          },
        },
      });
    });
  }

  onMounted(build);
  watch(data, build, { deep: true });
  return { chartRef };
}

export function useBarChart(containerRef, data, options = {}) {
  const chartRef = ref(null);
  let chart = null;

  function build() {
    if (!containerRef.value) return;
    nextTick(() => {
      const ctx = containerRef.value.getContext("2d");
      if (!ctx) return;
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Spending",
              data: data.map((d) => d.value),
              backgroundColor: data.map((d, i) => {
                const c = d.color || CATEGORY_COLORS["Shopping"] || "#00E5FF";
                return c + "CC";
              }),
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: options.animate !== false ? { duration: 1200, easing: "easeOutQuart" } : false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0A0F24",
              titleColor: "#FFFFFF",
              bodyColor: "#D1D5DB",
              borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 10,
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#8B93A7" } },
            y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8B93A7" } },
          },
        },
      });
    });
  }

  onMounted(build);
  watch(data, build, { deep: true });
  return { chartRef };
}

export function useDoughnutChart(containerRef, data, options = {}) {
  const chartRef = ref(null);
  let chart = null;

  function build() {
    if (!containerRef.value) return;
    nextTick(() => {
      const ctx = containerRef.value.getContext("2d");
      if (!ctx) return;
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: data.map((d) => d.color || CATEGORY_COLORS[d.label] || "#00E5FF"),
              borderColor: "#050816",
              borderWidth: 3,
              hoverOffset: 12,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "72%",
          animation: options.animate !== false ? { duration: 1200, easing: "easeOutQuart" } : false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#D1D5DB", padding: 16, usePointStyle: true, pointStyle: "circle", font: { size: 12 } },
            },
            tooltip: {
              backgroundColor: "#0A0F24",
              titleColor: "#FFFFFF",
              bodyColor: "#D1D5DB",
              borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 10,
              callbacks: {
                label: (ctx) => {
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = ((ctx.parsed / total) * 100).toFixed(1);
                  return ` ${ctx.label}: ${fmt(ctx.parsed)} (${pct}%)`;
                },
              },
            },
          },
        },
      });
    });
  }

  onMounted(build);
  watch(data, build, { deep: true });
  return { chartRef };
}

export function useRadarChart(containerRef, data, options = {}) {
  const chartRef = ref(null);
  let chart = null;

  function build() {
    if (!containerRef.value) return;
    nextTick(() => {
      const ctx = containerRef.value.getContext("2d");
      if (!ctx) return;
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: "radar",
        data: {
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Spending",
              data: data.map((d) => d.value),
              backgroundColor: "rgba(0,229,255,0.12)",
              borderColor: "#00E5FF",
              borderWidth: 2,
              pointBackgroundColor: "#00E5FF",
              pointBorderColor: "#050816",
              pointBorderWidth: 2,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: options.animate !== false ? { duration: 1200, easing: "easeOutQuart" } : false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0A0F24",
              titleColor: "#FFFFFF",
              bodyColor: "#D1D5DB",
              borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 10,
            },
          },
          scales: {
            r: {
              grid: { color: "rgba(255,255,255,0.08)" },
              angleLines: { color: "rgba(255,255,255,0.08)" },
              pointLabels: { color: "#D1D5DB", font: { size: 11 } },
              ticks: { display: false },
              beginAtZero: true,
            },
          },
        },
      });
    });
  }

  onMounted(build);
  watch(data, build, { deep: true });
  return { chartRef };
}

export function useStackedBarChart(containerRef, data, options = {}) {
  const chartRef = ref(null);
  let chart = null;

  function build() {
    if (!containerRef.value) return;
    nextTick(() => {
      const ctx = containerRef.value.getContext("2d");
      if (!ctx) return;
      if (chart) chart.destroy();

      const labels = data.labels;
      const categories = data.categories;
      const colors = data.colors || categories.map((c) => CATEGORY_COLORS[c] || "#00E5FF");

      chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: categories.map((cat, i) => ({
            label: cat,
            data: data.values[i] || labels.map(() => 0),
            backgroundColor: colors[i] + "CC",
            borderRadius: 3,
            borderSkipped: false,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: options.animate !== false ? { duration: 1200, easing: "easeOutQuart" } : false,
          plugins: {
            legend: { position: "bottom", labels: { color: "#D1D5DB", usePointStyle: true, padding: 16, font: { size: 12 } } },
            tooltip: {
              mode: "index",
              intersect: false,
              backgroundColor: "#0A0F24",
              titleColor: "#FFFFFF",
              bodyColor: "#D1D5DB",
              borderColor: "rgba(255,255,255,0.12)",
              borderWidth: 1,
              padding: 10,
              cornerRadius: 10,
            },
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { color: "#8B93A7" } },
            y: { stacked: true, grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8B93A7" } },
          },
        },
      });
    });
  }

  onMounted(build);
  watch(data, build, { deep: true });
  return { chartRef };
}

function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
