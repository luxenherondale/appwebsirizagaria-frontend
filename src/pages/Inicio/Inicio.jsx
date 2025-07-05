import { useState, useEffect } from 'react';
import './Inicio.css';

export const Inicio = () => {
  // Estados para almacenar los datos
  const [stockData, setStockData] = useState(null);
  const [contabilidadData, setContabilidadData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo para desarrollo (simulando una carga de datos)
  useEffect(() => {
    // Simular carga de datos de stock
    const stockMockData = [
      {
        id: 1,
        titulo: "El jardín de las mariposas",
        impresionTotal: 50,
        vendidosWeb: 15,
        consignadosVendidos: 8,
        consignadosNoVendidos: 12,
        promocionales: 5,
        regalados: 3
      },
      {
        id: 2,
        titulo: "Cien años de soledad",
        impresionTotal: 100,
        vendidosWeb: 25,
        consignadosVendidos: 18,
        consignadosNoVendidos: 7,
        promocionales: 10,
        regalados: 5
      },
      {
        id: 3,
        titulo: "La nueva violencia moderna",
        impresionTotal: 1040,
        vendidosWeb: 10,
        consignadosVendidos: 4,
        consignadosNoVendidos: 229,
        promocionales: 49,
        regalados: 15
      }
    ];

    // Simular carga de datos de contabilidad
    const contabilidadMockData = [
      { id: 1, fecha: '2025-06-01', concepto: 'Venta de libros', tipo: 'ingreso', monto: 1500.00, categoria: 'Ventas' },
      { id: 2, fecha: '2025-06-05', concepto: 'Pago de impresión', tipo: 'gasto', monto: 800.00, categoria: 'Producción' },
      { id: 3, fecha: '2025-06-10', concepto: 'Venta mayorista', tipo: 'ingreso', monto: 3200.00, categoria: 'Ventas' },
      { id: 4, fecha: '2025-06-15', concepto: 'Pago de servicios', tipo: 'gasto', monto: 450.00, categoria: 'Operativos' },
      { id: 5, fecha: '2025-06-20', concepto: 'Pago de diseño', tipo: 'gasto', monto: 1200.00, categoria: 'Producción' }
    ];

    setStockData(stockMockData);
    setContabilidadData(contabilidadMockData);
    setLoading(false);
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

  // Calcular datos para mostrar
  const totalesStock = calcularTotalesStock();
  const datosLibros = calcularDatosLibros();
  const datosContabilidadPorCategoria = calcularDatosContabilidadPorCategoria();
  const resumenContabilidad = calcularResumenContabilidad();

  return (
    <div className="inicio-container">
      <h1 className="inicio-titulo">Dashboard Editorial</h1>
      
      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Inicio;
