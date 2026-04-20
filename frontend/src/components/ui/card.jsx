import { cn } from '../../utils/cn.js';

export function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div
      className={cn('glass rounded-2xl', glow && 'card-glow', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('px-5 pt-5 pb-0', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('font-display font-bold text-base text-white', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={cn('text-xs text-slate-500 mt-0.5', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('px-5 pb-5 pt-0 flex items-center', className)}>
      {children}
    </div>
  );
}
