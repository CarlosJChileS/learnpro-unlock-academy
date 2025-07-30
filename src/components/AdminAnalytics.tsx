import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, PieChart, TrendingUp, Users, BookOpen, DollarSign, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  total_courses: number;
  total_students: number;
  total_revenue: number;
  completion_rate: number;
  active_subscriptions: number;
}

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInstructorStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('instructor-analytics');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setAnalyticsData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas del instructor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('course-analytics');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setCourseAnalytics(data?.courses || []);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
    }
  };

  const generateAdvancedReport = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced-reports');
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Crear y descargar el archivo
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-avanzado-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Reporte generado",
        description: "El reporte avanzado se ha descargado correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el reporte avanzado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorStats();
    fetchCourseAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics & Reportes</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchInstructorStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={generateAdvancedReport} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cursos</p>
                  <p className="text-2xl font-bold">{analyticsData.total_courses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Estudiantes</p>
                  <p className="text-2xl font-bold">{analyticsData.total_students}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ingresos Total</p>
                  <p className="text-2xl font-bold">${analyticsData.total_revenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasa Completado</p>
                  <p className="text-2xl font-bold">{analyticsData.completion_rate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suscripciones</p>
                  <p className="text-2xl font-bold">{analyticsData.active_subscriptions}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Análisis de Cursos</TabsTrigger>
          <TabsTrigger value="students">Análisis de Estudiantes</TabsTrigger>
          <TabsTrigger value="revenue">Análisis de Ingresos</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Curso</CardTitle>
              <CardDescription>
                Análisis detallado del rendimiento de cada curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseAnalytics.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.total_enrollments} inscripciones • {course.completion_rate}% completado
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {course.average_progress}% progreso promedio
                      </Badge>
                      <Badge variant={course.completion_rate > 70 ? "default" : "secondary"}>
                        {course.completion_rate > 70 ? "Alto rendimiento" : "Mejorable"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">Gráfico de Análisis de Estudiantes</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-4 text-muted-foreground">Gráfico de Distribución de Ingresos</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;