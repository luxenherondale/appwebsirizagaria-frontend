import { useState, useEffect } from "react";
import "./Stock.css";
import MainApi from "../../utils/MainApi";

// Instanciar la API
const api = new MainApi();

export const Stock = () => {
  // Estados para manejar los libros y el formulario
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    portada: "",
    sinopsis: "",
    stock: 0,
    sold: 0,
    consignadosVendidos: 0,
    consignadosNoVendidos: 0,
    promocionales: 0,
    regalados: 0,
    ubicacionActual: ""
  });

  // Cargar libros al montar el componente
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.getBooks();
        if (response && response.books) {
          setBooks(response.books.map(book => ({
            id: book.id,
            titulo: book.title,
            autor: book.author,
            isbn: book.isbn,
            portada: book.portada || "/default-book-cover.png",
            sinopsis: book.sinopsis || "Sin sinopsis disponible",
            impresionTotal: book.stock + book.sold,
            vendidosWeb: book.sold,
            consignadosVendidos: book.consignadosVendidos || 0,
            consignadosNoVendidos: book.consignadosNoVendidos || 0,
            promocionales: book.promocionales || 0,
            regalados: book.regalados || 0,
            ubicacionActual: book.ubicacionActual || "Bodega principal"
          })));
        }
      } catch (err) {
        console.error("Error al cargar libros:", err);
        setError("No se pudieron cargar los libros. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
      title: "",
      author: "",
      isbn: "",
      portada: "",
      sinopsis: "",
      stock: 0,
      sold: 0,
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
      title: book.titulo,
      author: book.autor,
      isbn: book.isbn,
      portada: book.portada,
      sinopsis: book.sinopsis,
      stock: book.impresionTotal - book.vendidosWeb,
      sold: book.vendidosWeb,
      consignadosVendidos: book.consignadosVendidos,
      consignadosNoVendidos: book.consignadosNoVendidos,
      promocionales: book.promocionales,
      regalados: book.regalados,
      ubicacionActual: book.ubicacionActual
    });
    setShowForm(true);
  };

  // Función para eliminar un libro
  const handleDeleteBook = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      try {
        await api.deleteBook(id);
        setBooks(books.filter(book => book.id !== id));
      } catch (err) {
        console.error("Error al eliminar el libro:", err);
        alert("No se pudo eliminar el libro. Por favor, intenta de nuevo más tarde.");
      }
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convertir a número si es un campo numérico
    const numericFields = ['stock', 'sold', 'consignadosVendidos', 'consignadosNoVendidos', 'promocionales', 'regalados'];
    const processedValue = numericFields.includes(name) ? parseInt(value, 10) || 0 : value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Función para guardar un libro (nuevo o editado)
  const handleSaveBook = async (e) => {
    e.preventDefault();
    
    try {
      // Validar datos antes de enviar
      if (!formData.title || !formData.author || !formData.isbn) {
        alert("Por favor completa los campos obligatorios: título, autor e ISBN");
        return;
      }

      // Preparar datos para la API
      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        portada: formData.portada || "",
        sinopsis: formData.sinopsis || "",
        stock: parseInt(formData.stock) || 0,
        sold: parseInt(formData.sold) || 0,
        consignadosVendidos: parseInt(formData.consignadosVendidos) || 0,
        consignadosNoVendidos: parseInt(formData.consignadosNoVendidos) || 0,
        promocionales: parseInt(formData.promocionales) || 0,
        regalados: parseInt(formData.regalados) || 0,
        ubicacionActual: formData.ubicacionActual || "Bodega principal"
      };
      
      let response;
      console.log('Enviando datos del libro a la API:', bookData);
      
      if (currentBook) {
        // Actualizar libro existente
        try {
          response = await api.updateBook(currentBook.id, bookData);
          console.log('Respuesta de actualización del libro:', response);
          
          if (response && response.book) {
            // Actualizar el estado local con el libro actualizado
            const updatedBook = {
              id: response.book.id,
              titulo: response.book.title,
              autor: response.book.author,
              isbn: response.book.isbn,
              portada: response.book.portada || "/default-book-cover.png",
              sinopsis: response.book.sinopsis || "Sin sinopsis disponible",
              impresionTotal: (parseInt(response.book.stock) || 0) + (parseInt(response.book.sold) || 0),
              vendidosWeb: parseInt(response.book.sold) || 0,
              consignadosVendidos: parseInt(response.book.consignadosVendidos) || 0,
              consignadosNoVendidos: parseInt(response.book.consignadosNoVendidos) || 0,
              promocionales: parseInt(response.book.promocionales) || 0,
              regalados: parseInt(response.book.regalados) || 0,
              ubicacionActual: response.book.ubicacionActual || "Bodega principal"
            };
            
            setBooks(books.map(book => 
              book.id === currentBook.id ? updatedBook : book
            ));
            
            alert("Libro actualizado correctamente");
            // Cerrar el formulario
            setShowForm(false);
          } else {
            throw new Error("La respuesta de la API no contiene los datos esperados");
          }
        } catch (updateError) {
          console.error("Error específico al actualizar el libro:", updateError);
          alert("No se pudo actualizar el libro. Por favor, intenta de nuevo más tarde.");
          return;
        }
      } else {
        // Añadir nuevo libro
        response = await api.createBook(bookData);
        console.log('Respuesta de creación del libro:', response);
        
        if (response && response.book) {
          // Añadir el nuevo libro al estado local
          const newBook = {
            id: response.book.id,
            titulo: response.book.title,
            autor: response.book.author,
            isbn: response.book.isbn,
            portada: response.book.portada || "/default-book-cover.png",
            sinopsis: response.book.sinopsis || "Sin sinopsis disponible",
            impresionTotal: (parseInt(response.book.stock) || 0) + (parseInt(response.book.sold) || 0),
            vendidosWeb: parseInt(response.book.sold) || 0,
            consignadosVendidos: parseInt(response.book.consignadosVendidos) || 0,
            consignadosNoVendidos: parseInt(response.book.consignadosNoVendidos) || 0,
            promocionales: parseInt(response.book.promocionales) || 0,
            regalados: parseInt(response.book.regalados) || 0,
            ubicacionActual: response.book.ubicacionActual || "Bodega principal"
          };
          
          setBooks([...books, newBook]);
          alert("Libro guardado correctamente");
          // Cerrar el formulario
          setShowForm(false);
        } else {
          throw new Error("La respuesta de la API no contiene los datos esperados");
        }
      }
    } catch (err) {
      console.error("Error al guardar el libro:", err);
      alert("No se pudo guardar el libro. Por favor, intenta de nuevo más tarde.");
    }
  };

  // Mostrar mensaje de carga
  if (loading) {
    return <div className="loading">Cargando libros...</div>;
  }

  // Mostrar mensaje de error
  if (error) {
    return <div className="error">{error}</div>;
  }

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
                    src={book.portada || "/default-book-cover.png"} 
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
                    name="title"
                    value={formData.title}
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
                    name="author"
                    value={formData.author}
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
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="vendidosWeb">Vendidos Web</label>
                  <input
                    className="form-input"
                    type="number"
                    id="sold"
                    name="sold"
                    value={formData.sold}
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
