import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function AdminLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendCode = async () => {
    if (!phone) {
      toast({
        title: "Ошибка",
        description: "Введите номер телефона",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Код отправлен",
      description: "Проверьте входящий звонок",
    });
    setStep("code");
  };

  const handleVerifyCode = async () => {
    try {
      await login(phone, code);
      toast({
        title: "Успешно",
        description: "Вход выполнен",
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.response?.data?.message || "Неверный код",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <img src={logo} alt="Возьми с собой" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl text-center">Админ-панель</CardTitle>
          <CardDescription className="text-center">
            {step === "phone" 
              ? "Введите номер телефона для входа" 
              : "Введите последние 4 цифры номера"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Button onClick={handleSendCode} className="w-full">
                Получить код
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Код подтверждения</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="1234"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Button onClick={handleVerifyCode} className="w-full">
                  Войти
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep("phone")}
                  className="w-full"
                >
                  Изменить номер
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
