const baseControl =
  "w-full rounded-full border border-rose-border bg-card px-4 py-2.5 text-sm text-plum placeholder:text-plum-soft/50 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:bg-rose-line/40";

/** Input con label integrado. */
export function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="px-1 text-xs font-bold uppercase tracking-wide text-plum-soft">
          {label}
        </label>
      )}
      <input id={id} className={baseControl} {...props} />
      {error && <span className="px-1 text-xs text-danger">{error}</span>}
    </div>
  );
}

/** Select con label integrado. `options` = [{ value, label }]. */
export function Select({ label, id, options = [], className = "", children, ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="px-1 text-xs font-bold uppercase tracking-wide text-plum-soft">
          {label}
        </label>
      )}
      <select id={id} className={baseControl} {...props}>
        {children}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
