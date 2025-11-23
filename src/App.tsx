import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/admin/Login";
import AdminProducts from "./pages/admin/Products";
import AdminDeliveries from "./pages/admin/Deliveries";
import AdminUsers from "./pages/admin/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={["admin", "manager", "courier"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route path="products" element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <AdminProducts />
                    </ProtectedRoute>
                  } />
                  <Route path="deliveries" element={<AdminDeliveries />} />
                  <Route path="users" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminUsers />
                    </ProtectedRoute>
                  } />
                </Route>
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
