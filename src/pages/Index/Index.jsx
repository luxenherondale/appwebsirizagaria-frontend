import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/Modal/Modal";
import "./Index.css";

const Index = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  // Validación instantánea cuando cambian los valores
  useEffect(() => {
    validateField('email', formData.email);
  }, [formData.email]);

  useEffect(() => {
    validateField('password', formData.password);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateField = (fieldName, value) => {
    let newError = "";
    
    switch (fieldName) {
      case 'email':
        if (value.trim() === "") {
          newError = "El correo electrónico es obligatorio";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newError = "Formato de correo electrónico inválido";
          }
        }
        break;
      
      case 'password':
        if (!value) {
          newError = "La contraseña es obligatoria";
        }
        break;
      
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: newError
    }));
    
    return !newError;
  };

  const validateForm = () => {
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    
    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Iniciar sesión usando el contexto de autenticación
      await login(formData.email, formData.password);
      
      // Mostrar modal de éxito en lugar de navegar inmediatamente
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Navegar a la página de inicio después de cerrar el modal
    navigate("/inicio", { replace: true });
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
          
          <button 
            className="button" 
            type="submit" 
            disabled={isLoading || Object.values(errors).some(error => error !== "")}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-footer">
            ¿No tienes una cuenta? <Link to="/register" className="link">Regístrate</Link>
          </div>
        </form>
      </div>
      <div className="image-side" />

      {/* Modal de inicio de sesión exitoso */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Inicio de Sesión Exitoso"
      >
        <div className="modal-success-icon">✅</div>
        <p className="modal-success-message">
          ¡Has iniciado sesión correctamente!
        </p>
        <div className="modal-actions">
          <button className="modal-button" onClick={handleCloseSuccessModal}>
            Continuar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Index;
