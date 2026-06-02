import { useState } from "react";
import { Input } from "../ui/Field.jsx";
import Button from "../ui/Button.jsx";
import { Alert } from "../ui/Feedback.jsx";

const EMPTY = { nombre: "", direccion: "", telefono: "" };

/**
 * Formulario de compania (crear/editar). Campos segun CreateCompanyRequest.
 * `initial` precarga valores; `onSubmit(payload)` devuelve una promesa.
 */
export default function CompanyForm({ initial, onSubmit, onCancel, submitLabel = "Guardar" }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Alert type="error">{error}</Alert>
      <Input label="Nombre" value={form.nombre} onChange={set("nombre")} required minLength={3} />
      <Input label="Dirección" value={form.direccion} onChange={set("direccion")} required />
      <Input
        label="Teléfono"
        value={form.telefono}
        onChange={set("telefono")}
        placeholder="+57 300 000 0000"
        required
      />
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
