import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { ROLES, STORAGE_KEYS } from "../lib/constants.js";

export const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.usuario);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Provee el estado de autenticacion a toda la app.
 * Persiste token + usuario en localStorage y expone login/register/logout.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  const persist = useCallback((auth) => {
    // auth = AuthResponse { token, usuario, ... }
    setToken(auth.token);
    setUser(auth.usuario);
    localStorage.setItem(STORAGE_KEYS.token, auth.token);
    localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(auth.usuario));
  }, []);

  const login = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        const auth = await authService.login(credentials);
        persist(auth);
        return auth;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const register = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const auth = await authService.register(data);
        persist(auth);
        return auth;
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.usuario);
  }, []);

  // Refresca el perfil desde el backend (GET /api/auth/perfil).
  const refreshProfile = useCallback(async () => {
    const perfil = await authService.getProfile();
    setUser(perfil);
    localStorage.setItem(STORAGE_KEYS.usuario, JSON.stringify(perfil));
    return perfil;
  }, []);

  // Si hay token pero no usuario en memoria, intenta recuperar el perfil.
  useEffect(() => {
    if (token && !user) {
      refreshProfile().catch(() => logout());
    }
  }, [token, user, refreshProfile, logout]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === ROLES.ADMIN,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [token, user, loading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
