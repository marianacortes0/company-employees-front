import { useState } from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { Input } from "../ui/Field.jsx";
import { Alert } from "../ui/Feedback.jsx";
import EmployeeForm from "./EmployeeForm.jsx";

/**
 * Panel para operar un empleado por su ID.
 * El listado (EmployeeApiResponse) no expone el id, asi que aqui se ingresa
 * manualmente para usar GET/PUT/PATCH/DELETE /api/empleados/{id} y el borrado por lote.
 */
export default function ManageEmployeeById({ service, onChanged }) {
  const [id, setId] = useState("");
  const [loaded, setLoaded] = useState(null); // empleado cargado por getById
  const [batchIds, setBatchIds] = useState("");
  const [msg, setMsg] = useState(null); // { type, text }
  const [busy, setBusy] = useState(false);

  const notify = (type, text) => setMsg({ type, text });

  const handleFetch = async () => {
    if (!id) return;
    setBusy(true);
    setMsg(null);
    try {
      const data = await service.getById(id);
      setLoaded(data);
    } catch (err) {
      setLoaded(null);
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (payload) => {
    // PUT: reemplazo completo (incluye status, viene del form en mode edit).
    await service.update(id, payload);
    notify("success", "Empleado actualizado (PUT).");
    onChanged?.();
  };

  const handlePatchStatus = async (status) => {
    setBusy(true);
    setMsg(null);
    try {
      await service.patch(id, { status });
      notify("success", `Estado cambiado a ${status} (PATCH).`);
      onChanged?.();
    } catch (err) {
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar el empleado ${id}?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await service.remove(id);
      notify("success", "Empleado eliminado (DELETE).");
      setLoaded(null);
      setId("");
      onChanged?.();
    } catch (err) {
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleBatchDelete = async () => {
    const ids = batchIds.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return;
    if (!window.confirm(`¿Eliminar ${ids.length} empleado(s)?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await service.removeBatch(ids);
      notify("success", `${ids.length} empleado(s) eliminados (DELETE /lote).`);
      setBatchIds("");
      onChanged?.();
    } catch (err) {
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Gestionar empleado por ID">
      {msg && <Alert type={msg.type} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      <div className="flex items-end gap-2">
        <Input
          label="ID del empleado"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="64f1c0…"
          className="flex-1"
        />
        <Button variant="secondary" onClick={handleFetch} loading={busy} disabled={!id}>
          Buscar
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={!id || busy}>
          Eliminar
        </Button>
      </div>

      {loaded && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => handlePatchStatus("ACTIVE")} disabled={busy}>
              Activar (PATCH)
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handlePatchStatus("INACTIVE")} disabled={busy}>
              Desactivar (PATCH)
            </Button>
          </div>
          <EmployeeForm
            mode="edit"
            initial={loaded}
            submitLabel="Actualizar (PUT)"
            onSubmit={handleUpdate}
          />
        </div>
      )}

      <div className="mt-4 border-t border-slate-100 pt-4">
        <Input
          label="Borrado por lote (IDs separados por coma)"
          value={batchIds}
          onChange={(e) => setBatchIds(e.target.value)}
          placeholder="id1, id2, id3"
        />
        <div className="mt-2 flex justify-end">
          <Button variant="danger" size="sm" onClick={handleBatchDelete} disabled={busy || !batchIds}>
            Eliminar lote
          </Button>
        </div>
      </div>
    </Card>
  );
}
