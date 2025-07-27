import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LessonProgressTrackerProps {
  lessonId: string;
  courseId: string;
  onProgressUpdate?: (progress: number) => void;
}

const LessonProgressTracker: React.FC<LessonProgressTrackerProps> = ({
  lessonId,
  courseId,
  onProgressUpdate
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [watchTime, setWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && lessonId) {
      loadProgress();
    }
  }, [user, lessonId]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update watch time every 5 seconds when video is playing
      setWatchTime(prev => prev + 5);
      updateProgress(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [lessonId, watchTime]);

  const loadProgress = async () => {
    try {
      // Mock progress loading - would connect to database
      const mockProgress = {
        watch_time_seconds: 0,
        is_completed: false
      };
      
      setWatchTime(mockProgress.watch_time_seconds);
      setIsCompleted(mockProgress.is_completed);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (completed: boolean = false) => {
    if (!user) return;

    try {
      // Mock progress update - would connect to database
      if (completed && !isCompleted) {
        setIsCompleted(true);
        toast({
          title: "¡Lección completada!",
          description: "Has marcado esta lección como completada. ¡Sigue así!"
        });
        
        // Calculate course progress
        const courseProgress = await calculateCourseProgress();
        onProgressUpdate?.(courseProgress);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const calculateCourseProgress = async (): Promise<number> => {
    try {
      // Mock course progress calculation - would use database function
      return 75; // Mock 75% progress
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return 0;
    }
  };

  const markAsCompleted = () => {
    updateProgress(true);
  };

  if (loading) {
    return null;
  }

  return (
    <div className="hidden">
      {/* This component works in the background to track progress */}
      {/* It could expose functions or state to parent components */}
    </div>
  );
};

// Helper hook for lesson progress
export const useLessonProgress = (lessonId: string, courseId: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    watchTime: 0,
    isCompleted: false,
    loading: true
  });

  useEffect(() => {
    if (user && lessonId) {
      loadProgress();
    }
  }, [user, lessonId]);

  const loadProgress = async () => {
    try {
      // Mock progress loading
      setProgress({
        watchTime: 0,
        isCompleted: false,
        loading: false
      });
    } catch (error) {
      console.error('Error loading progress:', error);
      setProgress(prev => ({ ...prev, loading: false }));
    }
  };

  const markCompleted = async () => {
    if (!user) return;

    try {
      // Mock progress update
      setProgress(prev => ({ ...prev, isCompleted: true }));
      return true;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      return false;
    }
  };

  const updateWatchTime = async (seconds: number) => {
    if (!user) return;

    try {
      // Mock watch time update
      setProgress(prev => ({ ...prev, watchTime: seconds }));
    } catch (error) {
      console.error('Error updating watch time:', error);
    }
  };

  return {
    ...progress,
    markCompleted,
    updateWatchTime
  };
};

export default LessonProgressTracker;