import { useState, useEffect } from 'react';
import './Inicio.css';
import MainApi from '../../utils/MainApi';

export const Inicio = () => {
  // Estados para almacenar los datos
  const [stockData, setStockData] = useState(null);
  const [contabilidadData, setContabilidadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Instancia de la API
  const api = new MainApi();

  // Cargar datos reales de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar datos de libros
        const booksResponse = await api.getBooks();

        
        if (booksResponse && booksResponse.books) {
          // Transformar los datos al formato esperado por el dashboard
          const formattedBooks = booksResponse.books.map(book => ({
            id: book.id,
            titulo: book.title || book.titulo,
            autor: book.author || book.autor,
            impresionTotal: (parseInt(book.stock) || 0) + (parseInt(book.sold) || 0),
            vendidosWeb: parseInt(book.sold) || 0,
            consignadosVendidos: parseInt(book.consignadosVendidos) || 0,
            consignadosNoVendidos: parseInt(book.consignadosNoVendidos) || 0,
            promocionales: parseInt(book.promocionales) || 0,
            regalados: parseInt(book.regalados) || 0
          }));
          
          setStockData(formattedBooks);
        } else {
          throw new Error('No se pudieron cargar los datos de libros');
        }
        
        // Cargar datos de gastos/ingresos
        const expensesResponse = await api.getExpenses();

        
        // Verificar si hay datos de gastos disponibles
        if (expensesResponse && Array.isArray(expensesResponse.expenses)) {
          // Transformar los datos al formato esperado por el dashboard
          const formattedExpenses = expensesResponse.expenses.map(expense => ({
            id: expense.id,
            fecha: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
            concepto: expense.concept || expense.concepto,
            tipo: expense.type || expense.tipo || 'gasto',
            monto: parseFloat(expense.amount) || parseFloat(expense.monto) || 0,
            categoria: expense.category || expense.categoria || 'Otros'
          }));
          
          setContabilidadData(formattedExpenses);
        } else {
          throw new Error('No se pudieron cargar los datos de contabilidad');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calcular totales de stock
  const calcularTotalesStock = () => {
    if (!stockData) return { totalImpresion: 0, totalVendidos: 0, totalNoVendidos: 0, porcentajeVendidos: 0, enBodega: 0 };

    const totalImpresion = stockData.reduce((sum, book) => sum + book.impresionTotal, 0);
    const totalVendidosWeb = stockData.reduce((sum, book) => sum + book.vendidosWeb, 0);
    const totalConsignadosVendidos = stockData.reduce((sum, book) => sum + book.consignadosVendidos, 0);
    const totalConsignadosNoVendidos = stockData.reduce((sum, book) => sum + book.consignadosNoVendidos, 0);
    const totalPromocionales = stockData.reduce((sum, book) => sum + book.promocionales, 0);
    const totalRegalados = stockData.reduce((sum, book) => sum + book.regalados, 0);
    
    const totalVendidos = totalVendidosWeb + totalConsignadosVendidos;
    const totalNoVendidos = totalConsignadosNoVendidos + totalPromocionales + totalRegalados;
    const porcentajeVendidos = Math.round((totalVendidos / totalImpresion) * 100);
    
    // Calcular libros en bodega (impresos - (vendidos + no vendidos))
    const enBodega = totalImpresion - (totalVendidos + totalNoVendidos);
    
    return { 
      totalImpresion, 
      totalVendidos, 
      totalNoVendidos, 
      porcentajeVendidos,
      totalVendidosWeb,
      totalConsignadosVendidos,
      totalConsignadosNoVendidos,
      totalPromocionales,
      totalRegalados,
      enBodega
    };
  };
  
  // Calcular datos de libros para mostrar en la tabla
  const calcularDatosLibros = () => {
    if (!stockData) return [];
    
    return stockData.map(book => {
      const totalVendidos = book.vendidosWeb + book.consignadosVendidos;
      const totalNoVendidos = book.consignadosNoVendidos + book.promocionales + book.regalados;
      const porcentajeVendidos = Math.round((totalVendidos / book.impresionTotal) * 100);
      
      // Calcular libros en bodega para cada libro
      const enBodega = book.impresionTotal - (totalVendidos + totalNoVendidos);
      
      return {
        ...book,
        totalVendidos,
        totalNoVendidos,
        porcentajeVendidos,
        enBodega
      };
    });
  };
  
  // Calcular datos de contabilidad por categoría
  const calcularDatosContabilidadPorCategoria = () => {
    if (!contabilidadData) return [];

    // Agrupar por categoría
    const categorias = {};
    contabilidadData.forEach(transaccion => {
      if (!categorias[transaccion.categoria]) {
        categorias[transaccion.categoria] = {
          categoria: transaccion.categoria,
          ingresos: 0,
          gastos: 0,
          balance: 0
        };
      }
      
      if (transaccion.tipo === 'ingreso') {
        categorias[transaccion.categoria].ingresos += transaccion.monto;
      } else {
        categorias[transaccion.categoria].gastos += transaccion.monto;
      }
      
      categorias[transaccion.categoria].balance = 
        categorias[transaccion.categoria].ingresos - categorias[transaccion.categoria].gastos;
    });

    return Object.values(categorias);
  };

  // Calcular resumen de contabilidad
  const calcularResumenContabilidad = () => {
    if (!contabilidadData) return { totalIngresos: 0, totalGastos: 0, balance: 0 };

    const totalIngresos = contabilidadData
      .filter(t => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);
      
    const totalGastos = contabilidadData
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.monto, 0);
      
    const balance = totalIngresos - totalGastos;

    return { totalIngresos, totalGastos, balance };
  };

  // Calcular totales de contabilidad
  const calcularTotalesContabilidad = () => {
    if (!contabilidadData) return { totalIngresos: 0, totalGastos: 0, balance: 0 };

    const totalIngresos = contabilidadData
      .filter(item => item.tipo === 'ingreso')
      .reduce((sum, item) => sum + item.monto, 0);
      
    const totalGastos = contabilidadData
      .filter(item => item.tipo === 'gasto')
      .reduce((sum, item) => sum + item.monto, 0);
      
    const balance = totalIngresos - totalGastos;
    
    return { totalIngresos, totalGastos, balance };
  };

  // Calcular datos por categoría
  const calcularDatosPorCategoria = () => {
    if (!contabilidadData) return [];
    
    const categorias = {};
    
    contabilidadData.forEach(item => {
      const categoria = item.categoria || 'Otros';
      
      if (!categorias[categoria]) {
        categorias[categoria] = { ingresos: 0, gastos: 0 };
      }
      
      if (item.tipo === 'ingreso') {
        categorias[categoria].ingresos += item.monto;
      } else {
        categorias[categoria].gastos += item.monto;
      }
    });
    
    return Object.entries(categorias).map(([nombre, datos]) => ({
      nombre,
      ingresos: datos.ingresos,
      gastos: datos.gastos,
      balance: datos.ingresos - datos.gastos
    }));
  };

  // Mostrar mensaje de carga
  if (loading) {
    return <div className="loading">Cargando datos del dashboard...</div>;
  }
  
  // Mostrar mensaje de error
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Calcular datos para mostrar
  const totalesStock = calcularTotalesStock();
  const datosLibros = calcularDatosLibros();
  const datosContabilidadPorCategoria = calcularDatosContabilidadPorCategoria();
  const resumenContabilidad = calcularResumenContabilidad();

  return (
    <div className="inicio-container">
      <h1 className="inicio-titulo">Dashboard Editorial</h1>
      
      {/* Sección de Stock */}
      <section className="dashboard-section">
        <h2 className="section-titulo">Resumen de Stock</h2>
        
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Porcentaje de Vendidos</h3>
            <div className="porcentaje-container">
              <div className="porcentaje-circulo" style={{ '--porcentaje': `${totalesStock.porcentajeVendidos}%` }}>
                <span className="porcentaje-valor">{totalesStock.porcentajeVendidos}%</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Distribución de Libros</h3>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-label">Vendidos</div>
                <div className="stat-value">{totalesStock.totalVendidos}</div>
                <div className="stat-bar" style={{ width: `${(totalesStock.totalVendidos / totalesStock.totalImpresion) * 100}%`, backgroundColor: '#4CAF50' }}></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">No Vendidos</div>
                <div className="stat-value">{totalesStock.totalNoVendidos}</div>
                <div className="stat-bar" style={{ width: `${(totalesStock.totalNoVendidos / totalesStock.totalImpresion) * 100}%`, backgroundColor: '#FF5722' }}></div>
              </div>
              <div className="stat-item">
                <div className="stat-label">En Bodega</div>
                <div className="stat-value">{totalesStock.enBodega}</div>
                <div className="stat-bar" style={{ width: `${(totalesStock.enBodega / totalesStock.totalImpresion) * 100}%`, backgroundColor: '#2196F3' }}></div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card wide-card">
                <h3>Distribución por Libro</h3>
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Impresión Total</th>
                        <th>Vendidos</th>
                        <th>No Vendidos</th>
                        <th>En Bodega</th>
                        <th>% Vendidos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosLibros.map(libro => (
                        <tr key={libro.id}>
                          <td>{libro.titulo}</td>
                          <td>{libro.impresionTotal}</td>
                          <td>{libro.totalVendidos}</td>
                          <td>{libro.totalNoVendidos}</td>
                          <td>{libro.enBodega}</td>
                          <td>
                            <div className="progress-bar">
                              <div 
                                className="progress-bar-fill" 
                                style={{ width: `${libro.porcentajeVendidos}%` }}
                              ></div>
                              <span className="progress-text">{libro.porcentajeVendidos}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
          
          {/* Sección de Contabilidad */}
          <section className="dashboard-section">
            <h2 className="section-titulo">Resumen de Contabilidad</h2>
            
            <div className="dashboard-cards">
              <div className="dashboard-card finance-card ingresos">
                <h3>Ingresos Totales</h3>
                <p className="finance-value">${resumenContabilidad.totalIngresos.toFixed(2)}</p>
              </div>
              
              <div className="dashboard-card finance-card gastos">
                <h3>Gastos Totales</h3>
                <p className="finance-value">${resumenContabilidad.totalGastos.toFixed(2)}</p>
              </div>
              
              <div className={`dashboard-card finance-card balance ${resumenContabilidad.balance >= 0 ? 'positivo' : 'negativo'}`}>
                <h3>Balance</h3>
                <p className="finance-value">${resumenContabilidad.balance.toFixed(2)}</p>
              </div>
              
              <div className="dashboard-card wide-card">
                <h3>Ingresos y Gastos por Categoría</h3>
                <div className="table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Categoría</th>
                        <th>Ingresos</th>
                        <th>Gastos</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosContabilidadPorCategoria.map((categoria, index) => (
                        <tr key={index}>
                          <td>{categoria.categoria}</td>
                          <td className="valor-positivo">${categoria.ingresos.toFixed(2)}</td>
                          <td className="valor-negativo">${categoria.gastos.toFixed(2)}</td>
                          <td className={categoria.balance >= 0 ? 'valor-positivo' : 'valor-negativo'}>
                            ${Math.abs(categoria.balance).toFixed(2)}
                            {categoria.balance >= 0 ? ' ↑' : ' ↓'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
      
    </div>
  );
};

export default Inicio;
