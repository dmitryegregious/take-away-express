import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductGrid } from "@/components/ProductGrid";
import { useFavorites } from "@/contexts/FavoritesContext";
import { products } from "@/data/products";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  
  const favoriteProducts = products.filter((p) =>
    favorites.includes(p.id)
  );

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Heart className="w-24 h-24 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">
              Нет избранных товаров
            </h2>
            <p className="text-muted-foreground text-center">
              Добавьте товары в избранное, нажав на сердечко
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-hero mt-4"
            >
              Перейти в меню
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Избранное</h1>
          <span className="text-muted-foreground">
            {favoriteProducts.length} товаров
          </span>
        </div>

        <ProductGrid products={favoriteProducts} />
      </main>

      <BottomNav />
    </div>
  );
};

export default Favorites;
