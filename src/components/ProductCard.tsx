import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors duration-200"
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-200",
              isFavorite
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

        <Button className="w-full bg-gradient-hero hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          В корзину
        </Button>
      </CardContent>
    </Card>
  );
};
