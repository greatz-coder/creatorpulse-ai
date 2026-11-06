import { NextResponse } from 'next/server';

type Tone = 'Energetic' | 'Controversial' | 'Educational' | 'Humorous';
type ScriptInput = { niche: string; audience: string; topic: string; tone: Tone };
const allowedTones: Tone[] = ['Energetic', 'Controversial', 'Educational', 'Humorous'];

function cleanTag(value: string) {
  return value.normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '').slice(0, 24);
}

function buildTemplate({ niche, audience, topic, tone }: ScriptInput) {
  const hooks: Record<Tone, string> = {
    Energetic: `Want a practical way to explore ${topic}? Let’s make it simple.`,
    Controversial: `A common belief about ${topic} deserves a closer look.`,
    Educational: `Here’s one useful thing ${audience} can learn about ${topic}.`,
    Humorous: `I tried to explain ${topic} in one sentence. It did not go as planned.`,
  };
  const tags = [...new Set([cleanTag(niche), cleanTag(topic), 'CreatorTips', 'ShortForm'])].filter(Boolean).map((tag) => `#${tag}`).join(' ');
  return `[The Hook: 0-3 Seconds]\n${hooks[tone]}\n\n[The Body Value & Pacing]\n\nSet up: Tell ${audience} why ${topic} matters in ${niche}.\n\nStep 1 — Show one specific example related to ${topic}. Keep the visual or demonstration on screen while you explain it.\n\nStep 2 — Share one actionable takeaway the viewer can try. Avoid unsupported promises; use your own experience or cite a source when making factual claims.\n\nPacing: Cut pauses, change the visual when the idea changes, and keep each sentence focused on one point.\n\n[Call to Action & Optimized Hashtags]\nIf this was useful, invite viewers to save the video or ask a specific follow-up question.\n\n${tags}`;
}

async function generateWithModel(input: ScriptInput) {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!baseUrl || !apiKey || !model) return null;

  const endpoint = new URL(baseUrl);
  if (endpoint.protocol !== 'https:' && process.env.NODE_ENV === 'production') throw new Error('LLM_BASE_URL must use HTTPS in production.');
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, '')}/chat/completions`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.75,
      max_tokens: 750,
      messages: [
        { role: 'system', content: 'Write a useful, shootable short-form video script for TikTok, Reels, or Shorts. Return exactly these headings: [The Hook: 0-3 Seconds], [The Body Value & Pacing], [Call to Action & Optimized Hashtags]. Be specific to the brief. Do not promise virality or invent factual evidence. Use 3-6 relevant hashtags.' },
        { role: 'user', content: `Niche: ${input.niche}\nAudience: ${input.audience}\nTopic: ${input.topic}\nTone: ${input.tone}` },
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`Configured model request failed (${response.status}).`);
  const data = await response.json();
  const script = data.choices?.[0]?.message?.content;
  if (typeof script !== 'string' || !script.trim()) throw new Error('Configured model returned an empty script.');
  return script.trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ScriptInput>;
    const { niche, audience, topic, tone = 'Educational' } = body;
    if (typeof niche !== 'string' || !niche.trim() || niche.length > 80 || typeof audience !== 'string' || !audience.trim() || audience.length > 100 || typeof topic !== 'string' || !topic.trim() || topic.length > 240) {
      return NextResponse.json({ error: 'Provide a niche (max 80 chars), audience (max 100 chars), and topic (max 240 chars).' }, { status: 400 });
    }
    if (!allowedTones.includes(tone as Tone)) return NextResponse.json({ error: 'Choose a supported tone.' }, { status: 400 });
    const cleanInput = { niche: niche.trim(), audience: audience.trim(), topic: topic.trim(), tone: tone as Tone };
    const generated = await generateWithModel(cleanInput);
    if (generated) return NextResponse.json({ script: generated, mode: 'hosted-llm' });
    return NextResponse.json({ script: buildTemplate(cleanInput), mode: 'template-based' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate a script.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
