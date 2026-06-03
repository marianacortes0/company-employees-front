import { Avatar, Badge, EmptyState } from "../ui/Feedback.jsx";
import { EMPLOYEE_SORT_FIELDS, EMPLOYEE_STATUS } from "../../lib/constants.js";

// La columna "Empleado" agrupa nombre/apellido/correo; se ordena por apellido (default del back).
const COLUMNS = [
  { key: "apellido", label: "Empleado" },
  { key: "cargo", label: "Cargo" },
  { key: "salario", label: "Salario" },
  { key: "status", label: "Estado" },
];

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/**
 * Tabla de empleados con estetica Vivid Pulse. Encabezados clicables para ordenar
 * por los campos permitidos (PageCriteria.ALLOWED_SORT_FIELDS).
 */
export default function EmployeeTable({ employees, criteria, onSort }) {
  if (!employees || employees.length === 0) {
    return <EmptyState>No hay empleados para mostrar.</EmptyState>;
  }

  const sortIndicator = (key) => {
    if (criteria?.orden !== key) return "";
    return criteria.dir === "asc" ? " ▲" : " ▼";
  };

  const handleSort = (key) => {
    if (!onSort || !EMPLOYEE_SORT_FIELDS.includes(key)) return;
    const nextDir = criteria?.orden === key && criteria.dir === "asc" ? "desc" : "asc";
    onSort(key, nextDir);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-1 text-left text-sm">
        <thead>
          <tr className="text-plum-soft">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`bg-surface-tint px-4 py-3 text-xs font-bold uppercase tracking-wide first:rounded-l-2xl last:rounded-r-2xl ${
                  onSort ? "cursor-pointer select-none hover:text-primary" : ""
                }`}
              >
                {col.label}
                {sortIndicator(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((e, i) => (
            <tr key={`${e.correo}-${i}`} className="bg-card transition-colors hover:bg-surface-tint">
              <td className="rounded-l-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={`${e.nombre} ${e.apellido}`} size="sm" />
                  <div className="min-w-0">
                    <p className="font-bold text-plum">{e.nombre} {e.apellido}</p>
                    <p className="truncate text-xs text-plum-soft">{e.correo}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-plum-soft">{e.cargo}</td>
              <td className="px-4 py-3 font-semibold text-plum">
                {e.salario != null ? money.format(e.salario) : "—"}
              </td>
              <td className="rounded-r-2xl px-4 py-3">
                <Badge color={e.status === EMPLOYEE_STATUS.ACTIVE ? "green" : "red"}>
                  {e.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
