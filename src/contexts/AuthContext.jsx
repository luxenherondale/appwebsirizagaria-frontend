import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificamos si el usuario ya ha iniciado sesión (token en localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      // Por ahora, simplemente establecemos un objeto de usuario básico
      // En producción, verificaríamos el token con el backend
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      // En producción, esta sería tu endpoint API real
      // const response = await axios.post("https://api.sirizagaria.com/login", { email, password });
      
      // Para desarrollo, simularemos un inicio de sesión exitoso
      // Reemplazar con llamada API real cuando el backend esté listo
      const mockResponse = {
        data: {
          token: "mock-jwt-token",
          user: {
            id: "1",
            name: "Usuario Administrador",
            email,
            role: email.includes("admin") ? "admin" : email.includes("editor") ? "editor" : "lector"
          }
        }
      };

      // Almacenamos el token y los datos del usuario
      localStorage.setItem("token", mockResponse.data.token);
      localStorage.setItem("userData", JSON.stringify(mockResponse.data.user));
      
      // Actualizamos el estado
      setUser(mockResponse.data.user);
      return mockResponse.data.user;
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      throw err;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
  };

  // Valores que expondrá el contexto
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isEditor: user?.role === "editor" || user?.role === "admin",
    isReader: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
