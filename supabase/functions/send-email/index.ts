// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // curl "https://api.postmarkapp.com/email/withTemplate" \
  // -X POST \
  // -H "Accept: application/json" \
  // -H "Content-Type: application/json" \
  // -H "X-Postmark-Server-Token: 96f7157d-cdb4-4b49-954c-5277df3d8459" \
  // -d '{
  // "From": "sender@example.com",
  // "To": "recipient@example.com",
  // "TemplateAlias": "invite-to-org",
  // "TemplateModel": {
  //   "full_name": "full_name_Value",
  //   "inviter": "inviter_Value",
  //   "org_title": "org_title_Value"
  // }
  // }'
  if (req.method === 'OPTIONS') {
    console.log('option, response ok');
    return new Response('ok', { headers: corsHeaders })
  }
  const { inviter, full_name, org_title, to_email  } = await req.json();
  const url = "https://api.postmarkapp.com/email/withTemplate";
  const token = "96f7157d-cdb4-4b49-954c-5277df3d8459";
  try {
    const data = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": token,
      },
      body: JSON.stringify({
        "from": "k2@hectagon.finance",
        "to": to_email,
        "TemplateAlias": "invite-to-org",
        "TemplateModel": {
          "full_name": full_name,
          "inviter": inviter,
          "org_title": org_title
        }
      })
    })
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, },
    )
  } catch(error) {
    return new Response(
      JSON.stringify(error),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, },
    )
  }
})
