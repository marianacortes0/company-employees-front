import Button from "./Button.jsx";

/** Controles de paginacion para PagedResponse { pagina, totalPaginas, total }. */
export default function Pagination({ page, onChange }) {
  if (!page) return null;
  const { pagina, totalPaginas, total } = page;

  return (
    <div className="flex items-center justify-between gap-3 pt-3 text-sm text-slate-500">
      <span>
        Página {pagina} de {totalPaginas || 1} · {total} registro(s)
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={pagina <= 1}
          onClick={() => onChange(pagina - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={pagina >= (totalPaginas || 1)}
          onClick={() => onChange(pagina + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
