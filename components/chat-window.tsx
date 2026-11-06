import { cn } from '@/lib/utils';
import * as React from 'react';

export function Button({
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' ? 'bg-violet-600 text-white hover:bg-violet-500' : 'border border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800',
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-3xl border border-slate-800 bg-slate-900/80 shadow-glow', className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-400', className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn('w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white', className)} {...props} />;
}
