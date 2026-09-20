export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(date) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
}

export function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatDateTime(date) {
  return `${formatDate(date)} at ${formatTime(date ? new Date(date).toTimeString().slice(0, 5) : "")}`;
}

export function toISODate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function daysInRange(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000) + 1);
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : plural || `${singular}s`;
}

export const CATEGORY_COLORS = {
  Food: "#FF9F43",
  Groceries: "#FDCB6E",
  Transport: "#5F27CD",
  Fuel: "#00E5FF",
  Rent: "#FF3366",
  Utilities: "#00FF9D",
  Internet: "#0984E3",
  "Mobile Bill": "#6C5CE7",
  Education: "#A29BFE",
  Books: "#FD79A8",
  Health: "#00B894",
  Medicine: "#E17055",
  Insurance: "#636E72",
  Entertainment: "#FAB1A0",
  Movies: "#DFE6E9",
  Streaming: "#74B9FF",
  Shopping: "#81ECEC",
  Clothing: "#F8A5C2",
  Electronics: "#A29BFE",
  Travel: "#0984E3",
  Hotel: "#55EFC4",
  Gifts: "#FFEAA7",
  Charity: "#FAB1A0",
  Family: "#FFD93D",
  Kids: "#FD79A8",
  Pets: "#00CEC9",
  Investment: "#636E72",
  Savings: "#55EFC4",
  Business: "#6C5CE7",
  Miscellaneous: "#DFE6E9",
};

export const CATEGORY_ICONS = {
  Food: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z",
  Groceries: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z",
  Transport: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  Fuel: "M12 2v20M2 12h20",
  Rent: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z",
  Utilities: "M12 2v20M2 12h20",
};
