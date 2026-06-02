import { useCallback, useEffect, useState } from "react";
import { companyService } from "../services/companyService.js";

/**
 * Estado y operaciones sobre la lista de companias.
 * Cubre GET /api/companias + create/update/delete y refresca la lista.
 */
export function useCompanies({ autoLoad = true } = {}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getAll();
      setCompanies(data ?? []);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (payload) => {
      const created = await companyService.create(payload);
      await load();
      return created;
    },
    [load]
  );

  const update = useCallback(
    async (id, payload) => {
      const updated = await companyService.update(id, payload);
      await load();
      return updated;
    },
    [load]
  );

  const remove = useCallback(
    async (id) => {
      await companyService.remove(id);
      await load();
    },
    [load]
  );

  const createWithEmployees = useCallback(
    async (payload) => {
      const result = await companyService.createWithEmployees(payload);
      await load();
      return result;
    },
    [load]
  );

  useEffect(() => {
    if (autoLoad) load().catch(() => {});
  }, [autoLoad, load]);

  return {
    companies,
    loading,
    error,
    load,
    create,
    update,
    remove,
    createWithEmployees,
  };
}
