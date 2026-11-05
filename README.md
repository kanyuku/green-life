# FieldDemo Pulse

A lightweight agribusiness field-force intelligence MVP inspired by the GreenLife Crop Protection proposal in the attached PDF.

## What this project includes

- Marketing landing page for the product concept
- Pilot dashboard for field activity, demand signals, and stock pressure
- Offline-first PWA manifest metadata
- Mock API endpoint for field demo telemetry
- Next.js 16 app-router project with Tailwind styling

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000 and http://localhost:3000/dashboard.

## Production build

```bash
npm run build
```

## Project structure

- `src/app/page.tsx` — public landing page
- `src/app/dashboard/page.tsx` — KPI dashboard
- `src/app/api/field-demo/route.ts` — field telemetry mock endpoint
- `src/app/manifest.ts` — PWA manifest definition
