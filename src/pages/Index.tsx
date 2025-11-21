import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { BottomNav } from "@/components/BottomNav";

// Mock data
const categories = [
  { id: "all", name: "Все", image: "" },
  { id: "pizza", name: "Пицца", image: "" },
  { id: "rolls", name: "Роллы", image: "" },
  { id: "drinks", name: "Напитки", image: "" },
  { id: "desserts", name: "Десерты", image: "" },
];

const mockProducts = [
  {
    id: "1",
    name: "Пицца Маргарита",
    description: "Классическая пицца с моцареллой и томатами",
    price: 450,
    weight: 500,
    image: "/placeholder.svg",
    category: "pizza",
  },
  {
    id: "2",
    name: "Пицца Пепперони",
    description: "Острая пицца с пепперони",
    price: 550,
    weight: 550,
    image: "/placeholder.svg",
    category: "pizza",
  },
  {
    id: "3",
    name: "Филадельфия",
    description: "Роллы с лососем и сливочным сыром",
    price: 380,
    weight: 250,
    image: "/placeholder.svg",
    category: "rolls",
  },
  {
    id: "4",
    name: "Калифорния",
    description: "Роллы с крабом и авокадо",
    price: 350,
    weight: 240,
    image: "/placeholder.svg",
    category: "rolls",
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProducts =
    selectedCategory === "all"
      ? mockProducts
      : mockProducts.filter((p) => p.category === selectedCategory);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductGrid
          products={filteredProducts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
