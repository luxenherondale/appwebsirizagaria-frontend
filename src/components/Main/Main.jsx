import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Footer } from "../Footer/Footer";
import "./Main.css";

// Función para obtener el título de la página según la ruta actual
const getPageTitle = (pathname) => {
  const titles = {
    '/inicio': 'Dashboard',
    '/stock': 'Gestión de Stock',
    '/contabilidad': 'Contabilidad',
    '/proyectos': 'Proyectos en Proceso',
    '/cotizaciones': 'Cotizaciones',
    '/marketing': 'Marketing',
    '/stock-externo': 'Stock Externo'
  };
  
  return titles[pathname] || 'Dashboard';
};

// Función para obtener los elementos del menú según el rol del usuario
const getNavItems = (role) => {
  const items = [
    { to: "/inicio", icon: "📊", text: "Dashboard" },
    { to: "/stock", icon: "📚", text: "Stock Editorial" },
    { to: "/contabilidad", icon: "💰", text: "Contabilidad" },
    { to: "/proyectos", icon: "📝", text: "Proyectos" },
    { to: "/cotizaciones", icon: "📋", text: "Cotizaciones" },
    { to: "/marketing", icon: "📢", text: "Marketing" },
    { to: "/stock-externo", icon: "📦", text: "Stock Externo" }
  ];
  
  // Filtrar elementos según el rol si es necesario
  return items;
};

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const navItems = getNavItems(user?.role);
  const pageTitle = getPageTitle(currentPath);
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  
  return (
    <div className="main-container">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="logo">
          <img className="logo-image" src="/logo.png" alt="Logo" onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/50x50?text=SA';
          }} />
        
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <Link 
                  to={item.to} 
                  className={`nav-link ${currentPath === item.to ? 'active' : ''}`}
                  onClick={closeSidebar}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="user-section">
          <div className="user-avatar">{userInitials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role === 'admin' ? 'Administrador' : user?.role === 'editor' ? 'Editor' : 'Lector'}</div>
          </div>
          <button className="logout-button" onClick={logout} title="Cerrar sesión"> Salir
          </button>
        </div>
      </aside>
      
      <div className={`overlay ${sidebarOpen ? 'overlay-visible' : ''}`} onClick={closeSidebar} />
      
      <main className="content">
        <header className="header">
          <button className="menu-button" onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className="page-title">{pageTitle}</h1>
        </header>
        
        <div className="content-container">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};