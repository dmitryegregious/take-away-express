import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <ShoppingBag className="w-24 h-24 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">Корзина пуста</h2>
            <p className="text-muted-foreground text-center">
              Добавьте товары из меню
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
        <h1 className="text-2xl font-bold text-foreground">Корзина</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {item.weight}г
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <span className="font-bold text-lg text-foreground">
                        {item.price * item.quantity}₽
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-muted-foreground">Итого:</span>
              <span className="font-bold text-2xl text-foreground">
                {totalPrice}₽
              </span>
            </div>
            
            <Button className="w-full bg-gradient-hero text-lg h-12">
              Оформить заказ
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Cart;
