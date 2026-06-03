import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { companyService } from "../services/companyService.js";
import { useEmployees } from "../hooks/useEmployees.js";
import { useAsync } from "../hooks/useAsync.js";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { Input } from "../components/ui/Field.jsx";
import { Alert, Spinner } from "../components/ui/Feedback.jsx";
import EmployeeTable from "../components/employees/EmployeeTable.jsx";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { data: company, loading, error, run } = useAsync();
  const [search, setSearch] = useState("");

  const {
    page,
    employees,
    criteria,
    loading: loadingEmployees,
    error: employeesError,
    setCriterion,
  } = useEmployees({ companyId: id });

  useEffect(() => {
    run(() => companyService.getById(id)).catch(() => {});
  }, [id, run]);

  const applySearch = (e) => {
    e.preventDefault();
    setCriterion({ buscar: search || undefined, pagina: 1 });
  };

  return (
    <div className="flex flex-col gap-4">
      <Link to="/companias" className="text-sm font-semibold text-primary hover:underline">
        ← Volver a compañías
      </Link>

      {error && <Alert type="error">{error.message}</Alert>}

      {loading ? (
        <Spinner />
      ) : company ? (
        <Card title={company.nombre}>
          <div className="grid grid-cols-1 gap-2 text-sm text-plum-soft sm:grid-cols-2">
            <p><strong>Dirección:</strong> {company.direccion}</p>
            <p><strong>Teléfono:</strong> {company.telefono}</p>
            <p><strong>Empleados:</strong> {company.employeeCount}</p>
            <p><strong>Creada:</strong> {company.fechaCreacion?.replace("T", " ").slice(0, 16)}</p>
          </div>
        </Card>
      ) : null}

      <Card title="Empleados de la compañía">
        <form onSubmit={applySearch} className="mb-4 flex items-end gap-2">
          <Input
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="nombre, correo, cargo…"
          />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>

        {employeesError && <Alert type="error">{employeesError.message}</Alert>}

        {loadingEmployees ? (
          <Spinner />
        ) : (
          <>
            <EmployeeTable
              employees={employees}
              criteria={criteria}
              onSort={(orden, dir) => setCriterion({ orden, dir, pagina: 1 })}
            />
            <Pagination page={page} onChange={(pagina) => setCriterion({ pagina })} />
          </>
        )}
      </Card>
    </div>
  );
}
