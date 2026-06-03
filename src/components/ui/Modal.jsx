/** Modal simple controlado por `open`. Fondo con glassmorphism (Vivid Pulse). */
export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div
      className="glass fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[1.5rem] border border-rose-border bg-card shadow-pulse-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-rose-line px-6 py-4">
          <h3 className="text-lg font-bold tracking-tight text-plum">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-xl leading-none text-plum-soft transition-colors hover:bg-rose-line hover:text-primary"
          >
            ×
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-rose-line px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
