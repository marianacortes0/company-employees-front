import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

/** Layout autenticado: navbar + contenedor central para las paginas. */
export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
