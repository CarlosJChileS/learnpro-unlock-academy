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

    const { course_id } = await req.json()

    if (!course_id) {
      return new Response(
        JSON.stringify({ error: 'course_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Enrolling user ${user.id} in course ${course_id}`)

    // Check if course exists and is published
    const { data: course, error: courseError } = await supabaseClient
      .from('courses')
      .select('id, title, price, is_published')
      .eq('id', course_id)
      .single()

    if (courseError || !course) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!course.is_published) {
      return new Response(
        JSON.stringify({ error: 'Course is not published' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is already enrolled
    const { data: existingEnrollment } = await supabaseClient
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course_id)
      .single()

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ error: 'User already enrolled in this course' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For paid courses, check if user has active subscription or has made payment
    if (course.price && course.price > 0) {
      const { data: activeSubscription } = await supabaseClient
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('ends_at', new Date().toISOString())
        .single()

      if (!activeSubscription) {
        return new Response(
          JSON.stringify({ error: 'Active subscription required for paid courses' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Enroll user in course
    const { data: enrollment, error: enrollmentError } = await supabaseClient
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: course_id,
        progress_percentage: 0
      })
      .select()
      .single()

    if (enrollmentError) {
      console.error('Enrollment error:', enrollmentError)
      return new Response(
        JSON.stringify({ error: 'Failed to enroll in course' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`User ${user.id} successfully enrolled in course ${course_id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        enrollment,
        course: {
          id: course.id,
          title: course.title
        }
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