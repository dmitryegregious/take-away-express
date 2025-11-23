import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id?: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!localStorage.getItem("authToken");

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartFromAPI();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated]);

  const fetchCartFromAPI = async () => {
    try {
      const response = await apiClient.get("/cart");
      const apiItems = response.data.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
      }));
      setItems(apiItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      loadCartFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    const saved = localStorage.getItem("cart");
    setItems(saved ? JSON.parse(saved) : []);
    setIsLoading(false);
  };

  const saveToLocalStorage = (newItems: CartItem[]) => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(newItems));
    }
  };

  const addToCart = async (product: any) => {
    if (isAuthenticated) {
      try {
        await apiClient.post("/cart", {
          product_id: product.id,
          quantity: 1,
        });
        await fetchCartFromAPI();
      } catch (error) {
        console.error("Failed to add to cart:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось добавить товар в корзину",
          variant: "destructive",
        });
      }
    } else {
      setItems((prev) => {
        const existing = prev.find((item) => item.productId === product.id);
        const newItems = existing
          ? prev.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [
              ...prev,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                weight: product.weight,
                image: product.image || product.image_url,
                quantity: 1,
              },
            ];
        saveToLocalStorage(newItems);
        return newItems;
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      try {
        const item = items.find((i) => i.productId === productId);
        if (item?.id) {
          await apiClient.delete(`/cart/${item.id}`);
          await fetchCartFromAPI();
        }
      } catch (error) {
        console.error("Failed to remove from cart:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить товар из корзины",
          variant: "destructive",
        });
      }
    } else {
      setItems((prev) => {
        const newItems = prev.filter((item) => item.productId !== productId);
        saveToLocalStorage(newItems);
        return newItems;
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        const item = items.find((i) => i.productId === productId);
        if (item?.id) {
          await apiClient.patch(`/cart/${item.id}`, { quantity });
          await fetchCartFromAPI();
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось обновить количество",
          variant: "destructive",
        });
      }
    } else {
      setItems((prev) => {
        const newItems = prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        saveToLocalStorage(newItems);
        return newItems;
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await Promise.all(
          items.map((item) => item.id && apiClient.delete(`/cart/${item.id}`))
        );
        setItems([]);
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    } else {
      setItems([]);
      localStorage.removeItem("cart");
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
