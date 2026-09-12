# TDOP Frontend

The **Tanzania Digital Opportunity Platform (TDOP)** frontend — a React + TypeScript single-page application for browsing opportunities, connecting talent with organizations, and managing the platform as an administrator.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Data fetching | TanStack Query (React Query) |
| Forms | React Hook Form 7 |
| State (local/global) | React Context + Zustand |
| i18n | i18next (English + Swahili) |
| HTTP | Axios |
| Testing | Vitest + React Testing Library |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure the backend URL
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:3000` by default. The backend API is expected at the URL in `.env` (default `http://localhost:8081/api/v1`) — see [TDOP Backend](../TDOP-backend/README.md).

## Demo Accounts

On the Sign In page you can use the one-click **"Try it"** buttons, or type these credentials manually:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@tdop.go.tz` | `admin123` |
| Organization | `info@tanzgold.com` | `org123` |
| Job Seeker | `john.mwangi@email.com` | `seeker123` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests with Vitest |

## Project Structure

```
src/
├── components/     # UI components (layout, auth, ui, dashboard)
├── context/        # Auth, Theme, Notification providers
├── hooks/          # useAuth, useNotifications, etc.
├── i18n/           # en.json / sw.json translations
├── pages/          # Route-level pages (Seeker, Organization, Admin)
├── services/       # Axios instance + API service modules
├── types/          # Shared TypeScript types
└── App.tsx         # Root component + routes
```

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8081/api/v1` | Backend API base URL |
| `VITE_APP_NAME` | `TDOP` | App display name |
| `VITE_APP_URL` | `http://localhost:3000` | Public app URL |

## Dark Mode

The app ships with a light/dark theme. Toggle it via the button in the navbar; the preference is persisted in `localStorage` and applied using the `dark` class strategy in Tailwind.

## Related

- [TDOP Backend](../TDOP-backend/README.md) — Spring Boot REST API
- [TDOP Root README](../README.md) — Full project overview