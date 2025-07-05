import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Index.css";

// Importamos el archivo CSS para este componente

// Los estilos están definidos en el archivo Index.css

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/stock");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <img 
              className="logo" 
              src="./src/assets/logo.png" 
              alt="Editorial Siriza Agaria" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/200x80?text=Siriza+Agaria';
              }}
            />
            <h1 className="title">Editorial Siriza Agaria</h1>
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input
              className="input"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              className="input"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-footer">
            ¿No tienes una cuenta? <Link to="/register" className="link">Regístrate aquí</Link>
          </div>
        </form>
      </div>
      <div className="image-side" />
    </div>
  );
};

export default Index;
