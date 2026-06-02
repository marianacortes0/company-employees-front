const ALERT_STYLES = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

/** Mensaje de estado (error/exito/info). */
export function Alert({ type = "info", children, onClose }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm ${ALERT_STYLES[type]}`}
    >
      <span>{children}</span>
      {onClose && (
        <button onClick={onClose} className="shrink-0 font-bold opacity-60 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
}

/** Spinner centrado para estados de carga. */
export function Spinner({ label = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-500">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Estado vacio. */
export function EmptyState({ children = "No hay datos para mostrar." }) {
  return (
    <p className="py-8 text-center text-sm text-slate-400">{children}</p>
  );
}

/** Etiqueta de estado (ACTIVE/INACTIVE u otros). */
export function Badge({ children, color = "slate" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  );
}
