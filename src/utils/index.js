// Utility generiche usabili ovunque

// join classi (se non vuoi duplicare la piccola cn locale)
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// numeri
export function clamp(value, min = 0, max = 100) {
  const n = Number(value) || 0;
  return Math.max(min, Math.min(max, n));
}

export function pct(value, min = 0, max = 100) {
  const c = clamp(value, min, max);
  return ((c - min) / (max - min)) * 100;
}

// formattazioni
export function formatNumber(n, locale = "it-IT", opts = {}) {
  try {
    return new Intl.NumberFormat(locale, opts).format(n);
  } catch {
    return String(n);
  }
}

export function formatDate(d, locale = "it-IT", opts = {}) {
  try {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      ...opts,
    });
  } catch {
    return String(d);
  }
}

// oggetti/array
export function deepMerge(target, source) {
  const out = { ...target };
  for (const k of Object.keys(source || {})) {
    if (
      source[k] &&
      typeof source[k] === "object" &&
      !Array.isArray(source[k])
    ) {
      out[k] = deepMerge(out[k] || {}, source[k]);
    } else {
      out[k] = source[k];
    }
  }
  return out;
}

export default {
  cn,
  clamp,
  pct,
  formatNumber,
  formatDate,
  deepMerge,
};
