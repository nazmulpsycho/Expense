<template>
  <div class="layout-container">
    <div class="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text lg:text-3xl">Reports</h1>
          <p class="mt-1 text-sm text-text-dim">Spending summaries by period.</p>
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="period"
            class="input rounded-lg border border-border/60 bg-dark-card/70 px-3 py-2 text-sm text-text focus:border-neon-blue focus:ring-neon-blue/20"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button type="button" class="secondary-button flex items-center gap-2 rounded-xl border border-border bg-dark-card/70 px-4 py-2 text-sm font-medium text-text transition-all hover:bg-dark-card hover:border-border/80">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7l-3 3m0 0h3l-3 3m-3-3v12" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-3">
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <p class="text-sm font-medium text-text-dim">Total spent</p>
          <p class="mt-1 text-3xl font-extrabold text-text">{{ formatCurrency(totalSpent) }}</p>
        </div>
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <p class="text-sm font-medium text-text-dim">Transactions</p>
          <p class="mt-1 text-3xl font-extrabold text-text">{{ totalTransactions }}</p>
        </div>
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <p class="text-sm font-medium text-text-dim">Average per day</p>
          <p class="mt-1 text-3xl font-extrabold text-text">{{ formatCurrency(averageDaily) }}</p>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <h3 class="text-lg font-semibold text-text">Spending by category</h3>
          <ul class="mt-4 space-y-3">
            <li v-for="cat in categorySummary" :key="cat.name" class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-dark">
                {{ cat.icon }}
              </span>
              <div class="flex-1 overflow-hidden">
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate text-sm font-medium text-text">{{ cat.name }}</span>
                  <span class="text-sm font-semibold text-text">{{ formatCurrency(cat.amount) }}</span>
                </div>
                <div class="mt-1 h-1.5 rounded-full bg-dark-border overflow-hidden">
                  <div class="h-full rounded-full" :class="cat.color" :style="{ width: cat.percent + '%' }" />
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
          <h3 class="text-lg font-semibold text-text">Daily breakdown</h3>
          <ul class="mt-4 space-y-3 text-sm text-text-dim">
            <li v-for="day in dailyBreakdown" :key="day.date" class="flex items-center justify-between">
              <span>{{ formatDate(day.date) }}</span>
              <span class="font-semibold text-text">{{ formatCurrency(day.amount) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatCurrency, formatDate } from '../utils/format';

const period = ref('monthly');

const totalSpent = computed(() => 1842.5);
const totalTransactions = computed(() => 48);
const averageDaily = computed(() => 76.8);

const categorySummary = computed(() => [
  { name: 'Food', amount: 420, icon: '🍔', percent: 42, color: 'bg-neon-blue' },
  { name: 'Transport', amount: 180, icon: '🚗', percent: 18, color: 'bg-neon-purple' },
  { name: 'Shopping', amount: 150, icon: '🛍️', percent: 15, color: 'bg-neon-orange' },
  { name: 'Entertainment', amount: 110, icon: '🎬', percent: 11, color: 'bg-neon-green' },
  { name: 'Utilities', amount: 60, icon: '📺', percent: 5, color: 'bg-neon-purple' },
]);

const dailyBreakdown = computed(() => [
  { date: '2024-01-06', amount: 87.3 },
  { date: '2024-01-07', amount: 24.99 },
  { date: '2024-01-08', amount: 55.0 },
  { date: '2024-01-09', amount: 20.49 },
  { date: '2024-01-10', amount: 21.25 },
]);
</script>
