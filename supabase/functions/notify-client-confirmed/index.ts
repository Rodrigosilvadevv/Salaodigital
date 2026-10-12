import { createClient } from 'npm:@supabase/supabase-js@2';
import { SignJWT, importPKCS8 } from 'npm:jose@5.9.6';

const APNS_HOST = 'https://api.push.apple.com'; // TestFlight e App Store usam produção
const ANDROID_CHANNEL_ID = 'salao_digital_notifications_v2';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// ── APNs (iPhone) ──
async function makeApnsJwt() {
  const pem = Deno.env.get('APNS_KEY_P8')!.replace(/\\n/g, '\n');
  const key = await importPKCS8(pem, 'ES256');
  return await new SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: Deno.env.get('APNS_KEY_ID')! })
    .setIssuer(Deno.env.get('APNS_TEAM_ID')!)
    .setIssuedAt()
    
    .sign(key);
}

async function sendApns(token: string, title: string, body: string, data: Record<string, string>) {
  const jwt = await makeApnsJwt();
  const res = await fetch(`${APNS_HOST}/3/device/${token}`, {
    method: 'POST',
    headers: {
      authorization: `bearer ${jwt}`,
      'apns-topic': Deno.env.get('APNS_BUNDLE_ID')!,
      'apns-push-type': 'alert',
      'apns-priority': '10',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ aps: { alert: { title, body }, sound: 'default' }, data }),
  });
  if (res.ok) return { ok: true };
  return { ok: false, status: res.status, reason: await res.text() };
}

// ── FCM (Android) ──
async function getFcmAccessToken(sa: any) {
  const key = await importPKCS8(sa.private_key, 'RS256');
  const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/firebase.messaging' })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(sa.client_email)
    .setSubject(sa.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(key);

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error('FCM auth falhou: ' + JSON.stringify(j));
  return j.access_token as string;
}

async function sendFcm(sa: any, token: string, title: string, body: string, data: Record<string, string>) {
  const accessToken = await getFcmAccessToken(sa);
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        token,
        notification: { title, body },
        data,
        android: {
          priority: 'HIGH',
          notification: { channel_id: ANDROID_CHANNEL_ID, sound: 'default' },
        },
      },
    }),
  });
  if (res.ok) return { ok: true };
  return { ok: false, status: res.status, reason: await res.text() };
}

// ── Função principal ──
Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  if (req.headers.get('x-push-secret') !== Deno.env.get('PUSH_WEBHOOK_SECRET')) {
    return json({ error: 'unauthorized' }, 401);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let userId: string | null = null;
  let title = '';
  let body = '';
  let data: Record<string, string> = {};

  if (payload?.record) {
    // Modo webhook: agendamento confirmado
    const rec = payload.record;
    const old = payload.old_record;

    if (payload.type !== 'UPDATE') return json({ skipped: 'não é update' });
    if (rec.status !== 'confirmed' || old?.status === 'confirmed') return json({ skipped: 'sem mudança para confirmado' });
    if (typeof rec.service_name === 'string' && rec.service_name.endsWith(' (continuação)')) {
      return json({ skipped: 'bloco de continuação' });
    }
    if (!rec.client_id) return json({ skipped: 'agendamento sem conta de cliente' });

    const { data: barber } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', rec.barber_id)
      .maybeSingle();

    const dia = String(rec.date || '').split('-').reverse().join('/');
    userId = String(rec.client_id);
    title = 'Agendamento confirmado ✅';
    body = `${barber?.name || 'O profissional'} confirmou ${rec.service_name || 'seu serviço'} em ${dia} às ${rec.time}.`;
    data = { type: 'appointment_confirmed', appointment_id: String(rec.id) };
  } else {
    // Modo teste direto: { user_id, title, body }
    if (!payload?.user_id || !payload?.title || !payload?.body) {
      return json({ error: 'user_id, title e body são obrigatórios' }, 400);
    }
    userId = String(payload.user_id);
    title = payload.title;
    body = payload.body;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('push_token, ios_push_token')
    .eq('id', userId)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500);
  if (!profile) return json({ sent: 0, note: 'perfil não encontrado' });

  const results: Record<string, unknown> = {};

  if (profile.ios_push_token) {
    try {
      const r: any = await sendApns(profile.ios_push_token, title, body, data);
      results.ios = r;
      if (!r.ok && (r.status === 410 || String(r.reason).includes('BadDeviceToken') || String(r.reason).includes('Unregistered'))) {
        await supabase.from('profiles').update({ ios_push_token: null }).eq('id', userId);
      }
    } catch (e) {
      results.ios = { ok: false, reason: String(e) };
    }
  }

  if (profile.push_token) {
    const saRaw = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!saRaw) {
      results.android = { ok: false, reason: 'FIREBASE_SERVICE_ACCOUNT não configurado' };
    } else {
      try {
        results.android = await sendFcm(JSON.parse(saRaw), profile.push_token, title, body, data);
      } catch (e) {
        results.android = { ok: false, reason: String(e) };
      }
    }
  }

  return json({ user_id: userId, results });
});