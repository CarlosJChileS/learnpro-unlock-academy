import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_name: string;
  user_avatar_url?: string;
}

interface CourseReviewsProps {
  courseId: string;
  canReview?: boolean;
}

const CourseReviews = ({ courseId, canReview = false }: CourseReviewsProps) => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Create mock reviews since course_reviews table doesn't exist
      const mockReviews = [
        {
          id: '1',
          rating: 5,
          review_text: 'Excelente curso, muy completo y bien estructurado.',
          created_at: new Date().toISOString(),
          user_name: 'María García',
          user_avatar_url: undefined
        },
        {
          id: '2',
          rating: 4,
          review_text: 'Muy bueno, aprendí mucho sobre el tema.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_name: 'Juan Pérez',
          user_avatar_url: undefined
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reseñas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!session || !user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dejar una reseña",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.trim()) {
      toast({
        title: "Reseña requerida",
        description: "Por favor escribe una reseña",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Mock submission - add to existing reviews
      const newReviewData: Review = {
        id: Date.now().toString(),
        rating: rating,
        review_text: newReview.trim(),
        created_at: new Date().toISOString(),
        user_name: user.email?.split('@')[0] || 'Usuario',
        user_avatar_url: undefined
      };
      
      setReviews(prev => [newReviewData, ...prev]);

      toast({
        title: "Reseña enviada",
        description: "Tu reseña ha sido enviada exitosamente"
      });

      setNewReview("");
      setRating(5);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la reseña",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Reseñas del Curso</h3>
          <p className="text-muted-foreground">
            {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {canReview && user && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Escribir Reseña
          </Button>
        )}
      </div>

      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Escribe una Reseña</CardTitle>
            <CardDescription>
              Comparte tu experiencia con este curso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Calificación
              </label>
              {renderStars(rating, true, setRating)}
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tu Reseña
              </label>
              <Textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Escribe tu reseña aquí..."
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={submitReview}
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Enviar Reseña"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No hay reseñas aún</h4>
            <p className="text-muted-foreground">
              Sé el primero en dejar una reseña para este curso
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user_avatar_url} />
                    <AvatarFallback>
                      {review.user_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{review.user_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    
                    <p className="text-sm leading-relaxed">
                      {review.review_text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseReviews;