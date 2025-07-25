import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "Basic",
    name: "Basic",
    description: "Perfecto para comenzar tu viaje de aprendizaje",
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    icon: Star,
    popular: false,
    features: [
      "Acceso a todos los cursos",
      "Certificados de finalización",
      "Soporte básico",
      "Acceso móvil y web",
      "Progreso sincronizado"
    ]
  },
  {
    id: "Premium",
    name: "Premium",
    description: "La opción más popular para profesionales",
    monthlyPrice: 19.99,
    annualPrice: 199.99,
    icon: Zap,
    popular: true,
    features: [
      "Acceso a todos los cursos",
      "Certificados de finalización", 
      "Soporte prioritario",
      "Contenido exclusivo",
      "Acceso móvil y web",
      "Progreso sincronizado",
      "Descargas offline",
      "Comunidad exclusiva"
    ]
  }
];

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();
  const { subscription, createCheckoutSession, createCustomerPortalSession, loading } = useSubscription();
  const { toast } = useToast();

  const handleSubscribe = async (planName: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión requerido",
        description: "Debes iniciar sesión para suscribirte a un plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      const planType = isAnnual ? 'annual' : 'monthly';
      const { url, error } = await createCheckoutSession(planType, planName);
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar la suscripción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url, error } = await createCustomerPortalSession();
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al acceder al portal de cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="planes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Planes de Suscripción
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Elige el plan que mejor se adapte a tus necesidades de aprendizaje
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Mensual
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Anual
            </span>
            {isAnnual && (
              <Badge variant="default" className="bg-gradient-primary">
                Ahorra 17%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const period = isAnnual ? "/año" : "/mes";
            const isCurrentPlan = subscription.subscribed && subscription.subscription_tier === plan.name;
            
            return (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 animate-scale-in ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-glow bg-gradient-card' 
                    : 'hover:shadow-card bg-card'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-2 text-sm font-medium">
                    ⭐ Más Popular
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                    ✓ Tu Plan Actual
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular || isCurrentPlan ? 'pt-12' : 'pt-6'}`}>
                  <div className={`inline-flex p-3 rounded-full mb-4 mx-auto ${
                    plan.popular ? 'bg-gradient-primary' : 'bg-muted'
                  }`}>
                    <IconComponent className={`h-8 w-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {plan.description}
                  </p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        ${currentPrice}
                      </span>
                      <span className="text-muted-foreground ml-1">{period}</span>
                    </div>
                    {isAnnual && (
                      <div className="text-sm text-muted-foreground mt-2">
                        <span className="line-through">${plan.monthlyPrice * 12}/año</span>
                        <span className="text-green-600 ml-2 font-medium">
                          Ahorra ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  {isCurrentPlan ? (
                    <div className="space-y-2 mb-6">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleManageSubscription}
                        disabled={loading}
                      >
                        {loading ? "Cargando..." : "Gestionar Suscripción"}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-gradient-primary hover:opacity-90' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                      size="lg"
                      onClick={() => handleSubscribe(plan.name)}
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : user ? "Suscribirse" : "Iniciar Sesión para Suscribirse"}
                    </Button>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Incluye:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start space-x-2">
                            <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas un plan personalizado para tu empresa?
          </p>
          <Button variant="outline" size="lg">
            Contactar Ventas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;