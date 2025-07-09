/**
 * Servicio para la gestión de libros
 * Proporciona métodos para interactuar con la API de libros
 */

import { API_ROUTES, authConfig, handleApiResponse } from '../config/api';
import MainApi from '../utils/MainApi';

// Instancia de MainApi para operaciones con libros
const bookApi = new MainApi();

/**
 * Obtiene todos los libros
 * @returns {Promise<Array>} Lista de libros
 */
export const getBooks = async () => {
  try {
    return await bookApi.getBooks();
  } catch (error) {
    console.error('Error al obtener libros:', error);
    throw error;
  }
};

/**
 * Obtiene un libro por su ID
 * @param {string} id - ID del libro
 * @returns {Promise<Object>} Datos del libro
 */
export const getBookById = async (id) => {
  try {
    return await bookApi.getBookById(id);
  } catch (error) {
    console.error(`Error al obtener libro ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de los libros
 * @returns {Promise<Object>} Estadísticas de libros
 */
export const getBookStats = async () => {
  try {
    return await bookApi.getBookStats();
  } catch (error) {
    console.error('Error al obtener estadísticas de libros:', error);
    throw error;
  }
};

/**
 * Crea un nuevo libro
 * @param {Object} bookData - Datos del libro a crear
 * @returns {Promise<Object>} Libro creado
 */
export const createBook = async (bookData) => {
  try {
    return await bookApi.createBook(bookData);
  } catch (error) {
    console.error('Error al crear libro:', error);
    throw error;
  }
};

/**
 * Actualiza un libro existente
 * @param {string} id - ID del libro a actualizar
 * @param {Object} bookData - Nuevos datos del libro
 * @returns {Promise<Object>} Libro actualizado
 */
export const updateBook = async (id, bookData) => {
  try {
    return await bookApi.updateBook(id, bookData);
  } catch (error) {
    console.error(`Error al actualizar libro ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un libro
 * @param {string} id - ID del libro a eliminar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const deleteBook = async (id) => {
  try {
    return await bookApi.deleteBook(id);
  } catch (error) {
    console.error(`Error al eliminar libro ${id}:`, error);
    throw error;
  }
};

export default {
  getBooks,
  getBookById,
  getBookStats,
  createBook,
  updateBook,
  deleteBook
};
