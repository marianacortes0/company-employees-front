import { useCallback, useState } from "react";

/**
 * Envuelve una operacion async exponiendo loading / error / data.
 * `run` ejecuta la funcion y propaga el resultado (o lanza para que el caller decida).
 */
export function useAsync(initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (promiseFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promiseFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, setData, loading, error, setError, run, reset };
}
