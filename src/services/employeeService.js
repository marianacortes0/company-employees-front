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

  // GET /api/empleados/{id}  -> EmployeeApiResponse
  getById(id) {
    return api.get(`/api/empleados/${id}`);
  },

  // POST /api/empleados  (ADMIN|USUARIO)  -> EmployeeApiResponse
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

  // POST /api/empleados/lote  (ADMIN|USUARIO)  -> List<EmployeeApiResponse>
  createBatch(empleados) {
    return api.post("/api/empleados/lote", { empleados });
  },

  // PUT /api/empleados/{id}  (ADMIN|owner)  -> EmployeeApiResponse
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

  // PATCH /api/empleados/{id}  (ADMIN|owner) -> EmployeeApiResponse
  // Actualizacion parcial: solo se envian los campos presentes.
  patch(id, partial) {
    return api.patch(`/api/empleados/${id}`, partial);
  },

  // DELETE /api/empleados/{id}  (ADMIN|owner)  -> 204
  remove(id) {
    return api.del(`/api/empleados/${id}`);
  },

  // DELETE /api/empleados/lote  (ADMIN|owner)  -> 204
  removeBatch(ids) {
    return api.del("/api/empleados/lote", { ids });
  },
};
