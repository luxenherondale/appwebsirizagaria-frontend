import { useState, useEffect } from "react";
import "./Stock.css";

// Datos de ejemplo para desarrollo
const initialBooks = [
  {
    id: 1,
    titulo: "El jardín de las mariposas",
    autor: "Dot Hutchison",
    isbn: "9788416387588",
    portada: "https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg",
    sinopsis: "Cerca de un aislado bosque, un jardinero cultiva las más hermosas mariposas. Las atrapa y colecciona, añadiéndolas a su jardín. Ellas son su arte y su obsesión. A las chicas las llama Las Mariposas... Y están cautivas.",
    impresionTotal: 50,
    vendidosWeb: 15,
    consignadosVendidos: 8,
    consignadosNoVendidos: 12,
    promocionales: 5,
    regalados: 3,
    ubicacionActual: "Bodega principal"
  },
  {
    id: 2,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    isbn: "9788497592208",
    portada: "https://images.penguinrandomhouse.com/cover/9780307474728",
    sinopsis: "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.",
    impresionTotal: 100,
    vendidosWeb: 25,
    consignadosVendidos: 18,
    consignadosNoVendidos: 7,
    promocionales: 10,
    regalados: 5,
    ubicacionActual: "Librería El Ateneo"
  },
  {
    id: 3,
    titulo: "La nueva violencia moderna",
    autor: "Sebastian Rodrigo",
    isbn: "9789560817105",
    portada: "https://isbnchile.cl/files/titulos/168550.jpg",
    sinopsis: "Hace cinco años lo soñé: Una guerra contra el mundo moderno, botellas tiradas en la arena y carteles con la imagen de dos mujeres, quemándose en la costa de una magnífica ciudad tropical. Kanae Guiedxe, profesora de filosofía en un colegio de Viña del Mar, despierta sintiendo que vuelve a experimentar el mundo por primera vez. Atrapada en una consciencia infantilizada e incapaz de continuar con su vida, es salvada del colapso por un hombre misterioso, quien le pagará sumas millonarias a cambio de su participación en un extraño proyecto político y científico: Traer de vuelta el Antiguo Imperio Sochiano, civilización que en algún momento gobernó todo el universo observable y al que está conectada de una forma que ninguno de sus nuevos empleadores está dispuesto a explicarle. Entre la playa de Reñaca, los lagos y volcanes de Nicaragua, la selva de Guinea Ecuatorial y un exoplaneta de plantas moradas, La Nueva Violencia Moderna nos plantea una mezcla entre una narrativa épica y un drama personal, pasando por la ficción histórica y una crítica social muy original, que contradice muchas de las convenciones, no solo de la literatura, sino que también de nuestra sociedad actual.",
    impresionTotal: 1040,
    vendidosWeb: 10,
    consignadosVendidos: 4,
    consignadosNoVendidos: 229,
    promocionales: 49,
    regalados: 15,
    ubicacionActual: "Bodega principal"
  }
];

export const Stock = () => {
  // Estados para manejar los libros y el formulario
  const [books, setBooks] = useState(initialBooks);
  const [showForm, setShowForm] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    portada: "",
    sinopsis: "",
    impresionTotal: 0,
    vendidosWeb: 0,
    consignadosVendidos: 0,
    consignadosNoVendidos: 0,
    promocionales: 0,
    regalados: 0,
    ubicacionActual: ""
  });

  // Cálculos para las tarjetas de resumen
  const totalImpresion = books.reduce((sum, book) => sum + book.impresionTotal, 0);
  const totalVendidosWeb = books.reduce((sum, book) => sum + book.vendidosWeb, 0);
  const totalConsignadosVendidos = books.reduce((sum, book) => sum + book.consignadosVendidos, 0);
  const totalConsignadosNoVendidos = books.reduce((sum, book) => sum + book.consignadosNoVendidos, 0);
  const totalPromocionales = books.reduce((sum, book) => sum + book.promocionales, 0);
  const totalRegalados = books.reduce((sum, book) => sum + book.regalados, 0);
  const totalLibros = totalVendidosWeb + totalConsignadosVendidos + totalConsignadosNoVendidos + totalPromocionales + totalRegalados;
  // Cálculo de libros en bodega (impresión total - (vendidos + no vendidos))
  const enBodega = totalImpresion - totalLibros;

  // Función para abrir el formulario para añadir un nuevo libro
  const handleAddBook = () => {
    setCurrentBook(null);
    setFormData({
      titulo: "",
      autor: "",
      isbn: "",
      portada: "",
      sinopsis: "",
      impresionTotal: 0,
      vendidosWeb: 0,
      consignadosVendidos: 0,
      consignadosNoVendidos: 0,
      promocionales: 0,
      regalados: 0,
      ubicacionActual: ""
    });
    setShowForm(true);
  };

  // Función para abrir el formulario para editar un libro existente
  const handleEditBook = (book) => {
    setCurrentBook(book);
    setFormData({
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      portada: book.portada,
      sinopsis: book.sinopsis,
      impresionTotal: book.impresionTotal,
      vendidosWeb: book.vendidosWeb,
      consignadosVendidos: book.consignadosVendidos,
      consignadosNoVendidos: book.consignadosNoVendidos,
      promocionales: book.promocionales,
      regalados: book.regalados,
      ubicacionActual: book.ubicacionActual
    });
    setShowForm(true);
  };

  // Función para eliminar un libro
  const handleDeleteBook = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convertir a número si es un campo numérico
    const numericFields = ['impresionTotal', 'vendidosWeb', 'consignadosVendidos', 'consignadosNoVendidos', 'promocionales', 'regalados'];
    const processedValue = numericFields.includes(name) ? parseInt(value, 10) || 0 : value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Función para guardar un libro (nuevo o editado)
  const handleSaveBook = (e) => {
    e.preventDefault();
    
    if (currentBook) {
      // Actualizar libro existente
      setBooks(books.map(book => 
        book.id === currentBook.id ? { ...book, ...formData } : book
      ));
    } else {
      // Añadir nuevo libro
      const newBook = {
        ...formData,
        id: Date.now() // Generar un ID único basado en la fecha actual
      };
      setBooks([...books, newBook]);
    }
    
    // Cerrar el formulario
    setShowForm(false);
  };

  return (
    <div className="stock-container">
      {/* Tarjetas de resumen */}
      <div className="summary-cards">
        <div className="summary-card impresion-total">
          <div className="summary-card-title">Impresión Total</div>
          <div className="summary-card-value">{totalImpresion}</div>
        </div>
        <div className="summary-card web">
          <div className="summary-card-title">Vendidos Web</div>
          <div className="summary-card-value">{totalVendidosWeb}</div>
        </div>
        <div className="summary-card consignados-vendidos">
          <div className="summary-card-title">Consignados Vendidos</div>
          <div className="summary-card-value">{totalConsignadosVendidos}</div>
        </div>
        <div className="summary-card consignados-no-vendidos">
          <div className="summary-card-title">Consignados No Vendidos</div>
          <div className="summary-card-value">{totalConsignadosNoVendidos}</div>
        </div>
        <div className="summary-card promocionales">
          <div className="summary-card-title">Promocionales</div>
          <div className="summary-card-value">{totalPromocionales}</div>
        </div>
        <div className="summary-card regalados">
          <div className="summary-card-title">Regalados</div>
          <div className="summary-card-value">{totalRegalados}</div>
        </div>
        <div className="summary-card en-bodega">
          <div className="summary-card-title">En Bodega</div>
          <div className="summary-card-value">{enBodega}</div>
        </div>
        <div className="summary-card total">
          <div className="summary-card-title">Total</div>
          <div className="summary-card-value">{totalLibros}</div>
        </div>
      </div>

      {/* Encabezado y botón para añadir */}
      <div className="stock-header">
        <h2 className="stock-title">Catálogo de Libros</h2>
        <button className="add-book-button" onClick={handleAddBook}>
          <span>+</span> Añadir Libro
        </button>
      </div>

      {/* Tabla de libros */}
      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>Portada</th>
              <th>Título</th>
              <th>Autor</th>
              <th>ISBN</th>
              <th>Impresión Total</th>
              <th>Vendidos Web</th>
              <th>Consignados Vendidos</th>
              <th>Consignados No Vendidos</th>
              <th>Promocionales</th>
              <th>Regalados</th>
              <th>Ubicación Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>
                  <img 
                    src={book.portada || "https://via.placeholder.com/50x70?text=No+Image"} 
                    alt={book.titulo}
                    className="book-cover"
                  />
                </td>
                <td>{book.titulo}</td>
                <td>{book.autor}</td>
                <td>{book.isbn}</td>
                <td>{book.impresionTotal}</td>
                <td>{book.vendidosWeb}</td>
                <td>{book.consignadosVendidos}</td>
                <td>{book.consignadosNoVendidos}</td>
                <td>{book.promocionales}</td>
                <td>{book.regalados}</td>
                <td>{book.ubicacionActual}</td>
                <td className="book-actions">
                  <button 
                    className="book-action-button" 
                    onClick={() => handleEditBook(book)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    className="book-action-button delete" 
                    onClick={() => handleDeleteBook(book.id)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario modal para añadir/editar libro */}
      {showForm && (
        <div className="book-form-overlay">
          <div className="book-form">
            <div className="book-form-header">
              <h3 className="book-form-title">
                {currentBook ? "Editar Libro" : "Añadir Nuevo Libro"}
              </h3>
              <button className="close-button" onClick={() => setShowForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleSaveBook}>
              {/* Previsualización de portada */}
              {formData.portada && (
                <img 
                  src={formData.portada} 
                  alt="Portada del libro" 
                  className="book-cover-preview"
                />
              )}
              
              {/* URL de la portada */}
              <div className="form-group">
                <label className="form-label" htmlFor="portada">URL de la Portada</label>
                <input
                  className="form-input"
                  type="text"
                  id="portada"
                  name="portada"
                  value={formData.portada}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              {/* Información básica del libro */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="titulo">Título</label>
                  <input
                    className="form-input"
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="autor">Autor</label>
                  <input
                    className="form-input"
                    type="text"
                    id="autor"
                    name="autor"
                    value={formData.autor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="isbn">ISBN</label>
                  <input
                    className="form-input"
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ubicacionActual">Ubicación Actual</label>
                  <input
                    className="form-input"
                    type="text"
                    id="ubicacionActual"
                    name="ubicacionActual"
                    value={formData.ubicacionActual}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              {/* Sinopsis */}
              <div className="form-group">
                <label className="form-label" htmlFor="sinopsis">Sinopsis</label>
                <textarea
                  className="form-input"
                  id="sinopsis"
                  name="sinopsis"
                  value={formData.sinopsis}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              {/* Categorías de stock */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="impresionTotal">Impresión Total</label>
                  <input
                    className="form-input"
                    type="number"
                    id="impresionTotal"
                    name="impresionTotal"
                    value={formData.impresionTotal}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="vendidosWeb">Vendidos Web</label>
                  <input
                    className="form-input"
                    type="number"
                    id="vendidosWeb"
                    name="vendidosWeb"
                    value={formData.vendidosWeb}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="consignadosVendidos">Consignados Vendidos</label>
                  <input
                    className="form-input"
                    type="number"
                    id="consignadosVendidos"
                    name="consignadosVendidos"
                    value={formData.consignadosVendidos}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="consignadosNoVendidos">Consignados No Vendidos</label>
                  <input
                    className="form-input"
                    type="number"
                    id="consignadosNoVendidos"
                    name="consignadosNoVendidos"
                    value={formData.consignadosNoVendidos}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="promocionales">Promocionales</label>
                  <input
                    className="form-input"
                    type="number"
                    id="promocionales"
                    name="promocionales"
                    value={formData.promocionales}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="regalados">Regalados</label>
                  <input
                    className="form-input"
                    type="number"
                    id="regalados"
                    name="regalados"
                    value={formData.regalados}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  {/* Espacio vacío para mantener la alineación */}
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  {currentBook ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
