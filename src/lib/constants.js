// Constantes alineadas con el backend (planeacionII.md).

// Roles del dominio (Role.java).
export const ROLES = {
  ADMIN: "ADMIN",
  USUARIO: "USUARIO",
};

// Estado del empleado (EmployeeStatus.java).
export const EMPLOYEE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

// Campos permitidos para ordenar empleados (PageCriteria.ALLOWED_SORT_FIELDS).
export const EMPLOYEE_SORT_FIELDS = [
  "nombre",
  "apellido",
  "correo",
  "salario",
  "cargo",
  "status",
];

// Defaults de paginacion (PageCriteria).
export const PAGINATION_DEFAULTS = {
  pagina: 1,
  tamano: 10,
  orden: "apellido",
  dir: "asc",
};

// Claves de localStorage.
export const STORAGE_KEYS = {
  token: "token",
  usuario: "usuario",
};
