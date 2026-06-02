import { api } from "./apiClient.js";

/**
 * Servicio de autenticacion. Mapea /api/auth.
 * AuthController: registro, login, perfil.
 */
export const authService = {
  // POST /api/auth/registro  -> AuthResponse { token, tipo, expiraEnSegundos, usuario }
  register({ nombre, correo, password, role, companiaId }) {
    return api.post(
      "/api/auth/registro",
      { nombre, correo, password, role, companiaId: companiaId || null },
      { auth: false }
    );
  },

  // POST /api/auth/login  -> AuthResponse
  login({ correo, password }) {
    return api.post("/api/auth/login", { correo, password }, { auth: false });
  },

  // GET /api/auth/perfil  -> AuthenticatedUserResponse { id, nombre, correo, role, companiaId }
  getProfile() {
    return api.get("/api/auth/perfil");
  },
};
