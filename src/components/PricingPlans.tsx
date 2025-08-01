import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  features: string[];
  popular?: boolean;
}

const PricingPlans = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      id: 'monthly',
      name: 'Plan Mensual',
      description: 'Perfecto para empezar',
      price: 19.99,
      duration_months: 1,
      features: [
        'Acceso a todos los cursos',
        'Certificados al completar',
        'Soporte prioritario',
        'Acceso móvil',
        'Contenido offline'
      ]
    },
    {
      id: 'annual',
      name: 'Plan Anual',
      description: 'El más popular',
      price: 199.99,
      duration_months: 12,
      features: [
        'Acceso a todos los cursos',
        'Certificados al completar',
        'Soporte prioritario',
        'Acceso móvil',
        'Contenido offline',
        '2 meses gratis',
        'Acceso temprano a nuevos cursos'
      ],
      popular: true
    }
  ]);

  const handleSubscribe = async (planId: string, planName: string) => {
    if (!session) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para suscribirte",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Use create-checkout function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planType: planId === 'annual' ? 'annual' : 'monthly',
          planName: planName 
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la sesión de pago",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async (planId: string) => {
    if (!session) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para suscribirte",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: { planId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el pago con PayPal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Elige tu Plan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Desbloquea todo el potencial de LearnPro con nuestros planes de suscripción
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-primary shadow-lg' : 'border-border'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Más Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-lg font-normal text-muted-foreground">
                    /{plan.duration_months === 1 ? 'mes' : 'año'}
                  </span>
                </div>
                {plan.duration_months === 12 && (
                  <p className="text-sm text-green-600 font-medium">
                    Ahorra $39.88 al año
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(plan.id, plan.name)}
                  disabled={loading}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {loading ? "Procesando..." : "Suscribirse con Stripe"}
                </Button>
                
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => handlePayPalPayment(plan.id)}
                  disabled={loading}
                >
                  Pagar con PayPal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;