import { cn } from '../../utils/cn.js';

const variants = {
  primary:  'btn-pri text-white rounded-xl',
  outline:  'btn-out text-white rounded-xl',
  danger:   'btn-danger rounded-xl',
  ghost:    'bg-transparent text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors',
  link:     'bg-transparent text-cyan-400 hover:underline p-0 h-auto',
};

const sizes = {
  sm:   'px-3 py-1.5 text-xs',
  md:   'px-4 py-2.5 text-sm',
  lg:   'px-6 py-3 text-base',
  icon: 'w-8 h-8 p-0 flex items-center justify-center',
};

export function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  className = '',
  disabled  = false,
  loading   = false,
  type      = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'font-display font-bold transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading
        ? <span className="animate-pulse">Loading…</span>
        : children}
    </button>
  );
}
