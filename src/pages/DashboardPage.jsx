import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useCompanies } from "../hooks/useCompanies.js";
import { useEmployees } from "../hooks/useEmployees.js";
import Card from "../components/ui/Card.jsx";
import { Badge, Spinner } from "../components/ui/Feedback.jsx";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { companies, loading: loadingCompanies } = useCompanies();
  const { page, loading: loadingEmployees } = useEmployees({});

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hola, {user?.nombre} 👋</h1>
        <p className="text-sm text-slate-500">Resumen general del sistema.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card title="Compañías">
          {loadingCompanies ? (
            <Spinner label="" />
          ) : (
            <p className="text-3xl font-bold text-blue-700">{companies.length}</p>
          )}
          <Link to="/companias" className="text-sm text-blue-600 hover:underline">
            Ver compañías →
          </Link>
        </Card>

        <Card title="Empleados">
          {loadingEmployees ? (
            <Spinner label="" />
          ) : (
            <p className="text-3xl font-bold text-blue-700">{page?.total ?? 0}</p>
          )}
          <Link to="/empleados" className="text-sm text-blue-600 hover:underline">
            Ver empleados →
          </Link>
        </Card>

        <Card title="Mi cuenta">
          <p className="text-sm text-slate-600">{user?.correo}</p>
          <div className="mt-2">
            <Badge color={isAdmin ? "blue" : "slate"}>{user?.role}</Badge>
          </div>
          {user?.companiaId && (
            <p className="mt-2 text-xs text-slate-400">Compañía: {user.companiaId}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
