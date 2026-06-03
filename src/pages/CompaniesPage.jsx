import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Users, Plus } from "lucide-react";
import { useCompanies } from "../hooks/useCompanies.js";
import { useAuth } from "../hooks/useAuth.js";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import { Alert, Avatar, Badge, EmptyState, Spinner } from "../components/ui/Feedback.jsx";
import CompanyForm from "../components/companies/CompanyForm.jsx";
import CompanyWithEmployeesForm from "../components/companies/CompanyWithEmployeesForm.jsx";

export default function CompaniesPage() {
  const { canCreateCompany, canUpdateCompany, canDeleteCompany } = useAuth();
  const { companies, loading, error, create, update, remove, createWithEmployees } = useCompanies();
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit', company }
  const [withEmployees, setWithEmployees] = useState(false);
  const [actionError, setActionError] = useState(null);

  const closeModal = () => setModal(null);

  const handleCreateWithEmployees = async (payload) => {
    await createWithEmployees(payload);
    setWithEmployees(false);
  };

  const handleSubmit = async (payload) => {
    if (modal.mode === "edit") {
      await update(modal.company.id, payload);
    } else {
      await create(payload);
    }
    closeModal();
  };

  const handleDelete = async (company) => {
    if (!window.confirm(`¿Eliminar la compañía "${company.nombre}"?`)) return;
    setActionError(null);
    try {
      await remove(company.id);
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-plum">Directorio de compañías</h1>
          <p className="mt-1 text-sm font-medium text-plum-soft">
            Gestiona y monitorea el crecimiento de tu ecosistema.
          </p>
        </div>
        <div className="flex gap-2">
          {canCreateCompany && (
            <Button variant="secondary" onClick={() => setWithEmployees(true)}>
              + Con empleados
            </Button>
          )}
          {canCreateCompany && (
            <Button onClick={() => setModal({ mode: "create" })}>
              <Plus size={16} /> Nueva compañía
            </Button>
          )}
        </div>
      </div>

      {error && <Alert type="error">{error.message}</Alert>}
      {actionError && <Alert type="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

      {loading ? (
        <Spinner />
      ) : companies.length === 0 ? (
        <Card><EmptyState>No hay compañías registradas.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <div
              key={c.id}
              className="flex flex-col rounded-[1.5rem] border border-rose-border bg-card p-5 shadow-pulse transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-start gap-3">
                <Avatar name={c.nombre} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-bold text-plum">{c.nombre}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-plum-soft">
                    <MapPin size={12} /> <span className="truncate">{c.direccion}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-tint px-4 py-2.5 text-xs text-plum-soft">
                <Phone size={12} /> {c.telefono}
                <span className="ml-auto flex items-center gap-1 font-semibold text-tertiary">
                  <Users size={12} /> {c.employeeCount}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {canUpdateCompany && (
                  <Button variant="secondary" size="sm" onClick={() => setModal({ mode: "edit", company: c })}>
                    Editar
                  </Button>
                )}
                <Link to={`/companias/${c.id}`} className="ml-auto">
                  <Button size="sm">Ver detalles</Button>
                </Link>
                {canDeleteCompany && (
                  <Button variant="danger" size="sm" onClick={() => handleDelete(c)}>
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Tarjeta de "añadir" (solo si puede crear), estilo Vivid Pulse. */}
          {canCreateCompany && (
            <button
              onClick={() => setModal({ mode: "create" })}
              className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-[1.5rem] border-2 border-dashed border-rose-border bg-card/40 text-plum-soft transition-colors hover:border-primary hover:text-primary"
            >
              <span className="bg-secondary-soft grid h-12 w-12 place-items-center rounded-full text-primary">
                <Plus size={22} />
              </span>
              <span className="text-sm font-bold">Agregar compañía</span>
              <span className="text-xs">Amplía tu red</span>
            </button>
          )}
        </div>
      )}

      <Modal
        open={Boolean(modal)}
        onClose={closeModal}
        title={modal?.mode === "edit" ? "Editar compañía" : "Nueva compañía"}
      >
        {modal && (
          <CompanyForm
            initial={modal.company}
            submitLabel={modal.mode === "edit" ? "Guardar cambios" : "Crear"}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        )}
      </Modal>

      <Modal
        open={withEmployees}
        onClose={() => setWithEmployees(false)}
        title="Nueva compañía con empleados"
      >
        {withEmployees && (
          <CompanyWithEmployeesForm
            onSubmit={handleCreateWithEmployees}
            onCancel={() => setWithEmployees(false)}
          />
        )}
      </Modal>
    </div>
  );
}
