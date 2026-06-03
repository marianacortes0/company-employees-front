import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { companyService } from "../services/companyService.js";
import { employeeService } from "../services/employeeService.js";
import Card from "../components/ui/Card.jsx";
import { Avatar, Badge, EmptyState, Spinner } from "../components/ui/Feedback.jsx";

function StatCard({ icon: Icon, label, value, loading, to, linkLabel }) {
  return (
    <div className="rounded-[1.5rem] border border-rose-border bg-card p-5 shadow-pulse">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-plum-soft">{label}</p>
        <span className="bg-secondary-soft grid h-9 w-9 place-items-center rounded-full text-primary">
          <Icon size={18} />
        </span>
      </div>
      {loading ? (
        <Spinner label="" />
      ) : (
        <p className="mt-3 text-4xl font-extrabold tracking-tight text-primary">{value}</p>
      )}
      {to && (
        <Link to={to} className="mt-2 inline-block text-sm font-semibold text-tertiary hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user, roles, scopes, canReadCompanies, canReadEmployees } = useAuth();

  const [counts, setCounts] = useState({ companias: null, empleados: null });
  const [allowed, setAllowed] = useState({ compania: [], empleado: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const tasks = [];
    if (canReadCompanies) {
      tasks.push(
        companyService.count().then((n) => alive && setCounts((c) => ({ ...c, companias: n })))
      );
    }
    if (canReadEmployees) {
      tasks.push(
        employeeService.count().then((n) => alive && setCounts((c) => ({ ...c, empleados: n })))
      );
    }
    tasks.push(
      companyService.allowedMethods().then((m) => alive && setAllowed((a) => ({ ...a, compania: m })))
    );
    tasks.push(
      employeeService.allowedMethods().then((m) => alive && setAllowed((a) => ({ ...a, empleado: m })))
    );
    Promise.allSettled(tasks).finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [canReadCompanies, canReadEmployees]);

  const accessLabel = roles.length > 0 ? roles.join(" · ") : "Acceso por scopes";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-plum">
          ¡Hola, {user?.nombre}! <span className="align-middle">👋</span>
        </h1>
        <p className="mt-1 text-base font-medium text-plum-soft">
          Esto es lo que ocurre en tu organización hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {canReadCompanies && (
          <StatCard
            icon={Building2}
            label="Compañías"
            value={counts.companias ?? 0}
            loading={loading}
            to="/companias"
            linkLabel="Ver compañías"
          />
        )}
        {canReadEmployees && (
          <StatCard
            icon={Users}
            label="Empleados"
            value={counts.empleados ?? 0}
            loading={loading}
            to="/empleados"
            linkLabel="Ver empleados"
          />
        )}

        <Card title="Mi cuenta">
          <div className="flex items-center gap-4">
            <Avatar name={user?.nombre} size="lg" />
            <div>
              <p className="text-lg font-bold text-plum">{user?.nombre}</p>
              <p className="text-sm text-plum-soft">{user?.correo}</p>
              <p className="mt-1 text-xs font-semibold text-tertiary">{accessLabel}</p>
            </div>
          </div>
          {user?.companiaId && (
            <p className="mt-4 rounded-2xl bg-surface-tint px-4 py-2 text-xs text-plum-soft">
              Compañía: <span className="font-mono">{user.companiaId}</span>
            </p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Permisos efectivos: la UI se gobierna por scopes (igual que el backend). */}
        <Card title="Mis permisos (scopes)">
          <div className="mb-3 flex items-center gap-2 text-sm text-plum-soft">
            <KeyRound size={16} className="text-primary" />
            Lo que tu rol/scopes te autorizan
          </div>
          {scopes.length === 0 ? (
            <EmptyState>Sin scopes asignados.</EmptyState>
          ) : (
            <div className="flex flex-wrap gap-2">
              {scopes.map((s) => (
                <Badge key={s} color="rose">{s}</Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Verbos permitidos por recurso, segun el propio backend (OPTIONS -> Allow). */}
        <Card title="Acciones disponibles (OPTIONS)">
          <div className="mb-3 flex items-center gap-2 text-sm text-plum-soft">
            <ShieldCheck size={16} className="text-primary" />
            Verbos HTTP que el backend te permite
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "/api/companias", verbs: allowed.compania },
              { label: "/api/empleados", verbs: allowed.empleado },
            ].map(({ label, verbs }) => (
              <div key={label}>
                <p className="mb-1.5 font-mono text-xs font-semibold text-plum">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {verbs.length === 0 ? (
                    <span className="text-xs text-plum-soft/60">—</span>
                  ) : (
                    verbs.map((m) => <Badge key={m} color="slate">{m}</Badge>)
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
