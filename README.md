# TERANGA DUBAI

Your African Travel Companion. See [the audit and rollout plan](audit-teranga.md).

## How it fits together

The existing static Cloudflare project now has a staging build on this branch.
The original HTML/JS and media remain in the repository for rollback, but the
staging build publishes only the new French and English pages, shared CSS,
browser modules and approved staging assets. No framework runtime is shipped
to the browser. Legacy routes for Visa, Billets, Plats and Admin are preserved.

`platform/catalog.mjs` holds the brand, official WhatsApp endpoint and service
content. `platform/pages.mjs` renders indexable HTML for later launch (staging
sets robots disallow plus noindex). `platform/worker.mjs` is the same-origin
API. SQL in `migrations/` creates operators, offers, photos, requests, sessions,
rate limits and an audit timeline. Photos are JPEG, PNG or WebP up to 512 KiB
and served only for an active offer from a verified test operator. Move larger
galleries to R2 before launch.

Public forms accept fictional email addresses in `.test` only. They create a
request reference and a per-request private key; only its SHA-256 digest is
stored in D1. The key is not in the URL or the WhatsApp message. No passport,
payment or Wave reference is collected. A prepared, verified operator is
required before an offer is shown. No live inventory is implied.

The team stages a request, prepares an AED quote in integer fils and makes it
visible in the request area. Acceptance is guarded by the current status and
expiry. The admin records a partner reference before marking a test booking
confirmed; this is not an API integration or legal proof. The staging admin
uses a high-entropy secret, short-lived server sessions, strict secure cookies,
an origin check and throttling. For production, replace the shared staging
credential with named MFA identities, role permissions and accountability.

## Verify and deploy staging

Use a current Node 24 release compatible with the pinned cf CLI.

```sh
npm ci
npm test
npm run preview:local
npm run build
node platform/guard-staging.mjs
```

Local preview binds only to loopback and uses a scratch SQLite database with
the same migrations. Supply a private `ADMIN_PASSWORD` of at least 24
characters in the environment for local admin testing.

For the very first deploy of the staging Worker, set `ADMIN_PASSWORD` via
`cf deploy --prebuilt --mode production --secrets-file <protected-env-file>`
after the guard has passed. Here `production` is the **Vite build mode**, not
the Worker name. Never pass secrets on the command line itself or commit the
file. Apply migrations with `cf d1 migrations apply <staging-database-id>`,
confirming the UUID first. Subsequent staging deployments use
`npm run deploy:staging`. The guard rejects the old production Worker output.

Validate navigation, request receipt, quote acceptance, private access, photo
visibility and final acknowledgement before discussing launch. Brand approval,
real inventory, contract checks, translation of operator-supplied terms, MFA,
Turnstile, retention and backups, private visa storage, partner portal,
payment webhooks, refunds, commissions, invoices, customer accounts and
notification delivery are not activated. Do not promote the staging Worker
or reuse its database. The site currently in production stays unchanged.

`npm run test:staging` runs a Chrome mobile flow against the staging hostname
only. It creates explicitly labelled test data, confirms quote acceptance and
checks photo visibility, then disables the test offer. Chrome must be
installed. Supply `ADMIN_PASSWORD` in the test process or use the private
Windows staging secret in the current user's LocalAppData. No WhatsApp
message, payment or operator request is sent by this test.

Hero photo: [Panorama of Dubai](https://commons.wikimedia.org/wiki/File:Panorama_of_Dubai.jpg)
by Milkaselnuss, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/),
resized and converted to WebP under the same licence. The staging logo was
supplied by the TERANGA team; final use is pending approval.
