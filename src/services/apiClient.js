import { STORAGE_KEYS } from "../lib/constants.js";

// URL base del backend. Configurable con VITE_API_BASE (.env); por defecto el back en 8080.
export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8080";

/** Error de API con el codigo HTTP y el mensaje devuelto por el backend. */
export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token);
}

/**
 * Wrapper unico sobre fetch para todas las llamadas al backend.
 * - Antepone API_BASE.
 * - Adjunta el JWT (Authorization: Bearer) si existe.
 * - Serializa/parsea JSON.
 * - Normaliza errores en ApiError (usa el campo `mensaje` del backend).
 */
export async function request(path, { method = "GET", body, auth = true, params } = {}) {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
      0,
      null
    );
  }

  // 204 No Content (delete, batch delete).
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.mensaje || data.message)) ||
      `Error ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, body, opts) =>
    request(path, { ...opts, method: "DELETE", body }),
};
