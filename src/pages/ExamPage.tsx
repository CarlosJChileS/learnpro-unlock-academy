import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  options: string[];
  points: number;
  order_index: number;
}

interface Exam {
  id: string;
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  time_limit_minutes: number;
}

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId && user) {
      loadExam();
    }
  }, [examId, user]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && attemptId) {
      handleSubmitExam();
    }
  }, [timeLeft]);

  const loadExam = async () => {
    try {
      // Mock exam data for now - this would connect to real database
      const mockExam = {
        id: examId || '',
        title: 'Examen Final - JavaScript Moderno',
        description: 'Evaluación final del curso de JavaScript ES6+',
        passing_score: 70,
        max_attempts: 3,
        time_limit_minutes: 60
      };

      const mockQuestions = [
        {
          id: '1',
          question_text: '¿Cuál es la diferencia principal entre let y var en JavaScript?',
          options: ['Let tiene scope de bloque', 'Var tiene scope de bloque', 'No hay diferencia', 'Let es más rápido'],
          points: 10,
          order_index: 1
        },
        {
          id: '2', 
          question_text: '¿Qué hace el operador spread (...) en JavaScript?',
          options: ['Expande arrays u objetos', 'Suma números', 'Concatena strings', 'Compara valores'],
          points: 10,
          order_index: 2
        }
      ];

      setExam(mockExam);
      setQuestions(mockQuestions);
      setTimeLeft(mockExam.time_limit_minutes * 60);
      
      // Mock attempt ID
      setAttemptId('mock-attempt-id');
    } catch (error) {
      console.error('Error loading exam:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el examen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitExam = async () => {
    if (!attemptId || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Mock exam submission - this would connect to real database
      const correctAnswers = {
        '1': 'Let tiene scope de bloque',
        '2': 'Expande arrays u objetos'
      };

      let score = 0;
      const totalQuestions = questions.length;
      
      Object.entries(answers).forEach(([questionId, userAnswer]) => {
        if (correctAnswers[questionId] === userAnswer) {
          score += 1;
        }
      });

      const percentage = (score / totalQuestions) * 100;
      const passed = percentage >= 70;

      toast({
        title: passed ? "¡Felicidades!" : "Examen completado",
        description: passed 
          ? `Has aprobado con ${percentage.toFixed(1)}%` 
          : `Has obtenido ${percentage.toFixed(1)}%. Puedes intentarlo de nuevo.`,
        variant: passed ? "default" : "destructive"
      });

      navigate(`/exam-results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el examen",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando examen...</p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Examen no disponible</h1>
          <p className="text-muted-foreground mb-4">No se pudo cargar el examen</p>
          <Button onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {answeredQuestions}/{questions.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navegación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentQuestionIndex === index 
                          ? "default" 
                          : answers[questions[index].id] 
                            ? "outline" 
                            : "ghost"
                      }
                      size="sm"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className="aspect-square"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t space-y-4">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Respondidas:</span>
                      <span>{answeredQuestions}/{questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiempo restante:</span>
                      <span className={timeLeft < 300 ? "text-destructive font-medium" : ""}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmitExam} 
                    disabled={isSubmitting || answeredQuestions === 0}
                    className="w-full"
                    variant={answeredQuestions === questions.length ? "default" : "outline"}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Examen"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Question */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {currentQuestion.points} punto{currentQuestion.points !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQuestion.question_text}
                </div>

                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                      <Label 
                        htmlFor={`${currentQuestion.id}-${index}`}
                        className="flex-1 cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;