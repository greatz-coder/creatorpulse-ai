# CreatorPulse AI

CreatorPulse is a free-first creator growth coach for people who cannot afford a subscription. It is designed to help short-form creators review performance, find ideas, write scripts, and learn from what they publish—not to sell guaranteed virality or pretend to have platform access.

## Creator coaching workflow

1. **Profile & Performance Audit:** enter your niche, focus, follower count, and average metrics from recent posts. CreatorPulse calculates transparent descriptive ratios and gives concrete next steps. It does not log in to social accounts or fetch profile data.
2. **Idea Lab:** generate five niche- and audience-aware content angles with suggested format and structure.
3. **Script Builder:** turn a brief into a hook, body, CTA, and relevant hashtags.
4. **Creator Coach:** ask for guidance on a hook, idea, structure, or posting test.
5. **Performance Log:** record real post metrics and compare your own results over time.

Core no-key versions work without payment. An optional hosted LLM can make ideas, scripts, audits, and chat more flexible, but the upstream provider's free quota may be limited. No tool promises a post will go viral.

## Run locally

Requirements: Node.js 18.17+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. No payment, API key, database account, or login is needed for local core tools.

## Optional hosted model

The chat, script, ideas, and audit routes support an OpenAI-compatible chat-completions provider. Configure a provider that currently offers a free tier if you have an eligible account; free quotas, availability, and terms can change.

```env
LLM_BASE_URL=https://provider.example/v1
LLM_API_KEY=your_secret_key
LLM_MODEL=provider-model-id
```

Use the base URL exactly as the provider documents it, usually ending in `/v1`; the app appends `/chat/completions`. Never use a `NEXT_PUBLIC_` prefix for the secret or commit it. Leave values blank for local rules/templates. Review provider pricing, data policy, model availability, and request limits before use.

Free quotas are finite. Do not expose a shared provider key on a public app without authentication and durable rate limiting. These routes limit prompt sizes and have request timeouts, but this repository does **not** yet have a distributed rate limiter; public deployment with a shared key needs abuse protection first.

## Current limitations

- Profile audits use self-reported metrics, not direct platform profile access. Ratios are descriptive, not official platform benchmarks.
- Performance entries are stored only in this browser. Clearing site data removes them.
- Real profile sync, automatic audience-activity recommendations, and cross-platform reposting require approved platform OAuth/API access and secure per-user token storage. They are not enabled or simulated.
- The no-key coach, idea generator, and script builder use rules/templates rather than a language model.
