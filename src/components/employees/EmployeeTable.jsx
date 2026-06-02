import { Badge, EmptyState } from "../ui/Feedback.jsx";
import { EMPLOYEE_SORT_FIELDS, EMPLOYEE_STATUS } from "../../lib/constants.js";

const COLUMNS = [
  { key: "nombre", label: "Nombre" },
  { key: "apellido", label: "Apellido" },
  { key: "correo", label: "Correo" },
  { key: "cargo", label: "Cargo" },
  { key: "salario", label: "Salario" },
  { key: "status", label: "Estado" },
];

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" });

/**
 * Tabla de empleados. Encabezados clicables para ordenar por los campos
 * permitidos (PageCriteria.ALLOWED_SORT_FIELDS).
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
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className={`px-3 py-2 font-semibold ${
                  onSort ? "cursor-pointer select-none hover:text-slate-800" : ""
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
            <tr key={`${e.correo}-${i}`} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-3 py-2 text-slate-700">{e.nombre}</td>
              <td className="px-3 py-2 text-slate-700">{e.apellido}</td>
              <td className="px-3 py-2 text-slate-600">{e.correo}</td>
              <td className="px-3 py-2 text-slate-600">{e.cargo}</td>
              <td className="px-3 py-2 text-slate-600">
                {e.salario != null ? money.format(e.salario) : "—"}
              </td>
              <td className="px-3 py-2">
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
