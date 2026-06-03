import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

/**
 * Protege rutas. Exige sesion y, opcionalmente:
 *   - requireScope: uno o varios scopes (string | string[]); se exigen TODOS.
 *   - requireAdmin: rol ADMIN (atajo legado).
 * Redirige a /login si no hay sesion, o a "/" si falta autorizacion.
 */
export default function ProtectedRoute({ children, requireAdmin = false, requireScope }) {
  const { isAuthenticated, isAdmin, hasScope } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  if (requireScope) {
    const needed = Array.isArray(requireScope) ? requireScope : [requireScope];
    if (!needed.every(hasScope)) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}
