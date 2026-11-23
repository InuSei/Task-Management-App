# Project Specification: Personal Task Manager (`spec.md`)

## 1. Overview & Goals
A single-user, local-first personal task manager built for speed, visual clarity, and deadline awareness. The user needs to capture tasks in seconds via a persistent quick-add bar, switch seamlessly between a structured List view and a Kanban Board view, monitor upcoming deadlines on a visual timeline, and customize the interface theme (defaulting to dark mode).

---

## 2. Constitution & Engineering Guardrails
- **Architecture:** Strict Separation of Concerns. UI components must never talk directly to `localStorage` or MongoDB. All data operations must go through a repository interface (`TaskRepository`).
- **Clean Code & Modularity:** Keep files focused and under ~100 lines where practical. Single Responsibility Principle (SRP) per component, hook, and utility.
- **Type Safety:** Strict TypeScript across all models, repositories, and component props. No `any` types.
- **Tech Stack:**
  - **Framework:** Next.js (App Router) + TypeScript
  - **Styling:** Tailwind CSS + CSS Custom Properties (for dynamic theme tokens)
  - **Icons:** Lucide React
  - **Persistence (Phase 1):** `LocalStorageTaskRepository` (instant zero-config usage for single device)
  - **Persistence (Phase 2 - Optional):** `MongoTaskRepository` via Next.js Route Handlers (`/api/tasks`)

---

## 3. Data Models

### 3.1 `Task` Entity
```ts
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;                 // UUID v4
  title: string;              // Required, trimmed, 1–140 chars
  description?: string;       // Optional markdown/plain notes
  status: TaskStatus;         // Default: 'todo'
  priority: TaskPriority;     // Default: 'medium'
  dueDate?: string | null;    // ISO 8601 date string (YYYY-MM-DD or full timestamp)
  order: number;              // Used for manual ordering within columns/lists
  createdAt: string;          // ISO 8601 timestamp
  updatedAt: string;          // ISO 8601 timestamp
}
```

### 3.2 `ThemeConfig` Entity
```ts
export type ColorMode = 'dark' | 'light';
export type AccentPreset = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';

export interface ThemeConfig {
  mode: ColorMode;            // Default: 'dark'
  accent: AccentPreset;       // Default: 'indigo'
}
```

---

## 4. Core Features & Functional Requirements

### 4.1 Quick-Add Bar (Persistent)
- **Location:** Pinned at the top of the main workspace, always accessible regardless of active view.
- **Behavior:**
  - Single text input (`"Add a task..."`) with inline quick-selectors for **Priority** and **Deadline** (date picker).
  - Pressing `Enter` immediately creates the task in `todo` status, clears the input, and keeps focus on the input for rapid entry.
  - Pressing `Escape` clears the current input draft.
- **Validation:** Prevent empty/whitespace-only submissions. Show subtle visual feedback if title exceeds 140 characters.

### 4.2 Dual Workspace Views (List & Kanban Board)
- **View Switcher:** Instant toggle in the header between **List View** and **Board View**. Persist last-selected view in `localStorage`.
- **List View:**
  - Groups tasks into collapsible sections: **Overdue**, **Today**, **Upcoming**, **No Deadline**, and **Completed**.
  - Clicking a checkbox toggles status between `todo` and `done`.
- **Kanban Board View:**
  - Three columns: **To Do** (`todo`), **In Progress** (`in_progress`), and **Done** (`done`).
  - Supports drag-and-drop (or accessible move controls) between columns and reordering within columns.
  - Column headers display live task counts.

### 4.3 Task Detail & Editing
- Clicking any task opens a slide-over drawer or modal to edit `title`, `description`, `status`, `priority`, `dueDate`, or delete the task.
- Changes save automatically on blur or explicit "Save" action.

### 4.4 Timeline & Deadline Monitoring
- **Timeline Strip / View:** A dedicated horizontal or chronological **Timeline Monitor** showing tasks plotted along upcoming dates (e.g., 7-day / 14-day window + an Overdue alert bucket).
- **Visual Urgency Indicators:**
  - **Overdue:** `dueDate < today` and `status !== 'done'` -> Red badge/highlight.
  - **Due Today:** `dueDate === today` and `status !== 'done'` -> Amber/Warning badge.
  - **Completed:** Muted styling with strikethrough title regardless of due date.

### 4.5 Customizable Theme System
- **Default State:** Dark mode enabled on first load (`mode: 'dark'`).
- **Theme Customizer Popover:** Accessible from the top bar, allowing the user to:
  1. Toggle **Dark Mode** / **Light Mode**.
  2. Pick an **Accent Color** (`indigo`, `emerald`, `amber`, `rose`, `cyan`) that dynamically updates primary buttons, active tabs, focus rings, and progress indicators via CSS variables (`--accent-primary`, `--accent-hover`).
- **Persistence:** Saved immediately to `localStorage` and hydrated before paint to prevent theme flash.

### 4.6 Filtering & Search
- Filter bar allowing filtering by **Priority** (`All`, `High`, `Medium`, `Low`) and real-time text search matching `title` or `description`.

---

## 5. Edge Cases & Acceptance Criteria

| Scenario | Expected Behavior |
| :--- | :--- |
| **Empty Workspace (First Launch)** | Show a clean empty state with a prompt pointing to the Quick-Add bar (and an optional "Load Sample Tasks" button). |
| **Filter Returns Zero Matches** | Display *"No tasks match your filters"* with a one-click **"Reset Filters"** button. Do not confuse with an empty database. |
| **Task Marked Done While Overdue** | Overdue red warning clears immediately; task moves to Completed group / `Done` column. |
| **Invalid/Corrupted LocalStorage** | Gracefully fall back to an empty task list without crashing the app; log warning to console. |
| **Long Task Titles** | Truncate cleanly with ellipsis on Kanban cards; wrap properly inside the Task Detail drawer. |
| **Storage Swap (Local -> Mongo)** | Swapping `LocalStorageTaskRepository` for `MongoTaskRepository` requires changing only the repository provider—zero changes to UI components. |

---

## 6. Suggested Project Structure
```text
src/
├── app/
│   ├── api/tasks/          # Optional MongoDB REST endpoints (Phase 2)
│   ├── layout.tsx          # Theme provider + root dark mode setup
│   └── page.tsx            # Main workspace shell
├── components/
│   ├── layout/             # Header, ViewSwitcher, ThemeCustomizer
│   ├── tasks/              # QuickAddBar, TaskCard, TaskDrawer, FilterBar
│   ├── views/              # ListView, KanbanBoard, TimelineMonitor
│   └── ui/                 # Reusable primitives (Badge, Button, Modal)
├── domain/
│   ├── task.ts             # Task interfaces & pure domain helpers (isOverdue, groupTasks)
│   └── theme.ts            # Theme types & preset definitions
├── repositories/
│   ├── taskRepository.ts   # Repository interface contract
│   ├── localTaskRepo.ts    # Phase 1: LocalStorage implementation
│   └── mongoTaskRepo.ts    # Phase 2: Optional MongoDB API client implementation
└── hooks/
    ├── useTasks.ts         # State management & optimistic UI updates
    └── useTheme.ts         # Theme state & CSS variable injection
```

---

## 7. Implementation Milestones (SDD Slices)
1. **Slice 1 (Foundation):** Set up Next.js + Tailwind, domain types, `ThemeConfig` (dark mode + accent CSS variables), and `LocalStorageTaskRepository`.
2. **Slice 2 (Core Loop):** Build `QuickAddBar` and `ListView` with grouping (Overdue, Today, Upcoming, No Deadline, Completed) + Task Detail Drawer.
3. **Slice 3 (Kanban & Filtering):** Add `KanbanBoard` with drag-and-drop status/order updates and the `FilterBar`.
4. **Slice 4 (Timeline Monitor):** Build the `TimelineMonitor` component for visual deadline tracking across upcoming days.
5. **Slice 5 (Optional MongoDB Adapter):** Implement `/api/tasks` + Mongoose/MongoDB driver and `MongoTaskRepository`.

## 8. Feature Update v2: Personnel Task Allocation & Public Progress Dashboard

### 8.1 Overview & Navigation Shift
- Build directly on the existing Next.js + Tailwind + repository-pattern codebase.
- **Route `/` (Task Allocation Workspace):** Becomes the main hub for creating/managing tasks and allocating them to personnel. Retains the persistent Quick-Add bar, theme customization, and clean repository abstraction.
- **Dashboard View (Replaces Board View):** Replaces the Kanban Board view with a read-friendly **Personnel Task Dashboard** open/visible to all viewers without login friction, showing every person's assigned tasks, progress, and active Day/Week context.

## 8. Feature Update v2: Personnel Task Allocation & Public Progress Dashboard

### 8.1 Overview & Navigation Shift
- Build directly on the existing Next.js + Tailwind + repository-pattern codebase.
- **Route `/` (Task Allocation Workspace):** Becomes the main hub for creating/managing tasks and allocating them to personnel. Retains the persistent Quick-Add bar, theme customization, and clean repository abstraction.
- **Dashboard View (Replaces Board View):** Replaces the Kanban Board view with a read-friendly **Personnel Task Dashboard** open/visible to all viewers without login friction, showing every person's assigned tasks, progress, and active Day/Week context.

### 8.2 New & Updated Data Models

#### `Personnel` Entity
```ts
export interface Personnel {
  id: string;                 // UUID v4
  name: string;               // Required, trimmed, 1–80 chars
  department: string;         // Free-text department name (e.g., "IT", "Operations"), trimmed
  createdAt: string;          // ISO 8601 timestamp
}
```

#### `WeekContext` Entity
```ts
export interface WeekContext {
  activeWeekLabel: string;    // e.g., "Week 1", "Week 2", or user-selected week
  availableWeeks: string[];   // Customizable list of week labels
}
```

#### `Task` Entity Extension
- Add `assigneeId?: string | null;` (links a task to a `Personnel.id`; `null` or `undefined` means unassigned).
- Add `weekLabel?: string;` (associates a task with a week label when allocated, defaulting to the current active week).

### 8.3 Functional Requirements

#### 8.3.1 Personnel Management (Add / Edit / Remove)
- Accessible from the `/` Allocation workspace via a clean modal or drawer.
- Add a person with **Name** and **Department** (free-text input with suggestions from existing departments).
- Persist via a dedicated `PersonnelRepository` (`LocalStoragePersonnelRepository` in Phase 1, extendable to MongoDB later) following the exact same separation-of-concerns rule as `TaskRepository`.

#### 8.3.2 Task Allocation on `/`
- Quick-Add bar and task rows/drawers on `/` allow assigning or reassigning a task to any `Personnel` member and setting its `weekLabel` alongside priority and deadline.
- Unassigned tasks remain clearly visible on `/` so nothing gets lost before allocation.

#### 8.3.3 Day & Customizable Week Header (Dashboard)
- Displays the current **Day** (e.g., `Friday, Nov 20`) alongside a **Week selector/customizer** (pick an existing week, add/rename a week label like `Week 1` → `Week 2`, and filter or inspect tasks by week).

#### 8.3.4 Personnel Card (Dashboard Grid)
- Renders one card per person in a responsive grid (free/open view for anyone looking at the dashboard).
- **Card Header:** Person's **Name** and **Department** badge/label.
- **Card Body (Compact Preview):** Lists up to **3 assigned tasks** (showing task title, status/priority indicator, and due date). If a person has more than 3 tasks, show a compact `"+X more tasks"` indicator.
- **Card Footer:** Shows **Progress (%)** calculated as `Math.round((completedCount / totalCount) * 100)` (displays `0%` when `totalCount === 0`), paired with a visual progress bar.
- **Card Click / Expand:** Clicking a card opens a detail modal or slide-over showing **all** tasks assigned to that person, full task notes/deadlines, and quick status toggles.

### 8.4 Edge Cases for v2
- **0 Personnel Added:** Show a prompt on the Dashboard and `/` to add team members before allocating tasks.
- **Person Has 0 Tasks:** Card still renders with Name, Department, empty task note, and `0%` progress.
- **Deleting a Person:** Tasks previously assigned to them become unassigned (`assigneeId: null`) rather than being deleted.
- **Division by Zero on Progress:** Safely return `0%` when a person has zero tasks.

