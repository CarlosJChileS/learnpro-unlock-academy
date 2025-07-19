import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Clock, Users, Star, ChevronLeft, Play, FileText, Award, 
  BookOpen, Target, CheckCircle2, Lock 
} from "lucide-react";

const courseData = {
  1: {
    id: 1,
    title: "JavaScript Moderno: ES6+",
    description: "Aprende las características más recientes de JavaScript incluyendo ES6, ES7 y más allá. Domina las nuevas sintaxis, funcionalidades y mejores prácticas del desarrollo moderno con JavaScript.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
    instructor: {
      name: "María González",
      bio: "Desarrolladora Senior con 8 años de experiencia en JavaScript y tecnologías web modernas.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    duration: "12 horas",
    students: 2840,
    rating: 4.8,
    level: "Intermedio",
    category: "Programación",
    price: "Incluido en suscripción",
    objectives: [
      "Dominar las características de ES6+ incluyendo arrow functions, destructuring y template literals",
      "Implementar async/await y promises para programación asíncrona",
      "Utilizar módulos ES6 para organizar código eficientemente",
      "Aplicar nuevas estructuras de datos como Map, Set y WeakMap",
      "Crear aplicaciones modernas siguiendo las mejores prácticas"
    ],
    modules: [
      {
        id: 1,
        title: "Introducción a ES6+",
        duration: "2h 30m",
        lessons: [
          { id: 1, title: "¿Qué es ES6?", duration: "15m", completed: true },
          { id: 2, title: "Configuración del entorno", duration: "20m", completed: true },
          { id: 3, title: "Let, const vs var", duration: "25m", completed: true },
          { id: 4, title: "Arrow Functions", duration: "30m", completed: false },
          { id: 5, title: "Template Literals", duration: "20m", completed: false }
        ]
      },
      {
        id: 2,
        title: "Destructuring y Spread",
        duration: "2h 15m",
        lessons: [
          { id: 6, title: "Destructuring de Arrays", duration: "30m", completed: false },
          { id: 7, title: "Destructuring de Objetos", duration: "35m", completed: false },
          { id: 8, title: "Spread Operator", duration: "25m", completed: false },
          { id: 9, title: "Rest Parameters", duration: "25m", completed: false },
          { id: 10, title: "Ejercicios Prácticos", duration: "20m", completed: false }
        ]
      },
      {
        id: 3,
        title: "Programación Asíncrona",
        duration: "3h 45m",
        lessons: [
          { id: 11, title: "Callbacks y sus problemas", duration: "30m", completed: false },
          { id: 12, title: "Promises", duration: "45m", completed: false },
          { id: 13, title: "Async/Await", duration: "40m", completed: false },
          { id: 14, title: "Manejo de errores", duration: "35m", completed: false },
          { id: 15, title: "Fetch API", duration: "35m", completed: false },
          { id: 16, title: "Proyecto: API Weather App", duration: "1h", completed: false }
        ]
      }
    ],
    requirements: [
      "Conocimientos básicos de JavaScript",
      "Familiaridad con HTML y CSS",
      "Editor de código (recomendado VS Code)",
      "Node.js instalado (versión 14 o superior)"
    ]
  }
  // Aquí se agregarían más cursos
};

const CourseDetail = () => {
  const { id } = useParams();
  const [currentLesson, setCurrentLesson] = useState(0);
  const course = courseData[Number(id) as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Curso no encontrado</h1>
          <p className="text-muted-foreground mb-8">El curso que buscas no existe o ha sido movido.</p>
          <Link to="/courses">
            <Button>Volver a Cursos</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(lesson => lesson.completed).length, 
    0
  );
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/courses" className="hover:text-primary transition-colors">
              Cursos
            </Link>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-hero relative overflow-hidden">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Link 
                  to="/courses" 
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver a cursos
                </Link>
                
                <div>
                  <Badge className="mb-4 bg-white/20 text-white border-white/30">
                    {course.category}
                  </Badge>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {course.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{course.students.toLocaleString()} estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Play className="h-5 w-5 mr-2" />
                  Comenzar Curso
                </Button>
              </div>

              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <Button size="lg" variant="outline" className="bg-white/20 border-white/50 text-white hover:bg-white/30">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="curriculum">Currículo</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Objetivos del Curso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {course.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Requisitos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="curriculum" className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Progreso del Curso</h3>
                    <div className="flex items-center space-x-4">
                      <Progress value={progressPercentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground">
                        {completedLessons}/{totalLessons} lecciones
                      </span>
                    </div>
                  </div>

                  <Accordion type="multiple" className="w-full">
                    {course.modules.map((module) => (
                      <AccordionItem key={module.id} value={`module-${module.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full mr-4">
                            <span className="font-medium">{module.title}</span>
                            <span className="text-sm text-muted-foreground">{module.duration}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <span className={lesson.completed ? "text-foreground" : "text-muted-foreground"}>
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
                
                <TabsContent value="instructor">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{course.instructor.name}</h3>
                          <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Estudiantes: </span>
                              <span className="font-medium">{course.students.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Calificación: </span>
                              <span className="font-medium">{course.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Nivel</span>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duración</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estudiantes</span>
                    <span className="font-medium">{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Calificación</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Precio</span>
                    <span className="font-medium text-green-600">{course.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Course Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Incluye</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Material descargable</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Certificado de finalización</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Acceso de por vida</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Comunidad de estudiantes</span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-primary text-white">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">¿Listo para comenzar?</h3>
                  <p className="mb-4 text-white/90">
                    Únete a miles de estudiantes que ya están aprendiendo
                  </p>
                  <Button variant="secondary" size="lg" className="w-full">
                    Comenzar Ahora
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;