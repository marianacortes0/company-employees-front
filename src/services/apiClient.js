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

/**
 * Variante de `request` que devuelve la respuesta cruda (status + headers) en vez del
 * cuerpo. Necesaria para verbos cuya informacion viaja en cabeceras: HEAD (X-Total-Count)
 * y OPTIONS (Allow). No lanza ApiError salvo problemas de red.
 */
export async function requestRaw(path, { method = "GET", auth = true } = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(url, { method, headers });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. ¿Está corriendo el backend?",
      0,
      null
    );
  }
  return res;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  del: (path, body, opts) =>
    request(path, { ...opts, method: "DELETE", body }),

  // OPTIONS -> cabecera Allow: verbos que el usuario puede usar sobre el recurso
  // segun sus scopes (AllowedMethodsResolver del backend).
  async options(path, opts) {
    const res = await requestRaw(path, { ...opts, method: "OPTIONS" });
    const allow = res.headers.get("Allow") || "";
    return allow.split(",").map((m) => m.trim()).filter(Boolean);
  },

  // HEAD -> cabecera X-Total-Count: total de elementos sin traer el cuerpo.
  async count(path, opts) {
    const res = await requestRaw(path, { ...opts, method: "HEAD" });
    const total = res.headers.get("X-Total-Count");
    return total != null ? Number(total) : null;
  },
};
