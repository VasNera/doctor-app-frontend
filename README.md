# Doctor App — Frontend

React single-page application for a small clinic: patients book appointments on doctors' time slots, doctors manage their schedule, and an admin manages the doctors.

This is the frontend counterpart of the [doctor-app Spring Boot backend](https://github.com/VasNera/doctor-app). It talks to the backend's REST API and mirrors its validation and security model.

> **Demo login (admin):** username `admin` · password `Ad12345!`
> Patients can also self-register from the login screen.

## Features

**Public**
- Login with JWT authentication
- Patient self-registration
- Doctor account activation via emailed one-time token (`/activate?token=...`)

**Admin**
- Paginated doctors list
- Create a doctor — the backend then emails the doctor an activation link (no password ever set by the admin)

**Doctor**
- Generate available time slots for a date range (Mon–Fri, 09:00–17:00, 30-minute slots) with live preview of how many slots will be created
- View own appointments, filterable by status

**Patient**
- Book an appointment: searchable doctor picker, available slots grouped by day, optional date filter, confirmation dialog
- View own appointments and cancel upcoming ones

**Cross-cutting**
- Full internationalization (Greek / English) — including validation messages, switchable at runtime
- Light / dark theme
- Role-based route guards; deep links survive the login redirect

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Build / language | Vite, TypeScript, React 19 | fast dev loop, type safety end to end |
| Routing | TanStack Router (file-based) | typed routes, loaders, search-param validation |
| Server state | TanStack Query v5 | caching, request de-duplication, invalidation |
| Forms | react-hook-form + zod v4 | schema-driven validation shared with types |
| HTTP | axios (single instance) | central JWT + error handling via interceptors |
| UI | Tailwind CSS v4 + shadcn/ui (Base UI) | ready-made accessible components |
| i18n | i18next / react-i18next | EL/EN with runtime switching |

## Getting started

Prerequisites:

- Node.js ≥ 20.19 (or ≥ 22)
- The [backend](https://github.com/VasNera/doctor-app) running on `http://localhost:8080` (MySQL + Flyway migrations + seeded roles)

```bash
npm install
npm run dev        # http://localhost:5173
```

The API base URL is set in `src/api/axios.ts` (`http://localhost:8080/api/v1`).

On first backend start a local admin account is seeded (`admin` / `Ad12345!` — development only). Patients register themselves; doctors are created by the admin and activate their account through the emailed link (Mailtrap sandbox in development).

Other scripts:

```bash
npm run build      # type-check + production build
npm run preview    # serve the production build locally
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
src/
├── api/                axios instance (JWT + Accept-Language interceptors), backend DTO types
├── lib/                auth (JWT decode/storage), query client, API-error helpers, formatting
├── i18n/               i18next setup + el.json / en.json translations
├── features/           one folder per domain, each with the same shape:
│   ├── auth/           schemas · api · hooks
│   ├── doctors/        schemas · api · queries · hooks
│   ├── timeslots/      schemas · api · queries · hooks
│   └── appointments/   schemas · api · queries · hooks · AppointmentsView
├── components/
│   ├── ui/             shadcn/ui primitives (generated)
│   ├── form/           typed field wrappers (TextField, SelectField, ComboboxField, ...)
│   ├── data/           PaginatedTable, PaginationControls, StatusBadge
│   └── layout/         sidebar, page header, language switcher, ...
└── routes/             file-based routes = URLs
    ├── login / register / activate      public pages
    └── _authenticated/                  auth guard + app shell (pathless layout)
        ├── admin/       doctors list, create doctor
        ├── doctor/      generate timeslots, appointments
        └── patient/     book appointment, appointments
```

Each feature follows the same three-file split: `api.ts` (plain HTTP calls), `queries.ts` (query-key factory + `queryOptions` recipes shared by loaders and components), `hooks.ts` (mutations with cache invalidation) — roughly the frontend's repository / service layers.

## Design decisions

- **Loaders + shared `queryOptions`.** Route loaders prefetch through the same recipe the component reads with `useSuspenseQuery` — same query key, so data is fetched once and pages render complete, without spinner flashes.
- **URL as the source of truth.** Pagination and filters live in search params, validated with zod (`.catch` fallbacks). Refresh, back button and shareable links work; the loader can read state that exists before the component does.
- **Zod schemas mirror backend DTOs** — same rules (regex, lengths) and same field paths, including nesting (`userInsertDTO.username`). Backend validation errors (`ValidationErrorResponseDTO`) map 1:1 onto form fields via a single `handleFormApiError` helper; errors without a field become toasts.
- **Messages are i18n keys, not texts.** Schemas emit keys (`validation.email.invalid`) resolved at render time, so switching language re-translates live; already-translated backend messages pass through via `defaultValue`.
- **Deliberate cache policy.** The doctor dropdown is fetched once per session (`staleTime: Infinity`) and refreshed only by explicit invalidation when a doctor is created. Mutations invalidate every feature their backend transaction touches — booking/cancelling invalidates both appointments *and* timeslots, mirroring the server-side state change.
- **Dependent queries for booking.** Available slots load only after a doctor is chosen (`enabled`), keyed by doctor/date/page — changing a selection changes the key, so refetching is automatic and previously seen pages come from cache.
- **Single axios instance.** Request interceptor attaches the JWT (never on the login call itself) and the `Accept-Language` header; response interceptor turns any 401 into a clean logout + redirect.
- **UUIDs, not numeric ids,** identify doctors in URLs and API calls.

## Related

- Backend: [VasNera/doctor-app](https://github.com/VasNera/doctor-app) — Spring Boot 3.5 / Java 21, MySQL, Flyway, Spring Security (JWT, capability-based authorization), JavaMail activation flow.




