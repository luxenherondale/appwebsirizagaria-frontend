/**
 * MainApi.js - Clase principal para interactuar con la API de Siriza Agaria
 * Este archivo centraliza todas las solicitudes a la API del backend
 */

import { API_URL, API_ROUTES, authConfig, handleApiResponse } from '../config/api';
import mockApi from './mockApi';

// Constante para determinar si se debe usar la API simulada
// En un entorno real, esto podría venir de una variable de entorno
const USE_MOCK_API = false; // Cambiado a false para usar el backend real

class MainApi {
  constructor(baseUrl = API_URL) {
    this._baseUrl = baseUrl;
    this._useMockApi = USE_MOCK_API;
  }

  /**
   * Métodos de autenticación
   */

  // Registrar un nuevo usuario
  register(userData) {
    if (this._useMockApi) {
      return mockApi.auth.register(userData);
    }

    return fetch(API_ROUTES.AUTH.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(handleApiResponse);
  }

  // Iniciar sesión
  login(email, password) {
    if (this._useMockApi) {
      return mockApi.auth.login(email, password);
    }

    return fetch(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(handleApiResponse);
  }

  // Obtener datos del usuario actual
  getCurrentUser() {
    if (this._useMockApi) {
      return mockApi.auth.getCurrentUser();
    }

    return fetch(API_ROUTES.AUTH.ME, authConfig())
      .then(handleApiResponse);
  }

  /**
   * Métodos para gestión de usuarios
   */

  // Obtener todos los usuarios
  getUsers() {
    if (this._useMockApi) {
      return mockApi.users.getUsers();
    }

    return fetch(API_ROUTES.USERS.BASE, authConfig())
      .then(handleApiResponse);
  }

  // Obtener un usuario por ID
  getUserById(id) {
    if (this._useMockApi) {
      return mockApi.users.getUserById(id);
    }

    return fetch(API_ROUTES.USERS.BY_ID(id), authConfig())
      .then(handleApiResponse);
  }

  // Crear un nuevo usuario
  createUser(userData) {
    if (this._useMockApi) {
      return mockApi.users.createUser(userData);
    }

    return fetch(API_ROUTES.USERS.BASE, {
      method: 'POST',
      ...authConfig(),
      body: JSON.stringify(userData)
    })
    .then(handleApiResponse);
  }

  // Actualizar un usuario
  updateUser(id, userData) {
    if (this._useMockApi) {
      return mockApi.users.updateUser(id, userData);
    }

    return fetch(API_ROUTES.USERS.BY_ID(id), {
      method: 'PUT',
      ...authConfig(),
      body: JSON.stringify(userData)
    })
    .then(handleApiResponse);
  }

  // Eliminar un usuario
  deleteUser(id) {
    if (this._useMockApi) {
      return mockApi.users.deleteUser(id);
    }

    return fetch(API_ROUTES.USERS.BY_ID(id), {
      method: 'DELETE',
      ...authConfig()
    })
    .then(handleApiResponse);
  }

  /**
   * Métodos para gestión de libros
   */

  // Obtener todos los libros
  getBooks() {
    if (this._useMockApi) {
      return mockApi.books.getBooks();
    }

    return fetch(API_ROUTES.BOOKS.BASE, authConfig())
      .then(handleApiResponse);
  }

  // Obtener estadísticas de libros
  getBookStats() {
    if (this._useMockApi) {
      return mockApi.books.getBookStats();
    }

    return fetch(API_ROUTES.BOOKS.STATS, authConfig())
      .then(handleApiResponse);
  }

  // Obtener un libro por ID
  getBookById(id) {
    if (this._useMockApi) {
      return mockApi.books.getBookById(id);
    }

    return fetch(API_ROUTES.BOOKS.BY_ID(id), authConfig())
      .then(handleApiResponse);
  }

  // Crear un nuevo libro
  createBook(bookData) {
    if (this._useMockApi) {
      return mockApi.books.createBook(bookData);
    }

    return fetch(API_ROUTES.BOOKS.BASE, {
      method: 'POST',
      ...authConfig(),
      body: JSON.stringify(bookData)
    })
    .then(handleApiResponse);
  }

  // Actualizar un libro
  updateBook(id, bookData) {
    if (this._useMockApi) {
      return mockApi.books.updateBook(id, bookData);
    }

    return fetch(API_ROUTES.BOOKS.BY_ID(id), {
      method: 'PUT',
      ...authConfig(),
      body: JSON.stringify(bookData)
    })
    .then(handleApiResponse);
  }

  // Eliminar un libro
  deleteBook(id) {
    if (this._useMockApi) {
      return mockApi.books.deleteBook(id);
    }

    return fetch(API_ROUTES.BOOKS.BY_ID(id), {
      method: 'DELETE',
      ...authConfig()
    })
    .then(handleApiResponse);
  }

  /**
   * Métodos para gestión de gastos
   */

  // Obtener todos los gastos
  getExpenses() {
    if (this._useMockApi) {
      return mockApi.expenses.getExpenses();
    }

    return fetch(API_ROUTES.EXPENSES.BASE, authConfig())
      .then(handleApiResponse);
  }

  // Obtener estadísticas de gastos
  getExpenseStats() {
    if (this._useMockApi) {
      return mockApi.expenses.getExpenseStats();
    }

    return fetch(API_ROUTES.EXPENSES.STATS, authConfig())
      .then(handleApiResponse);
  }

  // Obtener un gasto por ID
  getExpenseById(id) {
    if (this._useMockApi) {
      return mockApi.expenses.getExpenseById(id);
    }

    return fetch(API_ROUTES.EXPENSES.BY_ID(id), authConfig())
      .then(handleApiResponse);
  }

  // Crear un nuevo gasto
  createExpense(expenseData) {
    if (this._useMockApi) {
      return mockApi.expenses.createExpense(expenseData);
    }

    return fetch(API_ROUTES.EXPENSES.BASE, {
      method: 'POST',
      ...authConfig(),
      body: JSON.stringify(expenseData)
    })
    .then(handleApiResponse);
  }

  // Actualizar un gasto
  updateExpense(id, expenseData) {
    if (this._useMockApi) {
      return mockApi.expenses.updateExpense(id, expenseData);
    }

    return fetch(API_ROUTES.EXPENSES.BY_ID(id), {
      method: 'PUT',
      ...authConfig(),
      body: JSON.stringify(expenseData)
    })
    .then(handleApiResponse);
  }

  // Eliminar un gasto
  deleteExpense(id) {
    if (this._useMockApi) {
      return mockApi.expenses.deleteExpense(id);
    }

    return fetch(API_ROUTES.EXPENSES.BY_ID(id), {
      method: 'DELETE',
      ...authConfig()
    })
    .then(handleApiResponse);
  }
}

// Exportar la clase para poder crear instancias
export default MainApi;
