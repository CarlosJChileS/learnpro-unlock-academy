import { useState, useEffect } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Crown, Star, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubscriptionManager = () => {
  const { subscription, loading, createCustomerPortalSession, createCheckoutSession } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const [portalLoading, setPortalLoading] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Plan Mensual',
      price: 19.99,
      interval: 'mes',
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
      price: 199.99,
      interval: 'año',
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
  ];

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await createCustomerPortalSession();
      if (response && typeof response === 'string') {
        window.open(response, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo abrir el portal de gestión",
        variant: "destructive"
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSubscribe = async (planType: 'monthly' | 'annual') => {
    try {
      const plan = plans.find(p => p.id === planType);
      if (plan) {
        await createCheckoutSession(planType, plan.name);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar el proceso de suscripción",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (subscription.subscribed) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle className="text-green-800">Suscripción Activa</CardTitle>
                  <CardDescription className="text-green-600">
                    Plan {subscription.subscription_tier}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                <Check className="h-4 w-4 mr-1" />
                Activa
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fecha de renovación:</span>
                <span className="font-medium">
                  {subscription.subscription_end 
                    ? new Date(subscription.subscription_end).toLocaleDateString()
                    : 'No disponible'
                  }
                </span>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Beneficios incluidos:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    'Acceso a todos los cursos',
                    'Certificados al completar',
                    'Soporte prioritario',
                    'Acceso móvil',
                    'Contenido offline'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  variant="outline"
                  className="w-full"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {portalLoading ? "Cargando..." : "Gestionar Suscripción"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <div>
              <CardTitle className="text-orange-800">Sin Suscripción Activa</CardTitle>
              <CardDescription className="text-orange-600">
                Suscríbete para acceder a todos los cursos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
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
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-lg font-normal text-muted-foreground">
                    /{plan.interval}
                  </span>
                </div>
                {plan.id === 'annual' && (
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
              
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan.id as 'monthly' | 'annual')}
                variant={plan.popular ? "default" : "outline"}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Suscribirse ahora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionManager;