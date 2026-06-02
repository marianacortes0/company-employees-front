import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

/** Layout autenticado: navbar + contenedor central para las paginas. */
export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
