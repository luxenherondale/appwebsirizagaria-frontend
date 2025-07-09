/**
 * mockApi.js - Simulación de respuestas de la API para desarrollo
 * Se utiliza cuando el backend no está disponible
 */

// Función para inicializar datos desde localStorage o usar los predeterminados
const initializeData = (key, defaultData) => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error(`Error al cargar ${key} desde localStorage:`, error);
  }
  
  // Si no hay datos almacenados o hay un error, usar los datos predeterminados
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};

// Datos predeterminados para usuarios
const defaultUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@sirizagaria.com',
    password: '123456',
    role: 'admin',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Editor',
    email: 'editor@sirizagaria.com',
    password: '123456',
    role: 'editor',
    createdAt: '2023-01-02T00:00:00.000Z'
  }
];

// Datos predeterminados para libros
const defaultBooks = [
  {
    id: '1',
    title: 'El camino del artista',
    author: 'Julia Cameron',
    isbn: '9788403592063',
    published: '2019',
    stock: 50,
    sold: 30,
    price: 24.99,
    createdAt: '2023-01-10T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '9788497592208',
    published: '1967',
    stock: 100,
    sold: 85,
    price: 19.99,
    createdAt: '2023-01-15T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'El principito',
    author: 'Antoine de Saint-Exupéry',
    isbn: '9788478886296',
    published: '1943',
    stock: 75,
    sold: 40,
    price: 14.99,
    createdAt: '2023-01-20T00:00:00.000Z'
  }
];

// Datos predeterminados para gastos
const defaultExpenses = [
  {
    id: '1',
    concept: 'Impresión',
    amount: 1500,
    date: '2023-01-15T00:00:00.000Z',
    category: 'producción',
    createdAt: '2023-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    concept: 'Diseño de portada',
    amount: 500,
    date: '2023-01-10T00:00:00.000Z',
    category: 'diseño',
    createdAt: '2023-01-10T00:00:00.000Z'
  }
];

// Inicializar datos desde localStorage o usar los predeterminados
const mockUsers = initializeData('mockUsers', defaultUsers);
const mockBooks = initializeData('mockBooks', defaultBooks);
const mockExpenses = initializeData('mockExpenses', defaultExpenses);

// Función para guardar datos en localStorage
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error al guardar ${key} en localStorage:`, error);
  }
};

// Simular un retraso en las respuestas para emular el comportamiento de una API real
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para simular una respuesta de la API
const mockResponse = async (data, shouldFail = false, errorMessage = 'Error simulado') => {
  await delay(300); // Retraso de 300ms para simular latencia de red
  
  if (shouldFail) {
    throw new Error(errorMessage);
  }
  
  return data;
};

// Simulación de endpoints de autenticación
export const mockAuthApi = {
  login: async (email, password) => {
    console.log(`Intentando login con: ${email}, ${password}`);
    
    // Verificar credenciales
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      console.log('Usuario no encontrado');
      return mockResponse(null, true, 'Credenciales inválidas');
    }
    
    if (user.password !== password) {
      console.log(`Contraseña incorrecta. Esperada: ${user.password}, Recibida: ${password}`);
      return mockResponse(null, true, 'Credenciales inválidas');
    }
    
    console.log('Login exitoso');
    
    // Generar un token simulado
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('token', token);
    
    // Crear una copia del usuario sin la contraseña para devolver
    const { password: _, ...userWithoutPassword } = user;
    
    // Almacenar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return mockResponse({
      token,
      user: userWithoutPassword
    });
  },
  
  register: async (userData) => {
    console.log('Registrando usuario:', userData);
    
    // Verificar si el email ya existe
    if (mockUsers.some(u => u.email === userData.email)) {
      console.log('Email ya registrado');
      return mockResponse(null, true, 'El correo electrónico ya está registrado');
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: `${mockUsers.length + 1}`,
      ...userData,
      role: 'editor', // Por defecto, los nuevos usuarios son editores
      createdAt: new Date().toISOString()
    };
    
    console.log('Nuevo usuario creado:', newUser);
    mockUsers.push(newUser);
    
    // Guardar usuarios actualizados en localStorage
    saveData('mockUsers', mockUsers);
    
    // Generar un token simulado
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem('token', token);
    
    // Crear una copia del usuario sin la contraseña para devolver
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Almacenar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return mockResponse({
      token,
      user: userWithoutPassword
    });
  },
  
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return mockResponse(null, true, 'No autenticado');
    }
    
    // Obtener el usuario almacenado en localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return mockResponse(null, true, 'No se encontró información del usuario');
    }
    
    try {
      // Parsear el usuario almacenado
      const userFromStorage = JSON.parse(storedUser);
      
      // Buscar el usuario en la lista para asegurar que existe
      const user = mockUsers.find(u => u.id === userFromStorage.id || u.email === userFromStorage.email);
      
      if (!user) {
        console.log('Usuario no encontrado en mockUsers:', userFromStorage);
        return mockResponse(null, true, 'Usuario no encontrado');
      }
      
      console.log('Usuario autenticado:', userFromStorage);
      return mockResponse({ user: userFromStorage });
    } catch (error) {
      console.error('Error al recuperar el usuario:', error);
      return mockResponse(null, true, 'Error al recuperar información del usuario');
    }
  }
};

// Simulación de endpoints de usuarios
export const mockUsersApi = {
  getUsers: async () => {
    // Crear copias de los usuarios sin contraseñas
    const usersWithoutPasswords = mockUsers.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return mockResponse({ users: usersWithoutPasswords });
  },
  
  getUserById: async (id) => {
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return mockResponse(null, true, 'Usuario no encontrado');
    }
    
    // Crear una copia del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    return mockResponse({ user: userWithoutPassword });
  },
  
  createUser: async (userData) => {
    // Verificar si el email ya existe
    if (mockUsers.some(u => u.email === userData.email)) {
      return mockResponse(null, true, 'El correo electrónico ya está registrado');
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: `${mockUsers.length + 1}`,
      ...userData,
      role: 'editor', // Por defecto, los nuevos usuarios son editores
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Guardar usuarios actualizados en localStorage
    saveData('mockUsers', mockUsers);
    
    // Crear una copia del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    
    return mockResponse({ user: userWithoutPassword });
  },
  
  updateUser: async (id, userData) => {
    const index = mockUsers.findIndex(u => u.id === id);
    
    if (index === -1) {
      return mockResponse(null, true, 'Usuario no encontrado');
    }
    
    // Actualizar usuario
    mockUsers[index] = {
      ...mockUsers[index],
      ...userData,
      id // Asegurar que el ID no cambie
    };
    
    // Guardar usuarios actualizados en localStorage
    saveData('mockUsers', mockUsers);
    
    // Crear una copia del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = mockUsers[index];
    
    return mockResponse({ user: userWithoutPassword });
  },
  
  deleteUser: async (id) => {
    const index = mockUsers.findIndex(u => u.id === id);
    
    if (index === -1) {
      return mockResponse(null, true, 'Usuario no encontrado');
    }
    
    // Eliminar usuario
    mockUsers.splice(index, 1);
    
    // Guardar usuarios actualizados en localStorage
    saveData('mockUsers', mockUsers);
    
    return mockResponse({ success: true });
  }
};

// Simulación de endpoints de libros
export const mockBooksApi = {
  getBooks: async () => {
    return mockResponse({ books: mockBooks });
  },
  
  getBookStats: async () => {
    // Calcular estadísticas
    const totalBooks = mockBooks.reduce((sum, book) => sum + book.stock, 0);
    const totalSold = mockBooks.reduce((sum, book) => sum + book.sold, 0);
    const totalRevenue = mockBooks.reduce((sum, book) => sum + (book.sold * book.price), 0);
    
    return mockResponse({
      stats: {
        totalBooks,
        totalSold,
        totalRevenue,
        bestSeller: mockBooks.sort((a, b) => b.sold - a.sold)[0]
      }
    });
  },
  
  getBookById: async (id) => {
    const book = mockBooks.find(b => b.id === id);
    
    if (!book) {
      return mockResponse(null, true, 'Libro no encontrado');
    }
    
    return mockResponse({ book });
  },
  
  createBook: async (bookData) => {
    // Crear nuevo libro
    const newBook = {
      id: `${mockBooks.length + 1}`,
      ...bookData,
      createdAt: new Date().toISOString()
    };
    
    mockBooks.push(newBook);
    
    // Guardar libros actualizados en localStorage
    saveData('mockBooks', mockBooks);
    
    return mockResponse({ book: newBook });
  },
  
  updateBook: async (id, bookData) => {
    const index = mockBooks.findIndex(b => b.id === id);
    
    if (index === -1) {
      return mockResponse(null, true, 'Libro no encontrado');
    }
    
    // Actualizar libro
    mockBooks[index] = {
      ...mockBooks[index],
      ...bookData,
      id // Asegurar que el ID no cambie
    };
    
    // Guardar libros actualizados en localStorage
    saveData('mockBooks', mockBooks);
    
    return mockResponse({ book: mockBooks[index] });
  },
  
  deleteBook: async (id) => {
    const index = mockBooks.findIndex(b => b.id === id);
    
    if (index === -1) {
      return mockResponse(null, true, 'Libro no encontrado');
    }
    
    // Eliminar libro
    mockBooks.splice(index, 1);
    
    // Guardar libros actualizados en localStorage
    saveData('mockBooks', mockBooks);
    
    return mockResponse({ success: true });
  }
};

// Simulación de endpoints de gastos
export const mockExpensesApi = {
  getExpenses: async () => {
    return mockResponse({ expenses: mockExpenses });
  },
  
  getExpenseStats: async () => {
    // Calcular estadísticas de gastos
    const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Agrupar por categoría
    const expensesByCategory = mockExpenses.reduce((acc, expense) => {
      const category = expense.category || 'otros';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});
    
    // Calcular porcentajes por categoría
    const percentagesByCategory = {};
    Object.keys(expensesByCategory).forEach(category => {
      percentagesByCategory[category] = (expensesByCategory[category] / totalExpenses) * 100;
    });
    
    // Calcular gastos por mes (últimos 6 meses)
    const today = new Date();
    const expensesByMonth = {};
    
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      expensesByMonth[monthKey] = 0;
    }
    
    mockExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (expensesByMonth[monthKey] !== undefined) {
        expensesByMonth[monthKey] += expense.amount;
      }
    });
    
    return mockResponse({
      stats: {
        total: totalExpenses,
        byCategory: expensesByCategory,
        percentagesByCategory,
        byMonth: expensesByMonth
      }
    });
  },
  
  getExpenseById: async (id) => {
    const expense = mockExpenses.find(e => e.id === id);
    
    if (!expense) {
      return mockResponse(null, true, 'Gasto no encontrado');
    }
    
    return mockResponse({ expense });
  },
  
  createExpense: async (expenseData) => {
    // Crear nuevo gasto
    const newExpense = {
      id: `${mockExpenses.length + 1}`,
      ...expenseData,
      createdAt: new Date().toISOString()
    };
    
    mockExpenses.push(newExpense);
    
    // Guardar gastos actualizados en localStorage
    saveData('mockExpenses', mockExpenses);
    
    return mockResponse({ expense: newExpense });
  },
  
  updateExpense: async (id, expenseData) => {
    const index = mockExpenses.findIndex(e => e.id === id);
    
    if (index === -1) {
      return mockResponse(null, true, 'Gasto no encontrado');
    }
    
    // Actualizar gasto
    mockExpenses[index] = {
      ...mockExpenses[index],
      ...expenseData,
      id // Asegurar que el ID no cambie
    };
    
    // Guardar gastos actualizados en localStorage
    saveData('mockExpenses', mockExpenses);
    
    return mockResponse({ expense: mockExpenses[index] });
  },
  
  deleteExpense: async (id) => {
    const index = mockExpenses.findIndex(e => e.id === id);
    
    if (index === -1) {
      return mockResponse(null, true, 'Gasto no encontrado');
    }
    
    // Eliminar gasto
    mockExpenses.splice(index, 1);
    
    // Guardar gastos actualizados en localStorage
    saveData('mockExpenses', mockExpenses);
    
    return mockResponse({ success: true });
  }
};

export default {
  auth: mockAuthApi,
  users: mockUsersApi,
  books: mockBooksApi,
  expenses: mockExpensesApi
};
