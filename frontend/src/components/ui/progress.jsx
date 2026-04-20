import { cn }              from '../../utils/cn.js';
import { getBudgetColor }  from '../../utils/formatters.js';

export function Progress({ value = 0, max = 100, className = '', colorByValue = false }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const color = colorByValue ? getBudgetColor(pct) : '#6366f1';
  const bg =
    pct >= 100 ? 'linear-gradient(90deg,#f43f5e,#f59e0b)' :
    pct >= 80  ? 'linear-gradient(90deg,#f59e0b,#f43f5e)' :
                 'linear-gradient(90deg,#10b981,#22d3ee)';

  return (
    <div
      className={cn('h-2.5 rounded-full overflow-hidden', className)}
      style={{ background: 'rgba(255,255,255,.07)' }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: colorByValue ? bg : color }}
      />
    </div>
  );
}
