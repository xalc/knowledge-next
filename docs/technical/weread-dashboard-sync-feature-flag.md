# WeRead Dashboard Sync Feature Flag

## Current Policy

Dashboard-triggered WeRead database writes are disabled by default.

The guarded path is:

```text
GET /api/dashboard -> syncWRDataToDB()
```

`syncWRDataToDB()` still exists and can be used by code paths that intentionally opt in. The dashboard route only calls it when the feature flag below is enabled.

## Feature Flag

```bash
WEREAD_DASHBOARD_SYNC_ENABLED=true
```

Enabled values:

- `true`
- `1`
- `yes`
- `on`

Any other value, including an unset variable, disables dashboard-triggered writes.

## Disabled Behavior

When disabled, `GET /api/dashboard` still verifies the user session and returns a streamed text response. It then emits:

```text
[SYNC][SKIPPED] syncWRDataToDB is disabled by feature flag WEREAD_DASHBOARD_SYNC_ENABLED.
[SYNC][SKIPPED] Set WEREAD_DASHBOARD_SYNC_ENABLED=true to re-enable dashboard-triggered WeRead writes.
```

The final result includes:

```json
{
  "ok": true,
  "skipped": true,
  "featureFlag": "WEREAD_DASHBOARD_SYNC_ENABLED"
}
```

No WeRead gateway calls are made, and no WeRead database tables are written.

## Why It Is Disabled

The full WeRead gateway sync can perform these long-running operations:

- `/shelf/sync` bookshelf fetch
- many `/book/getprogress` calls
- monthly `/readdata/detail` calls from 2021 through the current year
- MongoDB upserts for books, progress, and daily reading summary rows

On Vercel Hobby, the dashboard route is capped to `maxDuration = 60`. A full sync can exceed that budget, so the safe production default is to skip the write path.

## Recommended Sync Path

Use an environment that can run longer than a Hobby serverless function:

```bash
pnpm backup:db
pnpm sync:weread:gateway
```

Required environment:

- `DATABASE_URL`
- `WEREAD_API_KEY`

The backup is a raw export and may contain sensitive values, so `.db-backups/` must remain ignored by Git.

## Re-Enabling Dashboard Sync

Only enable this on deployments where the sync can finish inside the function duration:

```bash
WEREAD_DASHBOARD_SYNC_ENABLED=true
```

After enabling, verify:

- `/api/dashboard` returns `[SYNC][RESULT]` without `[SYNC][FATAL]`
- `/reading` renders current bookshelf data
- `/reading/stats` renders current daily reading statistics
- `/api/skills/reading?view=overview` returns updated overview data

If the route times out, disable the flag again and move the sync to a queue, Vercel Workflows, cron worker, or external worker.
