import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate admin login (sin backend por ahora)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === "admin@learnpro.com" && password === "admin123") {
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido al panel de administración"
      });
      
      // Simular token de admin en localStorage
      localStorage.setItem("adminToken", "admin-demo-token");
      localStorage.setItem("adminUser", JSON.stringify({
        id: "admin-1",
        name: "Administrador",
        email: "admin@learnpro.com",
        role: "admin"
      }));
      
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Acceso denegado",
        description: "Credenciales incorrectas. Usa: admin@learnpro.com / admin123",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Acceso exclusivo para administradores</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-glow border-border/50">
          <CardHeader className="text-center">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email administrativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@learnpro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Acceder al Panel"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-medium text-sm mb-2">🔑 Credenciales de Demo:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Email:</strong> admin@learnpro.com</p>
                <p><strong>Contraseña:</strong> admin123</p>
              </div>
            </div>

            {/* Back to main site */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Volver al sitio principal
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>🔒 Este es un área segura. Todas las acciones son registradas.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;