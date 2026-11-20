# Personal Task Manager

A fast, local-first task manager for one person. Capture tasks in seconds, switch between a List, a Kanban Board and a deadline Timeline, and theme it to taste. Dark mode is the default. Everything is stored in your browser, so there's no account, server or setup.

## Features

- **Quick-add bar**: type a task and press `Enter`. You can set a priority and deadline inline. The priority you pick carries over to the next task.
- **List view**: tasks grouped into collapsible Overdue, Today, Upcoming, No Deadline and Completed sections, each with a done checkbox.
- **Kanban board**: To Do, In Progress and Done columns with live counts. Drag and drop cards, or use the arrow buttons on each card to move them with the keyboard.
- **Timeline monitor**: an Overdue bucket plus the next 7 or 14 days, so deadlines are easy to see.
- **Urgency indicators**: red for overdue, amber for due today. Completed tasks are greyed out with a strikethrough.
- **Task drawer**: click any task to edit its title, description, status, priority or deadline, or to delete it. Changes save automatically.
- **Filter and search**: filter by priority and search titles and descriptions as you type.
- **Theme customizer**: dark or light mode and five accent colours. Your choice is saved and applied before the first paint, so the theme never flashes.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript (strict mode)
- [Tailwind CSS](https://tailwindcss.com) v4 + CSS custom properties for theming
- [Lucide](https://lucide.dev) icons
- Browser `localStorage` for persistence

## Getting started

**Requirements:** Node.js 22.18+ (Node 24 recommended) and npm.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

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
| Kanban card    | `Tab` to arrow buttons | Move the card left/right/up/down |

## Project structure

```text
src/
├── app/              # Next.js entry: layout (theme bootstrap), page (workspace shell), global CSS
├── components/
│   ├── layout/       # Header, ViewSwitcher, ThemeCustomizer
│   ├── tasks/        # QuickAddBar, TaskCard, TaskListItem, TaskDrawer, FilterBar, badges
│   ├── views/        # ListView, KanbanBoard, TimelineMonitor, WorkspaceView
│   └── ui/           # Reusable primitives (Badge, Select, Field, SegmentedControl)
├── domain/           # Pure types and logic: tasks, grouping, filters, board ordering, timeline, theme
├── hooks/            # useTasks, useTheme, useViewMode
└── repositories/     # TaskRepository interface, localStorage implementation, preferences store
```

## Architecture

- **Domain logic is pure.** Grouping, urgency, filtering, ordering and timeline building live in `src/domain` with no React or browser dependencies, and `npm run check` tests them.
- **UI never touches storage.** Components go through hooks, and hooks talk to the `TaskRepository` interface (`src/repositories/taskRepository.ts`).
- **Swapping storage is one line.** To use a different backend, implement `TaskRepository` and change the instance in `src/repositories/provider.ts`. No UI changes are needed.
- **Theme colours live in CSS.** `<html data-mode data-accent>` selects the CSS variables (`--accent-primary`, `--accent-hover`, …). A small inline script sets these attributes before the page paints.

## Data and privacy

All data stays in your browser's `localStorage` under these keys:

| Key          | Contents                    |
| ------------ | --------------------------- |
| `ptm:tasks`  | Your tasks                  |
| `ptm:theme`  | Colour mode and accent      |
| `ptm:view`   | Last-selected view          |

If the task data ever becomes unreadable, the app starts with an empty list instead of crashing. It saves the unreadable data under `ptm:tasks:corrupt-backup` so it can be recovered by hand.

Clearing your browser's site data deletes your tasks. Data doesn't sync between browsers or devices.

## Browser support

Recent versions of Chrome, Edge, Firefox and Safari. The app relies on native `<dialog>` and the Popover API. Drag and drop needs a mouse; on touch devices, use the arrow buttons on each card.

## Roadmap

- [x] Foundation: theme system, domain model, localStorage repository
- [x] Core loop: quick-add, grouped list, task drawer
- [x] Kanban board, filtering, theme customizer
- [x] Timeline monitor
- [ ] Optional MongoDB backend (`/api/tasks` + `MongoTaskRepository`)

## License

[MIT](LICENSE) © 2026 Anton
