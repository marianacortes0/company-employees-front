import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Input } from "../components/ui/Field.jsx";
import Button from "../components/ui/Button.jsx";
import { Alert } from "../components/ui/Feedback.jsx";

/**
 * Registro publico. El backend (AuthController.register + RegisterRequest):
 *   - SIEMPRE crea un USUARIO (rol base); ignora roles/scopes del cliente (anti escalada).
 *   - Exige companiaId (obligatorio): la compania/ciudad a la que pertenece el usuario.
 * Como GET /api/companias requiere autenticacion, aqui el companiaId se ingresa
 * manualmente (lo provee un administrador), no se puede listar sin sesion.
 */
export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    companiaId: "",
  });
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Solo se envian los campos que el backend acepta para el registro publico.
      await register({
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        companiaId: form.companiaId,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-brand-gradient flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[1.5rem] border border-rose-border bg-card p-8 shadow-pulse-lg">
        <h1 className="text-2xl font-extrabold tracking-tight text-plum">Crear cuenta</h1>
        <p className="mb-6 text-sm text-plum-soft">
          <span className="font-semibold text-primary">CompanyEmployees</span> · Se creará con rol{" "}
          <strong className="text-tertiary">USUARIO</strong>
        </p>

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
          <Input
            label="ID de compañía"
            value={form.companiaId}
            onChange={set("companiaId")}
            placeholder="Identificador de tu compañía"
            required
          />
          <p className="-mt-1 px-1 text-xs text-plum-soft/70">
            Obligatorio. Solicítalo a un administrador de tu compañía.
          </p>
          <Button type="submit" loading={loading} className="mt-2">
            Registrarme
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-plum-soft">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
