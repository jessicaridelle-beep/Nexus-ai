# Connect the ORIVANE AI brain

The GitHub Pages site is the public front end. The AI runs in a separate Cloudflare Worker so no private API key is placed in this repository.

## What is already prepared

- `worker.js`: private server-side endpoint using the Cloudflare Workers AI binding.
- `wrangler.toml`: Cloudflare Worker configuration.
- `script.js`: sends chat messages to the Worker and displays its replies.

## One-time setup

This setup requires a Cloudflare account and acceptance of Cloudflare's current AI service terms and limits. Ask a parent or guardian to help with account creation and review any usage or billing settings. Do not add a payment method or enable paid usage unless they approve it.

1. Sign in to the Cloudflare dashboard.
2. Open **Workers & Pages** and create a Worker named `orivane-api`.
3. Deploy the contents of `worker.js` as the Worker code. Keep the Worker name as `orivane-api`.
4. In the Worker settings, open **Bindings** and add an **AI** binding with the variable name `AI`. Save and redeploy.
5. Copy the Worker URL. It should look like `https://orivane-api.YOUR-SUBDOMAIN.workers.dev`.
6. In this repository, open `script.js` and replace the empty string in `const NEXUS_API_URL = "";` with your Worker URL. Keep the quotation marks. Commit the change.
7. Wait for GitHub Pages to publish, then refresh the website and test a simple question.

## Important

- Never paste passwords, API tokens, or private account credentials into chat or into public GitHub files.
- The Worker only accepts browser requests from the NEXUS GitHub Pages origin. If you later change the website's domain, update `SITE_ORIGIN` in `worker.js`.
- The browser-side origin check is not a complete abuse-prevention system. Before sharing the site widely, add Cloudflare rate limiting and usage alerts, and have an adult review the account's current limits and billing settings.
- If the model name in `worker.js` is no longer available in the Cloudflare dashboard, choose a currently supported Workers AI chat model and update the `MODEL` constant.
- GitHub Pages may take a few minutes to publish each commit.
