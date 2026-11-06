import { NextResponse } from 'next/server';

type AuditInput = {
  platform: string;
  niche: string;
  goal: 'Reach' | 'Engagement' | 'Consistency' | 'Community';
  followers: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  postsPerWeek: number;
};

type AuditReport = {
  summary: string;
  observations: { title: string; detail: string }[];
  nextSteps: string[];
  metrics: { engagementRate: number | null; viewToFollowerRatio: number | null };
  disclaimer: string;
};

const goals: AuditInput['goal'][] = ['Reach', 'Engagement', 'Consistency', 'Community'];
const platforms = ['TikTok', 'YouTube Shorts', 'Instagram Reels', 'Other'];
const countFields = ['followers', 'avgViews', 'avgLikes', 'avgComments', 'avgShares', 'postsPerWeek'] as const;

function numberOrNull(value: number | null) {
  return value === null ? 'not available' : `${value.toFixed(1)}%`;
}

function localAudit(input: AuditInput): AuditReport {
  const interactions = input.avgLikes + input.avgComments + input.avgShares;
  const engagementRate = input.avgViews > 0 ? (interactions / input.avgViews) * 100 : null;
  const viewToFollowerRatio = input.followers > 0 ? (input.avgViews / input.followers) * 100 : null;
  const observations: AuditReport['observations'] = [];
  const nextSteps: string[] = [];

  if (input.avgViews === 0) {
    observations.push({ title: 'Add view data to unlock comparisons', detail: 'Average views are zero or were not recorded, so view-based ratios cannot be calculated.' });
    nextSteps.push('Record views for your next five posts so you can compare formats using your own baseline.');
  } else {
    observations.push({ title: 'Your recent-view baseline', detail: `You entered an average of ${Math.round(input.avgViews).toLocaleString()} views per post. Use this as a personal baseline, not a platform-wide benchmark.` });
  }

  if (engagementRate !== null) {
    observations.push({ title: 'Interactions per view', detail: `Likes, comments, and shares equal ${numberOrNull(engagementRate)} of the average views you entered. Platform definitions vary; this is a simple comparison metric.` });
  } else {
    observations.push({ title: 'Engagement rate unavailable', detail: 'Enter average views greater than zero to calculate interactions divided by views.' });
  }

  if (input.avgShares > input.avgComments && input.avgShares > 0) {
    observations.push({ title: 'Sharing is a relative strength in your inputs', detail: 'Your reported average shares exceed average comments. Consider testing formats viewers may want to pass along, then compare results.' });
    nextSteps.push('Test one useful checklist, resource, or before-and-after post and compare shares with your next five posts.');
  } else if (input.avgComments > 0) {
    observations.push({ title: 'Your posts are getting conversation', detail: 'You reported comments on a typical post. Review them for recurring questions that could become a follow-up series.' });
    nextSteps.push('Turn one repeated audience question into a short answer video and invite a specific follow-up.');
  } else {
    observations.push({ title: 'Conversation data is limited', detail: 'No average comments were entered. A direct, relevant question can make it easier for viewers to respond.' });
    nextSteps.push('End one upcoming post with a focused question related to its main takeaway, then log the response count.');
  }

  if (input.postsPerWeek < 2) {
    nextSteps.push('Choose a sustainable schedule and prepare two ideas in advance; consistency should fit your available time.');
  } else {
    nextSteps.push('Keep your current posting pace for a short test window and compare similar formats rather than changing many variables at once.');
  }

  const goalAction: Record<AuditInput['goal'], string> = {
    Reach: 'For reach, test a clear opening and topic framing; compare average views across similar posts.',
    Engagement: 'For engagement, test one concrete audience question or save-worthy takeaway and compare interactions per view.',
    Consistency: 'For consistency, plan a repeatable series and a realistic weekly publishing rhythm.',
    Community: 'For community, respond to a recurring comment with a follow-up post and invite viewers to share their experience.',
  };
  nextSteps.unshift(goalAction[input.goal]);

  return {
    summary: `A starter audit for your ${input.platform} ${input.niche} content, based only on the metrics you entered. Your stated focus is ${input.goal.toLowerCase()}.`,
    observations: observations.slice(0, 3),
    nextSteps: nextSteps.slice(0, 3),
    metrics: { engagementRate, viewToFollowerRatio },
    disclaimer: 'This is coaching guidance, not a platform data connection or prediction. Your figures are self-reported, definitions differ across platforms, and no tactic guarantees growth.',
  };
}

async function hostedAudit(input: AuditInput, local: AuditReport): Promise<AuditReport | null> {
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
      temperature: 0.3,
      max_tokens: 650,
      messages: [
        { role: 'system', content: 'You are a careful short-form creator coach. Use only the supplied self-reported metrics. Never claim access to a social account, benchmarks, trends, or algorithms. Do not promise virality. Return only JSON with keys summary (string), observations (array of exactly 3 {title,detail} strings), nextSteps (array of exactly 3 concise strings). Do not alter or invent the calculated metrics.' },
        { role: 'user', content: JSON.stringify({ ...input, calculatedMetrics: local.metrics }) },
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) throw new Error(`Configured model request failed (${response.status}).`);
  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new Error('Configured model returned an invalid audit.');
  const parsed = JSON.parse(content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.observations) || parsed.observations.length !== 3 || parsed.observations.some((item: unknown) => !item || typeof item.title !== 'string' || typeof item.detail !== 'string') || !Array.isArray(parsed.nextSteps) || parsed.nextSteps.length !== 3 || parsed.nextSteps.some((item: unknown) => typeof item !== 'string')) {
    throw new Error('Configured model returned an invalid audit structure.');
  }
  return { ...parsed, metrics: local.metrics, disclaimer: local.disclaimer } as AuditReport;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platform, niche, goal, ...metrics } = body ?? {};
    if (!platforms.includes(platform)) return NextResponse.json({ error: 'Choose a supported platform.' }, { status: 400 });
    if (typeof niche !== 'string' || !niche.trim() || niche.length > 80) return NextResponse.json({ error: 'Enter a niche (up to 80 characters).' }, { status: 400 });
    if (!goals.includes(goal)) return NextResponse.json({ error: 'Choose a coaching focus.' }, { status: 400 });
    if (countFields.some((field) => !Number.isSafeInteger(metrics[field]) || metrics[field] < 0 || metrics[field] > 1_000_000_000)) {
      return NextResponse.json({ error: 'Enter whole, non-negative metric values.' }, { status: 400 });
    }
    const input: AuditInput = { platform, niche: niche.trim(), goal, ...metrics };
    const local = localAudit(input);
    const report = await hostedAudit(input, local);
    return NextResponse.json({ report: report ?? local, mode: report ? 'hosted-llm' : 'rule-based' });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to analyze this profile.' }, { status: 502 });
  }
}
