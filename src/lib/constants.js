// Constantes alineadas con el backend (planeacionII.md).

// Roles del dominio (Role.java).
export const ROLES = {
  ADMIN: "ADMIN",
  USUARIO: "USUARIO",
};

// Recursos y acciones del catalogo de permisos del backend (DataInitializer.ALL_SCOPES).
// La autorizacion del backend es por SCOPE y global (no por rol): cada @PreAuthorize
// exige hasAuthority('SCOPE_<recurso>:<accion>'). El front replica esta logica para
// mostrar/ocultar acciones de forma coherente con lo que el backend permitira.
export const RESOURCES = {
  EMPLEADO: "empleado",
  COMPANIA: "compania",
};

export const ACTIONS = {
  LEER: "leer",
  CREAR: "crear",
  ACTUALIZAR: "actualizar",
  ELIMINAR: "eliminar",
};

/** Construye el scope tal como lo emite el backend en /api/auth/perfil (sin prefijo SCOPE_). */
export const scope = (resource, action) => `${resource}:${action}`;

// Catalogo completo de scopes (debe coincidir con DataInitializer.ALL_SCOPES).
export const SCOPES = {
  EMPLEADO_LEER: scope(RESOURCES.EMPLEADO, ACTIONS.LEER),
  EMPLEADO_CREAR: scope(RESOURCES.EMPLEADO, ACTIONS.CREAR),
  EMPLEADO_ACTUALIZAR: scope(RESOURCES.EMPLEADO, ACTIONS.ACTUALIZAR),
  EMPLEADO_ELIMINAR: scope(RESOURCES.EMPLEADO, ACTIONS.ELIMINAR),
  COMPANIA_LEER: scope(RESOURCES.COMPANIA, ACTIONS.LEER),
  COMPANIA_CREAR: scope(RESOURCES.COMPANIA, ACTIONS.CREAR),
  COMPANIA_ACTUALIZAR: scope(RESOURCES.COMPANIA, ACTIONS.ACTUALIZAR),
  COMPANIA_ELIMINAR: scope(RESOURCES.COMPANIA, ACTIONS.ELIMINAR),
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
