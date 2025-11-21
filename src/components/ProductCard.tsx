import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Product } from "@/data/products";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} добавлен в корзину`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors duration-200"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-200",
              favorite
                ? "fill-favorite text-favorite"
                : "text-foreground hover:text-favorite"
            )}
          />
        </button>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{product.weight}г</span>
          <span className="font-bold text-xl text-foreground">
            {product.price}₽
          </span>
        </div>

        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          В корзину
        </Button>
      </CardContent>
    </Card>
  );
};
