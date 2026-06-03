import { useState } from "react";
import { Input } from "../ui/Field.jsx";
import Button from "../ui/Button.jsx";
import { Alert } from "../ui/Feedback.jsx";

const EMPTY_EMPLOYEE = { nombre: "", apellido: "", correo: "", cargo: "", salario: "" };

/**
 * Crea una compania junto a sus empleados en una sola transaccion.
 * Mapea POST /api/companias/con-empleados (CreateCompanyWithEmployeesRequest).
 */
export default function CompanyWithEmployeesForm({ onSubmit, onCancel }) {
  const [company, setCompany] = useState({ nombre: "", direccion: "", telefono: "" });
  const [empleados, setEmpleados] = useState([{ ...EMPTY_EMPLOYEE }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setC = (key) => (e) => setCompany((c) => ({ ...c, [key]: e.target.value }));

  const setE = (idx, key) => (e) =>
    setEmpleados((list) =>
      list.map((emp, i) => (i === idx ? { ...emp, [key]: e.target.value } : emp))
    );

  const addEmployee = () => setEmpleados((l) => [...l, { ...EMPTY_EMPLOYEE }]);
  const removeEmployee = (idx) =>
    setEmpleados((l) => (l.length > 1 ? l.filter((_, i) => i !== idx) : l));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit({
        ...company,
        empleados: empleados.map((emp) => ({ ...emp, salario: Number(emp.salario) })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Alert type="error">{error}</Alert>

      <div className="flex flex-col gap-3">
        <Input label="Nombre compañía" value={company.nombre} onChange={setC("nombre")} required minLength={3} />
        <Input label="Dirección" value={company.direccion} onChange={setC("direccion")} required />
        <Input label="Teléfono" value={company.telefono} onChange={setC("telefono")} required />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-plum">Empleados</h4>
          <Button type="button" variant="secondary" size="sm" onClick={addEmployee}>
            + Agregar
          </Button>
        </div>

        {empleados.map((emp, idx) => (
          <div key={idx} className="rounded-2xl border border-rose-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-tertiary">#{idx + 1}</span>
              {empleados.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmployee(idx)}
                  className="text-xs font-semibold text-danger hover:underline"
                >
                  Quitar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Input placeholder="Nombre" value={emp.nombre} onChange={setE(idx, "nombre")} required />
              <Input placeholder="Apellido" value={emp.apellido} onChange={setE(idx, "apellido")} required />
              <Input placeholder="Correo" type="email" value={emp.correo} onChange={setE(idx, "correo")} required />
              <Input placeholder="Cargo" value={emp.cargo} onChange={setE(idx, "cargo")} required />
              <Input
                placeholder="Salario"
                type="number"
                min="1"
                step="0.01"
                value={emp.salario}
                onChange={setE(idx, "salario")}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading}>
          Crear compañía + empleados
        </Button>
      </div>
    </form>
  );
}
