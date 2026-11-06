import { NextResponse } from 'next/server';

type Tone = 'Energetic' | 'Controversial' | 'Educational' | 'Humorous';
type ScriptInput = { niche: string; audience: string; topic: string; tone: Tone };
const allowedTones: Tone[] = ['Energetic', 'Controversial', 'Educational', 'Humorous'];

function cleanTag(value: string) {
  return value.normalize('NFKD').replace(/[^\p{L}\p{N}]/gu, '').slice(0, 24);
}

function buildScript({ niche, audience, topic, tone }: ScriptInput) {
  const hooks: Record<Tone, string> = {
    Energetic: `Want a practical way to explore ${topic}? Let’s make it simple.`,
    Controversial: `A common belief about ${topic} deserves a closer look.`,
    Educational: `Here’s one useful thing ${audience} can learn about ${topic}.`,
    Humorous: `I tried to explain ${topic} in one sentence. It did not go as planned.`,
  };
  const tagList = [...new Set([cleanTag(niche), cleanTag(topic), 'CreatorTips', 'ShortForm'])].filter(Boolean).map((tag) => `#${tag}`).join(' ');
  return `[The Hook: 0-3 Seconds]\n${hooks[tone]}\n\n[The Body Value & Pacing]\n\nSet up: Tell ${audience} why ${topic} matters in ${niche}.\n\nStep 1 — Show one specific example related to ${topic}. Keep the visual or demonstration on screen while you explain it.\n\nStep 2 — Share one actionable takeaway the viewer can try. Avoid unsupported promises; use your own experience or cite a source when making factual claims.\n\nPacing: Cut pauses, change the visual when the idea changes, and keep each sentence focused on one point.\n\n[Call to Action & Optimized Hashtags]\nIf this was useful, invite viewers to save the video or ask a specific follow-up question.\n\n${tagList}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ScriptInput>;
    const { niche, audience, topic, tone = 'Educational' } = body;
    if (typeof niche !== 'string' || !niche.trim() || niche.length > 80 || typeof audience !== 'string' || !audience.trim() || audience.length > 100 || typeof topic !== 'string' || !topic.trim() || topic.length > 240) {
      return NextResponse.json({ error: 'Provide a niche (max 80 chars), audience (max 100 chars), and topic (max 240 chars).' }, { status: 400 });
    }
    if (!allowedTones.includes(tone as Tone)) return NextResponse.json({ error: 'Choose a supported tone.' }, { status: 400 });
    return NextResponse.json({ script: buildScript({ niche: niche.trim(), audience: audience.trim(), topic: topic.trim(), tone: tone as Tone }), mode: 'template-based' });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
