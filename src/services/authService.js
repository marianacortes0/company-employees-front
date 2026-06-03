import { api } from "./apiClient.js";

/**
 * Servicio de autenticacion. Mapea /api/auth.
 * AuthController: registro, login, perfil.
 */
export const authService = {
  // POST /api/auth/registro  -> AuthResponse { token, tipo, expiraEnSegundos, usuario }
  // Registro publico: el backend SIEMPRE crea un USUARIO e ignora roles/scopes del cliente
  // (anti escalada de privilegios). companiaId es obligatorio (RegisterRequest @NotBlank).
  register({ nombre, correo, password, companiaId }) {
    return api.post(
      "/api/auth/registro",
      { nombre, correo, password, companiaId },
      { auth: false }
    );
  },

  // POST /api/auth/login  -> AuthResponse
  login({ correo, password }) {
    return api.post("/api/auth/login", { correo, password }, { auth: false });
  },

  // GET /api/auth/perfil  -> AuthenticatedUserResponse { id, nombre, correo, roles[], scopes[], companiaId }
  getProfile() {
    return api.get("/api/auth/perfil");
  },
};
