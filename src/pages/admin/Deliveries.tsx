import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Order {
  id: string;
  order_number: string;
  delivery_address: string;
  total_amount: number;
  payment_status: "pending" | "paid";
  delivery_status: string;
  courier_id?: string;
}

export default function AdminDeliveries() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, isCourier } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      let filteredOrders = response.data;

      if (isCourier) {
        filteredOrders = filteredOrders.filter(
          (order: Order) => order.courier_id === user?.id
        );
      }

      setOrders(filteredOrders);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive",
      });
    }
  };

  const markAsDelivered = async (orderId: string) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, {
        delivery_status: "delivered",
      });
      toast({ title: "Заказ отмечен как доставленный" });
      fetchOrders();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Доставки</h1>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Нет заказов для доставки
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        Заказ #{order.order_number}
                      </h3>
                      <Badge
                        variant={
                          order.payment_status === "paid"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.payment_status === "paid"
                          ? "Оплачен"
                          : "Не оплачен"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Адрес:</strong> {order.delivery_address}
                    </p>
                    <p className="text-sm">
                      <strong>Сумма:</strong> {order.total_amount} ₽
                    </p>
                    {order.payment_status === "pending" && (
                      <p className="text-sm text-orange-600 font-medium">
                        ⚠️ Требуется оплата при получении
                      </p>
                    )}
                  </div>

                  {isCourier && order.delivery_status !== "delivered" && (
                    <Button onClick={() => markAsDelivered(order.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Доставлено
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
