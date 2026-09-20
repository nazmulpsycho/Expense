import { ref, computed } from "vue";
import { toISODate, daysInRange } from "../utils/format";
import { startOfWeek, startOfMonth, startOfYear, endOfDay, subDays } from "date-fns";

export function useDateRange() {
  const today = toISODate(new Date());
  const start = ref({
    today,
    weekStart: toISODate(startOfWeek(new Date(), { weekStartsOn: 0 })),
    monthStart: toISODate(startOfMonth(new Date())),
    yearStart: toISODate(startOfYear(new Date())),
  });

  const params = computed(() => ({ startDate: start.value.weekStart, endDate: start.value.today }));

  const totalDays = computed(() => daysInRange(start.value.weekStart, start.value.today));
  const totalMonthDays = computed(() => daysInRange(start.value.monthStart, start.value.today));
  const totalYearDays = computed(() => daysInRange(start.value.yearStart, start.value.today));

  return { start, params, totalDays, totalMonthDays, totalYearDays };
}
