import { NextResponse } from 'next/server';

const MAX_MESSAGES = 12;
const MAX_TEXT = 1000;
type Message = { role: 'user' | 'assistant'; content: string };

function localCoachReply(prompt: string) {
  const text = prompt.trim();
  const lower = text.toLowerCase();
  if (lower.includes('hook') || lower.includes('opening')) return `Hook checklist for your draft:\n1. Name one specific audience or problem immediately.\n2. Replace a broad claim with a concrete detail or example.\n3. Create an open loop, then pay it off in the video.\n\nTry this editable pattern: “If you [audience] struggle with [problem], try [specific action]—here’s why.”\n\nYour prompt: ${text}\n\nTreat this as a starting point; test alternatives against your own audience.`;
  if (lower.includes('idea') || lower.includes('ideas')) return `A simple idea framework for “${text}”:\n• A mistake beginners make, followed by a fix.\n• A before/after process breakdown.\n• Three tools, steps, or lessons compared.\n• A response to a real audience question.\n• A short case study with context and a specific takeaway.\n\nChoose one idea you can support with your own experience or evidence; there is no guaranteed viral formula.`;
  if (lower.includes('retention') || lower.includes('script') || lower.includes('structure')) return `Try this short-video outline for “${text}”:\n• Opening (0–3s): specific promise or question.\n• Context (3–7s): why the viewer should care.\n• Value (7–22s): one idea, shown in clear steps or examples.\n• Payoff (22–27s): summarize or demonstrate the result.\n• CTA (final seconds): one relevant next action.\n\nAdjust the timings to your delivery and verify claims before publishing.`;
  if (lower.includes('time') || lower.includes('posting')) return 'There is no universally best posting time. Use your platform’s audience-activity insights, compare similar posts published at different times, and judge results over a consistent sample. Log the post date and performance in your Performance Log.';
  return `Let’s turn this into an actionable test. For “${text}”:\n1. Define one audience and the problem the post addresses.\n2. Make one clear promise the video can actually deliver.\n3. Show a concrete example early.\n4. End with one next step for the viewer.\n5. Compare views and interactions with your own recent posts.\n\nThis fallback uses a local rule-based framework. Configure a free hosted-model endpoint to enable generated AI coaching.`;
}

async function askConfiguredModel(messages: Message[]) {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  if (!baseUrl || !apiKey || !model) return null;

  let endpoint: URL;
  try {
    endpoint = new URL(baseUrl);
  } catch {
    throw new Error('LLM_BASE_URL must be a valid URL.');
  }
  if (endpoint.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
    throw new Error('LLM_BASE_URL must use HTTPS in production.');
  }
  endpoint.pathname = `${endpoint.pathname.replace(/\/$/, '')}/chat/completions`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        { role: 'system', content: 'You are CreatorPulse, a practical short-form content coach for TikTok, Instagram Reels, and YouTube Shorts. Give concise, actionable advice. Do not claim to know private account metrics or guarantee virality. Clearly qualify platform-algorithm claims.' },
        ...messages.slice(-8),
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`Configured model request failed (${response.status}).`);
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;
  if (typeof reply !== 'string' || !reply.trim()) throw new Error('Configured model returned an empty response.');
  return reply.trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: `Send between 1 and ${MAX_MESSAGES} messages.` }, { status: 400 });
    }
    const messages = body.messages as Message[];
    if (messages.some((message) => !message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || message.content.length > MAX_TEXT)) {
      return NextResponse.json({ error: 'Messages must have a valid role and be under 1,000 characters.' }, { status: 400 });
    }
    const latest = [...messages].reverse().find((message) => message.role === 'user');
    if (!latest?.content.trim()) return NextResponse.json({ error: 'Write a message first.' }, { status: 400 });

    const generated = await askConfiguredModel(messages);
    if (generated) return NextResponse.json({ reply: generated, mode: 'hosted-llm' });
    return NextResponse.json({ reply: localCoachReply(latest.content), mode: 'rule-based' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate a response.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
