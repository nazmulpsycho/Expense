<template>
  <div class="layout-container">
    <div class="flex flex-1 flex-col gap-6 p-6 lg:p-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text lg:text-3xl">Expenses</h1>
          <p class="mt-1 text-sm text-text-dim">Every transaction you've tracked.</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="secondary-button flex items-center gap-2 rounded-xl border border-border bg-dark-card/70 px-4 py-2 text-sm font-medium text-text transition-all hover:bg-dark-card hover:border-border/80"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
            Filter
          </button>
          <router-link to="/expenses/new" class="btn-primary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Add Expense
          </router-link>
        </div>
      </div>

      <div class="rounded-2xl border border-border/60 bg-dark-card/70 p-5 shadow-lg backdrop-blur-xl">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-border/40 text-text-dim">
            <tr>
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Category</th>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium text-right">Amount</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/30">
            <tr v-for="expense in expenses" :key="expense._id" class="group hover:bg-dark-card/40 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dark border border-border/60 text-sm font-semibold text-text">
                    {{ expense.category?.[0]?.toUpperCase() || '•' }}
                  </span>
                  <span class="truncate max-w-[200px] text-text">{{ expense.expenseName }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-text-dim">{{ expense.category || '—' }}</td>
              <td class="px-4 py-3 text-text-dim">{{ formatDate(expense.date) }}</td>
              <td class="px-4 py-3 text-right font-semibold text-text">{{ formatCurrency(expense.amount) }}</td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button" class="rounded-lg border border-border/60 bg-dark-card px-3 py-1 text-xs font-medium text-text hover:bg-dark-card/80">
                    Edit
                  </button>
                  <button type="button" class="rounded-lg border border-border/60 bg-dark-card px-3 py-1 text-xs font-medium text-text hover:bg-dark-card/80">
                    Duplicate
                  </button>
                  <button type="button" class="rounded-lg border border-error/40 bg-error/10 px-3 py-1 text-xs font-medium text-error hover:bg-error/20">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!expenses.length">
              <td colspan="5" class="px-4 py-10 text-center text-text-dim">
                No expenses found. Add your first expense now.
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="expenses.length" class="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
          <p class="text-sm text-text-dim">
            {{ expenses.length }} expense{{ expenses.length === 1 ? '' : 's' }}
          </p>
          <div class="flex items-center gap-4">
            <button
              v-if="page > 1"
              type="button"
              class="rounded-lg border border-border/60 bg-dark-card px-3 py-1.5 text-xs font-medium text-text hover:bg-dark-card/80"
              @click="page = Math.max(1, page - 1)"
            >
              Previous
            </button>
            <span class="text-xs text-text-dim">Page {{ page }}</span>
            <button
              type="button"
              class="rounded-lg border border-border/60 bg-dark-card px-3 py-1.5 text-xs font-medium text-text hover:bg-dark-card/80"
              @click="page++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useExpensesStore } from '../stores/expenses';
import { formatCurrency, formatDate } from '../utils/format';

const expensesStore = useExpensesStore();
const page = ref(1);

const expenses = computed(() => expensesStore.expenses.slice(0, 10));

if (!expensesStore.expenses.length) {
  expensesStore.setExpenses([
    { _id: '1', expenseName: 'KFC Lunch', amount: 12.5, category: 'Food', date: '2024-01-10', time: '12:30' },
    { _id: '2', expenseName: 'Uber Ride', amount: 8.75, category: 'Transport', date: '2024-01-10', time: '09:15' },
    { _id: '3', expenseName: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2024-01-09', time: '08:00' },
    { _id: '4', expenseName: 'Coffee Shop', amount: 4.5, category: 'Food', date: '2024-01-09', time: '07:45' },
    { _id: '5', expenseName: 'Gas Station', amount: 55.0, category: 'Transport', date: '2024-01-08', time: '18:20' },
    { _id: '6', expenseName: 'Amazon Order', amount: 24.99, category: 'Shopping', date: '2024-01-07', time: '15:10' },
    { _id: '7', expenseName: 'Grocery Store', amount: 87.3, category: 'Groceries', date: '2024-01-06', time: '19:50' },
  ]);
}
</script>
