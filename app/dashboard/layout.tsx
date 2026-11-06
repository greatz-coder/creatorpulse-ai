import Link from 'next/link';
import { BarChart3, Lightbulb, MessageSquareText, PenTool, Zap } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { href: '/dashboard', label: 'Overview', icon: BarChart3 },
    { href: '/dashboard/ideas', label: 'Idea Lab', icon: Lightbulb },
    { href: '/dashboard/chat', label: 'Creator Coach', icon: MessageSquareText },
    { href: '/dashboard/script', label: 'Script Builder', icon: PenTool },
    { href: '/dashboard/analytics', label: 'Performance Log', icon: BarChart3 },
  ];
  return <div className="min-h-screen bg-[#07070d] text-white">
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200"><Zap className="h-4 w-4" /></span><span><span className="block text-[10px] uppercase tracking-[0.24em] text-violet-200/70">CreatorPulse</span><span className="block text-sm font-semibold">Creator Studio</span></span></Link><Link href="/" className="text-xs text-slate-400 sm:hidden">Home</Link></div>
        <nav aria-label="Creator tools" className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 text-xs text-slate-200 transition hover:border-violet-400 hover:text-violet-100"><Icon className="h-4 w-4" />{label}</Link>)}</nav>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
  </div>;
}
