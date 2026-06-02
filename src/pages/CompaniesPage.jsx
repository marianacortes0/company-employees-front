import { useState } from "react";
import { Link } from "react-router-dom";
import { useCompanies } from "../hooks/useCompanies.js";
import { useAuth } from "../hooks/useAuth.js";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import { Alert, EmptyState, Spinner } from "../components/ui/Feedback.jsx";
import CompanyForm from "../components/companies/CompanyForm.jsx";
import CompanyWithEmployeesForm from "../components/companies/CompanyWithEmployeesForm.jsx";

export default function CompaniesPage() {
  const { isAdmin } = useAuth();
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Compañías</h1>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="secondary" onClick={() => setWithEmployees(true)}>
              + Con empleados
            </Button>
          )}
          <Button onClick={() => setModal({ mode: "create" })}>+ Nueva compañía</Button>
        </div>
      </div>

      {error && <Alert type="error">{error.message}</Alert>}
      {actionError && <Alert type="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

      {loading ? (
        <Spinner />
      ) : companies.length === 0 ? (
        <Card><EmptyState>No hay compañías registradas.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <Card key={c.id} title={c.nombre}>
              <div className="flex flex-col gap-1 text-sm text-slate-600">
                <p>{c.direccion}</p>
                <p>{c.telefono}</p>
                <p className="text-slate-400">{c.employeeCount} empleado(s)</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/companias/${c.id}`}>
                  <Button variant="secondary" size="sm">Ver</Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={() => setModal({ mode: "edit", company: c })}>
                  Editar
                </Button>
                {isAdmin && (
                  <Button variant="danger" size="sm" onClick={() => handleDelete(c)}>
                    Eliminar
                  </Button>
                )}
              </div>
            </Card>
          ))}
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
