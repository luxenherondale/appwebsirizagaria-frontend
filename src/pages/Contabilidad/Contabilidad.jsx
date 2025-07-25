import { useState, useEffect } from 'react';
import './Contabilidad.css';
import MainApi from '../../utils/MainApi';

// Instanciar la API
const api = new MainApi();

export const Contabilidad = () => {
  // Estados para manejar los datos de contabilidad
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [transaccionActual, setTransaccionActual] = useState({
    fecha: '',
    concepto: '',
    tipo: 'ingreso',
    monto: '',
    categoria: ''
  });

  // Cargar gastos al montar el componente
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await api.getExpenses();
        if (response && response.expenses) {
          setTransacciones(response.expenses.map(expense => ({
            id: expense.id,
            fecha: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
            concepto: expense.concept || expense.concepto,
            tipo: expense.type || expense.tipo || 'gasto',
            monto: expense.amount || expense.monto || 0,
            categoria: expense.category || expense.categoria || 'Otros'
          })));
        }
      } catch (err) {

        setError("No se pudieron cargar los datos de contabilidad. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Categorías disponibles
  const categorias = ['Ventas', 'Producción', 'Operativos', 'Marketing', 'Administrativos', 'Otros'];

  // Calcular totales
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);
    
  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);
    
  const balance = totalIngresos - totalGastos;

  // Filtrar transacciones
  const transaccionesFiltradas = transacciones.filter(t => {
    const cumpleFiltroTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    const cumpleFiltroCategoria = filtroCategoria === 'todas' || t.categoria === filtroCategoria;
    return cumpleFiltroTipo && cumpleFiltroCategoria;
  });

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaccionActual({
      ...transaccionActual,
      [name]: name === 'monto' ? parseFloat(value) || '' : value
    });
  };

  // Abrir modal para nueva transacción
  const abrirModalNuevo = () => {
    setTransaccionActual({
      fecha: new Date().toISOString().split('T')[0],
      concepto: '',
      tipo: 'ingreso',
      monto: '',
      categoria: ''
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (transaccion) => {
    // Preparar formulario para edición
    // Asegurar que el ID esté explícitamente establecido
    setTransaccionActual({
      id: transaccion.id, // Asegurar que el ID esté explícitamente establecido
      ...transaccion
    });
    setModalAbierto(true);
  };

  // Guardar transacción
  const guardarTransaccion = async (e) => {
    e.preventDefault();
    
    try {
      // Validar datos antes de enviar
      if (!transaccionActual.concepto || !transaccionActual.concepto.trim()) {
        alert("Por favor ingresa un concepto válido");
        return;
      }
      
      if (!transaccionActual.fecha) {
        alert("Por favor selecciona una fecha válida");
        return;
      }
      
      if (!transaccionActual.monto) {
        alert("Por favor ingresa un monto válido");
        return;
      }

      // Asegurar que el monto sea un número válido
      const montoNumerico = parseFloat(transaccionActual.monto);
      if (isNaN(montoNumerico) || montoNumerico <= 0) {
        alert("El monto debe ser un número válido mayor que cero");
        return;
      }

      // Preparar datos para la API - asegurar que todos los campos tengan el formato correcto
      // Usar nombres de campo que funcionen tanto con la API real como con la simulada
      const expenseData = {
        concept: transaccionActual.concepto.trim(),
        concepto: transaccionActual.concepto.trim(), // Duplicar para compatibilidad
        date: transaccionActual.fecha, // Asegurar formato YYYY-MM-DD
        fecha: transaccionActual.fecha, // Duplicar para compatibilidad
        amount: montoNumerico,
        monto: montoNumerico, // Duplicar para compatibilidad
        category: (transaccionActual.categoria && transaccionActual.categoria.trim()) || 'Otros',
        categoria: (transaccionActual.categoria && transaccionActual.categoria.trim()) || 'Otros', // Duplicar para compatibilidad
        type: (transaccionActual.tipo && transaccionActual.tipo.trim()) || 'gasto',
        tipo: (transaccionActual.tipo && transaccionActual.tipo.trim()) || 'gasto' // Duplicar para compatibilidad
      };
      

      
      let response;
      
      if (transaccionActual.id) {
        // Verificar que el ID existe y es válido
        const expenseId = transaccionActual.id;
        if (!expenseId) {
          throw new Error("ID de transacción no válido");
        }
        

        
        try {
          // Actualizar existente
          response = await api.updateExpense(expenseId, expenseData);

          
          // Manejar diferentes formatos de respuesta del backend
          const responseData = response.expense || response.data || response;
          
          if (responseData && (responseData.id || responseData._id)) {
            // Actualizar el estado local con la transacción actualizada con manejo flexible de propiedades
            const updatedExpense = {
              id: responseData.id || responseData._id,
              fecha: responseData.date ? responseData.date.split('T')[0] : 
                     responseData.fecha ? responseData.fecha.split('T')[0] : 
                     new Date().toISOString().split('T')[0],
              concepto: responseData.concept || responseData.concepto || responseData.name || responseData.nombre || 'Sin concepto',
              tipo: responseData.type || responseData.tipo || 'gasto',
              monto: parseFloat(responseData.amount || responseData.monto || responseData.value || 0),
              categoria: responseData.category || responseData.categoria || 'Otros'
            };
            

            
            // Actualizar el estado local con la transacción actualizada
            setTransacciones(prevTransacciones => 
              prevTransacciones.map(t => t.id === expenseId ? updatedExpense : t)
            );
            
            alert("Transacción actualizada correctamente");
            setModalAbierto(false);
            setTransaccionActual(null); // Limpiar la transacción actual
          } else {
            console.error("Respuesta de API incompleta o en formato inesperado:", response);
            throw new Error("La respuesta de la API no contiene los datos esperados o tiene un formato diferente");
          }
        } catch (updateError) {

          alert("No se pudo actualizar la transacción. Por favor, intenta de nuevo más tarde.");
        }
      } else {
        // Crear nueva transacción

        
        try {
          response = await api.createExpense(expenseData);

          
          // Manejar diferentes formatos de respuesta del backend
          const responseData = response.expense || response.data || response;
          
          if (responseData && (responseData.id || responseData._id)) {
            // Añadir la nueva transacción al estado local con manejo flexible de propiedades
            const newExpense = {
              id: responseData.id || responseData._id,
              fecha: responseData.date ? responseData.date.split('T')[0] : 
                     responseData.fecha ? responseData.fecha.split('T')[0] : 
                     new Date().toISOString().split('T')[0],
              concepto: responseData.concept || responseData.concepto || responseData.name || responseData.nombre || 'Sin concepto',
              tipo: responseData.type || responseData.tipo || 'gasto',
              monto: parseFloat(responseData.amount || responseData.monto || responseData.value || 0),
              categoria: responseData.category || responseData.categoria || 'Otros'
            };
            

            
            // Actualizar el estado local con la nueva transacción
            setTransacciones(prevTransacciones => [...prevTransacciones, newExpense]);
            
            alert("Transacción guardada correctamente");
            setModalAbierto(false);
            setTransaccionActual(null); // Limpiar la transacción actual
          } else {
            console.error("Respuesta de API incompleta o en formato inesperado:", response);
            throw new Error("La respuesta de la API no contiene los datos esperados o tiene un formato diferente");
          }
        } catch (createError) {

          alert("No se pudo crear la transacción. Por favor, intenta de nuevo más tarde.");
        }
      }
    } catch (err) {

      alert("No se pudo guardar la transacción. Por favor, intenta de nuevo más tarde.");
    }
  };

  // Eliminar transacción
  const eliminarTransaccion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
      try {
        await api.deleteExpense(id);
        setTransacciones(transacciones.filter(t => t.id !== id));
      } catch (err) {

        alert("No se pudo eliminar la transacción. Por favor, intenta de nuevo más tarde.");
      }
    }
  };

  // Mostrar mensaje de carga
  if (loading) {
    return <div className="loading">Cargando datos de contabilidad...</div>;
  }

  // Mostrar mensaje de error
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="contabilidad-container">
      <div className="contabilidad-header">
        <h1>Gestión de Contabilidad</h1>
        <button className="btn-nuevo" onClick={abrirModalNuevo}>
          Nueva Transacción
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="tarjetas-resumen">
        <div className="tarjeta ingresos">
          <h3>Ingresos</h3>
          <p className="monto">${totalIngresos.toFixed(2)}</p>
        </div>
        <div className="tarjeta gastos">
          <h3>Gastos</h3>
          <p className="monto">${totalGastos.toFixed(2)}</p>
        </div>
        <div className={`tarjeta balance ${balance >= 0 ? 'positivo' : 'negativo'}`}>
          <h3>Balance</h3>
          <p className="monto">${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filtros">
        <div className="filtro">
          <label>Tipo:</label>
          <select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>
        <div className="filtro">
          <label>Categoría:</label>
          <select 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de transacciones */}
      <div className="tabla-container">
        <table className="tabla-transacciones">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transaccionesFiltradas.length > 0 ? (
              transaccionesFiltradas.map((transaccion) => (
                <tr key={transaccion.id} className={transaccion.tipo}>
                  <td>{transaccion.fecha}</td>
                  <td>{transaccion.concepto}</td>
                  <td>{transaccion.categoria}</td>
                  <td>{transaccion.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}</td>
                  <td className="monto">${transaccion.monto.toFixed(2)}</td>
                  <td className="acciones">
                    <button 
                      className="btn-editar" 
                      onClick={() => abrirModalEditar(transaccion)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-eliminar" 
                      onClick={() => eliminarTransaccion(transaccion.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-datos">No hay transacciones que coincidan con los filtros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar transacción */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{transaccionActual.id ? 'Editar' : 'Nueva'} Transacción</h2>
              <button className="btn-cerrar" onClick={() => setModalAbierto(false)}>×</button>
            </div>
            <form onSubmit={guardarTransaccion}>
              <div className="form-grupo">
                <label>Fecha:</label>
                <input 
                  type="date" 
                  name="fecha" 
                  value={transaccionActual.fecha} 
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Concepto:</label>
                <input 
                  type="text" 
                  name="concepto" 
                  value={transaccionActual.concepto} 
                  onChange={handleChange}
                  placeholder="Descripción de la transacción"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Tipo:</label>
                <div className="radio-grupo">
                  <label>
                    <input 
                      type="radio" 
                      name="tipo" 
                      value="ingreso" 
                      checked={transaccionActual.tipo === 'ingreso'} 
                      onChange={handleChange} 
                    />
                    Ingreso
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="tipo" 
                      value="gasto" 
                      checked={transaccionActual.tipo === 'gasto'} 
                      onChange={handleChange} 
                    />
                    Gasto
                  </label>
                </div>
              </div>
              <div className="form-grupo">
                <label>Monto ($):</label>
                <input 
                  type="number" 
                  name="monto" 
                  value={transaccionActual.monto} 
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Categoría:</label>
                <select 
                  name="categoria" 
                  value={transaccionActual.categoria} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="botones-form">
                <button type="button" className="btn-cancelar" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contabilidad;
