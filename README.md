# Front - Company Employees

SPA en **React + Vite + Tailwind CSS v4** con arquitectura en capas. Consume el
backend (`http://localhost:8080`) sin tocar el back: cada endpoint está mapeado
en la capa de servicios.

## Requisitos
- Node.js 18+ y npm.
- Backend corriendo en `http://localhost:8080` (CORS ya habilitado en `SecurityConfig`).

## Ejecutar
```bash
cd front
npm install
npm run dev      # http://localhost:5173 (puerto distinto al backend)
npm run build    # build de produccion en dist/
npm run preview  # sirve el build
```
La URL del backend se configura con `VITE_API_BASE` en un `.env` (por defecto `http://localhost:8080`).

## Arquitectura en capas

```
src/
  services/        # 1 metodo por endpoint del backend
    apiClient.js       fetch + JWT + manejo de errores (ApiError)
    authService.js     /api/auth      (registro, login, perfil)
    companyService.js  /api/companias (CRUD, lote, con-empleados, empleados, opciones, OPTIONS, HEAD)
    employeeService.js /api/empleados (CRUD, lote, patch, borrado por lote, opciones, OPTIONS, HEAD)
  hooks/           # logica de estado reutilizable
    useAuth.js         estado de sesion (sobre AuthContext)
    useCompanies.js    lista + CRUD de companias
    useEmployees.js    listado paginado + CRUD de empleados
    useAsync.js        helper loading/error/data
  context/
    AuthContext.jsx    sesion (token + usuario) persistida en localStorage
  components/      # UI reutilizable
    ui/                Button, Field, Card, Modal, Pagination, Feedback
    layout/            Navbar, Layout, ProtectedRoute
    companies/         CompanyForm, CompanyWithEmployeesForm
    employees/         EmployeeForm, EmployeeTable, ManageEmployeeById
  pages/           # vistas enrutadas
    LoginPage, RegisterPage, DashboardPage,
    CompaniesPage, CompanyDetailPage, EmployeesPage
  App.jsx          # rutas (react-router-dom)
  main.jsx         # entry (Router + AuthProvider)
```

## Endpoints conectados (capa services)

**Auth** — `POST /registro`, `POST /login`, `GET /perfil`
**Compañías** — `GET /`, `HEAD /`, `OPTIONS /`, `GET /opciones`, `GET /{id}`,
`POST /`, `POST /lote`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`,
`GET /{id}/empleados`, `POST /con-empleados`
**Empleados** — `GET /` (paginado), `HEAD /`, `OPTIONS /`, `GET /opciones`,
`GET /{id}`, `POST /`, `POST /lote`, `PUT /{id}`, `PATCH /{id}`,
`DELETE /{id}`, `DELETE /lote`

> Nota: `EmployeeApiResponse` del backend no incluye el `id`, por eso las
> operaciones por id (ver/editar/patch/eliminar) se hacen desde el panel
> "Gestionar empleado por ID" en la página de Empleados.

## Autorización por scope (no por rol)

El backend autoriza **por scope y de forma global** (`@PreAuthorize('SCOPE_<recurso>:<acción>')`),
no por nombre de rol. Los administradores de **Medellín** y **Bogotá** se siembran con
scopes asignados **directamente** (sin rol `ADMIN`). El front replica esta lógica: la UI
muestra/oculta cada acción según `scopes` del perfil (`useAuth().hasScope` / `can(recurso, acción)`),
de modo que solo aparece lo que el backend permitirá.

| Usuario (seed) | Scopes | Puede en la UI |
|---|---|---|
| **USUARIO** (`usuario@company.local`) | `empleado:leer` | Solo ver empleados. Sin acceso a Compañías |
| **Admin Bogotá** (`admin@company.local`) | `empleado` y `compania`: `leer/crear/actualizar` | Listar, crear y **editar** (PUT/PATCH). **No** elimina |
| **Admin Medellín** (`admin.medellin@company.local`) | `empleado` y `compania`: `leer/crear/eliminar` | Listar, crear y **eliminar** (DELETE/lote). **No** edita |
| **ADMIN** (rol completo) | todos | Todo |

- **Rutas** (`ProtectedRoute requireScope`): `/companias` exige `compania:leer`, `/empleados` exige `empleado:leer`.
- **Registro**: el endpoint público **siempre** crea un `USUARIO` (ignora roles del cliente) y
  exige `companiaId`. Como listar compañías requiere sesión, en `RegisterPage` el `companiaId`
  se ingresa manualmente (lo provee un administrador).

## Uso
1. Inicia sesión con un usuario semilla (ver tabla) o regístrate como `USUARIO` (requiere `companiaId`).
2. El token JWT se guarda en `localStorage` y se adjunta a cada petición.
3. La barra de navegación y los botones de acción se adaptan a tus scopes.
4. El Dashboard muestra tus permisos efectivos en la tarjeta **"Mis permisos (scopes)"**.
