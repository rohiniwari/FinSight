import { cn } from '../../utils/cn.js';

const variants = {
  income:  { bg: 'rgba(16,185,129,.12)',  color: '#10b981', border: 'rgba(16,185,129,.22)' },
  expense: { bg: 'rgba(244,63,94,.12)',   color: '#f43f5e', border: 'rgba(244,63,94,.22)'  },
  warning: { bg: 'rgba(245,158,11,.12)',  color: '#f59e0b', border: 'rgba(245,158,11,.22)' },
  info:    { bg: 'rgba(34,211,238,.10)',  color: '#22d3ee', border: 'rgba(34,211,238,.20)' },
  purple:  { bg: 'rgba(99,102,241,.12)',  color: '#6366f1', border: 'rgba(99,102,241,.22)' },
  neutral: { bg: 'rgba(148,163,184,.08)', color: '#94a3b8', border: 'rgba(148,163,184,.16)'},
};

export function Badge({ children, variant = 'neutral', className = '' }) {
  const v = variants[variant] || variants.neutral;
  return (
    <span
      className={cn('inline-block text-xs font-bold px-2.5 py-0.5 rounded-full capitalize', className)}
      style={{ background: v.bg, color: v.color, border: `1px solid ${v.border}` }}
    >
      {children}
    </span>
  );
}
