import { Link } from "react-router-dom";
import "./NotFound.css";

// Importamos el archivo CSS para este componente

// Los estilos están definidos en el archivo NotFound.css

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Página no encontrada</h2>
      <p className="not-found-description">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link className="back-button" to="/">Volver al inicio</Link>
    </div>
  );
};

export default NotFound;
