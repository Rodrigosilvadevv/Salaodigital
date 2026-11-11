import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import admin from "npm:firebase-admin@12.1.0"; 

serve(async (req) => {
  // 1. Valida se a requisição veio do Webhook do Supabase
  const webhookSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const table = payload.table;
  const record = payload.record;

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Descobre quem é o admin
  const { data: settings } = await supabase.from("admin_settings").select("value").eq("key", "admin_profile_id").single();
  
  if (!settings?.value) {
    return new Response("Alertas do admin desativados.", { status: 200 });
  }

  // 3. Pega os tokens do iPhone do admin
  const { data: adminProf } = await supabase.from("profiles").select("push_token, ios_push_token").eq("id", settings.value).single();
  
  const tokens = [adminProf?.push_token, adminProf?.ios_push_token].filter(Boolean) as string[];
  if (tokens.length === 0) {
    return new Response("Nenhum token encontrado para o admin.", { status: 200 });
  }

  // 4. Formata a mensagem
  let title = "Notificação";
  let body = "";

  if (table === "push_requests") {
    title = "🔔 Novo pedido de Push";
    body = `O profissional ${record.barber_name || "desconhecido"} pediu para lançar: "${record.title}"`;
  } else if (table === "support_messages") {
    title = "💬 Nova Mensagem de Suporte";
    body = `${record.barber_name || "Um profissional"} enviou uma mensagem pedindo ajuda.`;
  }

  // 5. Inicializa o Firebase e dispara
  if (tokens.length > 0) {
    if (!admin.apps.length) {
      const serviceAccountRaw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
      if (serviceAccountRaw) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(serviceAccountRaw)),
        });
      }
    }

    try {
      await admin.messaging().sendEachForMulticast({
        notification: { title, body },
        tokens: tokens,
      });
    } catch (e) {
      console.error("Erro ao enviar FCM:", e);
    }
  }
  
  return new Response(JSON.stringify({ success: true, title, body }), {
    headers: { "Content-Type": "application/json" }
  });
});