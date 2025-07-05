import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import Index from "../../pages/Index/Index";
import Register from "../../pages/Register/Register";
import { Stock } from "../../pages/Stock/Stock";
import { Contabilidad } from "../../pages/Contabilidad/Contabilidad";
import { Inicio } from "../../pages/Inicio/Inicio";
import { MainLayout } from "../Main/Main";
import { useAuth } from "../../contexts/AuthContext";
import NotFound from "../../pages/NotFound/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Index />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* <TooltipProvider>
      <Toaster />
      <Sonner /> */}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/inicio"
              element={
                <ProtectedRoute>
                  <Inicio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedRoute>
                  <Stock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contabilidad"
              element={
                <ProtectedRoute>
                  <Contabilidad />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyectos"
              element={
                <ProtectedRoute>
                  <div className="coming-soon">
                    <div className="coming-soon-icon">📝</div>
                    <h2 className="coming-soon-title">Proyectos en Proceso</h2>
                    <p className="coming-soon-description">Este módulo está en desarrollo y estará disponible próximamente</p>
                    <div className="coming-soon-progress">
                      <div className="coming-soon-progress-bar" style={{ width: '25%' }}></div>
                    </div>
                    <p className="coming-soon-status">Progreso: 25%</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cotizaciones"
              element={
                <ProtectedRoute>
                  <div className="coming-soon">
                    <div className="coming-soon-icon">📋</div>
                    <h2 className="coming-soon-title">Módulo de Cotizaciones</h2>
                    <p className="coming-soon-description">Este módulo está en desarrollo y estará disponible próximamente</p>
                    <div className="coming-soon-progress">
                      <div className="coming-soon-progress-bar" style={{ width: '20%' }}></div>
                    </div>
                    <p className="coming-soon-status">Progreso: 20%</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketing"
              element={
                <ProtectedRoute>
                  <div className="coming-soon">
                    <div className="coming-soon-icon">📢</div>
                    <h2 className="coming-soon-title">Módulo de Marketing</h2>
                    <p className="coming-soon-description">Este módulo está en desarrollo y estará disponible próximamente</p>
                    <div className="coming-soon-progress">
                      <div className="coming-soon-progress-bar" style={{ width: '15%' }}></div>
                    </div>
                    <p className="coming-soon-status">Progreso: 15%</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock-externo"
              element={
                <ProtectedRoute>
                  <div className="coming-soon">
                    <div className="coming-soon-icon">📦</div>
                    <h2 className="coming-soon-title">Stock Externo</h2>
                    <p className="coming-soon-description">Este módulo está en desarrollo y estará disponible próximamente</p>
                    <div className="coming-soon-progress">
                      <div className="coming-soon-progress-bar" style={{ width: '10%' }}></div>
                    </div>
                    <p className="coming-soon-status">Progreso: 10%</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    {/* </TooltipProvider> */}
  </QueryClientProvider>
);

export default App;
