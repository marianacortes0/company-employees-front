const VARIANTS = {
  // Primario: degradado rosa eléctrico, texto blanco, hover "bouncy".
  primary:
    "bg-brand-gradient text-white shadow-pulse hover:scale-[1.04] disabled:opacity-50 disabled:hover:scale-100",
  // Secundario: superficie rosa suave con texto ciruela.
  secondary:
    "bg-secondary-soft text-primary hover:bg-secondary/40 disabled:opacity-50",
  danger:
    "bg-danger text-white hover:scale-[1.04] disabled:opacity-50 disabled:hover:scale-100",
  ghost: "bg-transparent text-plum-soft hover:bg-rose-line disabled:opacity-50",
};

const SIZES = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
