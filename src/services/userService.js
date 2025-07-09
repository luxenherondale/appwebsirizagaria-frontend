/**
 * Servicio para la gestión de usuarios
 * Proporciona métodos para interactuar con la API de usuarios
 */

import { API_ROUTES, authConfig, handleApiResponse } from '../config/api';
import MainApi from '../utils/MainApi';

// Instancia de MainApi para operaciones con usuarios
const userApi = new MainApi();

/**
 * Obtiene todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getUsers = async () => {
  try {
    return await userApi.getUsers();
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserById = async (id) => {
  try {
    return await userApi.getUserById(id);
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario a crear
 * @returns {Promise<Object>} Usuario creado
 */
export const createUser = async (userData) => {
  try {
    return await userApi.createUser(userData);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario existente
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Nuevos datos del usuario
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (id, userData) => {
  try {
    return await userApi.updateUser(id, userData);
  } catch (error) {
    console.error(`Error al actualizar usuario ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un usuario
 * @param {string} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Respuesta de la API
 */
export const deleteUser = async (id) => {
  try {
    return await userApi.deleteUser(id);
  } catch (error) {
    console.error(`Error al eliminar usuario ${id}:`, error);
    throw error;
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
