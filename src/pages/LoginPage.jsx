import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Input } from "../components/ui/Field.jsx";
import Button from "../components/ui/Button.jsx";
import { Alert } from "../components/ui/Feedback.jsx";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-slate-800">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-slate-500">Company Employees</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Alert type="error">{error}</Alert>
          <Input
            label="Correo"
            type="email"
            value={form.correo}
            onChange={set("correo")}
            placeholder="admin@company.local"
            autoComplete="username"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <Button type="submit" loading={loading} className="mt-2">
            Entrar
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
