import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { ROLES, SCOPES, STORAGE_KEYS, scope } from "../lib/constants.js";

export const AuthContext = createContext(null);

/** Normaliza los roles del usuario: soporta roles[] (nuevo) y role (legado). */
function rolesOf(user) {
  if (Array.isArray(user?.roles)) return user.roles;
  return user?.role ? [user.role] : [];
}

/** Normaliza los scopes del usuario (AuthenticatedUserResponse.scopes). */
function scopesOf(user) {
  return Array.isArray(user?.scopes) ? user.scopes : [];
}

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

  const value = useMemo(() => {
    const roles = rolesOf(user);
    const scopes = scopesOf(user);
    const scopeSet = new Set(scopes);
    // hasScope replica el hasAuthority('SCOPE_...') del backend: la UI se gobierna por
    // SCOPE, no por rol, porque los admin de Medellin/Bogota no tienen rol ADMIN sino
    // scopes asignados directamente. El rol ADMIN solo es un atajo que ya trae todos.
    const hasScope = (s) => scopeSet.has(s);

    return {
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      // El backend ahora envia roles[] (multi-rol). Se tolera el campo legado role.
      roles,
      scopes,
      isAdmin: roles.includes(ROLES.ADMIN),
      hasScope,
      // Helper generico recurso/accion (ej. can("empleado", "crear")).
      can: (resource, action) => hasScope(scope(resource, action)),
      // Atajos por recurso/accion, alineados con cada @PreAuthorize del backend.
      canReadCompanies: hasScope(SCOPES.COMPANIA_LEER),
      canCreateCompany: hasScope(SCOPES.COMPANIA_CREAR),
      canUpdateCompany: hasScope(SCOPES.COMPANIA_ACTUALIZAR),
      canDeleteCompany: hasScope(SCOPES.COMPANIA_ELIMINAR),
      canReadEmployees: hasScope(SCOPES.EMPLEADO_LEER),
      canCreateEmployee: hasScope(SCOPES.EMPLEADO_CREAR),
      canUpdateEmployee: hasScope(SCOPES.EMPLEADO_ACTUALIZAR),
      canDeleteEmployee: hasScope(SCOPES.EMPLEADO_ELIMINAR),
      login,
      register,
      logout,
      refreshProfile,
    };
  }, [token, user, loading, login, register, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
