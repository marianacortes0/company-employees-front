import { api } from "./apiClient.js";

/**
 * Servicio de empleados. Mapea /api/empleados (EmployeeController).
 */
export const employeeService = {
  // GET /api/empleados  -> PagedResponse<EmployeeApiResponse>
  getAll({ pagina, tamano, orden, dir, buscar } = {}) {
    return api.get("/api/empleados", {
      params: { pagina, tamano, orden, dir, buscar },
    });
  },

  // HEAD /api/empleados  -> X-Total-Count (total de empleados)
  count() {
    return api.count("/api/empleados");
  },

  // OPTIONS /api/empleados  -> verbos permitidos para ESTE usuario (segun scopes)
  allowedMethods() {
    return api.options("/api/empleados");
  },

  // GET /api/empleados/opciones  -> List<OptionApiResponse> { label, value }
  getOptions() {
    return api.get("/api/empleados/opciones");
  },

  // GET /api/empleados/{id}  -> EmployeeApiResponse
  getById(id) {
    return api.get(`/api/empleados/${id}`);
  },

  // POST /api/empleados  (SCOPE empleado:crear)  -> EmployeeApiResponse
  create({ nombre, apellido, correo, cargo, salario, companiaId }) {
    return api.post("/api/empleados", {
      nombre,
      apellido,
      correo,
      cargo,
      salario,
      companiaId,
    });
  },

  // POST /api/empleados/lote  (SCOPE empleado:crear)  -> List<EmployeeApiResponse>
  createBatch(empleados) {
    return api.post("/api/empleados/lote", { empleados });
  },

  // PUT /api/empleados/{id}  (SCOPE empleado:actualizar)  -> EmployeeApiResponse
  update(id, { nombre, apellido, correo, cargo, salario, status }) {
    return api.put(`/api/empleados/${id}`, {
      nombre,
      apellido,
      correo,
      cargo,
      salario,
      status,
    });
  },

  // PATCH /api/empleados/{id}  (SCOPE empleado:actualizar) -> EmployeeApiResponse
  // Actualizacion parcial: solo se envian los campos presentes.
  patch(id, partial) {
    return api.patch(`/api/empleados/${id}`, partial);
  },

  // DELETE /api/empleados/{id}  (SCOPE empleado:eliminar)  -> 204
  remove(id) {
    return api.del(`/api/empleados/${id}`);
  },

  // DELETE /api/empleados/lote  (SCOPE empleado:eliminar)  -> 204
  removeBatch(ids) {
    return api.del("/api/empleados/lote", { ids });
  },
};
