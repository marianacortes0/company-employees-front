import { useState } from "react";
import { Input, Select } from "../ui/Field.jsx";
import Button from "../ui/Button.jsx";
import { Alert } from "../ui/Feedback.jsx";
import { EMPLOYEE_STATUS } from "../../lib/constants.js";

const EMPTY = {
  nombre: "",
  apellido: "",
  correo: "",
  cargo: "",
  salario: "",
  companiaId: "",
  status: EMPLOYEE_STATUS.ACTIVE,
};

/**
 * Formulario de empleado.
 * mode="create" -> incluye selector de compania (CreateEmployeeRequest).
 * mode="edit"   -> incluye status (UpdateEmployeeRequest).
 * `companies` = lista para el selector de compania.
 */
export default function EmployeeForm({
  mode = "create",
  initial,
  companies = [],
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ ...form, salario: Number(form.salario) });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Alert type="error">{error}</Alert>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Nombre" value={form.nombre} onChange={set("nombre")} required />
        <Input label="Apellido" value={form.apellido} onChange={set("apellido")} required />
      </div>
      <Input label="Correo" type="email" value={form.correo} onChange={set("correo")} required />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input label="Cargo" value={form.cargo} onChange={set("cargo")} required />
        <Input
          label="Salario"
          type="number"
          min="1"
          step="0.01"
          value={form.salario}
          onChange={set("salario")}
          required
        />
      </div>

      {mode === "create" && (
        <Select label="Compañía" value={form.companiaId} onChange={set("companiaId")} required>
          <option value="">Selecciona una compañía…</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
      )}

      {mode === "edit" && (
        <Select
          label="Estado"
          value={form.status}
          onChange={set("status")}
          options={[
            { value: EMPLOYEE_STATUS.ACTIVE, label: "ACTIVE" },
            { value: EMPLOYEE_STATUS.INACTIVE, label: "INACTIVE" },
          ]}
        />
      )}

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
