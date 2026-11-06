import { NextResponse } from 'next/server';

const fallbackReply = (prompt: string) => {
  const lower = prompt.toLowerCase();

  if (lower.includes('hook')) {
    return 'Use a tension-based hook: “I tested this strategy for 7 days and my CTR tripled.” Keep the first 2 seconds focused on a clear transformation, a visible pain point, or a surprising number.';
  }

  if (lower.includes('viral') || lower.includes('idea')) {
    return 'Try a recurring creator format: pain point -> transformation -> proof -> CTA. Example: “3 AI tools that saved me 5 hours this week.”';
  }

  if (lower.includes('retention') || lower.includes('script')) {
    return 'Structure your script in 3 waves: intrigue, value, payoff. Open with a contradiction, build tension, then end with a reason to comment or follow.';
  }

  return 'The strongest short-form content usually follows this sequence: hook > pain point > instant value > clear call to action. Keep each sentence short and visually driven.';
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json({ error: 'No messages received.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const latestPrompt = messages[messages.length - 1]?.content ?? 'Ask me about growth tactics';

    if (!apiKey) {
      return NextResponse.json({
        reply: fallbackReply(latestPrompt),
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
              'You are a growth strategist for TikTok, YouTube Shorts, and Instagram Reels. Give concise, creator-focused advice in a friendly tone.',
          },
          ...messages.map((message: { role: string; content: string }) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI request failed');
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? fallbackReply(latestPrompt);

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({
      reply: 'I hit a temporary issue. Try again in a moment or switch to a simpler prompt.',
    });
  }
}
