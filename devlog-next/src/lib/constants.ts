/**
 * Application constants.
 * ────────────────────────────────────────────
 * Edit CATEGORIES to match your company's KPI structure.
 * Edit AI_CONFIG to change model or API settings.
 */

import { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "initiative",
    label: "Initiative / Innovation / Creativity",
    short: "Initiative",
    color: "#f59e0b",
    icon: "💡",
    weight: 30,
    desc: "Impactful initiatives outside regular assignments that improve team knowledge / system performance / team interaction",
  },
  {
    id: "quality",
    label: "Quality of Work",
    short: "Quality",
    color: "#10b981",
    icon: "✨",
    weight: 30,
    desc: "Quality of deliverables, minimal rework, impact analysis, future-proof solutions",
  },
  {
    id: "throughput",
    label: "Throughput / Efficiency",
    short: "Throughput",
    color: "#3b82f6",
    icon: "⚡",
    weight: 20,
    desc: "Speed of task completion without sacrificing quality",
  },
  {
    id: "collaboration",
    label: "Collaboration / Teamwork",
    short: "Collab",
    color: "#8b5cf6",
    icon: "🤝",
    weight: 20,
    desc: "Participation in discussions, helping others, communication",
  },
  {
    id: "leadership",
    label: "Leadership / Developing Others",
    short: "Leadership",
    color: "#ec4899",
    icon: "🌱",
    weight: 0,
    desc: "Mentoring, coaching, and developing team members",
  },
  {
    id: "other",
    label: "Other / General",
    short: "Other",
    color: "#6b7280",
    icon: "📋",
    weight: 0,
    desc: "Other tasks and activities",
  },
];

export const VALUES = [
  "Honesty",
  "Boldness",
  "Passion",
  "Positivity",
  "Excellence",
] as const;

export const STORAGE_KEYS = {
  ENTRIES: "devlog_entries",
  SETTINGS: "devlog_settings",
} as const;

export const AI_CONFIG = {
  MODEL: "claude-sonnet-4-20250514",
  MAX_TOKENS: 4000,
  API_VERSION: "2023-06-01",
} as const;
