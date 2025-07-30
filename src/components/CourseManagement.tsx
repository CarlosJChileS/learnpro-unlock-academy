import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Upload, Download, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  price: number;
  is_published: boolean;
  created_at: string;
  category_id: string;
  thumbnail_url: string;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { session } = useAuth();
  const { toast } = useToast();

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: 0,
    category_id: "",
    is_published: false
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('course-management', {
        body: { action: 'list' },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
      setCourses(data?.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-categories', {
        body: { action: 'list' },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
      setCategories(data?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseForm.title || !courseForm.description) {
      toast({
        title: "Error",
        description: "Título y descripción son obligatorios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('course-management', {
        body: {
          action: editingCourse ? 'update' : 'create',
          course_id: editingCourse?.id,
          ...courseForm
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: editingCourse ? "Curso actualizado" : "Curso creado",
        description: `El curso ha sido ${editingCourse ? 'actualizado' : 'creado'} correctamente`
      });

      setCourseForm({
        title: "",
        description: "",
        price: 0,
        category_id: "",
        is_published: false
      });
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el curso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price,
      category_id: course.category_id || "",
      is_published: course.is_published
    });
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;

    try {
      const { error } = await supabase.functions.invoke('course-management', {
        body: {
          action: 'delete',
          course_id: courseId
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado correctamente"
      });

      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el curso",
        variant: "destructive"
      });
    }
  };

  const togglePublished = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('course-management', {
        body: {
          action: 'update',
          course_id: courseId,
          is_published: !currentStatus
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Estado actualizado",
        description: `El curso ha sido ${!currentStatus ? 'publicado' : 'despublicado'}`
      });

      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del curso",
        variant: "destructive"
      });
    }
  };

  const uploadContent = async (courseId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-course-content', {
        body: {
          action: 'upload',
          course_id: courseId
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      toast({
        title: "Contenido subido",
        description: "El contenido del curso ha sido procesado"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir el contenido",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestión de Cursos</h2>
        <Button onClick={() => setEditingCourse(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Curso
        </Button>
      </div>

      {/* Formulario de curso */}
      <Card>
        <CardHeader>
          <CardTitle>{editingCourse ? "Editar Curso" : "Crear Nuevo Curso"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Título del Curso</label>
                <Input
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título del curso"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Precio</label>
                <Input
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Categoría</label>
                <Select 
                  value={courseForm.category_id}
                  onValueChange={(value) => setCourseForm(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={courseForm.is_published}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, is_published: e.target.checked }))}
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Publicar curso
                </label>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción del curso"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : editingCourse ? "Actualizar" : "Crear Curso"}
              </Button>
              {editingCourse && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({
                    title: "",
                    description: "",
                    price: 0,
                    category_id: "",
                    is_published: false
                  });
                }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de cursos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cursos Existentes</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando cursos...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay cursos disponibles</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Publicado" : "Borrador"}
                        </Badge>
                        {course.price > 0 && (
                          <Badge variant="outline">${course.price}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Creado: {new Date(course.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => uploadContent(course.id)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(course.id, course.is_published)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;