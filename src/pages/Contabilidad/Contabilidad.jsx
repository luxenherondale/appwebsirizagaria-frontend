import { useState } from 'react';
import './Contabilidad.css';

export const Contabilidad = () => {
  // Estados para manejar los datos de contabilidad
  const [transacciones, setTransacciones] = useState([
    { id: 1, fecha: '2025-06-01', concepto: 'Venta de libros', tipo: 'ingreso', monto: 1500.00, categoria: 'Ventas' },
    { id: 2, fecha: '2025-06-05', concepto: 'Pago de impresión', tipo: 'gasto', monto: 800.00, categoria: 'Producción' },
    { id: 3, fecha: '2025-06-10', concepto: 'Venta mayorista', tipo: 'ingreso', monto: 3200.00, categoria: 'Ventas' },
    { id: 4, fecha: '2025-06-15', concepto: 'Pago de servicios', tipo: 'gasto', monto: 450.00, categoria: 'Operativos' },
    { id: 5, fecha: '2025-06-20', concepto: 'Pago de diseño', tipo: 'gasto', monto: 1200.00, categoria: 'Producción' }
  ]);
  
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
    setTransaccionActual({ ...transaccion });
    setModalAbierto(true);
  };

  // Guardar transacción
  const guardarTransaccion = (e) => {
    e.preventDefault();
    
    if (transaccionActual.id) {
      // Actualizar existente
      setTransacciones(transacciones.map(t => 
        t.id === transaccionActual.id ? transaccionActual : t
      ));
    } else {
      // Crear nueva
      const nuevaTransaccion = {
        ...transaccionActual,
        id: Date.now()
      };
      setTransacciones([...transacciones, nuevaTransaccion]);
    }
    
    setModalAbierto(false);
  };

  // Eliminar transacción
  const eliminarTransaccion = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
      setTransacciones(transacciones.filter(t => t.id !== id));
    }
  };

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
