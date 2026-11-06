'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { formatCount, interactionRate, readPosts, writePosts, type Platform, type PostEntry } from '@/lib/creator-data';

const platforms: Platform[] = ['TikTok', 'YouTube Shorts', 'Instagram Reels', 'Other'];
const blank = { title: '', platform: 'TikTok' as Platform, postedAt: new Date().toISOString().slice(0, 10), views: '', likes: '', comments: '', shares: '', saves: '' };
type Draft = typeof blank;

function numberOrZero(value: string) { return value === '' ? 0 : Number(value); }

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<PostEntry[]>([]);
  const [draft, setDraft] = useState<Draft>(blank);
  const [error, setError] = useState('');
  useEffect(() => setPosts(readPosts()), []);

  const save = (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    const counts = [draft.views, draft.likes, draft.comments, draft.shares, draft.saves];
    if (counts.some((value) => value !== '' && (!Number.isSafeInteger(Number(value)) || Number(value) < 0))) {
      setError('Enter whole, non-negative counts for each metric.'); return;
    }
    if (!draft.title.trim()) { setError('Add a post title so you can identify this entry.'); return; }
    const post: PostEntry = { id: crypto.randomUUID(), title: draft.title.trim(), platform: draft.platform, postedAt: draft.postedAt, views: numberOrZero(draft.views), likes: numberOrZero(draft.likes), comments: numberOrZero(draft.comments), shares: numberOrZero(draft.shares), saves: numberOrZero(draft.saves) };
    const next = [post, ...posts]; setPosts(next); writePosts(next); setDraft({ ...blank, postedAt: new Date().toISOString().slice(0, 10) });
  };
  const remove = (id: string) => { const next = posts.filter((post) => post.id !== id); setPosts(next); writePosts(next); };
  const totals = posts.reduce((acc, post) => ({ views: acc.views + post.views, likes: acc.likes + post.likes, comments: acc.comments + post.comments, shares: acc.shares + post.shares, saves: acc.saves + post.saves }), { views: 0, likes: 0, comments: 0, shares: 0, saves: 0 });
  const update = (key: keyof Draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));

  return <div className="space-y-6">
    <div><p className="text-xs uppercase tracking-[0.28em] text-violet-200/75">Performance Log · private to this browser</p><h1 className="mt-2 text-3xl font-bold">Track your post results</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Enter figures from your platform analytics. Entries are stored in this browser’s local storage; nothing is fetched from or sent to social networks.</p></div>
    <section className="grid gap-3 sm:grid-cols-3">{[
      ['Total views', formatCount(totals.views)], ['Engagement rate', `${interactionRate(posts).toFixed(1)}%`], ['Posts logged', `${posts.length}`],
    ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section>
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"><h2 className="text-lg font-semibold">Add performance from a published post</h2>
      <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-1 text-sm text-slate-300 sm:col-span-2 lg:col-span-1">Post title<Input value={draft.title} maxLength={120} required onChange={(e) => update('title', e.target.value)} placeholder="Name this video" /></label>
        <label className="space-y-1 text-sm text-slate-300">Platform<Select value={draft.platform} onChange={(e) => update('platform', e.target.value)}>{platforms.map((platform) => <option key={platform}>{platform}</option>)}</Select></label>
        <label className="space-y-1 text-sm text-slate-300">Date posted<Input type="date" value={draft.postedAt} required onChange={(e) => update('postedAt', e.target.value)} /></label>
        {(['views', 'likes', 'comments', 'shares', 'saves'] as const).map((field) => <label key={field} className="space-y-1 text-sm capitalize text-slate-300">{field}<Input type="number" min="0" step="1" inputMode="numeric" value={draft[field]} onChange={(e) => update(field, e.target.value)} placeholder="0" /></label>)}
        {error && <p role="alert" className="text-sm text-rose-300 sm:col-span-2 lg:col-span-3">{error}</p>}
        <button type="submit" className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-semibold hover:bg-violet-500 sm:col-span-2 lg:col-span-3">Save post metrics</button>
      </form>
    </section>
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"><h2 className="text-lg font-semibold">Your posts</h2>
      {posts.length === 0 ? <p className="mt-3 rounded-2xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">No post metrics yet. Add a post above to see your real totals and engagement rate.</p> : <div className="mt-4 space-y-3">{posts.map((post) => {
        const rate = post.views ? ((post.likes + post.comments + post.shares + post.saves) / post.views) * 100 : 0;
        return <article key={post.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"><div className="min-w-0"><p className="truncate font-medium">{post.title}</p><p className="mt-1 text-xs text-slate-400">{post.platform} · {post.postedAt} · {formatCount(post.views)} views · {rate.toFixed(1)}% engagement</p><p className="mt-1 text-xs text-slate-500">{formatCount(post.likes)} likes · {formatCount(post.comments)} comments · {formatCount(post.shares)} shares · {formatCount(post.saves)} saves</p></div><button type="button" aria-label={`Delete ${post.title}`} onClick={() => remove(post.id)} className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-full border border-slate-700 px-3 text-sm text-slate-300 hover:border-rose-400 hover:text-rose-300 sm:self-center"><Trash2 className="h-4 w-4" />Delete</button></article>;
      })}</div>}
    </section>
  </div>;
}
