import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// https://supabase.com/docs/reference/javascript/installing
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

//https://uafmqopjujmosmilsefw.supabase.co/functions/v1/new-org
serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    console.log('option, response ok');
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )
    const { orgInfo, uid } = await req.json();
    const { data, error } = await supabaseClient.from('org').insert(orgInfo).select('*');
    const rs = !error ? JSON.stringify(data) : JSON.stringify(error);
    if (data) {
      const org = {...data[0]};
      await supabaseClient.from('user_org').insert({
        org_id: org.id,
        user_id: uid,
        role: "ADMIN"
      }).select();
    }
    return new Response(
      rs,
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
