import { cn } from '../../utils/cn.js';

/**
 * Tabs — ShadCN-style tab switcher
 * Usage:
 *   <Tabs value={tab} onValueChange={setTab}>
 *     <TabsList>
 *       <TabsTrigger value="weekly">This Week</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="weekly">…</TabsContent>
 *   </Tabs>
 */
export function Tabs({ value, onValueChange, children, className = '' }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}
         data-current={value}
         onChange={onValueChange}>
      {typeof children === 'function' ? children(value, onValueChange) : children}
    </div>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={cn('flex p-1 rounded-xl glass gap-1', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, currentValue, onSelect, children, className = '' }) {
  const active = value === currentValue;
  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(value)}
      className={cn(
        'px-4 py-2 rounded-lg text-xs font-display font-bold transition-all',
        active ? 'text-white' : 'text-slate-500 hover:text-slate-300',
        className,
      )}
      style={active ? { background:'linear-gradient(135deg,#6366f1,#22d3ee)' } : {}}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, currentValue, children }) {
  if (value !== currentValue) return null;
  return <div>{children}</div>;
}
