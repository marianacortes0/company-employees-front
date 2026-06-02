import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useCompanies } from "../hooks/useCompanies.js";
import { Input, Select } from "../components/ui/Field.jsx";
import Button from "../components/ui/Button.jsx";
import { Alert } from "../components/ui/Feedback.jsx";
import { ROLES } from "../lib/constants.js";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const { companies } = useCompanies(); // GET /api/companias es publico
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    role: ROLES.USUARIO,
    companiaId: "",
  });
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-slate-800">Crear cuenta</h1>
        <p className="mb-6 text-sm text-slate-500">Company Employees</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Alert type="error">{error}</Alert>
          <Input label="Nombre" value={form.nombre} onChange={set("nombre")} required />
          <Input
            label="Correo"
            type="email"
            value={form.correo}
            onChange={set("correo")}
            autoComplete="username"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <Select
            label="Rol"
            value={form.role}
            onChange={set("role")}
            options={[
              { value: ROLES.USUARIO, label: "USUARIO" },
              { value: ROLES.ADMIN, label: "ADMIN" },
            ]}
          />
          <Select label="Compañía (opcional)" value={form.companiaId} onChange={set("companiaId")}>
            <option value="">Sin compañía</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
          <Button type="submit" loading={loading} className="mt-2">
            Registrarme
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
