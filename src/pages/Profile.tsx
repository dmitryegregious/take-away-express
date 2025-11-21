import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, CreditCard, History, Settings, LogOut } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Профиль</h1>
        </div>

        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Гость</h2>
                <p className="text-muted-foreground">Войдите для полного доступа</p>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-gradient-hero">
              Войти через Flash Call
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="hover:shadow-card transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                Мой номер телефона
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">Не указан</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                Адреса доставки
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">Нет сохраненных адресов</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                Способы оплаты
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">
                СБП, Наличные при получении
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <History className="w-5 h-5 text-primary" />
                История заказов
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">Нет заказов</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                Настройки
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
