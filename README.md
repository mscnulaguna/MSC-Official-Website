# MSC Official Website

Monorepo for the MSC website, containing:

- A React + TypeScript frontend (`client`)
- An Express backend API (`server`)

## Tech Stack

### Frontend (`client`)

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Tailwind CSS 4
- shadcn-style UI component architecture

### Backend (`server`)

- Node.js (ES modules)
- Express 5
- CORS + dotenv

## Repository Structure

```text
MSC/
|-- client/               # React frontend
|   |-- src/
|   |   |-- pages/        # Route-level pages
|   |   |-- components/   # UI components and layout primitives
|   |   `-- ...
|   `-- package.json
|-- server/               # Express API
|   |-- index.js          # API entrypoint
|   `-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

Install dependencies in both workspaces:

```powershell
cd client
npm install

cd ..\server
npm install
```

Run backend (Terminal 1):

```powershell
cd server
npm run dev
```

Run frontend (Terminal 2):

```powershell
cd client
npm run dev
```

Open the app at `http://localhost:5173`.

## Environment Variables

### Backend (`server/.env`)

- `PORT` (optional): API port. Defaults to `5000`.

Example:

```env
PORT=5000
```

### Frontend (`client/.env`)

- `VITE_API_BASE_URL`: backend base URL used by frontend API calls.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Scripts

### Frontend scripts (`client/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and build production bundle
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend scripts (`server/package.json`)

- `npm run dev` - Start server with nodemon
- `npm start` - Start server with Node.js

## Frontend Routes

Defined in `client/src/App.tsx`.

Main routes:

- `/` - Home
- `/about` - About
- `/activities` - Activities listing
- `/activities/:eventId` - Event details
- `/partners` - Partners
- `/login` - Login

Fallback/demo routes:

- `/coming-soon`
- `/maintenance`
- `/access-restricted`
- `/no-announcements`
- `/*` - 404 fallback

## Backend API

Defined in `server/app.js` (Express app) and `server/server.js` (runtime entrypoint).

- `GET /api/hello` -> `{ message: "Hello from the server!" }`

Default CORS origins for development:
- `http://localhost`
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

Production origins should be configured through `server/.env` using `CORS_ORIGINS` (comma-separated).

## Development Notes

- Frontend app is mounted with `BrowserRouter`, global theme provider, and app layout in `client/src/main.tsx`.
- Ensure `VITE_API_BASE_URL` points to the running backend before testing API-connected UI.
- Footer visibility and fallback behavior are route-dependent in `client/src/App.tsx`.

## Troubleshooting

- Frontend starts but API fails:
	- Verify backend is running on the expected port.
	- Verify `client/.env` contains the correct `VITE_API_BASE_URL`.
- CORS errors in browser:
	- Ensure frontend origin is in the backend allowlist in `server/app.js`.
	- In production, set `CORS_ORIGINS` in `server/.env` (or hosting app settings) to include your frontend URL.
- Port already in use:
	- Change backend `PORT` in `server/.env` and update `VITE_API_BASE_URL` accordingly.

## Contributing

1. Create a feature branch.
2. Keep changes scoped and consistent with existing project patterns.
3. Run lint/build checks in affected workspace before opening a PR.

---

For frontend-specific details, see `client/README.md`.