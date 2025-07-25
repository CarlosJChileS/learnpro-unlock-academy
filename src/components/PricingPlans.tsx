import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    id: "monthly",
    name: "Plan Mensual",
    description: "Perfecto para comenzar tu viaje de aprendizaje",
    price: 9.99,
    period: "/mes",
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
    id: "annual",
    name: "Plan Anual",
    description: "La opción más popular para profesionales",
    price: 79.99,
    originalPrice: 119.88,
    period: "/año",
    savings: "33% de descuento",
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
  },
  {
    id: "lifetime",
    name: "Plan de por Vida",
    description: "Acceso permanente a toda la plataforma",
    price: 299.99,
    originalPrice: 499.99,
    period: "pago único",
    savings: "40% de descuento",
    icon: Crown,
    popular: false,
    features: [
      "Acceso de por vida a todos los cursos",
      "Certificados de finalización",
      "Soporte VIP",
      "Contenido exclusivo y futuro",
      "Acceso móvil y web",
      "Progreso sincronizado",
      "Descargas offline",
      "Comunidad exclusiva",
      "Sesiones 1:1 con mentores",
      "Acceso beta a nuevas funciones"
    ]
  }
];

const PricingPlans = () => {
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
            <span className="text-muted-foreground">Mensual</span>
            <div className="relative">
              <input type="checkbox" id="billing-toggle" className="sr-only" />
              <label 
                htmlFor="billing-toggle" 
                className="flex items-center cursor-pointer"
              >
                <div className="w-14 h-8 bg-muted border border-border rounded-full relative">
                  <div className="w-6 h-6 bg-primary rounded-full absolute top-1 left-1 transition-transform duration-200"></div>
                </div>
              </label>
            </div>
            <span className="text-foreground font-medium">Anual</span>
            <Badge variant="default" className="bg-gradient-primary">
              Ahorra hasta 40%
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 animate-scale-in ${
                  plan.popular 
                    ? 'ring-2 ring-primary shadow-glow bg-gradient-card' 
                    : 'hover:shadow-card bg-card'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-white text-center py-2 text-sm font-medium">
                    ⭐ Más Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
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
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    {'savings' in plan && plan.savings && (
                      <Badge variant="secondary" className="mt-2">
                        {plan.savings}
                      </Badge>
                    )}
                    {'originalPrice' in plan && plan.originalPrice && (
                      <div className="text-sm text-muted-foreground mt-2 line-through">
                        ${plan.originalPrice}{plan.period === "/año" ? "/año" : ""}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  <Link to={`/checkout?plan=${plan.id}`}>
                    <Button 
                      className={`w-full mb-6 ${
                        plan.popular 
                          ? 'bg-gradient-primary hover:opacity-90' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                      size="lg"
                    >
                      Comenzar Ahora
                    </Button>
                  </Link>
                  
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