import { ProductCard } from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  image: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
}

export const ProductGrid = ({
  products,
  favorites,
  onToggleFavorite,
}: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={() => onToggleFavorite(product.id)}
        />
      ))}
    </div>
  );
};
