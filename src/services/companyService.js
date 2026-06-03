import { api } from "./apiClient.js";

/**
 * Servicio de companias. Mapea /api/companias (CompanyController).
 */
export const companyService = {
  // GET /api/companias  -> List<CompanyApiResponse>
  getAll() {
    return api.get("/api/companias");
  },

  // HEAD /api/companias  -> X-Total-Count (total de companias)
  count() {
    return api.count("/api/companias");
  },

  // OPTIONS /api/companias  -> verbos permitidos para ESTE usuario (segun scopes)
  allowedMethods() {
    return api.options("/api/companias");
  },

  // GET /api/companias/opciones  -> List<OptionApiResponse> { label, value }
  getOptions() {
    return api.get("/api/companias/opciones");
  },

  // GET /api/companias/{id}  -> CompanyApiResponse
  getById(id) {
    return api.get(`/api/companias/${id}`);
  },

  // POST /api/companias  (SCOPE compania:crear)  -> CompanyApiResponse
  create({ nombre, direccion, telefono }) {
    return api.post("/api/companias", { nombre, direccion, telefono });
  },

  // POST /api/companias/lote  (SCOPE compania:crear)  -> List<CompanyApiResponse>
  createBatch(companias) {
    return api.post("/api/companias/lote", { companias });
  },

  // PUT /api/companias/{id}  (SCOPE compania:actualizar)  -> CompanyApiResponse
  update(id, { nombre, direccion, telefono }) {
    return api.put(`/api/companias/${id}`, { nombre, direccion, telefono });
  },

  // PATCH /api/companias/{id}  (SCOPE compania:actualizar)  -> CompanyApiResponse
  // Actualizacion parcial: solo se envian los campos presentes.
  patch(id, partial) {
    return api.patch(`/api/companias/${id}`, partial);
  },

  // DELETE /api/companias/{id}  (SCOPE compania:eliminar)  -> 204
  remove(id) {
    return api.del(`/api/companias/${id}`);
  },

  // GET /api/companias/{id}/empleados  -> PagedResponse<EmployeeApiResponse>
  getEmployees(id, { pagina, tamano, orden, dir, buscar } = {}) {
    return api.get(`/api/companias/${id}/empleados`, {
      params: { pagina, tamano, orden, dir, buscar },
    });
  },

  // POST /api/companias/con-empleados  (SCOPE compania:crear)  -> CompanyWithEmployeesApiResponse
  createWithEmployees({ nombre, direccion, telefono, empleados }) {
    return api.post("/api/companias/con-empleados", {
      nombre,
      direccion,
      telefono,
      empleados,
    });
  },
};
