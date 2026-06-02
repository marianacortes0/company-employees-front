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
    companyService.js  /api/companias (CRUD, lote, con-empleados, empleados)
    employeeService.js /api/empleados (CRUD, lote, patch, borrado por lote)
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
**Compañías** — `GET /`, `GET /{id}`, `POST /`, `POST /lote`, `PUT /{id}`,
`DELETE /{id}`, `GET /{id}/empleados`, `POST /con-empleados`
**Empleados** — `GET /` (paginado), `GET /{id}`, `POST /`, `POST /lote`,
`PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `DELETE /lote`

> Nota: `EmployeeApiResponse` del backend no incluye el `id`, por eso las
> operaciones por id (ver/editar/patch/eliminar) se hacen desde el panel
> "Gestionar empleado por ID" en la página de Empleados.

## Uso
1. Regístrate o inicia sesión (seed dev típico: `admin@company.local` / `Admin123!`).
2. El token JWT se guarda en `localStorage` y se adjunta a cada petición.
3. Navega entre Inicio, Compañías y Empleados.
