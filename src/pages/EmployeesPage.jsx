import { useState } from "react";
import { Plus } from "lucide-react";
import { useEmployees } from "../hooks/useEmployees.js";
import { useCompanies } from "../hooks/useCompanies.js";
import { useAuth } from "../hooks/useAuth.js";
import { employeeService } from "../services/employeeService.js";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/ui/Modal.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { Input } from "../components/ui/Field.jsx";
import { Alert, Spinner } from "../components/ui/Feedback.jsx";
import EmployeeTable from "../components/employees/EmployeeTable.jsx";
import EmployeeForm from "../components/employees/EmployeeForm.jsx";
import ManageEmployeeById from "../components/employees/ManageEmployeeById.jsx";

export default function EmployeesPage() {
  const { canCreateEmployee, canUpdateEmployee, canDeleteEmployee, canReadCompanies } = useAuth();
  // El selector de compania del formulario de creacion necesita listar companias; solo
  // se cargan si el usuario tiene compania:leer (de lo contrario el backend daria 403).
  const { companies } = useCompanies({ autoLoad: canReadCompanies });
  const {
    page,
    employees,
    criteria,
    loading,
    error,
    load,
    setCriterion,
    create,
  } = useEmployees({});

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const applySearch = (e) => {
    e.preventDefault();
    setCriterion({ buscar: search || undefined, pagina: 1 });
  };

  const handleSort = (orden, dir) => setCriterion({ orden, dir, pagina: 1 });
  const handlePage = (pagina) => setCriterion({ pagina });

  const handleCreate = async (payload) => {
    await create(payload);
    setShowCreate(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-plum">Empleados</h1>
          <p className="mt-1 text-sm font-medium text-plum-soft">
            Administra tu equipo en todas las compañías.
          </p>
        </div>
        {canCreateEmployee && (
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Nuevo empleado
          </Button>
        )}
      </div>

      {error && <Alert type="error">{error.message}</Alert>}

      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <form onSubmit={applySearch} className="flex items-end gap-2">
            <Input
              label="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="nombre, correo, cargo…"
            />
            <Button type="submit" variant="secondary">Buscar</Button>
          </form>

          <label className="flex items-center gap-2 text-sm text-plum-soft">
            Por página:
            <select
              value={criteria.tamano}
              onChange={(e) => setCriterion({ tamano: Number(e.target.value), pagina: 1 })}
              className="rounded-full border border-rose-border bg-card px-3 py-1.5 text-plum focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <EmployeeTable employees={employees} criteria={criteria} onSort={handleSort} />
            <Pagination page={page} onChange={handlePage} />
          </>
        )}
      </Card>

      <ManageEmployeeById
        service={employeeService}
        canUpdate={canUpdateEmployee}
        canDelete={canDeleteEmployee}
        onChanged={() => load()}
      />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo empleado">
        <EmployeeForm
          mode="create"
          companies={companies}
          submitLabel="Crear"
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}
