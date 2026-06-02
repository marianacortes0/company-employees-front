import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Badge } from "../ui/Feedback.jsx";
import Button from "../ui/Button.jsx";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-blue-700">Company Employees</span>
          <div className="flex gap-1">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/companias" className={linkClass}>
              Compañías
            </NavLink>
            <NavLink to="/empleados" className={linkClass}>
              Empleados
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">{user.nombre}</p>
              <p className="text-xs text-slate-400">{user.correo}</p>
            </div>
          )}
          {user && <Badge color={isAdmin ? "blue" : "slate"}>{user.role}</Badge>}
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Salir
          </Button>
        </div>
      </nav>
    </header>
  );
}
