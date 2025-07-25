import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Video, FileText, Users, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'text' | 'quiz';
}

const AdminCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = id !== "new";

  const [courseData, setCourseData] = useState({
    title: isEdit ? "React Avanzado" : "",
    description: isEdit ? "Domina React con hooks, context, suspense y las mejores prácticas de desarrollo." : "",
    image: "",
    instructor: isEdit ? "Carlos Rodríguez" : "",
    category: isEdit ? "Frontend" : "",
    level: isEdit ? "Avanzado" : "",
    duration: isEdit ? "15 horas" : "",
    price: isEdit ? "0" : "0", // Todos incluidos en suscripción
    published: isEdit ? true : false,
    featured: isEdit ? false : false,
    prerequisites: isEdit ? ["Conocimientos básicos de JavaScript", "Experiencia con HTML/CSS"] : [],
    objectives: isEdit ? [
      "Dominar React Hooks avanzados",
      "Implementar Context API eficientemente", 
      "Crear aplicaciones escalables"
    ] : []
  });

  const [modules, setModules] = useState<Module[]>(
    isEdit ? [
      {
        id: "1",
        title: "Introducción a React Avanzado",
        lessons: [
          { id: "1", title: "Hooks avanzados", duration: "25m", type: "video" },
          { id: "2", title: "Custom Hooks", duration: "30m", type: "video" },
          { id: "3", title: "Ejercicios prácticos", duration: "20m", type: "text" }
        ]
      },
      {
        id: "2", 
        title: "Context API y Estado Global",
        lessons: [
          { id: "4", title: "Context API básico", duration: "20m", type: "video" },
          { id: "5", title: "Optimización de renders", duration: "35m", type: "video" }
        ]
      }
    ] : []
  );

  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newObjective, setNewObjective] = useState("");

  const handleSave = () => {
    toast({
      title: isEdit ? "Curso actualizado" : "Curso creado",
      description: `El curso "${courseData.title}" ha sido ${isEdit ? "actualizado" : "creado"} exitosamente.`
    });
    navigate("/admin/dashboard");
  };

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: "Nuevo Módulo",
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "Nueva Lección",
      duration: "0m",
      type: "video"
    };
    
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ));
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(module =>
      module.id === moduleId
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCourseData({
        ...courseData,
        prerequisites: [...courseData.prerequisites, newPrerequisite.trim()]
      });
      setNewPrerequisite("");
    }
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setCourseData({
        ...courseData,
        objectives: [...courseData.objectives, newObjective.trim()]
      });
      setNewObjective("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEdit ? "Editar Curso" : "Crear Nuevo Curso"}
                </h1>
                <p className="text-muted-foreground">
                  {isEdit ? "Modifica los detalles del curso" : "Completa la información del curso"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Guardar Cambios" : "Crear Curso"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="requirements">Requisitos</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Curso</CardTitle>
                  <CardDescription>Información principal del curso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título del curso</Label>
                    <Input
                      id="title"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                      placeholder="Ej: React Avanzado para Desarrolladores"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      placeholder="Describe lo que aprenderán los estudiantes..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={courseData.instructor}
                      onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                      placeholder="Nombre del instructor"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select value={courseData.category} onValueChange={(value) => setCourseData({ ...courseData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programación">Programación</SelectItem>
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="Backend">Backend</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                          <SelectItem value="Diseño">Diseño</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="IA/ML">IA/ML</SelectItem>
                          <SelectItem value="Seguridad">Seguridad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Nivel</Label>
                      <Select value={courseData.level} onValueChange={(value) => setCourseData({ ...courseData, level: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Principiante">Principiante</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración estimada</Label>
                    <Input
                      id="duration"
                      value={courseData.duration}
                      onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                      placeholder="Ej: 15 horas"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Imagen del Curso</CardTitle>
                  <CardDescription>Sube una imagen representativa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <Button variant="outline">
                      Seleccionar Imagen
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos recomendados: JPG, PNG. Tamaño recomendado: 1280x720px
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Estructura del Curso</CardTitle>
                    <CardDescription>Organiza el contenido en módulos y lecciones</CardDescription>
                  </div>
                  <Button onClick={addModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Módulo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <Card key={module.id} className="border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline">Módulo {moduleIndex + 1}</Badge>
                          <Input
                            value={module.title}
                            onChange={(e) => {
                              const updatedModules = modules.map(m =>
                                m.id === module.id ? { ...m, title: e.target.value } : m
                              );
                              setModules(updatedModules);
                            }}
                            className="font-medium"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={() => addLesson(module.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Lección
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => removeModule(module.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                            <Badge variant="secondary">
                              {lessonIndex + 1}
                            </Badge>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                              <Input
                                value={lesson.title}
                                onChange={(e) => {
                                  const updatedModules = modules.map(m =>
                                    m.id === module.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, title: e.target.value } : l
                                          )
                                        }
                                      : m
                                  );
                                  setModules(updatedModules);
                                }}
                                placeholder="Título de la lección"
                              />
                              <Input
                                value={lesson.duration}
                                onChange={(e) => {
                                  const updatedModules = modules.map(m =>
                                    m.id === module.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, duration: e.target.value } : l
                                          )
                                        }
                                      : m
                                  );
                                  setModules(updatedModules);
                                }}
                                placeholder="Duración"
                              />
                              <Select
                                value={lesson.type}
                                onValueChange={(value: 'video' | 'text' | 'quiz') => {
                                  const updatedModules = modules.map(m =>
                                    m.id === module.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map(l =>
                                            l.id === lesson.id ? { ...l, type: value } : l
                                          )
                                        }
                                      : m
                                  );
                                  setModules(updatedModules);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="video">
                                    <div className="flex items-center">
                                      <Video className="h-4 w-4 mr-2" />
                                      Video
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="text">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2" />
                                      Texto
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="quiz">
                                    <div className="flex items-center">
                                      <Users className="h-4 w-4 mr-2" />
                                      Quiz
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeLesson(module.id, lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {modules.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No hay módulos creados aún.</p>
                    <p className="text-sm">Haz clic en "Agregar Módulo" para comenzar.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requirements */}
          <TabsContent value="requirements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos Previos</CardTitle>
                  <CardDescription>¿Qué deben saber los estudiantes antes de tomar el curso?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      placeholder="Agregar requisito..."
                      onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                    />
                    <Button onClick={addPrerequisite}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {courseData.prerequisites.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="text-sm">{req}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updated = courseData.prerequisites.filter((_, i) => i !== index);
                            setCourseData({ ...courseData, prerequisites: updated });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objetivos de Aprendizaje</CardTitle>
                  <CardDescription>¿Qué aprenderán los estudiantes?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Agregar objetivo..."
                      onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                    />
                    <Button onClick={addObjective}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {courseData.objectives.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                        <span className="text-sm">{obj}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updated = courseData.objectives.filter((_, i) => i !== index);
                            setCourseData({ ...courseData, objectives: updated });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Publicación</CardTitle>
                <CardDescription>Controla la visibilidad y disponibilidad del curso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="published">Curso Publicado</Label>
                    <p className="text-sm text-muted-foreground">El curso estará visible para los estudiantes</p>
                  </div>
                  <Switch
                    id="published"
                    checked={courseData.published}
                    onCheckedChange={(checked) => setCourseData({ ...courseData, published: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">Curso Destacado</Label>
                    <p className="text-sm text-muted-foreground">Aparecerá en la sección de cursos destacados</p>
                  </div>
                  <Switch
                    id="featured"
                    checked={courseData.featured}
                    onCheckedChange={(checked) => setCourseData({ ...courseData, featured: checked })}
                  />
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4">Información del Modelo de Suscripción</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Precio:</strong> Incluido en todos los planes de suscripción
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Este curso estará disponible automáticamente para todos los usuarios con una suscripción activa, independientemente del plan que tengan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminCourseEditor;