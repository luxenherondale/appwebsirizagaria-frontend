import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/Modal/Modal";
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  // Validación instantánea cuando cambian los valores
  useEffect(() => {
    validateField('name', formData.name);
  }, [formData.name]);

  useEffect(() => {
    validateField('email', formData.email);
  }, [formData.email]);

  useEffect(() => {
    validateField('password', formData.password);
  }, [formData.password]);

  useEffect(() => {
    validateField('confirmPassword', formData.confirmPassword);
  }, [formData.confirmPassword]);

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
      case 'name':
        if (value.trim() === "") {
          newError = "El nombre es obligatorio";
        }
        break;
      
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
        } else if (value.length < 6) {
          newError = "La contraseña debe tener al menos 6 caracteres";
        }
        break;
      
      case 'confirmPassword':
        if (value !== formData.password) {
          newError = "Las contraseñas no coinciden";
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
    const nameValid = validateField('name', formData.name);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);
    
    return nameValid && emailValid && passwordValid && confirmPasswordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Registrar al usuario usando el contexto de autenticación
      await register(formData);
      
      // Mostrar modal de éxito en lugar de navegar inmediatamente
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error al registrar usuario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Navegar a la página de inicio después de cerrar el modal
    navigate("/");
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
          
          <button 
            className="button" 
            type="submit" 
            disabled={isLoading || Object.values(errors).some(error => error !== "")}
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-footer">
            ¿Ya tienes una cuenta? <Link to="/" className="link">Inicia sesión</Link>
          </div>
        </form>
      </div>
      <div className="image-side" />

      {/* Modal de registro exitoso */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="Registro Exitoso"
      >
        <div className="modal-success-icon">✅</div>
        <p className="modal-success-message">
          ¡Tu cuenta ha sido creada exitosamente!
        </p>
        <div className="modal-actions">
          <button className="modal-button" onClick={handleCloseSuccessModal}>
            Iniciar Sesión
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
