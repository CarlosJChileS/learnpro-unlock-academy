import { Users, Target, Award, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { label: "Estudiantes activos", value: "50,000+", icon: Users },
    { label: "Cursos disponibles", value: "500+", icon: Target },
    { label: "Certificaciones", value: "25,000+", icon: Award },
    { label: "Años de experiencia", value: "10+", icon: Lightbulb }
  ];

  const team = [
    {
      name: "Ana García",
      role: "CEO & Fundadora",
      description: "15 años de experiencia en educación online"
    },
    {
      name: "Carlos Ruiz",
      role: "Director de Tecnología",
      description: "Experto en plataformas educativas y desarrollo"
    },
    {
      name: "María López",
      role: "Directora de Contenidos",
      description: "Especialista en diseño curricular y metodología"
    },
    {
      name: "Roberto Silva",
      role: "Director de Marketing",
      description: "Estratega digital con enfoque en educación"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transformando el futuro de la educación
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            En LearnPro, creemos que el aprendizaje no tiene límites. Nuestra misión es 
            democratizar la educación de calidad y hacer que esté al alcance de todos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Proporcionar educación de calidad mundial accesible para todos, 
                utilizando tecnología innovadora y metodologías pedagógicas avanzadas 
                que permitan a nuestros estudiantes alcanzar su máximo potencial.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nuestra Visión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ser la plataforma educativa líder que revolucione la forma en que 
                las personas aprenden, creando un ecosistema global donde el 
                conocimiento fluya libremente y las oportunidades estén al alcance de todos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Excelencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nos comprometemos a ofrecer contenido de la más alta calidad, 
                  desarrollado por expertos en cada materia.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accesibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Creemos que la educación debe estar al alcance de todos, 
                  independientemente de su ubicación o situación económica.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Innovación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Utilizamos las últimas tecnologías para crear experiencias 
                  de aprendizaje interactivas y efectivas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-center">{member.name}</CardTitle>
                  <CardDescription className="text-center">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para empezar tu viaje de aprendizaje?</h2>
          <p className="text-muted-foreground mb-8">
            Únete a miles de estudiantes que ya están transformando sus carreras con LearnPro
          </p>
          <div className="space-x-4">
            <a href="/courses" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Explorar cursos
            </a>
            <a href="/contact" className="border border-input bg-background px-6 py-3 rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
              Contactanos
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;