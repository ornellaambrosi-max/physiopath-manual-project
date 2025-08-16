// Placeholder di entità condivise per dashboard/screening.
// Aggiungi qui dataset, liste, costanti, ecc.

export const EXERCISE_CATEGORIES = [
  { id: "mobility", label: "Mobilità" },
  { id: "strength", label: "Forza" },
  { id: "endurance", label: "Resistenza" },
];

export const SCALE_LABELS = {
  pain: "Dolore (0–10)",
  stiffness: "Rigidità (0–10)",
  fatigue: "Affaticamento (0–10)",
};

export const DEMO_STATS = {
  weekly_sessions: 3,
  adherence_pct: 72,
  last_update: new Date().toISOString(),
};

const ENTITIES = {
  EXERCISE_CATEGORIES,
  SCALE_LABELS,
  DEMO_STATS,
};

export default ENTITIES;
