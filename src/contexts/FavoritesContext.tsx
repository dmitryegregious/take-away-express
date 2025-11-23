import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Favorite {
  id: string;
  product_id: string;
}

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoritesFromAPI();
    } else {
      loadFavoritesFromLocalStorage();
    }
  }, [isAuthenticated]);

  const fetchFavoritesFromAPI = async () => {
    try {
      const response = await apiClient.get("/favorites");
      setFavorites(response.data.map((fav: Favorite) => fav.product_id));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      loadFavoritesFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavoritesFromLocalStorage = () => {
    const saved = localStorage.getItem("favorites");
    setFavorites(saved ? JSON.parse(saved) : []);
    setIsLoading(false);
  };

  const saveToLocalStorage = (items: string[]) => {
    if (!isAuthenticated) {
      localStorage.setItem("favorites", JSON.stringify(items));
    }
  };

  const toggleFavorite = async (productId: string) => {
    const isFav = favorites.includes(productId);

    if (isAuthenticated) {
      try {
        if (isFav) {
          const response = await apiClient.get("/favorites");
          const favorite = response.data.find((f: Favorite) => f.product_id === productId);
          if (favorite) {
            await apiClient.delete(`/favorites/${favorite.id}`);
          }
        } else {
          await apiClient.post("/favorites", { product_id: productId });
        }
        await fetchFavoritesFromAPI();
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить избранное",
          variant: "destructive",
        });
      }
    } else {
      setFavorites((prev) => {
        const newFavorites = isFav
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        saveToLocalStorage(newFavorites);
        return newFavorites;
      });
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, isLoading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};
