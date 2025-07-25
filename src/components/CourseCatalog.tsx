import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Play } from "lucide-react";
import CoursePreviewModal from "./CoursePreviewModal";

const courses = [
  {
    id: 1,
    title: "Desarrollo Web Full Stack",
    instructor: "Ana García",
    description: "Aprende React, Node.js y MongoDB desde cero hasta crear aplicaciones profesionales.",
    image: "/api/placeholder/400/250",
    duration: "24 horas",
    students: 1234,
    rating: 4.8,
    level: "Intermedio",
    category: "Desarrollo Web",
    included: true
  },
  {
    id: 2,
    title: "Python para Data Science",
    instructor: "Carlos Mendoza",
    description: "Domina Python, Pandas, NumPy y Machine Learning para análisis de datos.",
    image: "/api/placeholder/400/250",
    duration: "32 horas",
    students: 856,
    rating: 4.9,
    level: "Avanzado",
    category: "Data Science",
    included: true
  },
  {
    id: 3,
    title: "Diseño UX/UI Profesional",
    instructor: "María López",
    description: "Crea interfaces excepcionales con Figma y principios de diseño centrado en el usuario.",
    image: "/api/placeholder/400/250",
    duration: "18 horas",
    students: 2156,
    rating: 4.7,
    level: "Principiante",
    category: "Diseño",
    included: true
  },
  {
    id: 4,
    title: "Marketing Digital Avanzado",
    instructor: "José Rodríguez",
    description: "Estrategias completas de SEO, SEM, redes sociales y analytics para hacer crecer tu negocio.",
    image: "/api/placeholder/400/250",
    duration: "28 horas",
    students: 1543,
    rating: 4.6,
    level: "Intermedio",
    category: "Marketing",
    included: true
  },
  {
    id: 5,
    title: "Inteligencia Artificial con Python",
    instructor: "Dr. Elena Vázquez",
    description: "Introducción práctica a IA, Machine Learning y redes neuronales.",
    image: "/api/placeholder/400/250",
    duration: "40 horas",
    students: 689,
    rating: 4.9,
    level: "Avanzado",
    category: "IA",
    included: true
  },
  {
    id: 6,
    title: "Finanzas Personales",
    instructor: "Roberto Santos",
    description: "Aprende a manejar tus finanzas, invertir y planificar tu futuro financiero.",
    image: "/api/placeholder/400/250",
    duration: "12 horas",
    students: 3421,
    rating: 4.5,
    level: "Principiante",
    category: "Finanzas",
    included: true
  }
];

const categories = ["Todos", "Desarrollo Web", "Data Science", "Diseño", "Marketing", "IA", "Finanzas"];

const CourseCatalog = () => {
  const [previewCourse, setPreviewCourse] = useState<any>(null);
  return (
    <section id="cursos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Catálogo de Cursos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Accede a todos nuestros cursos premium con cualquier plan de suscripción
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-lg px-4 py-2">
              🎯 Todos los cursos incluidos en tu suscripción
            </Badge>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Todos" ? "default" : "outline"}
              className={category === "Todos" ? "bg-gradient-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card 
              key={course.id} 
              className="group hover:shadow-glow transition-all duration-300 animate-scale-in border-0 bg-gradient-card overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-primary opacity-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="outline" 
                      className="border-white text-white bg-green-600/80"
                    >
                      Incluido
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge 
                      variant="outline" 
                      className={`border-white text-white mb-2 ${
                        course.level === "Principiante" ? "bg-success/80" :
                        course.level === "Intermedio" ? "bg-warning/80" : "bg-destructive/80"
                      }`}
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreviewCourse(course);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Vista previa
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  por {course.instructor}
                </p>
                <p className="text-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                
                <a href="/courses">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
                    Ver Curso
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/courses">
            <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground">
              Ver Todos los Cursos
            </Button>
          </a>
        </div>
        
        <CoursePreviewModal
          isOpen={!!previewCourse}
          onClose={() => setPreviewCourse(null)}
          course={previewCourse}
        />
      </div>
    </section>
  );
};

export default CourseCatalog;