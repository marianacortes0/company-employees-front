import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, Users, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { Avatar } from "../ui/Feedback.jsx";
import Button from "../ui/Button.jsx";

// Indicador activo tipo "punto/subrayado" en rosa eléctrico bajo la etiqueta (Vivid Pulse).
const linkClass = ({ isActive }) =>
  `relative flex items-center gap-2 px-1 py-1.5 text-sm font-semibold transition-colors ${
    isActive
      ? "text-primary after:absolute after:-bottom-1 after:left-1/2 after:h-1 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-primary"
      : "text-plum-soft hover:text-primary"
  }`;

export default function Navbar() {
  const { user, roles, canReadCompanies, canReadEmployees, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Etiqueta de acceso: rol(es) o "Acceso por scopes" para admin Medellin/Bogota (sin rol).
  const accessLabel = roles.length > 0 ? roles.join(" · ") : "Acceso por scopes";

  return (
    <header className="sticky top-0 z-40 border-b border-rose-border bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-xl font-extrabold tracking-tight text-primary">
            Company<span className="text-tertiary">Employees</span>
          </span>
          <div className="flex gap-6">
            <NavLink to="/" end className={linkClass}>
              <LayoutDashboard size={16} /> Inicio
            </NavLink>
            {canReadCompanies && (
              <NavLink to="/companias" className={linkClass}>
                <Building2 size={16} /> Compañías
              </NavLink>
            )}
            {canReadEmployees && (
              <NavLink to="/empleados" className={linkClass}>
                <Users size={16} /> Empleados
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-plum">{user.nombre}</p>
              <p className="text-xs text-plum-soft">{accessLabel}</p>
            </div>
          )}
          {user && <Avatar name={user.nombre} size="sm" />}
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut size={14} /> Salir
          </Button>
        </div>
      </nav>
    </header>
  );
}
