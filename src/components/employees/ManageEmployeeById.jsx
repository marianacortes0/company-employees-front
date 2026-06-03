import { useEffect, useState } from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { Select } from "../ui/Field.jsx";
import { Alert, EmptyState } from "../ui/Feedback.jsx";
import EmployeeForm from "./EmployeeForm.jsx";

/**
 * Panel para operar un empleado concreto.
 * El listado (EmployeeApiResponse) no expone el id; aqui el empleado se elige por
 * nombre desde GET /api/empleados/opciones (el id viaja como value del option, nunca
 * se muestra) y se opera con GET/PUT/PATCH/DELETE /api/empleados/{id} y borrado por lote.
 * Las acciones se muestran segun los scopes del usuario (canUpdate -> PUT/PATCH,
 * canDelete -> DELETE y borrado por lote), igual que autoriza el backend.
 */
export default function ManageEmployeeById({ service, canUpdate = false, canDelete = false, onChanged }) {
  const [id, setId] = useState("");
  const [loaded, setLoaded] = useState(null); // empleado cargado por getById
  const [batchSelected, setBatchSelected] = useState([]); // ids marcados para borrado por lote
  const [msg, setMsg] = useState(null); // { type, text }
  const [busy, setBusy] = useState(false);
  const [options, setOptions] = useState([]); // [{ label, value }] = GET /opciones

  const notify = (type, text) => setMsg({ type, text });

  // Carga las opciones de empleados (GET /api/empleados/opciones) para elegir el
  // empleado por nombre. El id solo viaja como value, no se expone en pantalla.
  // Requiere scope empleado:leer (garantizado por la ruta).
  useEffect(() => {
    let alive = true;
    service
      .getOptions()
      .then((data) => alive && setOptions(data ?? []))
      .catch(() => alive && setOptions([]));
    return () => {
      alive = false;
    };
  }, [service]);

  // Recarga las opciones tras crear/eliminar para mantener el select al dia.
  const reloadOptions = () => {
    service.getOptions().then((data) => setOptions(data ?? [])).catch(() => {});
  };

  // Etiqueta del empleado seleccionado (para los mensajes, sin mostrar el id).
  const labelOf = (value) => options.find((o) => o.value === value)?.label ?? "empleado";

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
    if (!id) return;
    if (!window.confirm(`¿Eliminar a ${labelOf(id)}?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await service.remove(id);
      notify("success", "Empleado eliminado (DELETE).");
      setLoaded(null);
      setId("");
      reloadOptions();
      onChanged?.();
    } catch (err) {
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const toggleBatch = (value) =>
    setBatchSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const handleBatchDelete = async () => {
    if (batchSelected.length === 0) return;
    if (!window.confirm(`¿Eliminar ${batchSelected.length} empleado(s)?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await service.removeBatch(batchSelected);
      notify("success", `${batchSelected.length} empleado(s) eliminados (DELETE /lote).`);
      setBatchSelected([]);
      reloadOptions();
      onChanged?.();
    } catch (err) {
      notify("error", err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Gestionar empleado">
      {msg && <Alert type={msg.type} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      {options.length === 0 ? (
        <EmptyState>No hay empleados disponibles para gestionar.</EmptyState>
      ) : (
        <div className="flex items-end gap-2">
          <Select
            label="Empleado"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setLoaded(null);
            }}
            className="flex-1"
          >
            <option value="">Selecciona un empleado…</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={handleFetch} loading={busy} disabled={!id}>
            Ver
          </Button>
          {canDelete && (
            <Button variant="danger" onClick={handleDelete} disabled={!id || busy}>
              Eliminar
            </Button>
          )}
        </div>
      )}

      {loaded && (
        <div className="mt-4 border-t border-rose-line pt-4">
          {canUpdate ? (
            <>
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
            </>
          ) : (
            // Solo lectura: sin scope empleado:actualizar se muestran los datos sin editar.
            <div className="grid grid-cols-1 gap-1 text-sm text-plum-soft sm:grid-cols-2">
              <p><strong>Nombre:</strong> {loaded.nombre} {loaded.apellido}</p>
              <p><strong>Correo:</strong> {loaded.correo}</p>
              <p><strong>Cargo:</strong> {loaded.cargo}</p>
              <p><strong>Estado:</strong> {loaded.status}</p>
            </div>
          )}
        </div>
      )}

      {canDelete && options.length > 0 && (
        <div className="mt-4 border-t border-rose-line pt-4">
          <p className="mb-2 text-sm font-bold text-plum">Borrado por lote</p>
          <div className="max-h-48 overflow-y-auto rounded-2xl border border-rose-border p-2">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-plum-soft hover:bg-surface-tint"
              >
                <input
                  type="checkbox"
                  checked={batchSelected.includes(opt.value)}
                  onChange={() => toggleBatch(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-plum-soft/70">
              {batchSelected.length} seleccionado(s)
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBatchDelete}
              disabled={busy || batchSelected.length === 0}
            >
              Eliminar lote
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
