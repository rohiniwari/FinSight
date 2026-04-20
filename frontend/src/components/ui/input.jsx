import { cn } from '../../utils/cn.js';

export function Input({ className = '', type = 'text', label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn('fs-input', error && 'border-rose-500/50', className)}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400 font-semibold">{error}</p>
      )}
    </div>
  );
}

export function Select({ className = '', label, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={cn('fs-input', error && 'border-rose-500/50', className)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-xs text-rose-400 font-semibold">{error}</p>
      )}
    </div>
  );
}

export function Textarea({ className = '', label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={cn('fs-input resize-none', error && 'border-rose-500/50', className)}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-400 font-semibold">{error}</p>
      )}
    </div>
  );
}
