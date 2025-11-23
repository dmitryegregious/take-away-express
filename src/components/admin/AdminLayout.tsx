import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, Truck, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export const AdminLayout = () => {
  const { user, logout, isAdmin, isManager, isCourier } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      path: "/admin/products", 
      label: "Товары", 
      icon: Package,
      show: isManager 
    },
    { 
      path: "/admin/deliveries", 
      label: "Доставки", 
      icon: Truck,
      show: true 
    },
    { 
      path: "/admin/users", 
      label: "Пользователи", 
      icon: Users,
      show: isAdmin 
    },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Возьми с собой" className="h-10 w-auto" />
              <span className="text-sm text-muted-foreground">
                {user?.name} ({user?.role})
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <nav className="w-64 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn("w-full justify-start", isActive && "bg-primary")}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
