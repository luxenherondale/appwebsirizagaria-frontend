import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};

// Simulación de una base de datos de usuarios para desarrollo
const USERS_STORAGE_KEY = "sirizagaria_users";

// Función para obtener usuarios almacenados
const getStoredUsers = () => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
};

// Función para guardar usuarios en localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Inicializar con algunos usuarios predeterminados si no existen
const initializeUsers = () => {
  const existingUsers = getStoredUsers();
  if (existingUsers.length === 0) {
    const defaultUsers = [
      {
        id: "1",
        name: "Administrador",
        email: "admin@sirizagaria.com",
        password: "admin123", // En producción, estas contraseñas estarían hasheadas
        role: "admin"
      },
      {
        id: "2",
        name: "Editor",
        email: "editor@sirizagaria.com",
        password: "editor123",
        role: "editor"
      },
      {
        id: "3",
        name: "Lector",
        email: "lector@sirizagaria.com",
        password: "lector123",
        role: "lector"
      }
    ];
    saveUsers(defaultUsers);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicializar usuarios predeterminados
    initializeUsers();
    
    // Verificamos si el usuario ya ha iniciado sesión (token en localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError(null);
      
      // En un entorno de producción, esto sería una llamada a la API
      // Simulamos la verificación con los usuarios almacenados en localStorage
      const users = getStoredUsers();
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Credenciales incorrectas");
      }
      
      // Generamos un token simulado (en producción sería JWT del backend)
      const token = `mock-jwt-token-${Date.now()}`;
      
      // Omitimos la contraseña del objeto de usuario
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Almacenamos el token y los datos del usuario
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userWithoutPassword));
      
      // Actualizamos el estado
      setUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      setError(null);
      
      // En un entorno de producción, esto sería una llamada a la API
      // Simulamos el registro guardando en localStorage
      const users = getStoredUsers();
      
      // Verificar si el correo ya está registrado
      if (users.some(u => u.email === userData.email)) {
        throw new Error("El correo electrónico ya está registrado");
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: `${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password, // En producción, esta contraseña estaría hasheada
        role: "lector" // Por defecto, los nuevos usuarios son lectores
      };
      
      // Guardar el nuevo usuario
      users.push(newUser);
      saveUsers(users);
      
      // Iniciar sesión automáticamente después del registro
      return login(userData.email, userData.password);
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
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
    register,
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
