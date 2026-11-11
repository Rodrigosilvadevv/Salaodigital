import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import admin from "npm:firebase-admin@12.1.0"; 

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { admin_user, admin_pass, title, body, request_id, audience } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: isAuthorized } = await supabase.rpc("admin_login", {
      p_user: admin_user,
      p_pass: admin_pass,
    });

    if (!isAuthorized) throw new Error("Credenciais inválidas ou acesso não autorizado.");

    let tokens: string[] = [];

    // Coleta o público-alvo correto
    if (audience?.type === "admin") {
      const { data: adminSet } = await supabase.from("admin_settings").select("value").eq("key", "admin_profile_id").single();
      if (adminSet?.value) {
        const { data: adminProf } = await supabase.from("profiles").select("push_token, ios_push_token").eq("id", adminSet.value).single();
        if (adminProf?.push_token) tokens.push(adminProf.push_token);
        if (adminProf?.ios_push_token) tokens.push(adminProf.ios_push_token);
      }
    } else if (audience?.type === "all_clients" || audience?.type === "all_barbers") {
      const roleTarget = audience.type === "all_clients" ? "client" : "barber";
      const { data: profiles } = await supabase.from("profiles").select("push_token, ios_push_token").eq("role", roleTarget);
      profiles?.forEach((p) => {
        if (p.push_token) tokens.push(p.push_token);
        if (p.ios_push_token) tokens.push(p.ios_push_token);
      });
    } else if (audience?.type === "barber_clients" || request_id) {
      let targetBarberId = audience?.barber_id;
      if (request_id) {
        const { data: reqData } = await supabase.from("push_requests").select("barber_id").eq("id", request_id).single();
        targetBarberId = reqData?.barber_id;
      }
      if (targetBarberId) {
        const { data: apps } = await supabase.from("appointments").select("client_id").eq("barber_id", targetBarberId).not("client_id", "is", null);
        if (apps && apps.length > 0) {
          const clientIds = [...new Set(apps.map((a) => a.client_id))];
          const { data: clientProfiles } = await supabase.from("profiles").select("push_token, ios_push_token").in("id", clientIds);
          clientProfiles?.forEach((p) => {
            if (p.push_token) tokens.push(p.push_token);
            if (p.ios_push_token) tokens.push(p.ios_push_token);
          });
        }
      }
    }

    tokens = [...new Set(tokens.filter(Boolean))];
    let sentCount = 0;

    // Dispara via Firebase Admin SDK
    if (tokens.length > 0) {
      if (!admin.apps.length) {
        const serviceAccountRaw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
        if (!serviceAccountRaw) throw new Error("Secret FIREBASE_SERVICE_ACCOUNT ausente.");
        
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(serviceAccountRaw)),
        });
      }

      const fcmResponse = await admin.messaging().sendEachForMulticast({
        notification: { title, body },
        tokens: tokens,
      });

      sentCount = fcmResponse.successCount;
    }

    // Atualiza fila
    if (request_id) {
      await supabase.from("push_requests")
        .update({ status: "enviado", sent_at: new Date().toISOString(), sent_count: sentCount })
        .eq("id", request_id);
    }

    return new Response(JSON.stringify({ success: true, sent: sentCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});