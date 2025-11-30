// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 1. Handle CORS preflight requests (Browser security check)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Parse the request body (The email you sent from the frontend)
    const { email, orgName, orgId } = await req.json()

    // 3. Initialize Supabase Admin Client
    // We use the SERVICE_ROLE_KEY here to bypass RLS and create users
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 4. Send the Invite
    // This sends a magic link to the user's email
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { 
        organization_id: orgId},
        // full_name: "", // add meta data here later
        // organization: orgName || 'Default Org' }, // will want to add the org name as well. Attach metadata to the user
        redirectTo: redirectTo || 'http://localhost:3000/set-password',
        // testing: redirectTo: 'http://localhost:3000/set-password', // CHANGE this to production URL later
    })

    if (error) throw error

    // 5. Success Response
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    // 6. Error Response
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// update edge function each time: npx supabase functions deploy invite-user --project-ref "rbvmenphejjqlgmjfohw"