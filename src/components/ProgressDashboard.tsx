import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Award, TrendingUp, Play, Target, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_time_spent_minutes: number;
  completion_rate: number;
}

interface CourseProgress {
  id: string;
  title: string;
  instructor_id: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at?: string;
  thumbnail_url?: string;
}

interface CompletedCourse extends CourseProgress {
  certificate_id?: string;
  certificate_number?: string;
}

const ProgressDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentCourses, setCurrentCourses] = useState<CourseProgress[]>([]);
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase.functions.invoke('student-dashboard', {
        body: { action: 'get_stats' }
      });

      if (statsError) throw statsError;
      setStats(statsData);

      // Fetch current courses
      const { data: currentData, error: currentError } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          progress_percentage,
          enrolled_at,
          courses!inner (
            id,
            title,
            instructor_id,
            thumbnail_url
          )
        `)
        .eq('user_id', user?.id)
        .is('completed_at', null)
        .order('enrolled_at', { ascending: false });

      if (currentError) throw currentError;
      
      const formattedCurrent = currentData?.map(enrollment => ({
        id: enrollment.courses.id,
        title: enrollment.courses.title,
        instructor_id: enrollment.courses.instructor_id,
        progress_percentage: enrollment.progress_percentage || 0,
        enrolled_at: enrollment.enrolled_at,
        thumbnail_url: enrollment.courses.thumbnail_url
      })) || [];
      
      setCurrentCourses(formattedCurrent);

      // Fetch completed courses
      const { data: completedData, error: completedError } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          progress_percentage,
          enrolled_at,
          completed_at,
          courses!inner (
            id,
            title,
            instructor_id,
            thumbnail_url
          ),
          certificates (
            id,
            certificate_number
          )
        `)
        .eq('user_id', user?.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (completedError) throw completedError;
      
      const formattedCompleted = completedData?.map(enrollment => ({
        id: enrollment.courses.id,
        title: enrollment.courses.title,
        instructor_id: enrollment.courses.instructor_id,
        progress_percentage: enrollment.progress_percentage || 0,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        thumbnail_url: enrollment.courses.thumbnail_url,
        certificate_id: enrollment.certificates?.[0]?.id || undefined,
        certificate_number: enrollment.certificates?.[0]?.certificate_number || undefined
      })) || [];
      
      setCompletedCourses(formattedCompleted);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Cursos Completados",
      value: stats?.completed_courses || 0,
      total: stats?.total_courses || 0,
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Horas Aprendidas",
      value: Math.round((stats?.total_time_spent_minutes || 0) / 60),
      total: "∞",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Certificados",
      value: completedCourses.filter(c => c.certificate_id).length,
      total: "∞",
      icon: Award,
      color: "text-purple-600"
    },
    {
      title: "Tasa Completado",
    value: `${Math.round(stats?.completion_rate || 0)}%`,
      total: "",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                    {stat.total !== "∞" && stat.total !== "" && (
                      <span className="text-sm text-muted-foreground">/{stat.total}</span>
                    )}
                    {stat.total === "" && stat.value.includes('%') && (
                      <span className="text-sm text-muted-foreground"></span>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">En Progreso</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendados</TabsTrigger>
        </TabsList>

        {/* Current Courses */}
        <TabsContent value="current" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Cursos en Progreso</h3>
            {currentCourses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">No tienes cursos en progreso</h4>
                  <p className="text-muted-foreground mb-4">
                    Explora nuestro catálogo y comienza a aprender
                  </p>
                  <Link to="/courses">
                    <Button>Explorar Cursos</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourses.map((course) => (
                  <Card key={course.id} className="group hover:shadow-glow transition-all duration-300">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.thumbnail_url || `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop`}
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
                          {course.progress_percentage}%
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      <CardDescription>
                        Iniciado el {new Date(course.enrolled_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span>{course.progress_percentage}%</span>
                        </div>
                        <Progress value={course.progress_percentage} className="h-2" />
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
            )}
          </div>
        </TabsContent>

        {/* Completed Courses */}
        <TabsContent value="completed" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Cursos Completados</h3>
            {completedCourses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="text-lg font-medium mb-2">Aún no has completado ningún curso</h4>
                  <p className="text-muted-foreground">
                    ¡Sigue aprendiendo para ganar tu primer certificado!
                  </p>
                </CardContent>
              </Card>
            ) : (
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
                            <h4 className="font-semibold">{course.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Completado el {course.completed_at ? new Date(course.completed_at).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {course.certificate_number && (
                            <Link to={`/certificate/${course.certificate_number}`}>
                              <Button variant="outline" size="sm">
                                Ver Certificado
                              </Button>
                            </Link>
                          )}
                          <Badge className="bg-green-600 text-white">
                            100% Completado
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Recomendados para Ti</h3>
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">Generando recomendaciones</h4>
                <p className="text-muted-foreground mb-4">
                  Basado en tu progreso, te sugeriremos cursos personalizados
                </p>
                <Link to="/courses">
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Explorar Catálogo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressDashboard;