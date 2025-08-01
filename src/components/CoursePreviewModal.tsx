import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, Star, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  instructor_id: string;
  thumbnail_url?: string;
  intro_video_url?: string;
  trailer_url?: string;
  duration_hours?: number;
  level?: string;
  average_rating?: number;
  total_reviews?: number;
  price?: number;
  subscription_tier?: string;
}

interface CoursePreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (courseId: string) => void;
}

const CoursePreviewModal = ({ course, isOpen, onClose, onEnroll }: CoursePreviewModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!course) return null;

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para inscribirte en el curso",
        variant: "destructive"
      });
      return;
    }

    setIsEnrolling(true);
    try {
      if (onEnroll) {
        await onEnroll(course.id);
      }
      toast({
        title: "¡Inscrito!",
        description: "Te has inscrito exitosamente en el curso"
      });
      onClose();
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la inscripción",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return level;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          <DialogDescription className="text-base">
            {course.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Video Preview */}
          {course.intro_video_url || course.trailer_url ? (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-cover"
                controls
                poster={course.thumbnail_url}
              >
                <source src={course.intro_video_url || course.trailer_url} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>
          ) : course.thumbnail_url ? (
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="h-16 w-16 text-white" />
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
          )}

          {/* Course Info */}
          <div className="flex flex-wrap gap-4 items-center">
            {course.level && (
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
            )}
            
            {course.duration_hours && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration_hours} horas
              </div>
            )}
            
            {course.average_rating && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {course.average_rating.toFixed(1)} ({course.total_reviews} reseñas)
              </div>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              Estudiantes inscritos
            </div>
          </div>

          {/* Description */}
          {course.long_description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Descripción del Curso</h3>
              <p className="text-muted-foreground leading-relaxed">
                {course.long_description}
              </p>
            </div>
          )}

          {/* What you'll learn */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Lo que aprenderás</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Conceptos fundamentales y avanzados del tema
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ejercicios prácticos y casos de estudio reales
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Técnicas y mejores prácticas de la industria
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Proyectos finales para aplicar lo aprendido
              </li>
            </ul>
          </div>

          {/* Pricing and Enrollment */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                {course.price && course.price > 0 ? (
                  <div className="text-2xl font-bold">
                    ${course.price}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      pago único
                    </span>
                  </div>
                ) : (
                  <div className="text-lg">
                    <Badge className="bg-green-100 text-green-800">
                      Incluido en tu suscripción
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cerrar
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolling}
                  className="min-w-[120px]"
                >
                  {isEnrolling ? "Inscribiendo..." : "Inscribirse"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePreviewModal;