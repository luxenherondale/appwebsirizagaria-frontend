/**
 * Utilidades para validación de formularios
 */

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

// Validar contraseña (mínimo 8 caracteres, al menos una letra y un número)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Validar que un campo no esté vacío
export const isNotEmpty = (value) => {
  return value && value.trim() !== '';
};

// Validar número
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

// Validar ISBN (10 o 13 dígitos)
export const isValidISBN = (isbn) => {
  // Eliminar guiones y espacios
  const cleanISBN = isbn.replace(/[\s-]/g, '');
  
  // Verificar longitud
  if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
    return false;
  }
  
  // Verificar que solo contenga dígitos (y posiblemente una X al final para ISBN-10)
  if (!/^\d{9}[\dX]$/.test(cleanISBN) && !/^\d{13}$/.test(cleanISBN)) {
    return false;
  }
  
  return true;
};

// Validar URL
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validar formulario completo
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    // Regla requerido
    if (rules.required && !isNotEmpty(value)) {
      errors[field] = 'Este campo es obligatorio';
      isValid = false;
      return; // Saltar otras validaciones si está vacío
    }
    
    // Si el campo está vacío y no es requerido, no validar más
    if (!isNotEmpty(value) && !rules.required) {
      return;
    }
    
    // Validar email
    if (rules.email && !isValidEmail(value)) {
      errors[field] = 'Email no válido';
      isValid = false;
    }
    
    // Validar contraseña
    if (rules.password && !isValidPassword(value)) {
      errors[field] = 'La contraseña debe tener al menos 8 caracteres, una letra y un número';
      isValid = false;
    }
    
    // Validar número
    if (rules.number && !isValidNumber(value)) {
      errors[field] = 'Debe ser un número válido';
      isValid = false;
    }
    
    // Validar ISBN
    if (rules.isbn && !isValidISBN(value)) {
      errors[field] = 'ISBN no válido (debe tener 10 o 13 dígitos)';
      isValid = false;
    }
    
    // Validar URL
    if (rules.url && !isValidURL(value)) {
      errors[field] = 'URL no válida';
      isValid = false;
    }
    
    // Validar longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Debe tener al menos ${rules.minLength} caracteres`;
      isValid = false;
    }
    
    // Validar longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `No puede tener más de ${rules.maxLength} caracteres`;
      isValid = false;
    }
    
    // Validar valor mínimo (para números)
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      errors[field] = `El valor mínimo es ${rules.min}`;
      isValid = false;
    }
    
    // Validar valor máximo (para números)
    if (rules.max !== undefined && parseFloat(value) > rules.max) {
      errors[field] = `El valor máximo es ${rules.max}`;
      isValid = false;
    }
    
    // Validar coincidencia con otro campo (ej: confirmar contraseña)
    if (rules.match && formData[rules.match] !== value) {
      errors[field] = `No coincide con ${rules.matchLabel || rules.match}`;
      isValid = false;
    }
    
    // Validación personalizada
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
};

 