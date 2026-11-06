import { NextResponse } from 'next/server';

const fallbackScript = ({ niche, audience, topic, tone }: { niche: string; audience: string; topic: string; tone: string }) => {
  return `
[The Hook: 0-3 Seconds]
Here’s the reality: ${topic} is the fastest way to build momentum in ${niche} — and most creators are doing it wrong.

[The Body Value & Pacing]
In the first 3 seconds, make the audience feel a transformation. Explain why ${topic} matters to ${audience} and give one clear benefit they can use immediately.

Keep the pacing tight:
- 0-3s: show the pain point or surprising truth
- 3-8s: explain the system or strategy
- 8-15s: use one practical example or proof
- 15-25s: present the result and why it matters right now

Tone: ${tone}
Core message: ${topic}

[Call to Action & Optimized Hashtags]
If you want more creator growth ideas like this, comment “creator” and follow for more ${niche} breakdowns.

#${niche.replace(/\s+/g, '')} #${audience.replace(/\s+/g, '')} #${topic.replace(/\s+/g, '')} #CreatorGrowth #ShortFormStrategy
`.trim();
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { niche, audience, topic, tone } = body;

    if (!niche || !audience || !topic) {
      return NextResponse.json({ error: 'Missing required generation fields.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        script: fallbackScript({ niche, audience, topic, tone: tone || 'Energetic' }),
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        messages: [
          {
            role: 'system',
            content:
              'You are a short-form script writer for creators. Output exactly three sections with: [The Hook: 0-3 Seconds], [The Body Value & Pacing], [Call to Action & Optimized Hashtags]. Keep it practical, punchy, and mobile-first.',
          },
          {
            role: 'user',
            content: `Niche: ${niche}\nTarget audience: ${audience}\nCore topic: ${topic}\nTone: ${tone || 'Energetic'}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI generation failed');
    }

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content ?? fallbackScript({ niche, audience, topic, tone: tone || 'Energetic' });

    return NextResponse.json({ script });
  } catch (error) {
    return NextResponse.json({
      script: fallbackScript({
        niche: body?.niche ?? 'Tech',
        audience: body?.audience ?? 'creators',
        topic: body?.topic ?? 'better short-form content',
        tone: body?.tone ?? 'Energetic',
      }),
    });
  }
}
