export default function Card({ title, actions, className = "", children }) {
  return (
    <section
      className={`rounded-[1.5rem] border border-rose-border bg-card shadow-pulse ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-2 border-b border-rose-line px-6 py-4">
          {title && (
            <h2 className="text-lg font-bold tracking-tight text-plum">{title}</h2>
          )}
          {actions}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
