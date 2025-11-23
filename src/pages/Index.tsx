import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { BottomNav } from "@/components/BottomNav";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { products, categories, loading } = useProducts();

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const category = p.category_id || (p as any).category;
          return category === selectedCategory;
        });

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="space-y-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <ProductGrid products={filteredProducts} />
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
