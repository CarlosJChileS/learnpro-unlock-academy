import { useState } from "react";
import { BookOpen, Clock, Award, TrendingUp, Play, Calendar, Target, Users, Star, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user] = useState({
    name: "María González",
    email: "maria@email.com",
    plan: "Premium",
    joinDate: "Enero 2024",
    streak: 7
  });

  const stats = [
    { title: "Cursos Completados", value: "3", total: "12", icon: BookOpen, color: "text-green-600" },
    { title: "Horas Aprendidas", value: "45", total: "120", icon: Clock, color: "text-blue-600" },
    { title: "Certificados", value: "2", total: "∞", icon: Award, color: "text-purple-600" },
    { title: "Racha Actual", value: `${user.streak}`, total: "días", icon: TrendingUp, color: "text-orange-600" }
  ];

  const currentCourses = [
    {
      id: 1,
      title: "React Avanzado",
      instructor: "Carlos Rodríguez",
      progress: 65,
      nextLesson: "Hooks Personalizados",
      timeRemaining: "4h 30m",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop"
    },
    {
      id: 2,
      title: "Node.js Backend",
      instructor: "Ana Martínez",
      progress: 30,
      nextLesson: "APIs RESTful",
      timeRemaining: "8h 15m",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop"
    },
    {
      id: 3,
      title: "Python Data Science",
      instructor: "Luis Hernández",
      progress: 85,
      nextLesson: "Machine Learning",
      timeRemaining: "2h 45m",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop"
    }
  ];

  const completedCourses = [
    {
      id: 1,
      title: "JavaScript Moderno",
      instructor: "María González",
      completedDate: "2024-01-15",
      certificate: true,
      rating: 5
    },
    {
      id: 2,
      title: "UI/UX Design",
      instructor: "Sara López",
      completedDate: "2024-01-10",
      certificate: true,
      rating: 4
    }
  ];

  const achievements = [
    { title: "Primer Curso", description: "Completaste tu primer curso", earned: true, date: "2024-01-10" },
    { title: "Racha de 7 días", description: "Aprendiste 7 días consecutivos", earned: true, date: "2024-01-20" },
    { title: "Especialista Frontend", description: "Completa 5 cursos de Frontend", earned: false, progress: 3 },
    { title: "Maratonista", description: "Aprende 50 horas en un mes", earned: false, progress: 45 }
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: "TypeScript Avanzado",
      instructor: "Carlos García",
      match: 95,
      reason: "Basado en tu progreso en JavaScript"
    },
    {
      id: 5,
      title: "Express.js Avanzado",
      instructor: "José Martín",
      match: 88,
      reason: "Complementa tu curso de Node.js"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">¡Hola, {user.name}! 👋</h1>
              <p className="text-muted-foreground">Continúa tu viaje de aprendizaje</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Plan {user.plan}
              </Badge>
              <Badge variant="outline">
                🔥 {user.streak} días de racha
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">
                      {stat.value}
                      {stat.total !== "∞" && stat.total !== "días" && (
                        <span className="text-sm text-muted-foreground">/{stat.total}</span>
                      )}
                      {stat.total === "días" && (
                        <span className="text-sm text-muted-foreground"> {stat.total}</span>
                      )}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Mis Cursos</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="recommended">Recomendados</TabsTrigger>
          </TabsList>

          {/* Current Courses */}
          <TabsContent value="current" className="space-y-6">
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Cursos en Progreso</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-glow transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm" className="bg-white/20 backdrop-blur-sm text-white border-white hover:bg-white hover:text-primary">
                            <Play className="h-4 w-4 mr-2" />
                            Continuar
                          </Button>
                        </Link>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-white">
                          {course.progress}%
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <CardDescription>por {course.instructor}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Siguiente:</span>
                          <span className="font-medium">{course.nextLesson}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tiempo restante:</span>
                          <span>{course.timeRemaining}</span>
                        </div>
                      </div>
                      
                      <Link to={`/courses/${course.id}`}>
                        <Button className="w-full">
                          Continuar Aprendiendo
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Completed Courses */}
          <TabsContent value="completed" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Cursos Completados</h2>
              <div className="space-y-4">
                {completedCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Award className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              por {course.instructor} • Completado el {course.completedDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {course.certificate && (
                            <Button variant="outline" size="sm">
                              Ver Certificado
                            </Button>
                          )}
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < course.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Tus Logros</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <Card 
                    key={index} 
                    className={`${achievement.earned ? 'border-green-500 bg-green-50' : 'border-border'}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned ? 'bg-green-500' : 'bg-muted'
                        }`}>
                          {achievement.earned ? (
                            <CheckCircle className="h-6 w-6 text-white" />
                          ) : (
                            <Award className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          {achievement.earned ? (
                            <p className="text-xs text-green-600 mt-1">
                              Obtenido el {achievement.date}
                            </p>
                          ) : achievement.progress && (
                            <div className="mt-2">
                              <Progress 
                                value={(achievement.progress / (achievement.title === "Especialista Frontend" ? 5 : 50)) * 100} 
                                className="h-1" 
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {achievement.progress}/{achievement.title === "Especialista Frontend" ? 5 : 50}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Recommended */}
          <TabsContent value="recommended" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">Recomendado para Ti</h2>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Target className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-muted-foreground">por {course.instructor}</p>
                            <p className="text-xs text-primary mt-1">{course.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {course.match}% match
                            </Badge>
                          </div>
                          <Link to={`/courses/${course.id}`}>
                            <Button>Ver Curso</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/courses">
                <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Explorar Cursos</span>
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Mi Perfil</span>
                </Button>
              </Link>
              
              <Link to="/subscription">
                <Button variant="outline" className="w-full h-16 flex flex-col space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Mi Suscripción</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;