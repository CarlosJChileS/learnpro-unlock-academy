import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const faqCategories = [
    {
      title: "Cursos y Contenido",
      questions: [
        {
          question: "¿Cómo puedo acceder a los cursos?",
          answer: "Una vez que te registres y selecciones un plan, tendrás acceso inmediato a todos los cursos incluidos en tu suscripción. Puedes acceder desde cualquier dispositivo las 24 horas del día."
        },
        {
          question: "¿Los cursos tienen certificación?",
          answer: "Sí, todos nuestros cursos incluyen certificación oficial al completar exitosamente el contenido y las evaluaciones correspondientes."
        },
        {
          question: "¿Puedo descargar el contenido para verlo offline?",
          answer: "Sí, con nuestros planes Premium y Pro puedes descargar videos y materiales para acceso offline a través de nuestra aplicación móvil."
        },
        {
          question: "¿Con qué frecuencia se actualiza el contenido?",
          answer: "Actualizamos nuestro contenido regularmente. Los cursos de tecnología se actualizan cada 3-6 meses, mientras que otros temas se revisan anualmente."
        }
      ]
    },
    {
      title: "Pagos y Suscripciones",
      questions: [
        {
          question: "¿Puedo cancelar mi suscripción en cualquier momento?",
          answer: "Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de usuario. El acceso continuará hasta el final del período de facturación actual."
        },
        {
          question: "¿Ofrecen reembolsos?",
          answer: "Ofrecemos una garantía de reembolso de 30 días para todos nuestros planes. Si no estás satisfecho, puedes solicitar un reembolso completo."
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal y transferencias bancarias."
        },
        {
          question: "¿Hay descuentos para estudiantes?",
          answer: "Sí, ofrecemos un 50% de descuento para estudiantes universitarios con identificación válida. Contacta a nuestro equipo de soporte para más información."
        }
      ]
    },
    {
      title: "Soporte Técnico",
      questions: [
        {
          question: "¿Qué navegadores son compatibles?",
          answer: "Nuestra plataforma es compatible con las versiones más recientes de Chrome, Firefox, Safari y Edge. Para la mejor experiencia, recomendamos Chrome."
        },
        {
          question: "¿Puedo usar la plataforma en mi móvil?",
          answer: "Sí, nuestra plataforma es completamente responsive y también tenemos aplicaciones nativas para iOS y Android disponibles en las tiendas de aplicaciones."
        },
        {
          question: "¿Qué hago si tengo problemas técnicos?",
          answer: "Puedes contactar a nuestro equipo de soporte técnico 24/7 a través del chat en vivo, email o teléfono. También tenemos un centro de ayuda con soluciones comunes."
        },
        {
          question: "¿Necesito software especial para los cursos?",
          answer: "La mayoría de nuestros cursos solo requieren un navegador web. Para cursos específicos de programación o diseño, proporcionamos instrucciones detalladas sobre el software necesario."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encuentra respuestas a las preguntas más comunes sobre LearnPro
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>
                    {category.questions.length} pregunta{category.questions.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${categoryIndex}-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron preguntas que coincidan con tu búsqueda.
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <Card className="mt-12">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
              <p className="text-muted-foreground mb-4">
                Nuestro equipo de soporte está aquí para ayudarte
              </p>
              <div className="space-x-4">
                <a href="/contact" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                  Contactar soporte
                </a>
                <a href="mailto:soporte@learnpro.com" className="border border-input bg-background px-6 py-3 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                  Enviar email
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;