# FocusFlow

FocusFlow is a modern premium productivity web app built with React, Vite, TypeScript, Tailwind CSS, Zustand, Framer Motion, dnd-kit, shadcn-style UI primitives, and Supabase.

It is designed to feel closer to a real SaaS productivity tool than a basic CRUD todo app, with a dark-first interface, glassmorphism surfaces, smooth transitions, keyboard shortcuts, a command palette, a productivity dashboard, and real multi-user account support.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn-style UI component architecture
- Zustand
- Framer Motion
- dnd-kit
- lucide-react
- Supabase Auth
- Supabase Postgres
- local UI preference persistence

## Features

- Add, edit, delete, and complete tasks
- Due dates, priorities, and tags
- Search and filter tasks
- Drag-and-drop task reordering
- Productivity dashboard with charts and summary cards
- Completion progress and task statistics
- Dark/light mode toggle
- Toast notifications
- Keyboard shortcuts
- Command palette with `Cmd/Ctrl + K`
- Responsive layout for desktop and mobile
- Multi-user sign up and sign in
- Cloud-synced per-user task storage

## Project Structure

```text
src/
├── components/
├── data/
├── hooks/
├── layouts/
├── pages/
├── store/
├── types/
└── utils/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and fill in:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

3. Open the Supabase SQL editor and run the SQL from `supabase/schema.sql`.
4. Restart the dev server.

## Deployment

- Frontend: deploy to Vercel
- Backend services: handled by Supabase
- Environment variables: add the same `VITE_SUPABASE_*` values in Vercel project settings

This keeps hosting simple while still supporting real user accounts and synced data.

## Notes

- Tasks are now stored in Supabase so each signed-in user has an isolated synced workspace.
- Zustand is used to keep global state simple and maintainable even after adding auth and async data loading.
- Tailwind CSS is used for scalable utility-first styling.
- The component layer follows a reusable shadcn-inspired pattern for consistency.
