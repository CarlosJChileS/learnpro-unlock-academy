import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentMethod {
  id: string;
  type: 'stripe' | 'paypal';
  amount: number;
  currency: string;
  description: string;
}

const PaymentIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'paypal'>('stripe');
  const { session } = useAuth();
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'basic-monthly',
      type: 'stripe',
      amount: 9.99,
      currency: 'USD',
      description: 'Plan Básico Mensual'
    },
    {
      id: 'premium-monthly',
      type: 'stripe',
      amount: 19.99,
      currency: 'USD',
      description: 'Plan Premium Mensual'
    },
    {
      id: 'pro-monthly',
      type: 'stripe',
      amount: 39.99,
      currency: 'USD',
      description: 'Plan Pro Mensual'
    }
  ];

  const handleStripePayment = async (paymentMethod: PaymentMethod) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-payment', {
        body: {
          amount: paymentMethod.amount * 100, // Convert to cents
          currency: paymentMethod.currency.toLowerCase(),
          description: paymentMethod.description,
          payment_method_id: paymentMethod.id
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        toast({
          title: "Pago procesado",
          description: "Tu pago ha sido procesado correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar el pago con Stripe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async (paymentMethod: PaymentMethod) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: {
          amount: paymentMethod.amount.toString(),
          currency: paymentMethod.currency,
          description: paymentMethod.description,
          payment_method_id: paymentMethod.id
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.approval_url) {
        // Redirect to PayPal
        window.location.href = data.approval_url;
      } else {
        toast({
          title: "Pago procesado",
          description: "Tu pago ha sido procesado correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar el pago con PayPal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentMethod: PaymentMethod) => {
    if (selectedMethod === 'stripe') {
      await handleStripePayment(paymentMethod);
    } else {
      await handlePayPalPayment(paymentMethod);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Planes de Suscripción</h2>
        <p className="text-muted-foreground">
          Elige el plan que mejor se adapte a tus necesidades
        </p>
      </div>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
          <CardDescription>
            Selecciona tu método de pago preferido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as 'stripe' | 'paypal')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stripe" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Stripe
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                PayPal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stripe" className="mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Stripe</span>
                  <Badge variant="outline">Recomendado</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pago seguro con tarjeta de crédito o débito. Procesamiento instantáneo.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="paypal" className="mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">PayPal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Paga con tu cuenta de PayPal o tarjeta de crédito de forma segura.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {paymentMethods.map((method, index) => (
          <Card key={method.id} className={`relative ${index === 1 ? 'border-primary shadow-lg scale-105' : ''}`}>
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">Más Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {index === 0 && <CheckCircle className="h-6 w-6 text-primary" />}
                {index === 1 && <Calendar className="h-6 w-6 text-primary" />}
                {index === 2 && <DollarSign className="h-6 w-6 text-primary" />}
              </div>
              <CardTitle className="text-xl">{method.description}</CardTitle>
              <div className="text-3xl font-bold">
                ${method.amount}
                <span className="text-base font-normal text-muted-foreground">/mes</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {index === 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Acceso a cursos básicos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Soporte por email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-muted-foreground">Sin certificados</span>
                    </div>
                  </>
                )}

                {index === 1 && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Acceso a todos los cursos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Certificados incluidos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Soporte prioritario</span>
                    </div>
                  </>
                )}

                {index === 2 && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Todo lo del Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mentoría 1 a 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Proyectos exclusivos</span>
                    </div>
                  </>
                )}
              </div>

              <Button 
                className="w-full" 
                onClick={() => handlePayment(method)}
                disabled={loading}
                variant={index === 1 ? "default" : "outline"}
              >
                {loading ? "Procesando..." : `Elegir ${method.description}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Security Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Cancela cuando quieras</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Garantía de 30 días</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentIntegration;