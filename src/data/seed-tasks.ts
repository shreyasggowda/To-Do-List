import type { Task } from "@/types/task";

const today = new Date();

const addDays = (base: Date, days: number) => {
  const next = new Date(base);
  next.setDate(base.getDate() + days);
  return next.toISOString().slice(0, 10);
};

// Seed data gives a polished first-run experience and makes the dashboard
// feel alive immediately instead of rendering an empty application shell.
export const seedTasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: "Finalize Q3 roadmap narrative",
    description:
      "Shape the story for the next planning review with a tighter product arc and success metrics.",
    completed: false,
    priority: "urgent",
    dueDate: addDays(today, 0),
    tags: ["Strategy", "Leadership"],
    createdAt: addDays(today, -2),
    updatedAt: addDays(today, -1),
    completedAt: null,
    order: 0,
  },
  {
    id: crypto.randomUUID(),
    title: "Refine onboarding checklist",
    description:
      "Reduce drop-off by simplifying the first-run experience into three confidence-building steps.",
    completed: false,
    priority: "high",
    dueDate: addDays(today, 1),
    tags: ["Growth", "UX"],
    createdAt: addDays(today, -4),
    updatedAt: addDays(today, -1),
    completedAt: null,
    order: 1,
  },
  {
    id: crypto.randomUUID(),
    title: "Inbox zero for stakeholder requests",
    description:
      "Triage open follow-ups and convert anything actionable into clearly scoped tasks.",
    completed: false,
    priority: "medium",
    dueDate: addDays(today, 0),
    tags: ["Ops"],
    createdAt: addDays(today, -1),
    updatedAt: addDays(today, -1),
    completedAt: null,
    order: 2,
  },
  {
    id: crypto.randomUUID(),
    title: "Ship design QA notes",
    description:
      "Consolidate visual regressions from the staging review and share ownership with engineering.",
    completed: true,
    priority: "high",
    dueDate: addDays(today, -1),
    tags: ["Design", "QA"],
    createdAt: addDays(today, -3),
    updatedAt: addDays(today, -1),
    completedAt: addDays(today, -1),
    order: 3,
  },
  {
    id: crypto.randomUUID(),
    title: "Plan deep work block",
    description:
      "Reserve an uninterrupted afternoon session for roadmap and research synthesis.",
    completed: true,
    priority: "low",
    dueDate: addDays(today, -2),
    tags: ["Planning"],
    createdAt: addDays(today, -5),
    updatedAt: addDays(today, -2),
    completedAt: addDays(today, -2),
    order: 4,
  },
];
