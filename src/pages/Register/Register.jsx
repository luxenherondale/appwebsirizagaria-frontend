import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error específico cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }
    
    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      console.error("Error al registrar usuario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-side">
        <form className="register-form" onSubmit={handleSubmit}>
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
            <h1 className="title">Registro - Editorial Siriza Agaria</h1>
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="name">Nombre completo</label>
            <input
              className={`input ${errors.name ? 'input-error' : ''}`}
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre completo"
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="email">Correo electrónico</label>
            <input
              className={`input ${errors.email ? 'input-error' : ''}`}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="password">Contraseña</label>
            <input
              className={`input ${errors.password ? 'input-error' : ''}`}
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label className="label" htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>
          
          <button className="button" type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-footer">
            ¿Ya tienes una cuenta? <Link to="/" className="link">Inicia sesión</Link>
          </div>
        </form>
      </div>
      <div className="image-side" />
    </div>
  );
};

export default Register;
