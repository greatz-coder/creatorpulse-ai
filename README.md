# CreatorPulse AI

A mobile-friendly creator toolkit that keeps its core features usable without a paid API key.

## What works

- **Script Builder:** builds an editable hook/body/CTA script from the brief. It uses local templates when no hosted model is configured; optionally calls a configured OpenAI-compatible LLM endpoint.
- **Creator Coach:** uses the same optional hosted LLM integration for flexible answers. If it is not configured, a rule-based local coach remains available.
- **Performance Log:** lets you enter metrics from platform analytics, calculates totals and engagement rate, and stores/removes entries in this browser's local storage. It does not fetch social data or sync across devices.
- **No invented metrics or connections:** social OAuth is disabled until a real platform integration is configured.

## Run locally

Requirements: Node.js 18.17+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No API key, database account, or login is required for the local template/coach and performance-log features.

## Optional hosted LLM, without a paid OpenAI key

The server routes support an **OpenAI-compatible** chat-completions API. You may use a provider that currently offers a free tier, subject to that provider's account requirements, model availability, quotas, and terms. Free quotas change and are not guaranteed to be unlimited or suitable for a public app.

Set these variables in `.env.local` or your hosting provider's server-only environment settings:

```env
LLM_BASE_URL=https://provider.example/v1
LLM_API_KEY=your_secret_key
LLM_MODEL=provider-model-id
```

Use the base URL exactly as the provider documents it, usually ending in `/v1` (not `/chat/completions`). The app appends `/chat/completions`. Pick a model enabled for your account. Restart the dev server after changing environment variables. Leave all three blank to use local fallback tools. The secret is only read in API routes; never put it in a `NEXT_PUBLIC_` variable or commit it.

**Free is not the same as unlimited:** users' requests to a hosted provider consume that provider's quota. For a public deployment, configure strict provider limits and add durable rate limiting/authentication before enabling a shared key, or visitors could exhaust the quota. The app caps input/output size and times out requests, but its API routes do not implement a distributed rate limiter. Never promise unlimited free AI to users.

## Known limitations

- Template-based script generation and the local coach are not LLMs.
- Hosted model availability depends on your chosen provider and account. A provider outage or quota limit returns an error rather than silently pretending the model generated a response.
- Performance entries exist only in the current browser. Clearing site data removes them.
- Real profile analysis, social analytics sync, and repost scheduling require approved platform OAuth/API access, app credentials, user consent, and secure token storage. The existing disabled social endpoint does not accept or store tokens.

Before deploying a shared provider key to a public audience, add a durable rate limiter and authentication or another abuse-control mechanism, and review the provider's data-use terms.
