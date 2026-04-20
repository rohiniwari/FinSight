import { cn } from '../../utils/cn.js';

/**
 * Dialog — modal overlay wrapper (ShadCN-style API)
 * Usage:
 *   <Dialog open={open} onClose={() => setOpen(false)}>
 *     <DialogContent>
 *       <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
 *       ...body...
 *     </DialogContent>
 *   </Dialog>
 */
export function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      {children}
    </div>
  );
}

export function DialogContent({ children, className = '' }) {
  return (
    <div
      className={cn('glass rounded-2xl p-6 w-full max-w-md animate-slide-up', className)}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '' }) {
  return (
    <h2 className={cn('font-display font-bold text-xl text-white', className)}>
      {children}
    </h2>
  );
}

export function DialogClose({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white transition-colors"
      style={{ background: 'rgba(255,255,255,.05)' }}
    >✕</button>
  );
}
