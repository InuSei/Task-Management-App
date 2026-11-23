# Personal Task Manager

A fast, local-first task manager. Capture tasks in seconds, assign them to people, track each person's weekly progress on a dashboard, watch deadlines on a Timeline, and theme it to taste. Data is shared through a MongoDB database, so everyone who opens the app sees the same team, tasks and progress. Theme and view choices stay per browser.

## Features

- **Quick-add bar**: type a task and press `Enter`. You can set a priority, deadline, assignee and week inline. Priority, assignee and week carry over to the next task.
- **Team management**: the people icon in the header opens a panel to add, rename or remove people (Name + free-text Department with suggestions). Removing someone unassigns their tasks instead of deleting them.
- **List view**: tasks grouped into collapsible Overdue, Today, Upcoming, No Deadline and Completed sections, each with a done checkbox and an assignee picker. Unassigned tasks are highlighted in amber.
- **Personnel dashboard**: today's date, a week selector (add or rename weeks), and one card per person with their department, top 3 tasks for the week, a "+X more tasks" note and a progress bar. Click a person's name or "+X more tasks" to see all their tasks, notes and deadlines and change their status; click any task to open its full detail.
- **Timeline monitor**: an Overdue bucket plus the next 7 or 14 days, so deadlines are easy to see.
- **Urgency indicators**: red for overdue, amber for due today. Completed tasks are greyed out with a strikethrough.
- **Task drawer**: click any task to edit its title, description, status, priority, deadline, assignee or week, or to delete it. Changes save automatically.
- **Filter and search**: filter by priority and search titles and descriptions as you type.
- **Theme customizer**: five soft, low-saturation page themes (Graphite, Dusk, Moss, Paper, Mist) and five muted accents (clay, slate, sage, ochre, plum). Every theme and accent combination meets WCAG AA text contrast. Your choice is saved and applied before the first paint, so the theme never flashes.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript (strict mode)
- [Tailwind CSS](https://tailwindcss.com) v4 + CSS custom properties for theming
- [Lucide](https://lucide.dev) icons
- [MongoDB](https://www.mongodb.com) (official `mongodb` driver) via Next.js route handlers for shared data; browser `localStorage` for personal preferences

## Getting started

**Requirements:** Node.js 22.18+ (Node 24 recommended) and npm.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Connecting the database

1. Create a MongoDB database. The free tier of [MongoDB Atlas](https://www.mongodb.com/atlas) is enough. In Atlas, allow your server's IP under **Network Access**.
2. Copy `.env.example` to `.env.local` and set `MONGODB_URI` to your connection string (Atlas: **Database > Connect > Drivers**). `.env.local` is git-ignored; never commit it or paste it anywhere public.
3. Restart `npm run dev`.

If the database can't be reached, the app shows a notice instead of the workspace. To try the app without a database, set `NEXT_PUBLIC_STORAGE=local` in `.env.local`; data then stays in that browser only.

> **No sign-in yet.** Anyone who can open the app's URL can view and edit all data. Only deploy it where the URL is limited to your team (e.g. an internal network), or add authentication first.

### Scripts

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload           |
| `npm run build`     | Create a production build                      |
| `npm start`         | Serve the production build                     |
| `npm run typecheck` | Type-check the whole project                   |
| `npm run check`     | Run the domain-logic self-checks (plain Node)  |

## Keyboard shortcuts

| Where          | Key                    | Action                          |
| -------------- | ---------------------- | ------------------------------- |
| Quick-add bar  | `Enter`                | Add the task                    |
| Quick-add bar  | `Escape`               | Clear the draft                 |
| Task drawer    | `Enter` (in title)     | Save the title                  |
| Task drawer    | `Escape`               | Save and close                  |

## Project structure

```text
src/
├── app/              # Next.js entry: layout (theme bootstrap), page (workspace shell), global CSS
├── components/
│   ├── dashboard/    # DashboardHeader, PersonnelCard, PersonnelDetail
│   ├── layout/       # Header, ViewSwitcher, ThemeCustomizer
│   ├── personnel/    # TeamDialog, PersonnelForm/Row, AssigneeSelect, WeekSelect
│   ├── tasks/        # QuickAddBar, TaskListItem, TaskDrawer, FilterBar, badges
│   ├── views/        # ListView, PersonnelDashboard, TimelineMonitor, WorkspaceView
│   └── ui/           # Reusable primitives (Badge, Select, Field, SlideOver, ProgressBar, …)
├── domain/           # Pure types and logic: tasks, personnel, weeks, dashboard, grouping, filters, timeline, theme
├── hooks/            # useWorkspace, useTasks, usePersonnel, useWeeks, useTheme, useViewMode
├── repositories/     # Repository interfaces, API (shared) and localStorage implementations, preferences store
└── server/           # MongoDB connection and validated route handlers used by src/app/api
```

## Architecture

- **Domain logic is pure.** Grouping, urgency, filtering, ordering and timeline building live in `src/domain` with no React or browser dependencies, and `npm run check` tests them.
- **UI never touches storage.** Components go through hooks, and hooks talk to the `TaskRepository` and `PersonnelRepository` interfaces (`src/repositories/`).
- **Swapping storage is one place.** `src/repositories/provider.ts` picks the API repositories (shared MongoDB, the default) or the localStorage ones (`NEXT_PUBLIC_STORAGE=local`). No UI changes are needed.
- **The server validates every write.** `/api/tasks`, `/api/personnel` and `/api/weeks` check each request body with the same domain guards the client uses, and return `400` for invalid data. Database errors return a generic `500`; details go to the server log only.
- **Theme colours live in CSS.** `<html data-mode data-accent>` selects the CSS variables (`--accent-primary`, `--accent-hover`, …). A small inline script sets these attributes before the page paints.

## Data and privacy

Shared data lives in your MongoDB database (`MONGODB_DB`, default `task-manager`):

| Collection  | Contents                                  |
| ----------- | ----------------------------------------- |
| `tasks`     | All tasks                                 |
| `personnel` | Team members                              |
| `settings`  | The week list and active week (`weeks`)   |

Personal preferences stay in each browser's `localStorage`: `ptm:theme` (theme and accent) and `ptm:view` (last-selected view). With `NEXT_PUBLIC_STORAGE=local`, tasks, people and weeks are also kept there (`ptm:tasks`, `ptm:personnel`, `ptm:weeks`).

Changes made by others appear when you reload the page. If two people edit the same task at the same moment, the last save wins.

## Browser support

Recent versions of Chrome, Edge, Firefox and Safari. The app relies on native `<dialog>` and the Popover API.

## Roadmap

- [x] Foundation: theme system, domain model, localStorage repository
- [x] Core loop: quick-add, grouped list, task drawer
- [x] Kanban board, filtering, theme customizer
- [x] Timeline monitor
- [x] Personnel allocation and progress dashboard (replaces the Kanban board)
- [x] Shared MongoDB backend (`/api/tasks`, `/api/personnel`, `/api/weeks`)

## License

[MIT](LICENSE) © 2026 Anton
