import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// https://supabase.com/docs/reference/javascript/installing
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    console.log('option, response ok');
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { email, orgId } = await req.json();
    const redirectTo = `https://app.syncvote.com/set-password?email=${email}`;
    const { data, error } = await supabaseClient.auth.admin.inviteUserByEmail(
      email,
      { redirectTo }
    );

    //add member to user_org when invite
    if (data) {
      const infoMember = {
        org_id: orgId,
        user_id: data?.user?.id,
        role: 'MEMBER',
      };
      await supabaseClient.from('user_org').insert(infoMember).select();
    }

    const rs = !error ? JSON.stringify(data) : JSON.stringify(error);
    return new Response(rs, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
