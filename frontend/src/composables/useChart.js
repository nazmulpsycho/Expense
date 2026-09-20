import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import { CATEGORY_COLORS } from "../utils/format";

Chart.register(...registerables);

export function useChart(containerRef, dataset, options = {}) {
  const chartRef = ref(null);
  let chart = null;

  const { type = "line", responsive = true, maintainAspectRatio = false, animate = true, ...restOptions } = options;

  const defaultOptions = {
    responsive,
    maintainAspectRatio,
    animation: animate ? { duration: 1200, easing: "easeOutQuart" } : false,
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
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8B93A7" } },
      y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: { color: "#8B93A7" } },
    },
    ...restOptions,
  };

  function buildDataset(data, labelKey, valueKey, colorKey, fill = false, tension = 0.35, borderWidth = 2) {
    return {
      label: labelKey,
      data: data.map((d) => ({ x: d[labelKey], y: d[valueKey] })),
      borderColor: colorKey ? CATEGORY_COLORS[colorKey] || "#00E5FF" : "#00E5FF",
      backgroundColor: fill
        ? (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, ctx.chart.height, 0, 0);
            g.addColorStop(0, "rgba(0,229,255,0.35)");
            g.addColorStop(1, "rgba(0,229,255,0.02)");
            return g;
          }
        : "rgba(0,229,255,0.15)",
      fill,
      tension,
      pointRadius: 3,
      pointBackgroundColor: "#00E5FF",
      pointBorderColor: "#050816",
      pointBorderWidth: 2,
      borderWidth,
    };
  }

  function buildFromPairs(pairs, color, label, fill = false, tension = 0.35) {
    return {
      label,
      data: pairs.map(([x, y]) => ({ x, y })),
      borderColor: color || "#00E5FF",
      backgroundColor: fill
        ? (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, ctx.chart.height, 0, 0);
            g.addColorStop(0, "rgba(0,229,255,0.35)");
            g.addColorStop(1, "rgba(0,229,255,0.02)");
            return g;
          }
        : "rgba(0,229,255,0.15)",
      fill,
      tension,
      pointRadius: 3,
      pointBackgroundColor: color || "#00E5FF",
      pointBorderColor: "#050816",
      pointBorderWidth: 2,
    };
  }

  function render(chartData) {
    if (chart) {
      chart.destroy();
      chart = null;
    }
    if (!containerRef.value) return;
    nextTick(() => {
      const ctx = containerRef.value.getContext("2d");
      if (!ctx) return;
      chart = new Chart(ctx, {
        type,
        data: {
          datasets: Array.isArray(chartData.datasets) ? chartData.datasets : [chartData.datasets],
        },
        options: chartData.options ? { ...defaultOptions, ...chartData.options } : defaultOptions,
      });
    });
  }

  function update(newDataset) {
    if (!chart) {
      render(newDataset);
      return;
    }
    if (Array.isArray(newDataset.datasets)) {
      chart.data.datasets = newDataset.datasets;
    } else {
      chart.data.datasets = [newDataset.datasets];
    }
    if (newDataset.options) {
      Object.assign(chart.options, newDataset.options);
    }
    chart.update("default");
  }

  onMounted(() => {
    if (dataset) render(dataset);
  });

  watch(dataset, (val) => {
    if (val) render(val);
  });

  onUnmounted(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });

  return { chartRef, render, update };
}
