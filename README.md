# CreatorPulse AI

A mobile-friendly creator toolkit built around honest, working no-API-key features.

## What works now

- **Script Builder:** takes the creator's niche, audience, topic, and tone and returns a structured, editable hook/body/CTA draft with relevant tags. It uses deterministic templates, not an LLM, and makes no virality guarantee.
- **Creator Coach:** a small rule-based coaching endpoint for hook, idea, structure, and posting-time prompts. It makes no external AI/API calls and does not claim to know changing platform algorithms.
- **Performance Log:** lets you enter post metrics, calculates total views and engagement rate, and stores/removes entries using this browser's local storage. Engagement rate is (likes + comments + shares + saves) / views. Entries do not sync across devices or users.
- **Daily hook prompt:** a writing prompt, not a prediction or trend feed.

## Run locally

Requirements: Node.js 18.17+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. No API key, database account, or login is required for these local features. Production build: `npm run build`.

## Important limitations

This version intentionally does **not** show fabricated analytics or simulate social connections. The old `/api/social/connect` endpoint now returns `501` and stores no tokens. Real profile analysis, automatic insights, and cross-platform publishing require each platform's approved OAuth/API access, application credentials, consent scopes, a secure database/token-vault, and platform-specific implementation. Do not send social passwords or tokens to the disabled endpoint.

The local coach and script builder are not substitutes for a language model. They are useful no-cost workflows that work without API credits. An optional local LLM can be added later for users who run their own model, but a public hosted service cannot promise unlimited free inference without someone supplying compute.

Performance records live only in browser local storage. Clearing site data removes them. Do not use shared/public devices for private creator records.

## Next production steps for social integrations

Implement one platform at a time (YouTube is a reasonable first choice): create an OAuth app, request only required read scopes, validate OAuth state and callback origins, encrypt refresh tokens at rest in a user-isolated database, implement token revocation/disconnect, and build analytics from documented API fields. Publishing/reposting should be a separate explicit permission and workflow. Never accept access tokens directly from the browser as a substitute for OAuth.
