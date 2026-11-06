# CreatorPulse AI

A mobile-friendly creator growth coach and content-planning toolkit. Its purpose is to help creators who cannot afford a subscription get useful planning, scripting, and performance-tracking tools without a paywall.

## What works

- **Idea Lab:** creates five niche/audience/tone-aware short-form ideas with formats and structures. Uses local idea frameworks without a key, or an optional configured OpenAI-compatible LLM.
- **Script Builder:** makes a hook/body/CTA script from the brief. Uses local templates by default or the same optional LLM.
- **Creator Coach:** flexible LLM responses when configured; rule-based guidance works without an API key.
- **Performance Log:** manually enter real metrics from your platform analytics; totals and engagement rates are calculated in the browser. Data stays in local storage on this device.
- **Honest analytics:** no invented metrics, fake social connections, or guarantees of virality.

## Run locally

Requirements: Node.js 18.17+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No payment, API key, database account, or login is needed for local core features.

## Optional hosted model

Chat, script, and idea routes support an OpenAI-compatible chat-completions provider. If you have access to a provider's free tier, configure its server-side credentials. Free quotas and eligibility change; they are not unlimited or guaranteed.

```env
LLM_BASE_URL=https://provider.example/v1
LLM_API_KEY=your_secret_key
LLM_MODEL=provider-model-id
```

Use the base URL exactly as the provider documents it, usually ending in `/v1`; the app appends `/chat/completions`. Never use a `NEXT_PUBLIC_` prefix for the secret or commit it. Leave values blank for local fallbacks. Check provider pricing, data policy, model availability, and request limits before use.

A free upstream quota is finite. Do not expose a shared provider key on a public app without authentication and durable rate limiting. These routes limit prompt sizes and have request timeouts, but this repository does **not** yet have a distributed rate limiter; public deployment with a shared key needs that before launch.

## Not connected yet

Profile data sync, automatic posting-time recommendations, and cross-platform reposting require platform-approved OAuth/API access and secure per-user token storage. The app does not claim these work until those integrations are implemented and configured. Performance records are manual and local to this browser. The no-key coach and script/idea tools are templates/frameworks, not an LLM.
