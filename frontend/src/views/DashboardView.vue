<template>
  <div class="layout-container">
    <div class="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <!-- top bar -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text lg:text-3xl">Dashboard</h1>
          <span class="rounded-lg bg-dark-card border border-border/60 px-3 py-1 text-xs font-mono text-text-dim">overview</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-for="period in periods"
            :key="period.key"
            type="button"
            class="rounded-lg border border-border/60 bg-dark-card px-4 py-2 text-sm font-medium text-text transition-all hover:border-border/80 hover:bg-dark-card/80"
            :class="periodClass(period.key)"
            @click="setPeriod(period.key)"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- stats -->
      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="stat in stats" :key="stat.key" class="group rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl transition-all duration-300">
          <div class="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-dark shadow-lg">
            <component :is="stat.icon" class="h-4 w-4 text-text-dim" />
          </div>
          <p class="text-sm font-medium text-text-dim">{{ stat.label }}</p>
          <p class="mt-1 text-3xl font-extrabold text-text tracking-tight">
            <span class="count" :data-value="stat.value">0</span>
            <span v-if="stat.unit" class="text-lg font-medium text-text-dim">{{ stat.unit }}</span>
          </p>
          <p class="mt-1 text-xs text-text-dim">
            <span v-if="stat.delta" class="text-neon-green font-medium">{{ stat.delta }}</span>
            <span v-else>today</span>
          </p>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- line chart -->
        <div class="lg:col-span-2 rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-text">Spending trend</h3>
            <span class="text-sm text-text-dim">{{ chartRangeLabel }}</span>
          </div>
          <div class="mt-4 flex h-72 items-end justify-between gap-2">
            <div
              v-for="(bar, index) in chartData"
              :key="index"
              class="flex flex-1 flex-col items-center gap-2"
            >
              <div class="relative w-full flex-1">
                <div
                  class="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-neon-blue/20 to-neon-purple/20"
                  :style="{ height: chartHeight(index) }"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-neon-blue to-neon-purple shadow-lg shadow-neon-blue/20 transition-all duration-700"
                  :style="{ height: chartHeight(index) }"
                />
                <span
                  class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-text"
                  :class="{ 'opacity-0': chartData[index] === 0 }"
                >
                  {{ formatCurrency(chartData[index]) }}
                </span>
              </div>
              <span class="text-xs text-text-dim">{{ chartLabels[index] }}</span>
            </div>
          </div>
        </div>

        <!-- category pie-like distribution -->
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <h3 class="text-lg font-semibold text-text">Top categories</h3>
          <ul class="mt-4 space-y-3">
            <li v-for="cat in topCategories" :key="cat.name" class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold" :class="categoryColor(cat.name)">
                {{ cat.icon }}
              </span>
              <div class="flex-1 overflow-hidden">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate text-sm font-medium text-text">{{ cat.name }}</span>
                  <span class="text-sm font-semibold text-text">{{ formatCurrency(cat.amount) }}</span>
                </div>
                <div class="mt-1 h-1.5 rounded-full bg-dark-border overflow-hidden">
                  <div class="h-full rounded-full" :class="categoryColorClass(cat.name)" :style="{ width: cat.percent + '%' }" />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- recent expenses -->
      <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text">Recent expenses</h3>
          <router-link to="/expenses" class="text-sm text-neon-blue hover:underline">View all</router-link>
        </div>
        <ul class="mt-4 divide-y divide-border/40">
          <li v-for="expense in recentExpenses" :key="expense._id" class="group flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark border border-border/60">
              <span class="text-sm font-semibold text-text">{{ expense.category?.[0]?.toUpperCase() || '?' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="truncate text-sm font-medium text-text">{{ expense.expenseName }}</p>
              <p class="text-xs text-text-dim">{{ formatDate(expense.date) }} • {{ formatTime(expense.time) }}</p>
            </div>
            <span class="text-right text-sm font-semibold text-text">{{ formatCurrency(expense.amount) }}</span>
          </li>
          <li v-if="!recentExpenses.length" class="py-6 text-center text-sm text-text-dim">
            No expenses yet. Start tracking now.
          </li>
        </ul>
      </div>

      <!-- budget summary -->
      <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-text">Budget status</h3>
          <router-link to="/dashboard/budget" class="text-sm text-neon-blue hover:underline">Manage budgets</router-link>
        </div>
        <div class="mt-4 grid gap-4 sm:grid-cols-3">
          <div v-for="budgetItem in budgetSummary" :key="budgetItem.key" class="rounded-xl bg-dark border border-border/60 p-4">
            <p class="text-sm font-medium text-text-dim">{{ budgetItem.label }}</p>
            <p class="mt-1 text-xl font-bold text-text">
              {{ formatCurrency(budgetItem.spent) }} <span class="text-sm font-medium text-text-dim">/ {{ formatCurrency(budgetItem.limit) }}</span>
            </p>
            <div class="mt-2 h-2 w-full rounded-full bg-dark-border overflow-hidden">
              <div class="h-full rounded-full transition-all duration-700" :class="budgetBarClass(budgetItem.percent)" :style="{ width: Math.min(budgetItem.percent, 100) + '%' }" />
            </div>
            <p class="mt-1 text-xs text-text-dim">{{ budgetItem.percent.toFixed(0) }}% used</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDashboardStore } from '../stores/dashboard';
import { formatCurrency, formatDate, formatTime } from '../utils/format';
import { ArrowTrendingUpIcon, Bars3Icon, ChartBarIcon, Cog6ToothIcon, WalletIcon } from '@heroicons/vue/24/solid/esm/index.js';

const dashboardStore = useDashboardStore();

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'year', label: 'This year' },
];

const period = ref('month');

function setPeriod(key) {
  period.value = key;
}

const stats = computed(() => {
  const current = dashboardStore.getPeriodStats[period.value] || dashboardStore.getPeriodStats.month || {};
  const previous = dashboardStore.getPeriodComparison?.[period.value] ?? 0;
  const delta = current.total
    ? previous
      ? Math.round(((current.total - previous) / previous) * 100)
      : 0
    : 0;

  return [
    {
      key: 'total',
      label: period.value === 'today' ? 'Today’s spending' : `Total spend — ${periods.find(p => p.key === period.value)?.label}`,
      value: current.total || 0,
      unit: 'USD',
      delta: delta ? (delta > 0 ? `+${delta}% vs prior` : `${delta}% vs prior`) : undefined,
      icon: Bars3Icon,
    },
    {
      key: 'transactions',
      label: 'Transactions',
      value: current.count || 0,
      icon: ChartBarIcon,
      delta: undefined,
    },
    {
      key: 'avg',
      label: 'Average per day',
      value: current.avg || 0,
      unit: 'USD',
      delta: undefined,
      icon: Cog6ToothIcon,
    },
    {
      key: 'topCategory',
      label: 'Highest category',
      value: 0,
      icon: ArrowTrendingUpIcon,
      delta: undefined,
    },
  ];
});

function categoryColorClass(name) {
  const map = {
    Food: 'bg-neon-blue',
    Transport: 'bg-neon-purple',
    Entertainment: 'bg-neon-green',
    Shopping: 'bg-neon-orange',
  };
  return map[name] || 'bg-dark-border';
}

function categoryColor(name) {
  return {
    background: categoryColorClass(name).replace('bg-', 'bg-').replace('/20', '/15'),
    color: categoryColorClass(name).includes('bg-dark-border') ? 'text-text-dim' : 'text-dark',
  };
}

const chartLabels = computed(() => dashboardStore.chartLabels);
const chartData = computed(() => dashboardStore.chartData);

function chartHeight(index) {
  const max = Math.max(...chartData.value, 1);
  return `${(chartData.value[index] / max) * 70}%`;
}

const chartRangeLabel = computed(() => {
  if (period.value === 'today') return 'Daily spend';
  if (period.value === 'week') return 'Weekly spend';
  if (period.value === 'month') return 'Monthly spend';
  return 'Yearly spend';
});

const topCategories = computed(() => dashboardStore.topCategories);

const recentExpenses = computed(() => dashboardStore.recentExpenses.slice(0, 5));

const budgetSummary = computed(() => dashboardStore.budgetSummary);

function periodClass(key) {
  return key === period.value
    ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-sm shadow-neon-blue/10'
    : '';
}

// mock seeding for build-time preview in case store is empty
if (!dashboardStore.recentExpenses.length) {
  dashboardStore.setPeriodStats({
    today: { total: 42, count: 3, avg: 42 },
    week: { total: 218, count: 14, avg: 31 },
    month: { total: 980, count: 42, avg: 32 },
    year: { total: 8420, count: 312, avg: 27 },
  });
  dashboardStore.setChartData([12, 19, 8, 15, 22, 13, 27, 18, 24, 9, 14, 20], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  dashboardStore.setTopCategories([
    { name: 'Food', amount: 420, icon: '🍔', percent: 42 },
    { name: 'Transport', amount: 180, icon: '🚗', percent: 18 },
    { name: 'Shopping', amount: 150, icon: '🛍️', percent: 15 },
    { name: 'Entertainment', amount: 110, icon: '🎬', percent: 11 },
  ]);
  dashboardStore.setRecentExpenses([
    { _id: '1', expenseName: 'KFC Lunch', amount: 12.5, category: 'Food', date: '2024-01-10', time: '12:30' },
    { _id: '2', expenseName: 'Uber Ride', amount: 8.75, category: 'Transport', date: '2024-01-10', time: '09:15' },
    { _id: '3', expenseName: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2024-01-09', time: '08:00' },
    { _id: '4', expenseName: 'Coffee Shop', amount: 4.5, category: 'Food', date: '2024-01-09', time: '07:45' },
    { _id: '5', expenseName: 'Gas Station', amount: 55.0, category: 'Transport', date: '2024-01-08', time: '18:20' },
  ]);
  dashboardStore.setBudgetSummary([
    { key: 'daily', label: 'Daily budget', spent: 42, limit: 75, percent: 56 },
    { key: 'weekly', label: 'Weekly budget', spent: 218, limit: 500, percent: 44 },
    { key: 'monthly', label: 'Monthly budget', spent: 980, limit: 4000, percent: 24 },
  ]);
}
</script>
