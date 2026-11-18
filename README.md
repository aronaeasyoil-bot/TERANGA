# TERANGA Dubai Rentals

Static site deployed as Cloudflare Workers Static Assets. The build stages only
public pages, scripts, styles and media; do not deploy the repository root.

```sh
node build-static.mjs
cf deploy ./dist --dry-run
cf deploy ./dist
```

Use a Cloudflare CLI version that supports direct assets-directory deployment.
Use the authorized TERANGA Cloudflare account for production deploys.

The existing admin is a local demo: edits and the request log are stored in the
browser for the current origin. They are not shared or copied across domains.
The code in the demo is not server-side authentication. Visa and flight
requests reach the team only when the visitor sends them via WhatsApp.
