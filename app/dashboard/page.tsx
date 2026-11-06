import Link from 'next/link';
import { ArrowLeft, BarChart3, MessageSquareText, PenTool, Zap } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: BarChart3 },
    { href: '/dashboard/chat', label: 'Copilot Chat', icon: MessageSquareText },
    { href: '/dashboard/script', label: 'Script Generator', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-slate-200 transition hover:text-violet-200">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back home</span>
            </Link>
            <div className="h-6 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-violet-200/70">CreatorPulse</p>
                <p className="text-sm font-semibold text-white">AI Studio</p>
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400 hover:text-violet-200"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
    </div>
  );
}
