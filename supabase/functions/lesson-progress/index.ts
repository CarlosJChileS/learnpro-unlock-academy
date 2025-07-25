import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { lesson_id, course_id, watch_time_seconds, is_completed } = await req.json()

    if (!lesson_id || !course_id) {
      return new Response(
        JSON.stringify({ error: 'lesson_id and course_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Updating progress for user ${user.id}, lesson ${lesson_id}`)

    // Check if user is enrolled in the course
    const { data: enrollment } = await supabaseClient
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (!enrollment) {
      return new Response(
        JSON.stringify({ error: 'User not enrolled in this course' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upsert lesson progress
    const progressData: any = {
      user_id: user.id,
      lesson_id,
      course_id,
      watch_time_seconds: watch_time_seconds || 0,
      is_completed: is_completed || false,
    }

    if (is_completed) {
      progressData.completed_at = new Date().toISOString()
    }

    const { data: progress, error: progressError } = await supabaseClient
      .from('lesson_progress')
      .upsert(progressData, {
        onConflict: 'user_id,lesson_id'
      })
      .select()
      .single()

    if (progressError) {
      console.error('Progress update error:', progressError)
      return new Response(
        JSON.stringify({ error: 'Failed to update lesson progress' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate course progress percentage
    const { data: allLessons } = await supabaseClient
      .from('lessons')
      .select('id')
      .eq('course_id', course_id)

    const { data: completedLessons } = await supabaseClient
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .eq('is_completed', true)

    const totalLessons = allLessons?.length || 0
    const completedCount = completedLessons?.length || 0
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    // Update course enrollment progress
    const updateData: any = { progress_percentage: progressPercentage }
    
    // If course is 100% complete, mark as completed
    if (progressPercentage === 100) {
      updateData.completed_at = new Date().toISOString()
    }

    const { error: enrollmentUpdateError } = await supabaseClient
      .from('course_enrollments')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('course_id', course_id)

    if (enrollmentUpdateError) {
      console.error('Enrollment update error:', enrollmentUpdateError)
    }

    console.log(`Progress updated for user ${user.id}, course progress: ${progressPercentage}%`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        progress,
        course_progress_percentage: progressPercentage,
        course_completed: progressPercentage === 100
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})