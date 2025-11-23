import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductGrid } from "@/components/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { products, loading: productsLoading } = useProducts();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();
  
  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );

  const isLoading = productsLoading || favoritesLoading;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Избранное</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Heart className="w-24 h-24 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Нет избранных товаров
            </h2>
            <p className="text-muted-foreground text-center">
              Добавьте товары в избранное, чтобы они появились здесь
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-hero mt-4"
            >
              Перейти в меню
            </Button>
          </div>
        ) : (
          <ProductGrid products={favoriteProducts} />
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Favorites;
