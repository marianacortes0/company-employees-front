import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import CompaniesPage from "./pages/CompaniesPage.jsx";
import CompanyDetailPage from "./pages/CompanyDetailPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import { SCOPES } from "./lib/constants.js";

export default function App() {
  return (
    <Routes>
      {/* Rutas publicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Rutas protegidas (requieren sesion) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        {/* Acceso a cada modulo segun el scope de lectura (igual que el backend). */}
        <Route
          path="/companias"
          element={
            <ProtectedRoute requireScope={SCOPES.COMPANIA_LEER}>
              <CompaniesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/companias/:id"
          element={
            <ProtectedRoute requireScope={SCOPES.COMPANIA_LEER}>
              <CompanyDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados"
          element={
            <ProtectedRoute requireScope={SCOPES.EMPLEADO_LEER}>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
