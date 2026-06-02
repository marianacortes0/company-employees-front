import { useCallback, useEffect, useState } from "react";
import { employeeService } from "../services/employeeService.js";
import { companyService } from "../services/companyService.js";
import { PAGINATION_DEFAULTS } from "../lib/constants.js";

/**
 * Estado y operaciones sobre el listado paginado de empleados.
 * - Si se pasa `companyId`, usa GET /api/companias/{id}/empleados.
 * - Si no, usa GET /api/empleados.
 * Mantiene los criterios de paginacion/orden/busqueda y expone el CRUD.
 */
export function useEmployees({ companyId = null, autoLoad = true } = {}) {
  const [page, setPage] = useState(null); // PagedResponse completo
  const [criteria, setCriteria] = useState(PAGINATION_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (overrides = {}) => {
      const params = { ...criteria, ...overrides };
      setLoading(true);
      setError(null);
      try {
        const data = companyId
          ? await companyService.getEmployees(companyId, params)
          : await employeeService.getAll(params);
        setPage(data);
        return data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [companyId, criteria]
  );

  // Cambia un criterio (pagina, tamano, orden, dir, buscar) y recarga.
  const setCriterion = useCallback((patch) => {
    setCriteria((prev) => ({ ...prev, ...patch }));
  }, []);

  const create = useCallback(
    async (payload) => {
      const created = await employeeService.create(payload);
      await load();
      return created;
    },
    [load]
  );

  const update = useCallback(
    async (id, payload) => {
      const updated = await employeeService.update(id, payload);
      await load();
      return updated;
    },
    [load]
  );

  const patch = useCallback(
    async (id, partial) => {
      const patched = await employeeService.patch(id, partial);
      await load();
      return patched;
    },
    [load]
  );

  const remove = useCallback(
    async (id) => {
      await employeeService.remove(id);
      await load();
    },
    [load]
  );

  const removeBatch = useCallback(
    async (ids) => {
      await employeeService.removeBatch(ids);
      await load();
    },
    [load]
  );

  // Recarga cuando cambian los criterios (incluye carga inicial).
  useEffect(() => {
    if (autoLoad) load().catch(() => {});
  }, [autoLoad, load]);

  return {
    page,
    employees: page?.datos ?? [],
    criteria,
    loading,
    error,
    load,
    setCriterion,
    create,
    update,
    patch,
    remove,
    removeBatch,
  };
}
