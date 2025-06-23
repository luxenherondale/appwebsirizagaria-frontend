import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "../../pages/Index";
import { Stock } from "../../pages/Stock";
import { MainLayout } from "../Main/Main";
import { useAuth } from "@/contexts/AuthContext";
import NotFound from "../../pages/NotFound";

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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
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
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">
                      Módulo de Contabilidad
                    </h2>
                    <p className="text-gray-600">Próximamente disponible</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/proyectos"
              element={
                <ProtectedRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">
                      Proyectos en Proceso
                    </h2>
                    <p className="text-gray-600">Próximamente disponible</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cotizaciones"
              element={
                <ProtectedRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">
                      Módulo de Cotizaciones
                    </h2>
                    <p className="text-gray-600">Próximamente disponible</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketing"
              element={
                <ProtectedRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">
                      Módulo de Marketing
                    </h2>
                    <p className="text-gray-600">Próximamente disponible</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stock-externo"
              element={
                <ProtectedRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold mb-4">Stock Externo</h2>
                    <p className="text-gray-600">Próximamente disponible</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
