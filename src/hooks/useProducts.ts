import { useState, useEffect } from "react";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  image_url: string;
  category_id: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get("/products"),
        apiClient.get("/categories"),
      ]);
      
      setProducts(productsRes.data);
      setCategories([
        { id: "all", name: "Все", description: "", image_url: "" },
        ...categoriesRes.data,
      ]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные. Используются демо-данные.",
        variant: "destructive",
      });
      
      // Fallback to demo data
      const demoCategories = [
        { id: "all", name: "Все", description: "", image_url: "" },
        { id: "pizza", name: "Пицца", description: "", image_url: "" },
        { id: "rolls", name: "Роллы", description: "", image_url: "" },
      ];
      setCategories(demoCategories);
    } finally {
      setLoading(false);
    }
  };

  return { products, categories, loading, refetch: fetchData };
};
