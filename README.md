# EYESON AI — Admin & Invigilator Dashboard

React + Vite frontend for an exam proctoring system. **All data is mocked in-memory** — no real backend is wired up. The mock layer is shaped to match the planned REST API so swapping to a real server later is a one-file change.

---

## Quick Start

```bash
bun install
bun run dev
```

### Demo Login Credentials

| Role         | Email               | Password      |
| ------------ | ------------------- | ------------- |
| Admin        | `admin@eyeson.ai`   | `admin123`    |
| Invigilator  | `inv@eyeson.ai`     | `password123` |

Token + user are stored in **`sessionStorage`** under keys `token`, `user`, `role`.

---

## Tech Stack

- **React 18** + **Vite 5** + **JavaScript/JSX**
- **Tailwind CSS v3** — semantic tokens defined in `src/index.css` and `tailwind.config.ts`
- **shadcn/ui** components (in `src/components/ui/`)
- **React Router v6** for routing
- **TanStack Query** provider mounted (not heavily used yet)
- **lucide-react** for icons
- **sonner** + custom toast hook for notifications

---

## Project Structure

```
src/
├── App.jsx                          # Router + all routes
├── main.jsx                         # App bootstrap
├── index.css                        # Design tokens (HSL)
├── services/
│   └── api.js                       # ⭐ ALL mock APIs live here
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.jsx      # Sidebar + header shell
│   │   └── DashboardSidebar.jsx     # Role-based nav items
│   └── ui/                          # shadcn + custom UI primitives
│       ├── data-table.jsx           # Generic table used by every CRUD page
│       ├── resource-form-dialog.jsx # Generic add/edit modal
│       ├── confirm-dialog.jsx       # Delete confirmation
│       ├── csv-upload-button.jsx    # Mock CSV upload
│       ├── status-badge.jsx         # Colored status pills
│       ├── stat-card.jsx            # Dashboard stat tiles
│       └── loading-spinner.jsx
├── pages/
│   ├── Login.jsx                    # Shared login (email + password)
│   ├── NotFound.jsx
│   ├── admin/                       # Admin-only pages
│   └── invigilator/                 # Invigilator pages
└── hooks/
    └── use-toast.js
```

---

## Routes

### Public
| Path | Component | Notes |
| ---- | --------- | ----- |
| `/`  | `Login`   | Redirects to dashboard on success based on role |

### Admin (`/admin/*`)
| Path                  | Page                  | Purpose |
| --------------------- | --------------------- | ------- |
| `/admin/dashboard`    | `AdminOverview`       | Stat cards + recent violations/alerts |
| `/admin/invigilators` | `AdminInvigilators`   | CRUD + CSV upload |
| `/admin/halls`        | `AdminExamHallsNew`   | CRUD, status toggle, delete-blocked-if-active-exam |
| `/admin/exams`        | `AdminExams`          | CRUD + CSV upload, status badges |
| `/admin/cameras`      | `AdminCameras`        | CRUD, active toggle |
| `/admin/speakers`     | `AdminSpeakers`       | CRUD, status dropdown (active/inactive/offline) |
| `/admin/microphones`  | `AdminMicrophones`    | CRUD, active toggle |
| `/admin/violations`   | `AdminViolations`     | View, status update, delete |
| `/admin/alerts`       | `AdminAlerts`         | Mark reviewed / delete |
| `/admin/seating`      | `AdminSeating`        | Legacy seating editor |
| `/admin/reports`      | `AdminReports`        | Legacy reports view |

### Invigilator (`/invigilator/*`)
| Path                          | Page                       | Purpose |
| ----------------------------- | -------------------------- | ------- |
| `/invigilator/dashboard`      | `InvigilatorOverview`      | Stat cards + recent alerts (own halls only) |
| `/invigilator/alerts`         | `InvigilatorAlertsPage`    | New alerts table, mark reviewed |
| `/invigilator/violations`     | `InvigilatorViolations`    | Read-only violations in own halls |
| `/invigilator/exam-halls`     | `InvigilatorExamHalls`     | Legacy hall view: seating grid + cameras |
| `/invigilator/students`       | `InvigilatorStudents`      | Legacy student directory |
| `/invigilator/live-alerts`    | `InvigilatorAlerts`        | Legacy live alerts feed |

---

## API Reference — `src/services/api.js`

**Base URL when integrating real backend:** `http://localhost:5000/api`
**Auth header:** `Authorization: Bearer <token>` (read via `getToken()`)

All functions are `async`, simulate latency with `delay()`, and return cloned mock data. Replace each function body with a `fetch()` call when connecting the real API.

### Auth
| Function                | Real endpoint              | Returns |
| ----------------------- | -------------------------- | ------- |
| `login(email, pw)`      | `POST /api/auth/login`     | `{ user }` or `{ error }` |
| `logout()`              | client-side                | clears sessionStorage |
| `getCurrentUser()`      | client-side                | user object or null |
| `getToken()`            | client-side                | JWT string |

### Invigilators (admin only)
| Function                       | Real endpoint                          |
| ------------------------------ | -------------------------------------- |
| `getInvigilators()`            | `GET /api/invigilators`                |
| `getInvigilatorById(id)`       | `GET /api/invigilators/:id`            |
| `createInvigilator(data)`      | `POST /api/invigilators`               |
| `updateInvigilator(id, data)`  | `PUT /api/invigilators/:id`            |
| `deleteInvigilator(id)`        | `DELETE /api/invigilators/:id`         |
| `uploadInvigilatorsCsv(file)`  | `POST /api/invigilators/upload/csv`    |

### Exam Halls (admin only)
| Function                                 | Real endpoint                          |
| ---------------------------------------- | -------------------------------------- |
| `getExamHalls()` / `getAdminExamHalls()` | `GET /api/examhalls`                   |
| `getExamHallById(id)`                    | `GET /api/examhalls/:id`               |
| `createAdminExamHall(data)`              | `POST /api/examhalls`                  |
| `updateAdminExamHall(id, data)`          | `PUT /api/examhalls/:id`               |
| `updateAdminExamHallStatus(id, status)`  | `PATCH /api/examhalls/:id/status`      |
| `deleteAdminExamHall(id)`                | `DELETE /api/examhalls/:id` (blocked if active exam) |
| `uploadExamHallsCsv(file)`               | `POST /api/examhalls/upload/csv`       |

### Exams
| Function                  | Real endpoint                  |
| ------------------------- | ------------------------------ |
| `getExams()`              | `GET /api/exams`               |
| `getExamById(id)`         | `GET /api/exams/:id`           |
| `createExam(data)`        | `POST /api/exams`              |
| `updateExam(id, data)`    | `PUT /api/exams/:id`           |
| `deleteExam(id)`          | `DELETE /api/exams/:id`        |
| `uploadExamsCsv(file)`    | `POST /api/exams/upload/csv`   |
| `refreshExamStatuses()`   | `POST /api/exams/refresh`      |

### Devices — Cameras / Speakers / Microphones
Each is exposed as an object with the same shape: `cameras`, `speakers`, `microphones`.
```js
api.cameras.list()           // GET    /api/cameras
api.cameras.get(id)          // GET    /api/cameras/:id
api.cameras.create(data)     // POST   /api/cameras
api.cameras.update(id, d)    // PUT    /api/cameras/:id
api.cameras.remove(id)       // DELETE /api/cameras/:id
api.cameras.uploadCsv(f)     // POST   /api/cameras/upload/csv
api.cameras.setStatus(id, s) // PATCH  /api/cameras/:id/status
```
Identical for `api.speakers.*` and `api.microphones.*`.

### Violations (admin + invigilator)
| Function                          | Real endpoint                       |
| --------------------------------- | ----------------------------------- |
| `getViolations()`                 | `GET /api/violations`               |
| `getViolationById(id)`            | `GET /api/violations/:id`           |
| `createViolation(data)`           | `POST /api/violations`              |
| `updateViolationStatus(id, s)`    | `PATCH /api/violations/:id/status`  |
| `deleteViolation(id)`             | `DELETE /api/violations/:id` (admin only) |

### Alerts (admin + invigilator)
| Function                       | Real endpoint                     |
| ------------------------------ | --------------------------------- |
| `getAlerts()`                  | `GET /api/alerts` (invigilator filtered to own halls in mock) |
| `getAlertById(id)`             | `GET /api/alerts/:id`             |
| `createAlert(data)`            | `POST /api/alerts`                |
| `updateAlertStatus(id, s)`     | `PATCH /api/alerts/:id/status`    |
| `deleteAlert(id)`              | `DELETE /api/alerts/:id` (admin)  |

### Dashboard / Misc
| Function                              | Purpose |
| ------------------------------------- | ------- |
| `getAdminDashboardStats()`            | Counts for admin overview cards |
| `getInvigilatorDashboardStats()`      | Counts for invigilator overview cards |
| `getRecentActivity()`                 | Recent violations + alerts |
| `getSystemOverview()`                 | Uptime + active cameras (legacy) |
| `getCameraOptions()`                  | Dropdown options for forms |
| `getExamHallOptions()`                | Dropdown options for forms |
| `getStudentList()`                    | Legacy student directory |
| `getInvigilatorHallDetails()`         | Rich legacy hall data (seating grid + cameras) |

### Legacy (still wired to keep-alongside pages)
| Function                | Used by |
| ----------------------- | ------- |
| `getSeatingHalls()`     | `AdminSeating` |
| `getSeatingStudents()`  | `AdminSeating` |
| `saveSeatingPlan()`     | `AdminSeating` |
| `uploadSeatingPlan()`   | `AdminSeating` |
| `uploadStudentsList()`  | `AdminSeating` |
| `getReports()`          | `AdminReports` |
| `exportReport()`        | `AdminReports` |

---

## Mock Data Stores

In-memory arrays at the top of `src/services/api.js`:

- `DEMO_USERS` — login accounts
- `invigilatorsStore`
- `examHallsStore`
- `examsStore`
- `camerasStore`, `speakersStore`, `microphonesStore`
- `violationsStore`, `alertsStore`
- `mockStudentList`, `mockReports`
- `seatingHalls`, `invigilatorHallsRich` — for legacy seating/hall views

Mutations from the UI persist in-memory until page reload.

---

## Switching from Mocks to a Real Backend

1. Open `src/services/api.js`.
2. For each function, replace the mock body with a `fetch()` call:
   ```js
   export async function getInvigilators() {
     const res = await fetch("http://localhost:5000/api/invigilators", {
       headers: { Authorization: `Bearer ${getToken()}` },
     });
     if (!res.ok) throw new Error("Failed");
     return res.json();
   }
   ```
3. Update `login()` to hit `POST /api/auth/login` and store the returned JWT.
4. Keep the same function signatures so no UI code needs to change.

Tip: add a small `request()` helper that injects the base URL + auth header.

---

## Design System

- **Light theme only**, clean academic aesthetic, navy/teal palette, soft gray cards.
- All colors are HSL semantic tokens in `src/index.css` and `tailwind.config.ts`.
- **Never hardcode colors** in components — use tokens like `bg-primary`, `text-foreground`, `bg-card`, `border-border`, `text-success`, `bg-destructive/60`, etc.

---

## Conventions

- Status badge colors: `pending=yellow`, `reviewed/active=green`, `dismissed/inactive=gray`, `offline=red`, `scheduled=blue`, `ended=gray`.
- Toast notifications via `useToast()` for success/error feedback.
- Empty-state messages on every table.
- Loading spinners while async data resolves.
- Logout clears sessionStorage and redirects to `/`.

---

## Roadmap / Not Yet Implemented

- Students + attendance API
- Seat allocations API
- Reports API
- Real dashboard aggregation endpoints
- `socket.io` real-time alerts
