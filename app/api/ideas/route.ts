import { NextResponse } from 'next/server';

type Tone = 'Energetic' | 'Controversial' | 'Educational' | 'Humorous';
const tones: Tone[] = ['Energetic', 'Controversial', 'Educational', 'Humorous'];
type Brief = { niche: string; audience: string; tone: Tone };

function localIdeas({ niche, audience, tone }: Brief) {
  const frames: Record<Tone, string[]> = {
    Energetic: [
      `A 3-step ${niche} challenge ${audience} can try today`,
      `Before and after: one small ${niche} change that made a difference`,
      `I tested a popular ${niche} tip so you can decide if it is worth trying`,
      `The quickest beginner-friendly ${niche} win I would start with`,
      `A behind-the-scenes look at how I approach ${niche}`,
    ],
    Controversial: [
      `A common ${niche} tip I would question—and what I would test instead`,
      `Is ${niche} advice for ${audience} too complicated? Compare two approaches`,
      `One ${niche} habit people praise that may not fit everyone`,
      `A respectful myth-check: what is evidence and what is just opinion in ${niche}?`,
      `The trade-off nobody mentions when choosing a ${niche} shortcut`,
    ],
    Educational: [
      `Explain one ${niche} term ${audience} often hear but rarely get clearly defined`,
      `A beginner's checklist for getting started with ${niche}`,
      `Three steps to solve one specific ${niche} problem`,
      `Compare two ${niche} options and explain when each makes sense`,
      `Answer a real audience question about ${niche} with a visual example`,
    ],
    Humorous: [
      `POV: you are ${audience} trying to learn ${niche} from conflicting advice`,
      `Act out a beginner mistake in ${niche}, then show the kind fix`,
      `Expectation vs. reality when trying a ${niche} tip`,
      `Explain a ${niche} concept using an everyday object`,
      `A friendly skit about the one question ${audience} always asks about ${niche}`,
    ],
  };
  return frames[tone].map((idea, index) => ({
    title: idea,
    format: ['Quick tutorial', 'Before / after', 'Myth check', 'Storytime', 'Audience Q&A'][index],
    structure: `Open with the specific ${niche} question, show one example, give ${audience} a practical takeaway, then invite a relevant response.`,
  }));
}

async function hostedIdeas(brief: Brief) {
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
      temperature: 0.8,
      max_tokens: 700,
      messages: [
        { role: 'system', content: 'Create exactly five practical short-form video ideas. Return valid JSON array only, each item with string fields title, format, structure. Do not promise virality or invent facts.' },
        { role: 'user', content: `Niche: ${brief.niche}\nAudience: ${brief.audience}\nTone: ${brief.tone}` },
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`Configured model request failed (${response.status}).`);
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new Error('Configured model returned an invalid response.');
  const parsed = JSON.parse(content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  if (!Array.isArray(parsed) || parsed.length !== 5 || parsed.some((item) => typeof item.title !== 'string' || typeof item.format !== 'string' || typeof item.structure !== 'string')) {
    throw new Error('Configured model did not return five valid ideas.');
  }
  return parsed as ReturnType<typeof localIdeas>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { niche, audience, tone = 'Educational' } = body ?? {};
    if (typeof niche !== 'string' || !niche.trim() || niche.length > 80 || typeof audience !== 'string' || !audience.trim() || audience.length > 100) {
      return NextResponse.json({ error: 'Provide a niche (max 80 chars) and audience (max 100 chars).' }, { status: 400 });
    }
    if (!tones.includes(tone)) return NextResponse.json({ error: 'Choose a supported tone.' }, { status: 400 });
    const brief = { niche: niche.trim(), audience: audience.trim(), tone } as Brief;
    const generated = await hostedIdeas(brief);
    return NextResponse.json({ ideas: generated ?? localIdeas(brief), mode: generated ? 'hosted-llm' : 'template-based' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create ideas.' }, { status: 502 });
  }
}
