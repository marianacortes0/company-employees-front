const ALERT_STYLES = {
  error: "bg-danger-soft text-danger border-danger/20",
  success: "bg-success-soft text-success border-success/20",
  info: "bg-secondary-soft text-primary border-rose-border",
};

/** Mensaje de estado (error/exito/info). */
export function Alert({ type = "info", children, onClose }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${ALERT_STYLES[type]}`}
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
    <div className="flex items-center justify-center gap-3 py-8 text-plum-soft">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-rose-border border-t-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Estado vacio. */
export function EmptyState({ children = "No hay datos para mostrar." }) {
  return <p className="py-8 text-center text-sm text-plum-soft/70">{children}</p>;
}

/** Etiqueta de estado tipo pildora (ACTIVE/INACTIVE u otros). */
export function Badge({ children, color = "rose" }) {
  const colors = {
    green: "bg-success-soft text-success",
    red: "bg-danger-soft text-danger",
    primary: "bg-primary text-white",
    rose: "bg-secondary-soft text-primary",
    slate: "bg-rose-line text-plum-soft",
  };
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-wide ${colors[color] ?? colors.rose}`}
    >
      {children}
    </span>
  );
}

/** Iniciales a partir de un texto (ej. "Ana Garcia" -> "AG"). */
export function initialsOf(text = "") {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Avatar circular con degradado magenta->rosa e iniciales blancas (sin fotos). */
export function Avatar({ name, size = "md", className = "" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-20 w-20 text-2xl",
  };
  return (
    <span
      className={`bg-avatar-gradient grid shrink-0 place-items-center rounded-full font-bold text-white shadow-pulse ${sizes[size]} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
