// Shimmer skeleton loaders matching the dark glass design

function Shimmer({ className = '', style = {} }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background: 'linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s linear infinite',
        ...style,
      }}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <Shimmer className="w-10 h-10 rounded-xl mb-4" />
      <Shimmer className="w-24 h-3 mb-2" />
      <Shimmer className="w-32 h-6 mb-2" />
      <Shimmer className="w-16 h-5 rounded-full" />
    </div>
  );
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3"
         style={{ borderBottom: '1px solid rgba(148,163,184,.05)' }}>
      <Shimmer className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1">
        <Shimmer className="w-32 h-3 mb-1.5" />
        <Shimmer className="w-20 h-2.5" />
      </div>
      <Shimmer className="w-16 h-4" />
    </div>
  );
}

export function ChartSkeleton({ height = 48 }) {
  return <Shimmer className="w-full rounded-xl" style={{ height }} />;
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="flex justify-between items-center">
        <div><Shimmer className="w-48 h-6 mb-2" /><Shimmer className="w-32 h-3" /></div>
        <Shimmer className="w-36 h-10 rounded-xl" />
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <MetricCardSkeleton key={i} />)}
      </div>
      {/* Charts */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 glass rounded-2xl p-5">
          <Shimmer className="w-40 h-4 mb-4" />
          <ChartSkeleton height={112} />
        </div>
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <Shimmer className="w-32 h-4 mb-4" />
          <ChartSkeleton height={112} />
        </div>
      </div>
      {/* Transactions */}
      <div className="glass rounded-2xl p-5">
        <Shimmer className="w-36 h-4 mb-4" />
        {[0,1,2,3,4].map(i => <TransactionRowSkeleton key={i} />)}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="glass rounded-2xl p-5">
      <Shimmer className="w-40 h-4 mb-5" />
      {Array.from({ length: rows }).map((_, i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function BudgetCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <Shimmer className="w-9 h-9 rounded-xl" />
        <div><Shimmer className="w-24 h-4 mb-1.5" /><Shimmer className="w-32 h-3" /></div>
      </div>
      <Shimmer className="w-full h-2.5 rounded-full mb-2" />
      <Shimmer className="w-3/4 h-8 rounded-xl" />
    </div>
  );
}

// Inject shimmer keyframe once
const style = document.createElement('style');
style.textContent = '@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}';
document.head.appendChild(style);
