# FieldDemo Pulse

Mobile-first field operations prototype for the GreenLife Crop Protection field-demo workflow.

## Workspaces

- `/promoter` — voice and camera capture, geotag/time stamps, offline IndexedDB queue, manual mock sync, and SMS coupon generation.
- `/stockist` — sample coupon redemption, localized demand alerts, inventory projections, and an ERP restock approval mock.
- `/dashboard` — dark executive telemetry view with ROI metrics, field verification, demand-risk heatmap, and connector health.

The root page links to each workspace. The persistent status bar shows connectivity and pending field reports.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Voice capture requires a secure context (HTTPS or localhost) and microphone permission. Camera capture depends on browser/device support.

## Offline behavior

- Field reports and attached media are stored in IndexedDB until mock API sync succeeds.
- `public/sw.js` caches the application routes and same-origin assets for repeat visits while offline.
- The sync endpoint returns a mock acknowledgement; it does not persist data to a backend.

## Prototype limitations

All dashboard figures, GPS coordinates, promoter IDs, coupon validation, attribution, and ERP actions are sample/mock data. The coupon screen does not send SMS, and the stockist approval only simulates an ERP outbox. No real blockchain ledger, transcription service, or enterprise connector is configured.

## Production checks

```bash
npm run lint
npm run build
```
