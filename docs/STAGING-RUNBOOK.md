# AKSARA UNDANGAN — Staging Release Runbook

This runbook is a required gate before production deployment or merging the production-hardening PR.

## 1. Staging isolation

- Use a separate staging PostgreSQL database, application origin, Midtrans Sandbox credentials, and object-storage namespace.
- Never copy production secrets into CI logs, repository files, frontend `VITE_*` variables, or invitation payloads.
- `MIDTRANS_IS_PRODUCTION=false` in staging.
- Configure `APP_ORIGIN` to the exact HTTPS staging frontend origin.
- Configure `TRUST_PROXY_HOPS` only after confirming the hosting provider's exact proxy topology.

## 2. Pre-deploy database backup

Before every staging migration:

```sh
umask 077
mkdir -p backups
pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" > "backups/aksara-staging-$(date -u +%Y%m%dT%H%M%SZ).dump"
```

Requirements:
- Backup files must be private and encrypted at rest by the backup/storage platform.
- Do not commit dumps to Git.
- Retain enough backups to recover from the latest bad deployment and periodically test restoration.

## 3. Apply database migration

From `server/`:

```sh
npm run db:migrate
```

The command must exit successfully before application traffic is switched to the new release. A failed migration stops the deployment; do not continue by manually ignoring SQL errors.

## 4. Restore drill

A backup is not considered valid until restoration has been tested against a disposable database.

```sh
createdb aksara_restore_check
pg_restore --clean --if-exists --no-owner --no-acl --dbname=aksara_restore_check backups/<backup-file>.dump
psql aksara_restore_check -c "SELECT count(*) FROM orders;"
psql aksara_restore_check -c "SELECT count(*) FROM payments;"
psql aksara_restore_check -c "SELECT count(*) FROM payment_events;"
psql aksara_restore_check -c "SELECT count(*) FROM invitations;"
dropdb aksara_restore_check
```

For managed PostgreSQL where `createdb/dropdb` are unavailable, create a temporary database through the provider and run the equivalent `pg_restore` and verification queries there.

## 5. Application smoke checks

After deploy, verify over HTTPS:

1. Homepage, templates, pricing, policies, login, and checkout render without console/server errors.
2. Unauthenticated `/dashboard`, `/admin`, and checkout actions fail closed or require authentication.
3. Customer cannot read another customer's invitation/order data.
4. Public unpublished, unpaid, expired, or unknown invitation slugs return the same non-disclosing not-found behavior.
5. RSVP and guest-message validation/rate limits reject malformed or abusive requests.
6. Admin moderation requires an ADMIN server session.
7. No Midtrans Server Key, database URL, session token, or storage credential appears in frontend assets/network payloads.

## 6. Midtrans Sandbox E2E gate

Use unique order IDs and test at minimum:

- successful payment -> signed trusted settlement/capture webhook -> invitation becomes ACTIVE;
- pending payment -> invitation remains unavailable;
- deny/cancel/expire/failure -> pending order does not activate;
- duplicate settlement webhook -> no duplicate activation/expiry extension;
- delayed non-settlement after successful settlement -> no state regression;
- invalid signature -> rejected and no state change;
- valid signature with wrong amount/order -> ignored/fail-closed and no activation;
- ambiguous Snap create / reconciliation-required path -> invitation remains unavailable until a verified webhook settles it.

For every case, verify `orders`, `payments`, `payment_events`, and `invitations` state directly in staging PostgreSQL. Browser redirect success is never evidence of payment.

## 7. Rollback criteria

Stop/rollback the release if any of these occur:

- migration failure or restore drill failure;
- authentication/authorization bypass;
- payment activation without a verified server-side Midtrans notification;
- amount/order mismatch can activate an invitation;
- duplicate/delayed webhook regresses state;
- secrets appear in browser-visible output or logs;
- CI/typecheck/tests/build are not green.

Rollback application code to the last known-good release. For database incidents, restore only after identifying whether a forward fix is safer; never overwrite newer legitimate payment/order data casually.

## 8. Evidence required before production

Record the staging release commit SHA, CI run, migration result, backup identifier, restore-drill result, Midtrans Sandbox order IDs, and the observed database state for each E2E scenario. Production approval remains a separate decision; passing this runbook does not guarantee Midtrans merchant approval.
