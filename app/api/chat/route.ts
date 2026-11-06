import { NextResponse } from 'next/server';

const MAX_MESSAGES = 12;
const MAX_TEXT = 1000;
type Message = { role: 'user' | 'assistant'; content: string };

function coachReply(prompt: string) {
  const text = prompt.trim();
  const lower = text.toLowerCase();
  if (lower.includes('hook') || lower.includes('opening')) return `Hook checklist for your draft:\n1. Name one specific audience or problem immediately.\n2. Replace a broad claim with a concrete detail or example.\n3. Create an open loop, then pay it off in the video.\n\nTry this editable pattern: “If you [audience] struggle with [problem], try [specific action]—here’s why.”\n\nYour prompt: ${text}\n\nTreat this as a starting point; test alternatives against your own audience.`;
  if (lower.includes('idea') || lower.includes('ideas')) return `A simple idea framework for “${text}”:\n• A mistake beginners make, followed by a fix.\n• A before/after process breakdown.\n• Three tools, steps, or lessons compared.\n• A response to a real audience question.\n• A short case study with context and a specific takeaway.\n\nChoose one idea you can support with your own experience or evidence; there is no guaranteed viral formula.`;
  if (lower.includes('retention') || lower.includes('script') || lower.includes('structure')) return `Try this short-video outline for “${text}”:\n• Opening (0–3s): specific promise or question.\n• Context (3–7s): why the viewer should care.\n• Value (7–22s): one idea, shown in clear steps or examples.\n• Payoff (22–27s): summarize or demonstrate the result.\n• CTA (final seconds): one relevant next action.\n\nAdjust the timings to your delivery and verify claims before publishing.`;
  if (lower.includes('time') || lower.includes('posting')) return 'There is no universally best posting time. Use your platform’s audience-activity insights, compare similar posts published at different times, and judge results over a consistent sample. Log the post date and performance in your Performance Log.';
  return `Let’s turn this into an actionable test. For “${text}”:\n1. Define one audience and the problem the post addresses.\n2. Make one clear promise the video can actually deliver.\n3. Show a concrete example early.\n4. End with one next step for the viewer.\n5. Compare views and interactions with your own recent posts.\n\nI’m a no-key rule-based coach, not an AI model; share a draft or niche for a more focused checklist.`;
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
    return NextResponse.json({ reply: coachReply(latest.content), mode: 'rule-based' });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
