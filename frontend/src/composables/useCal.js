import { ref, computed, watch } from "vue";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  format,
  startOfDay,
  isToday,
} from "date-fns";

export function useCalendar() {
  const today = new Date();
  const currentMonth = ref(startOfMonth(today));

  const days = computed(() => {
    const start = startOfWeek(currentMonth.value, { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  });

  const weeks = computed(() => {
    const result = [];
    let week = [];
    for (const day of days.value) {
      week.push(day);
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    }
    if (week.length) result.push(week);
    return result;
  });

  const calendarHeader = computed(() => ({
    month: format(currentMonth.value, "MMMM yyyy"),
    year: currentMonth.value.getFullYear(),
    monthIndex: currentMonth.value.getMonth(),
  }));

  function goNext() {
    currentMonth.value = addMonths(currentMonth.value, 1);
  }
  function goPrev() {
    currentMonth.value = subMonths(currentMonth.value, 1);
  }
  function goToday() {
    currentMonth.value = startOfMonth(today);
  }

  function setMonth(date) {
    currentMonth.value = startOfMonth(date);
  }

  function isCurrentMonth(date) {
    return isSameMonth(date, currentMonth.value);
  }
  function isCurrentDay(date) {
    return isSameDay(date, today);
  }

  function cellClass(date, expenseDates) {
    const cls = [];
    cls.push("relative flex h-20 w-full flex-col items-center justify-start rounded-xl p-1.5 transition-all duration-200");
    if (!isCurrentMonth(date)) cls.push("text-text-dim opacity-30");
    if (isCurrentDay(date)) cls.push("ring-2 ring-neon-blue/60 bg-neon-blue/8");
    if (!expenseDates || !expenseDates[format(date, "yyyy-MM-dd")]) {
      cls.push("hover:bg-white/5");
    } else {
      cls.push("cursor-pointer");
    }
    return cls.join(" ");
  }

  function cellContent(date, expenseDates) {
    const dayNum = format(date, "d");
    const spent = expenseDates ? expenseDates[format(date, "yyyy-MM-dd")] : null;
    const total = spent ? spent.total : 0;
    return { dayNum, spent, total };
  }

  return {
    currentMonth,
    days,
    weeks,
    calendarHeader,
    goNext,
    goPrev,
    goToday,
    setMonth,
    isCurrentMonth,
    isCurrentDay,
    cellClass,
    cellContent,
  };
}
