import { api } from "./apiClient.js";

/**
 * Servicio de companias. Mapea /api/companias (CompanyController).
 */
export const companyService = {
  // GET /api/companias  -> List<CompanyApiResponse>
  getAll() {
    return api.get("/api/companias");
  },

  // GET /api/companias/{id}  -> CompanyApiResponse
  getById(id) {
    return api.get(`/api/companias/${id}`);
  },

  // POST /api/companias  (ADMIN|USUARIO)  -> CompanyApiResponse
  create({ nombre, direccion, telefono }) {
    return api.post("/api/companias", { nombre, direccion, telefono });
  },

  // POST /api/companias/lote  (ADMIN|USUARIO)  -> List<CompanyApiResponse>
  createBatch(companias) {
    return api.post("/api/companias/lote", { companias });
  },

  // PUT /api/companias/{id}  (ADMIN|USUARIO)  -> CompanyApiResponse
  update(id, { nombre, direccion, telefono }) {
    return api.put(`/api/companias/${id}`, { nombre, direccion, telefono });
  },

  // DELETE /api/companias/{id}  (ADMIN)  -> 204
  remove(id) {
    return api.del(`/api/companias/${id}`);
  },

  // GET /api/companias/{id}/empleados  -> PagedResponse<EmployeeApiResponse>
  getEmployees(id, { pagina, tamano, orden, dir, buscar } = {}) {
    return api.get(`/api/companias/${id}/empleados`, {
      params: { pagina, tamano, orden, dir, buscar },
    });
  },

  // POST /api/companias/con-empleados  (ADMIN)  -> CompanyWithEmployeesApiResponse
  createWithEmployees({ nombre, direccion, telefono, empleados }) {
    return api.post("/api/companias/con-empleados", {
      nombre,
      direccion,
      telefono,
      empleados,
    });
  },
};
