import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import imgMao from './img/mao.jpg';
import imgMp from './img/mp.jpg';
import imgPopup from './img/popup.png';
import { Capacitor } from '@capacitor/core';
import {
  Scissors, User, Calendar, MapPin, Star, CheckCircle2, LogOut, Bell, DollarSign,
  ChevronLeft, ChevronRight, Check, Trash2, KeyRound, UserPlus, Eye, EyeOff,
  CreditCard, Lock, Clock, CalendarDays, Sparkles, Palette, Briefcase, Edit3,
  MessageCircle, Phone, XCircle, History, Loader2,
  Home, Plus, Camera,
  CheckCircle, ArrowLeft, Send, Headphones, Copy, Link, Image, Shield, Award, Zap, ExternalLink,
  BarChart2, TrendingUp, Moon, Sun, Video, VideoOff, RefreshCw, PlusCircle, X,
  Gift, QrCode, Type, FileText, Users, Tag, Settings, Activity, MessageSquare,
  ChevronDown, ChevronUp, Search, Filter, Reply, MoreVertical, Circle, TrendingDown,
  Percent, Target, AlertCircle, CheckSquare, Bot
} from 'lucide-react';




import { PushNotifications } from '@capacitor/push-notifications';
PushNotifications.addListener('pushNotificationReceived', (notification) => {
  console.log('Notificação Push recebida:', notification);
});

const APP_VERSION = 'v6.2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Inicialização única do cliente Supabase para toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseKey);

// Criação do canal de notificação otimizado para o Android
const createNotificationChannel = async () => {
  if (Capacitor.getPlatform() === 'android') {
    await PushNotifications.createChannel({
      id: 'salao_digital_notifications_v2',
      name: 'Agendamentos Salão Digital',
      importance: 5, // Importância máxima (som e vibração)
      visibility: 1,
      sound: 'default',
    });
  }
};

// ─── CAPTURA E ATUALIZAÇÃO AUTOMÁTICA DO PUSH TOKEN (CAPACITOR) ───────────────
export async function setupPushNotifications(barberId) {
  try {
    // Cria o canal nativo do Android antes de pedir permissão ou registrar
    await createNotificationChannel();

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn('Permissão de notificação negada!');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      console.log('FCM Token do Dispositivo:', token.value);

      if (barberId && token.value) {
        const { error } = await supabase
          .from('profiles')
          .update({ push_token: token.value })
          .eq('id', barberId);

        if (error) {
          console.error('Erro ao salvar push_token no Supabase:', error.message);
        } else {
          console.log('push_token atualizado com sucesso no Supabase!');
        }
      }
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Erro no registro de Push:', error.error);
    });
  } catch (err) {
    console.error('Erro ao configurar notificações push:', err);
  }
}
// ─── DARK MODE CSS ────────────────────────────────────────────────────────────
const injectDarkModeCSS = (isDark) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  let styleEl = document.getElementById('dm-override');
  if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'dm-override'; document.head.appendChild(styleEl); }
  styleEl.textContent = `
    *, *::before, *::after { transition: background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease, box-shadow 0.25s ease !important; }
    :root { --c-bg:#f8fafc;--c-surface:#ffffff;--c-surface2:#f1f5f9;--c-border:#e2e8f0;--c-border2:#cbd5e1;--c-text:#0f172a;--c-text2:#475569;--c-muted:#94a3b8;--c-shadow:rgba(0,0,0,0.08);--c-shadow-xl:rgba(0,0,0,0.15); }
    [data-theme="dark"] { --c-bg:#0f172a;--c-surface:#1e293b;--c-surface2:#273548;--c-border:#334155;--c-border2:#475569;--c-text:#f1f5f9;--c-text2:#cbd5e1;--c-muted:#64748b;--c-shadow:rgba(0,0,0,0.4);--c-shadow-xl:rgba(0,0,0,0.6); }
    [data-theme="dark"] body{background-color:#0f172a!important}
    [data-theme="dark"] .bg-white{background-color:#1e293b!important}
    [data-theme="dark"] .bg-slate-50{background-color:#0f172a!important}
    [data-theme="dark"] .bg-slate-100{background-color:#1e293b!important}
    [data-theme="dark"] .bg-slate-200{background-color:#273548!important}
    [data-theme="dark"] .text-slate-900{color:#f1f5f9!important}
    [data-theme="dark"] .text-slate-800{color:#e2e8f0!important}
    [data-theme="dark"] .text-slate-700{color:#cbd5e1!important}
    [data-theme="dark"] .text-slate-600{color:#94a3b8!important}
    [data-theme="dark"] .text-slate-500{color:#64748b!important}
    [data-theme="dark"] .border-slate-100{border-color:#334155!important}
    [data-theme="dark"] .border-slate-200{border-color:#334155!important}
    [data-theme="dark"] .shadow-sm{box-shadow:0 1px 3px rgba(0,0,0,0.5)!important}
    [data-theme="dark"] .shadow-xl{box-shadow:0 20px 40px rgba(0,0,0,0.6)!important}
    [data-theme="dark"] .bg-amber-50{background-color:#1c1a0e!important}
    [data-theme="dark"] .bg-blue-50{background-color:#0c1929!important}
    [data-theme="dark"] .bg-green-50{background-color:#0a1f12!important}
    [data-theme="dark"] .bg-purple-50{background-color:#150d1f!important}
    [data-theme="dark"] .bg-red-50{background-color:#1f0d0d!important}
    [data-theme="dark"] input,[data-theme="dark"] select,[data-theme="dark"] textarea{background-color:#273548!important;color:#f1f5f9!important;border-color:#334155!important}
    [data-theme="dark"] input::placeholder{color:#64748b!important}
    @keyframes storyPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    .story-ring-animated{animation:storyPulse 3s ease-in-out infinite}
    @keyframes goalPulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,0.4)}70%{box-shadow:0 0 0 12px rgba(251,191,36,0)}}
    .goal-pulse{animation:goalPulse 2s ease-in-out infinite}
  `;
};



// ─── CHAT DO PROFISSIONAL ───
const SupportChat = ({ user, isGuest }) => {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase.from('support_messages').select('*').eq('barber_id', user.id).order('created_at', { ascending: true });
    if (error) console.error('Erro ao carregar suporte:', error);
    else setMsgs(data || []);
  };

  useEffect(() => {
    if (isGuest || !user?.id) return;
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [user?.id, isGuest]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const { error } = await supabase.from('support_messages').insert([{
      barber_id: user.id,
      barber_name: user.name || 'Profissional',
      barber_phone: user.phone || null,
      message: text.trim()
    }]);
    setSending(false);
    if (error) { alert('Erro ao enviar: ' + error.message); return; }
    setText('');
    load();
  };

  return (
    <section className="pb-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-purple-500"/>
        <h3 className="font-bold text-sm text-slate-900">Suporte — Falar com Administrador</h3>
      </div>
      {isGuest ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
          <p className="text-xs text-amber-700 font-bold">Faça login para usar o suporte.</p>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          {msgs.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {msgs.map(m => (
                <div key={m.id} className="space-y-1.5">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-purple-600 text-white rounded-2xl rounded-br-sm px-3 py-2">
                      <p className="text-xs whitespace-pre-wrap">{m.message}</p>
                      <p className="text-[9px] text-purple-200 mt-1 text-right">{new Date(m.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  {m.reply && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm px-3 py-2">
                        <p className="text-[9px] font-black text-purple-600 mb-0.5">SUPORTE</p>
                        <p className="text-xs whitespace-pre-wrap">{m.reply}</p>
                        {m.replied_at && <p className="text-[9px] text-slate-400 mt-1">{new Date(m.replied_at).toLocaleString('pt-BR')}</p>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="space-y-3">
            <p className="text-[11px] text-slate-400 font-medium">
              Precisa de ajuda com o aplicativo ou quer relatar um problema? Escreva abaixo para o nosso time de suporte.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite sua dúvida ou mensagem aqui..."
              rows={3}
              maxLength={500}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-purple-400 transition-colors resize-none font-medium text-slate-700"
            />
            <button type="submit" disabled={sending || !text.trim()}
              className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-1.5">
              {sending ? 'Enviando...' : '✉ Enviar Mensagem'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

// ─── SUPORTE NO PAINEL ADM ───
const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const selected = messages.find(m => m.id === selectedId) || null;

  const load = async () => {
    const { data, error } = await supabase.from('support_messages').select('*').order('created_at', { ascending: false });
    if (error) { console.error('Erro ao carregar suporte:', error); return; }
    setMessages(data || []);
  };

  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, []);
  useEffect(() => { setReplyText(selected?.reply || ''); }, [selectedId]);

  const handleSaveReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('support_messages').update({ reply: replyText.trim(), replied_at: new Date().toISOString() }).eq('id', selected.id);
    setSaving(false);
    if (error) { alert('Erro ao salvar: ' + error.message); return; }
    load();
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm('Excluir esta mensagem? Ela também some para o profissional.')) return;
    const { error } = await supabase.from('support_messages').delete().eq('id', selected.id);
    if (error) { alert('Erro ao excluir: ' + error.message); return; }
    setSelectedId(null);
    load();
  };

  const unread = messages.filter(m => !m.reply).length;

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-black text-white flex items-center gap-2"><MessageSquare size={20} className="text-blue-400"/> Central de Suporte</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-[10px] text-slate-400 font-bold">As mensagens ficam salvas até você excluir. A resposta que você escrever aparece para o profissional no chat dele. Use o WhatsApp para falar direto.</p>
      </div>
      {messages.length === 0
        ? <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center"><p className="text-slate-400">Nenhuma mensagem de suporte ainda.</p></div>
        : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-white text-sm">Mensagens ({messages.length})</h3>
                {unread > 0 && <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{unread} sem resposta</span>}
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                {messages.map(msg => (
                  <button key={msg.id} onClick={() => setSelectedId(msg.id)}
                    className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800 transition-colors ${selectedId === msg.id ? 'bg-slate-800' : ''}`}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm truncate">{msg.barber_name || 'Profissional'}</p>
                          {!msg.reply && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"/>}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{msg.message}</p>
                        <p className="text-[9px] text-slate-600 mt-1">{new Date(msg.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                      {msg.reply && <CheckSquare size={14} className="text-green-400 flex-shrink-0 mt-1"/>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              {selected ? (
                <>
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-black text-white text-sm">{selected.barber_name}</p>
                      <p className="text-[10px] text-slate-400">{new Date(selected.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <button onClick={handleDelete} className="px-3 py-1.5 rounded-lg bg-red-900/40 text-red-400 text-[10px] font-black uppercase hover:bg-red-900/70 transition-colors">Excluir</button>
                  </div>
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <div className="bg-slate-800 rounded-xl p-3">
                      <p className="text-[10px] text-slate-400 font-bold mb-1">MENSAGEM DO PROFISSIONAL</p>
                      <p className="text-sm text-white whitespace-pre-wrap">{selected.message}</p>
                    </div>
                    {selected.reply && (
                      <div className="bg-blue-900/30 border border-blue-800 rounded-xl p-3">
                        <p className="text-[10px] text-blue-400 font-bold mb-1">SUA RESPOSTA (o profissional vê)</p>
                        <p className="text-sm text-white whitespace-pre-wrap">{selected.reply}</p>
                        <p className="text-[9px] text-slate-500 mt-1">{selected.replied_at && new Date(selected.replied_at).toLocaleString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-slate-800 space-y-2">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder="Escreva sua resposta..." rows={3}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors resize-none placeholder-slate-500"/>
                    <div className="flex gap-2">
                      <button onClick={handleSaveReply} disabled={!replyText.trim() || saving}
                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-95 transition-all">
                        {saving ? <Loader2 size={14} className="animate-spin"/> : <><Reply size={14}/> Enviar Resposta</>}
                      </button>
                      {selected.barber_phone && (
                        <a href={`https://wa.me/55${String(selected.barber_phone).replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selected.barber_name}! Equipe Salão Digital aqui. `)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="p-2.5 bg-green-700 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors">
                          <Phone size={16}/>
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                  <div><MessageSquare size={32} className="text-slate-600 mx-auto mb-3"/><p className="text-slate-400 text-sm">Selecione uma mensagem para ver detalhes</p></div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const generateSlug = (name, id) => {
  const normalized = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,'').trim().replace(/\s+/g,'-');
  return `${normalized}-${String(id).slice(-4)}`;
};
const getPublicUrl = (slug) => `${window.location.origin}/${slug}`;
const applyPhoneMask = (value) => {
  const digits = value.replace(/\D/g,'').slice(0,11);
  if (digits.length<=2) return digits;
  if (digits.length<=7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length<=11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
};
const getPhoneDigits = (phone) => phone.replace(/\D/g,'');

// ─── MASTER SERVICES ──────────────────────────────────────────────────────────
const MASTER_SERVICES = [
  { id:1,name:'Corte Degradê',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'hair' },
  { id:2,name:'Barba Terapia',defaultPrice:40,duration:'30min',icon:<User size={20}/>,category:'beard' },
  { id:3,name:'Combo Completo',defaultPrice:80,duration:'1h 00min',icon:<Star size={20}/>,category:'combo' },
  { id:4,name:'Luzes / Platinado',defaultPrice:120,duration:'2h',icon:<Sparkles size={20}/>,category:'chemical' },
  { id:6,name:'Design Sobrancelhas',defaultPrice:35,duration:'30min',icon:<Eye size={20}/>,category:'eyebrow' },
  { id:7,name:'Nail design',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'nail' },
  { id:8,name:'Manicure/Pedicure',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'foot' },
  { id:9,name:'Limpeza facial',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'face' },
  { id:10,name:'Massagem e drenagem',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'dren' },
  { id:12,name:'Lash design',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'lash' },
  { id:13,name:'Micro Pig Sobrancelha',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'face' },
  { id:14,name:'Designer com Henna',defaultPrice:50,duration:'30min',icon:<Scissors size={20}/>,category:'face' },
];

const GLOBAL_TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00'
];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const getDaysInMonth = (year,month) => new Date(year,month+1,0).getDate();
const formatDate = (year,month,day) => `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
const calculateDistance = (lat1,lon1,lat2,lon2) => {
  if (!lat1||!lon1||!lat2||!lon2) return null;
  const R=6371,dLat=(lat2-lat1)*(Math.PI/180),dLon=(lon2-lon1)*(Math.PI/180);
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180))*Math.sin(dLon/2)**2;
  return parseFloat((R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1));
};

// ─── BADGES & RATINGS ─────────────────────────────────────────────────────────
const getBadges = (barber) => {
  const badges=[], services=barber.my_services||[], slots=barber.available_slots||{};
  const totalSlots=Object.values(slots).reduce((acc,arr)=>acc+(arr?.length||0),0);
  if (barber.plano_ativo) badges.push({label:'Pro',color:'bg-blue-600 text-white',icon:<Zap size={9}/>});
  if (services.length>=5) badges.push({label:'Especialista',color:'bg-purple-600 text-white',icon:<Award size={9}/>});
  if (totalSlots>=20) badges.push({label:'Vaga na agenda',color:'bg-green-600 text-white',icon:<Calendar size={9}/>});
  if (barber.avatar_url&&barber.address) badges.push({label:'Verificado',color:'bg-slate-900 text-white',icon:<Shield size={9}/>});
  return badges;
};

const BadgeList = ({ barber, small }) => {
  const badges=getBadges(barber);
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {badges.map((b,i)=>(
        <span key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-bold ${small?'text-[8px]':'text-[9px]'} ${b.color}`}>
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
};

const getBarberRating = (barber) => {
  const badges=getBadges(barber);
  let score=3.5;
  if (barber.plano_ativo) score+=0.5;
  if (barber.avatar_url) score+=0.3;
  if (barber.address) score+=0.2;
  if ((barber.my_services||[]).length>=5) score+=0.3;
  if (badges.find(b=>b.label==='Verificado')) score+=0.2;
  return Math.min(5,parseFloat(score.toFixed(1)));
};

const StarRating = ({ rating }) => {
  const full=Math.floor(rating), half=rating%1>=0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({length:5},(_,i)=>(
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1l1.12 2.27 2.51.36-1.82 1.77.43 2.5L5 6.77l-2.24 1.13.43-2.5L1.37 3.63l2.51-.36z"
            fill={i<full?'#f59e0b':(i===full&&half?'url(#half)':'#e2e8f0')}
            stroke={i<full||(i===full&&half)?'#f59e0b':'#cbd5e1'} strokeWidth="0.5"/>
          {i===full&&half&&<defs><linearGradient id="half"><stop offset="50%" stopColor="#f59e0b"/><stop offset="50%" stopColor="#e2e8f0"/></linearGradient></defs>}
        </svg>
      ))}
    </div>
  );
};

const StoryRing = ({ rating, size=72, children, animate=false }) => {
  const pct=Math.min(1,rating/5), strokeW=3, r=(size-strokeW*2)/2, circ=2*Math.PI*r, offset=circ*(1-pct);
  const ringColor=rating>=4.5?'#f59e0b':rating>=4.0?'#3b82f6':rating>=3.5?'#10b981':'#94a3b8';
  const ratingBg=rating>=4.5?'bg-amber-500':rating>=4.0?'bg-blue-600':rating>=3.5?'bg-green-600':'bg-slate-500';
  return (
    <div className={`relative inline-flex items-center justify-center ${animate?'story-ring-animated':''}`} style={{width:size,height:size}}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeW} opacity="0.4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringColor} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{filter:`drop-shadow(0 0 4px ${ringColor}88)`}}/>
      </svg>
      <div style={{width:size-strokeW*4,height:size-strokeW*4}} className="rounded-full overflow-hidden">{children}</div>
      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${ratingBg} text-white rounded-full text-[8px] font-black px-1.5 py-0.5 shadow-lg border border-white leading-none whitespace-nowrap`}>
        ★ {rating}
      </div>
    </div>
  );
};

const DarkModeToggle = ({ isDark, onToggle }) => (
  <button onClick={onToggle} title={isDark?'Modo Claro':'Modo Escuro'} className="relative flex-shrink-0 transition-all active:scale-90" style={{width:34,height:34}}>
    <div className={`w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-md ${isDark?'bg-slate-800 border-slate-600':'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300 shadow-yellow-200'}`}>
      {isDark?<Moon size={15} className="text-blue-300"/>:<Sun size={15} className="text-yellow-500"/>}
    </div>
    <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-500 ${isDark?'bg-blue-400':'bg-yellow-400'}`}/>
  </button>
);

// ─── GOAL CARD ────────────────────────────────────────────────────────────────
// ─── BOTTOM NAVIGATION (estilo Instagram) ─────────────────────────────────────
const BottomNavBar = ({ activeTab, setActiveTab, tabs, tabLabels, tabIcons, badges = {} }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-stretch z-30 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
    {tabs.map(tab => {
      const Icon = tabIcons[tab];
      const active = activeTab === tab;
      const badge = badges[tab];
      return (
        <button key={tab} onClick={() => setActiveTab(tab)}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all active:scale-95
            ${active ? 'text-slate-900' : 'text-slate-400'}`}>
          <div className="relative">
            <Icon size={20} strokeWidth={active ? 2.5 : 2}/>
            {badge > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </div>
          <span className={`text-[9px] uppercase tracking-tight ${active ? 'font-black' : 'font-bold'}`}>{tabLabels[tab]}</span>
          {active && <span className="absolute top-0 w-8 h-0.5 bg-slate-900 rounded-full"/>}
        </button>
      );
    })}
  </nav>
);

const GoalCard = ({ totalAppointments, slug, isGuest }) => {
  const META_GOAL=30, progress=Math.min(100,Math.round((totalAppointments/META_GOAL)*100)), achieved=totalAppointments>=META_GOAL, remaining=META_GOAL-totalAppointments;
  const publicUrl=getPublicUrl(slug||'profissional');
  const qrCodeUrl=`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}&bgcolor=fffbeb&color=92400e&margin=4&qzone=1`;
  const SUPPORT_WHATSAPP='5541992931394';
  return (
    <div className={`rounded-3xl border-2 overflow-hidden transition-all ${achieved?'border-amber-400 shadow-xl shadow-amber-100':'border-slate-200 bg-white shadow-sm'}`}>
      <div className={`p-4 flex items-center gap-3 ${achieved?'bg-gradient-to-r from-amber-400 to-orange-400':'bg-white'}`}>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${achieved?'bg-white/20':'bg-amber-100'}`}>
          {achieved?<Gift size={20} className="text-white"/>:<Award size={20} className="text-amber-500"/>}
        </div>
        <div className="flex-1">
          <p className={`font-black text-sm ${achieved?'text-white':'text-slate-900'}`}>Meta dos {META_GOAL} Atendimentos</p>
          <p className={`text-[10px] font-bold ${achieved?'text-white/80':'text-slate-400'}`}>{achieved?'🎉 Parabéns! Você desbloqueou recompensas!':'Complete e ganhe prêmios exclusivos!'}</p>
        </div>
        {achieved&&<span className="text-white text-xl">🏆</span>}
      </div>
      <div className="p-4 bg-white space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500">Progresso</span>
            <span className="text-[10px] font-black text-slate-900">{totalAppointments}/{META_GOAL}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
            <div className={`h-full rounded-full transition-all duration-1000 ${achieved?'bg-gradient-to-r from-amber-400 to-orange-400':'bg-gradient-to-r from-blue-400 to-blue-600'} ${achieved?'goal-pulse':''}`} style={{width:`${progress}%`}}/>
            {[25,50,75].map(pct=><div key={pct} className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={{left:`${pct}%`}}/>)}
          </div>
          {!achieved&&<p className="text-[9px] text-slate-400 mt-1 text-center">Faltam {remaining} atendimento{remaining!==1?'s':''} para desbloquear!</p>}
        </div>
        <div className={`rounded-2xl p-3 border ${achieved?'bg-amber-50 border-amber-200':'bg-slate-50 border-slate-100'}`}>
          <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${achieved?'text-amber-600':'text-slate-400'}`}>Recompensas ao atingir</p>
          <div className="grid grid-cols-2 gap-2">
            {[{icon:'📱',title:'5 Tags NFC',sub:'Cartao aproximacao personalizado'},{icon:'🖨️',title:'QR Code Personalizado',sub:'Com seu link'}].map((r,i)=>(
              <div key={i} className={`rounded-xl p-2.5 text-center border ${achieved?'bg-white border-amber-200':'bg-white border-slate-200 opacity-50'}`}>
                <p className="text-xl mb-1">{r.icon}</p>
                <p className="text-[9px] font-black text-slate-700 leading-tight">{r.title}</p>
                <p className="text-[8px] text-slate-400 mt-0.5">{r.sub}</p>
              </div>
            ))}
          </div>
        </div>
        {achieved&&!isGuest&&(
          <div className="space-y-3">
            <div className="flex flex-col items-center bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Seu QR Code Exclusivo</p>
              <img src={qrCodeUrl} alt="QR Code" className="w-36 h-36 rounded-2xl border-4 border-amber-200 shadow-lg" onError={e=>{e.target.style.display='none'}}/>
              <p className="text-[9px] text-amber-600 font-bold mt-2 text-center break-all">{publicUrl}</p>
            </div>
            <a href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(`Olá! Atingi a meta de ${META_GOAL} atendimentos no Salão Digital! Gostaria de resgatar minhas recompensas.\n\nMeu link: ${publicUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white rounded-xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-green-100">
              <Phone size={15}/> Resgatar Prêmio no WhatsApp
            </a>
          </div>
        )}
        {achieved&&isGuest&&<div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center"><p className="text-xs text-amber-700 font-bold">Faça login para resgatar seus prêmios!</p></div>}
      </div>
    </div>
  );
};

// ─── AI SUPPORT CHAT (substitui SupportChat) ──────────────────────────────────

// ─── SIMPLE BAR CHART ─────────────────────────────────────────────────────────
const SimpleBarChart = ({ data, color='#3b82f6', height=80 }) => {
  const max=Math.max(...data.map(d=>d.value),1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{height}}>
        {data.map((d,i)=>(
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
            <span className="text-[8px] font-black text-slate-500">{d.value>0?d.value:''}</span>
            <div className="w-full rounded-t-lg transition-all duration-700"
              style={{height:`${Math.max((d.value/max)*(height-20),d.value>0?4:0)}px`,backgroundColor:color,opacity:0.7+0.3*(d.value/max)}}/>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map((d,i)=><div key={i} className="flex-1 text-center text-[8px] text-slate-400 font-bold truncate">{d.label}</div>)}
      </div>
    </div>
  );
};

// ─── ADMIN PIE CHART ──────────────────────────────────────────────────────────
const AdminPieChart = ({ data = [] }) => {
  const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#84cc16','#f97316','#ec4899','#6366f1'];
  const total = data.reduce((acc,d)=>acc+d.value,0);
  if (!data.length||total===0) return <div className="text-center text-slate-400 text-xs py-8">Sem dados suficientes</div>;
  const cx=80, cy=80, r=65, innerR=30;
  const toRad=(deg)=>(deg-90)*Math.PI/180;
  const polar=(angle)=>({x:cx+r*Math.cos(toRad(angle)),y:cy+r*Math.sin(toRad(angle))});
  let cur=0;
  const slices=data.map((d,i)=>{
    const angle=(d.value/total)*360;
    const start=polar(cur), end=polar(cur+angle);
    const large=angle>180?1:0;
    const path=angle>=359.99
      ? `M ${cx} ${cy-r} A ${r} ${r} 0 1 1 ${cx-0.01} ${cy-r} Z`
      : `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
    cur+=angle;
    return {...d,path,pct:Math.round((d.value/total)*100),color:d.color||COLORS[i%COLORS.length]};
  });
  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 160 160" width={160} height={160}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth={2}/>)}
        <circle cx={cx} cy={cy} r={innerR} fill="white"/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#64748b">TOTAL</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize={13} fontWeight="900" fill="#0f172a">{total}</text>
      </svg>
      <div className="grid grid-cols-2 gap-1.5 w-full max-w-xs">
        {slices.map((s,i)=>(
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:s.color}}/>
            <span className="text-[9px] font-bold text-slate-600 truncate">{s.label}</span>
            <span className="text-[9px] font-black text-slate-900 ml-auto flex-shrink-0">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  useEffect(()=>{
    let meta=document.querySelector('meta[name="robots"]');
    if (!meta) { meta=document.createElement('meta'); meta.name='robots'; document.head.appendChild(meta); }
    meta.content='noindex, nofollow';
    document.title='Admin — Salão Digital';
    return()=>{ meta.content='index, follow'; };
  },[]);

  const [isLoggedIn,setIsLoggedIn]=useState(()=>localStorage.getItem('sd_admin_session')==='true');
  const [loginUser,setLoginUser]=useState('');
  const [loginPass,setLoginPass]=useState('');
  const [loginError,setLoginError]=useState('');
  const [loginLoading,setLoginLoading]=useState(false);
  const [activeSection,setActiveSection]=useState('financial');
  const [allProfiles,setAllProfiles]=useState([]);
  const [allAppointments,setAllAppointments]=useState([]);
  const [supportMessages,setSupportMessages]=useState([]);
  const [dataLoading,setDataLoading]=useState(false);
  const [replyTexts,setReplyTexts]=useState({});
  const [sendingReply,setSendingReply]=useState({});
  const [tagInputs,setTagInputs]=useState({});
  const [savingTags,setSavingTags]=useState({});
  const [selectedMsg,setSelectedMsg]=useState(null);



  const fetchAllData=useCallback(async()=>{
    setDataLoading(true);
    try {
      const [pRes,aRes,sRes]=await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('appointments').select('*').order('created_at',{ascending:false}).limit(500),
        supabase.from('support_messages').select('*').order('created_at',{ascending:false}).limit(200),
      ]);
      if (pRes.data) setAllProfiles(pRes.data);
      if (aRes.data) setAllAppointments(aRes.data);
      if (sRes.data) setSupportMessages(sRes.data);
    } catch(e) { console.error(e); }
    setDataLoading(false);
  },[]);

  useEffect(()=>{
    if (!isLoggedIn) return;
    fetchAllData();
    const channel=supabase.channel('admin-rt')
      .on('postgres_changes',{event:'*',schema:'public',table:'appointments'},()=>fetchAllData())
      .on('postgres_changes',{event:'*',schema:'public',table:'support_messages'},()=>fetchAllData())
      .subscribe();
    return()=>supabase.removeChannel(channel);
  },[isLoggedIn,fetchAllData]);

  const handleLogin=async()=>{
    if (!loginUser.trim()||!loginPass.trim()) { setLoginError('Preencha usuário e senha.'); return; }
    setLoginLoading(true); setLoginError('');
    try {
      const {data,error}=await supabase.rpc('admin_login',{p_user:loginUser.trim(),p_pass:loginPass.trim()});
      if (error) setLoginError('Erro: '+error.message);
      else if (data===true) { localStorage.setItem('sd_admin_session','true'); setIsLoggedIn(true); }
      else setLoginError('Usuário ou senha incorretos.');
    } catch(e) { setLoginError('Erro de conexão: '+e.message); }
    setLoginLoading(false);
  };

  const handleLogout=()=>{ localStorage.removeItem('sd_admin_session'); setIsLoggedIn(false); };

  

  const handleSaveTags=async(profileId,tags)=>{
    setSavingTags(p=>({...p,[profileId]:true}));
    try {
      const tagsArray=tags.split(',').map(t=>t.trim()).filter(Boolean);
      await supabase.from('profiles').update({admin_tags:tagsArray}).eq('id',profileId);
      setAllProfiles(prev=>prev.map(p=>p.id===profileId?{...p,admin_tags:tagsArray}:p));
    } catch(e) { alert('Erro: '+e.message); }
    setSavingTags(p=>({...p,[profileId]:false}));
  };

  const handleSetFeatured=async(profileId,rank)=>{
    try {
      if (rank!==null) {
        const existing=allProfiles.find(p=>p.featured_rank===rank&&p.id!==profileId);
        if (existing) await supabase.from('profiles').update({featured_rank:null}).eq('id',existing.id);
      }
      await supabase.from('profiles').update({featured_rank:rank}).eq('id',profileId);
      setAllProfiles(prev=>prev.map(p=>{
        if (p.id===profileId) return {...p,featured_rank:rank};
        if (rank!==null&&p.featured_rank===rank) return {...p,featured_rank:null};
        return p;
      }));
    } catch(e) { alert('Erro: '+e.message); }
  };

  const handleToggleVisibility=async(profileId,currentValue)=>{
    try {
      await supabase.from('profiles').update({is_visible:!currentValue}).eq('id',profileId);
      setAllProfiles(prev=>prev.map(p=>p.id===profileId?{...p,is_visible:!currentValue}:p));
    } catch(e) { alert('Erro: '+e.message); }
  };

  const handleDeleteProfile=async(profileId,profileName)=>{
    if (!window.confirm(`Excluir a conta de "${profileName}"? Esta ação é irreversível.`)) return;
    try {
      await supabase.from('appointments').delete().or(`barber_id.eq.${profileId},client_id.eq.${profileId}`);
      await supabase.from('profiles').delete().eq('id',profileId);
      setAllProfiles(prev=>prev.filter(p=>p.id!==profileId));
      alert('Conta excluída com sucesso.');
    } catch(e) { alert('Erro ao excluir: '+e.message); }
  };

  // ── DERIVED DATA ──
  const barbers=allProfiles.filter(p=>p.role==='barber');
  const clients=allProfiles.filter(p=>p.role==='client');
  const confirmedApps=allAppointments.filter(a=>a.status==='confirmed');
  const pendingApps=allAppointments.filter(a=>a.status==='pending');
  const totalRevenue=confirmedApps.reduce((acc,a)=>acc+(Number(a.price)||0),0);
  const avgTicket=confirmedApps.length>0?(totalRevenue/confirmedApps.length).toFixed(2):0;

  const monthlyRevenue=useMemo(()=>{
    const months={};
    confirmedApps.forEach(a=>{
      if (!a.date) return;
      const [y,m]=a.date.split('-');
      const key=`${y}-${m}`;
      months[key]=(months[key]||0)+(Number(a.price)||0);
    });
    return Object.entries(months).sort(([a],[b])=>a.localeCompare(b)).slice(-6).map(([k,v])=>({
      label:MONTH_NAMES[parseInt(k.split('-')[1])-1]?.slice(0,3)||k,value:v
    }));
  },[confirmedApps]);

  const revenuePerBarber=useMemo(()=>{
    const map={};
    confirmedApps.forEach(a=>{
      const b=barbers.find(br=>String(br.id)===String(a.barber_id));
      if (!b) return;
      if (!map[b.id]) map[b.id]={name:b.name,revenue:0,count:0};
      map[b.id].revenue+=(Number(a.price)||0);
      map[b.id].count++;
    });
    return Object.values(map).sort((a,b)=>b.revenue-a.revenue);
  },[confirmedApps,barbers]);

  const serviceDistribution=useMemo(()=>{
    const map={};
    allAppointments.forEach(a=>{
      if (!a.service_name) return;
      map[a.service_name]=(map[a.service_name]||0)+1;
    });
    return Object.entries(map).sort(([,a],[,b])=>b-a).slice(0,8).map(([label,value])=>({label,value}));
  },[allAppointments]);

  const appsByDay=useMemo(()=>{
    const days=Array(7).fill(0);
    allAppointments.forEach(a=>{ if (a.date) days[new Date(a.date+'T00:00:00').getDay()]++; });
    return ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((label,i)=>({label,value:days[i]}));
  },[allAppointments]);

  const sevenDaysAgo=new Date(Date.now()-7*24*60*60*1000).toISOString().split('T')[0];
  const inactiveBarbers=useMemo(()=>barbers.filter(b=>{
    const lastApp=allAppointments.filter(a=>String(a.barber_id)===String(b.id)&&a.status==='confirmed').sort((a,b)=>b.date?.localeCompare(a.date||'')||0)[0];
    return !lastApp||(lastApp.date&&lastApp.date<sevenDaysAgo);
  }),[barbers,allAppointments,sevenDaysAgo]);

  const inactiveClients=useMemo(()=>clients.filter(c=>{
    const lastApp=allAppointments.filter(a=>String(a.client_id)===String(c.id)).sort((a,b)=>b.date?.localeCompare(a.date||'')||0)[0];
    return !lastApp||(lastApp.date&&lastApp.date<sevenDaysAgo);
  }),[clients,allAppointments,sevenDaysAgo]);

  const newThisWeek=allProfiles.filter(p=>p.created_at&&p.created_at>new Date(Date.now()-7*24*60*60*1000).toISOString());
  const unreadSupport=supportMessages.filter(m=>!m.reply&&!m.read_at).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-2xl">
              <Settings size={32} className="text-white"/>
            </div>
            <h1 className="text-2xl font-black text-white italic">SALÃO<span className="text-blue-500">DIGITAL</span></h1>
            <p className="text-slate-400 text-sm mt-1 font-bold">Painel Administrativo</p>
          </div>
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
            <h2 className="text-white font-black text-lg mb-6 text-center">Acesso Restrito</h2>
            {loginError&&<div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 text-xs font-bold rounded-xl">{loginError}</div>}
            <div className="space-y-3">
              <input type="text" value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="Usuário"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors placeholder-slate-400"/>
              <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="Senha"
                onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors placeholder-slate-400"/>
              <button onClick={handleLogin} disabled={loginLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
                {loginLoading?<Loader2 size={18} className="animate-spin"/>:'Entrar'}
              </button>
            </div>
          </div>
          <p className="text-center text-slate-600 text-[10px] mt-6 font-bold uppercase tracking-widest">Acesso não autorizado é proibido</p>
        </div>
      </div>
    );
  }

  const NAV=[
    {id:'financial',label:'Financeiro',icon:<DollarSign size={16}/>},
    {id:'operations',label:'Operações',icon:<BarChart2 size={16}/>},
    {id:'crm',label:'CRM',icon:<Users size={16}/>},
    {id:'realtime',label:'Tempo Real',icon:<Activity size={16}/>},
    {id:'support',label:'Suporte',icon:<MessageSquare size={16}/>},
    {id:'professionals',label:'Profissionais',icon:<Tag size={16}/>},
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Settings size={16} className="text-white"/></div>
          <div>
            <h1 className="font-black text-white text-sm">Painel Admin</h1>
            <p className="text-[10px] text-slate-400 font-bold">SALÃO DIGITAL {APP_VERSION}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {dataLoading&&<Loader2 size={16} className="text-blue-400 animate-spin"/>}
          <button onClick={fetchAllData} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><RefreshCw size={15}/></button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-900/50 transition-colors"><LogOut size={14}/> Sair</button>
        </div>
      </header>

      <nav className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex gap-1 overflow-x-auto">
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setActiveSection(n.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all relative ${activeSection===n.id?'bg-blue-600 text-white':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            {n.icon} {n.label}
            {n.id==='support'&&unreadSupport>0&&(
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{unreadSupport}</span>
            )}
            {n.id==='realtime'&&pendingApps.length>0&&(
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"/>
            )}
          </button>
        ))}
      </nav>

      <main className="p-4 md:p-6 max-w-5xl mx-auto pb-16">

        {/* ── FINANCIAL ── */}
        {activeSection==='financial'&&(
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2"><DollarSign size={20} className="text-green-400"/> Visão Financeira</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {label:'Faturamento Total',value:`R$ ${totalRevenue.toFixed(2)}`,icon:<DollarSign size={18}/>,color:'bg-green-600',sub:`${confirmedApps.length} confirmados`},
                {label:'Ticket Médio',value:`R$ ${avgTicket}`,icon:<TrendingUp size={18}/>,color:'bg-blue-600',sub:'por atendimento'},
                {label:'Profissionais',value:barbers.length,icon:<Scissors size={18}/>,color:'bg-purple-600',sub:`${barbers.filter(b=>b.is_visible).length} ativos`},
                {label:'Clientes',value:clients.length,icon:<Users size={18}/>,color:'bg-amber-600',sub:`+${newThisWeek.length} esta semana`},
              ].map((c,i)=>(
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className={`w-8 h-8 ${c.color} rounded-lg flex items-center justify-center mb-3`}>{c.icon}</div>
                  <p className="text-xl font-black text-white">{c.value}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{c.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{c.sub}</p>
                </div>
              ))}
            </div>
            {monthlyRevenue.length>0&&(
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-green-400"/> Faturamento Mensal</h3>
                <SimpleBarChart data={monthlyRevenue} color="#22c55e" height={80}/>
              </div>
            )}
            {revenuePerBarber.length>0&&(
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Award size={16} className="text-amber-400"/> Faturamento por Profissional</h3>
                <div className="space-y-2">
                  {revenuePerBarber.map((b,i)=>(
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                      <span className="text-[10px] font-black text-slate-500 w-4">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{b.name}</p>
                        <p className="text-[10px] text-slate-400">{b.count} atendimentos</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-green-400">R$ {b.revenue.toFixed(2)}</p>
                        <p className="text-[9px] text-slate-400">avg R$ {b.count>0?(b.revenue/b.count).toFixed(2):0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── OPERATIONS ── */}
        {activeSection==='operations'&&(
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2"><BarChart2 size={20} className="text-blue-400"/> Controle de Operação</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Percent size={16} className="text-blue-400"/> Serviços Mais Solicitados</h3>
                <AdminPieChart data={serviceDistribution}/>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Calendar size={16} className="text-purple-400"/> Agendamentos por Dia da Semana</h3>
                <SimpleBarChart data={appsByDay} color="#8b5cf6" height={80}/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label:'Total agendamentos',value:allAppointments.length,icon:'📅'},
                {label:'Taxa de confirmação',value:`${allAppointments.length>0?Math.round((confirmedApps.length/allAppointments.length)*100):0}%`,icon:'✅'},
                {label:'Pendentes',value:pendingApps.length,icon:'⏳'},
              ].map((s,i)=>(
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-4">Top Serviços em Detalhe</h3>
              <div className="space-y-2">
                {serviceDistribution.slice(0,6).map((s,i)=>{
                  const pct=Math.round((s.value/allAppointments.length)*100)||0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 w-3 font-black">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-white truncate">{s.label}</span>
                          <span className="text-[11px] font-black text-slate-300 flex-shrink-0 ml-2">{s.value}×</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{width:`${pct}%`}}/>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-blue-400 w-8 text-right flex-shrink-0">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CRM ── */}
        {activeSection==='crm'&&(
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2"><Users size={20} className="text-amber-400"/> Gestão de CRM</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label:'Profissionais inativos (7d)',value:inactiveBarbers.length,color:'text-red-400'},
                {label:'Clientes inativos (7d)',value:inactiveClients.length,color:'text-orange-400'},
                {label:'Novos esta semana',value:newThisWeek.length,color:'text-green-400'},
              ].map((s,i)=>(
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2"><AlertCircle size={16} className="text-red-400"/> Profissionais sem movimento (&gt;7 dias)</h3>
              {inactiveBarbers.length===0
                ? <p className="text-slate-400 text-sm text-center py-4">Todos os profissionais estão ativos 🎉</p>
                : <div className="space-y-2">{inactiveBarbers.map(b=>{
                    const lastApp=allAppointments.filter(a=>String(a.barber_id)===String(b.id)).sort((a,c)=>c.date?.localeCompare(a.date)||0)[0];
                    return (
                      <div key={b.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                          {b.avatar_url?<img src={b.avatar_url} className="w-full h-full object-cover rounded-full" alt=""/>:<User size={14} className="text-slate-400"/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{b.name}</p>
                          <p className="text-[10px] text-slate-400">{lastApp?`Último: ${lastApp.date?.split('-').reverse().join('/')}`:'Nunca teve agendamento'}</p>
                        </div>
                        <span className="flex-shrink-0 text-[9px] font-black bg-red-900/50 text-red-400 px-2 py-1 rounded-lg uppercase">Inativo</span>
                      </div>
                    );
                  })}</div>}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2"><AlertCircle size={16} className="text-orange-400"/> Clientes sem agendamento (&gt;7 dias)</h3>
              {inactiveClients.length===0
                ? <p className="text-slate-400 text-sm text-center py-4">Todos os clientes estão engajados 🎉</p>
                : <div className="space-y-2 max-h-64 overflow-y-auto">
                    {inactiveClients.slice(0,20).map(c=>(
                      <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0"><User size={14} className="text-slate-400"/></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                        </div>
                        {c.phone&&(
                          <a href={`https://wa.me/55${c.phone.replace(/\D/g,'')}?text=${encodeURIComponent('Olá! Sentimos sua falta no Salão Digital 💙 Que tal agendar um horário?')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors">
                            <Phone size={13}/>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>}
            </div>
          </div>
        )}

        {/* ── REAL TIME ── */}
        {activeSection==='realtime'&&(
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white flex items-center gap-2"><Activity size={20} className="text-green-400"/> Agendamentos em Tempo Real</h2>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/><span className="text-[10px] text-green-400 font-bold">Ao vivo</span></div>
            </div>
            {pendingApps.length>0&&(
              <div className="bg-orange-950/40 border border-orange-800 rounded-2xl p-4">
                <h3 className="text-sm font-black text-orange-300 mb-3 flex items-center gap-2"><Bell size={16}/> Pendentes ({pendingApps.length})</h3>
                <div className="space-y-2">
                  {pendingApps.slice(0,5).map(a=>{
                    const barber=allProfiles.find(p=>String(p.id)===String(a.barber_id));
                    return (
                      <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-white text-sm">{a.client_name}</p>
                          <p className="text-[10px] text-slate-400">{a.service_name} • com {barber?.name||'Profissional'}</p>
                          <p className="text-[10px] text-blue-400 font-bold">{a.date?.split('-').reverse().join('/')} às {a.time}</p>
                        </div>
                        <p className="font-black text-green-400 text-sm flex-shrink-0">R$ {a.price}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-3">Últimos Agendamentos</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allAppointments.slice(0,30).map(a=>{
                  const barber=allProfiles.find(p=>String(p.id)===String(a.barber_id));
                  const statusColor={confirmed:'bg-green-900/50 text-green-400 border-green-800',pending:'bg-orange-900/50 text-orange-400 border-orange-800',rejected:'bg-red-900/50 text-red-400 border-red-800'};
                  return (
                    <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-white">{a.client_name}</p>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${statusColor[a.status]||'bg-slate-700 text-slate-400 border-slate-600'}`}>
                            {a.status==='confirmed'?'CONFIRMADO':a.status==='pending'?'PENDENTE':'REJEITADO'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">{a.service_name} • {barber?.name}</p>
                        <p className="text-[10px] text-slate-500">{a.date?.split('-').reverse().join('/')} {a.time}</p>
                      </div>
                      <p className="font-black text-green-400 text-sm flex-shrink-0">R$ {a.price||0}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SUPPORT ── */}
         {activeSection==='support' && <AdminSupport />}

        {/* ── PROFESSIONALS ── */}
        {activeSection==='professionals'&&(
          <div className="space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2"><Tag size={20} className="text-purple-400"/> Gestão de Profissionais</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2"><Star size={16} className="text-amber-400"/> Top 3 em Destaque</h3>
              <p className="text-[10px] text-slate-400 mb-4">Estes profissionais aparecem no topo da lista de clientes, independente de localização.</p>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(rank=>{
                  const featured=allProfiles.find(p=>p.featured_rank===rank);
                  return (
                    <div key={rank} className={`rounded-xl border p-3 text-center ${featured?'border-amber-600 bg-amber-950/30':'border-slate-700 bg-slate-800'}`}>
                      <p className="text-[10px] font-black text-amber-400 mb-2">#{rank}</p>
                      {featured?(
                        <>
                          <div className="w-10 h-10 rounded-full bg-slate-700 mx-auto mb-1.5 overflow-hidden">
                            {featured.avatar_url?<img src={featured.avatar_url} className="w-full h-full object-cover" alt=""/>:<User size={18} className="text-slate-400 mx-auto mt-1"/>}
                          </div>
                          <p className="text-[10px] font-bold text-white truncate">{featured.name}</p>
                          <button onClick={()=>handleSetFeatured(featured.id,null)} className="mt-2 text-[9px] text-red-400 font-bold">Remover</button>
                        </>
                      ):(
                        <div className="text-slate-500"><p className="text-2xl mb-1">＋</p><p className="text-[9px]">Vaga livre</p></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-black text-white text-sm">Todos os Profissionais ({barbers.length})</h3>
              </div>
              <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                {barbers.map(b=>{
                  const currentTags=(b.admin_tags||[]).join(', ');
                  const tagInput=tagInputs[b.id]!==undefined?tagInputs[b.id]:currentTags;
                  const rating=getBarberRating(b);
                  const appCount=allAppointments.filter(a=>String(a.barber_id)===String(b.id)&&a.status==='confirmed').length;
                  const revenue=allAppointments.filter(a=>String(a.barber_id)===String(b.id)&&a.status==='confirmed').reduce((acc,a)=>acc+(Number(a.price)||0),0);
                  return (
                    <div key={b.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
                          {b.avatar_url?<img src={b.avatar_url} className="w-full h-full object-cover" alt=""/>:<div className="w-full h-full flex items-center justify-center"><User size={16} className="text-slate-400"/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-white text-sm">{b.name}</p>
                            <StarRating rating={rating}/>
                            <span className="text-[9px] font-bold text-amber-400">{rating}</span>
                            {b.featured_rank&&<span className="text-[9px] font-black bg-amber-900/50 text-amber-400 px-2 py-0.5 rounded-full">★ Top #{b.featured_rank}</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">{b.phone}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-[9px] text-slate-500">{appCount} atend. · R$ {revenue}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${b.is_visible?'bg-green-900/50 text-green-400':'bg-red-900/50 text-red-400'}`}>
                              {b.is_visible?'Visível':'Oculto'}
                            </span>
                          </div>
                          {(b.admin_tags||[]).length>0&&(
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(b.admin_tags||[]).map((tag,i)=>(
                                <span key={i} className="text-[9px] font-bold bg-purple-900/40 text-purple-400 border border-purple-800 px-2 py-0.5 rounded-full">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2">
                          <input type="text" value={tagInput}
                            onChange={e=>setTagInputs(p=>({...p,[b.id]:e.target.value}))}
                            placeholder="Tags separadas por vírgula (ex: destaque, vip)"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-purple-500 transition-colors placeholder-slate-500"/>
                          <button onClick={()=>handleSaveTags(b.id,tagInput)} disabled={savingTags[b.id]}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-[10px] font-bold disabled:opacity-50 flex items-center gap-1 whitespace-nowrap">
                            {savingTags[b.id]?<Loader2 size={10} className="animate-spin"/>:<Tag size={10}/>} Salvar
                          </button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {[1,2,3].map(rank=>(
                            <button key={rank} onClick={()=>handleSetFeatured(b.id,b.featured_rank===rank?null:rank)}
                              className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all ${b.featured_rank===rank?'bg-amber-500 text-white':'bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-700'}`}>
                              ★ #{rank}
                            </button>
                          ))}
                          <button onClick={()=>handleToggleVisibility(b.id,b.is_visible)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all ${b.is_visible?'bg-red-900/40 text-red-400 border border-red-800':'bg-green-900/40 text-green-400 border border-green-800'}`}>
                            {b.is_visible?'Ocultar':'Mostrar'}
                          </button>
                          <button onClick={()=>handleDeleteProfile(b.id,b.name)}
                            className="px-2.5 py-1 rounded-lg text-[9px] font-black transition-all bg-red-900/60 text-red-300 border border-red-800 hover:bg-red-800 ml-auto">
                            <Trash2 size={10}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ─── REPORTS SECTION ──────────────────────────────────────────────────────────
const ReportsSection = ({ appointments, user, isGuest, onUpdateProfile, supabase: sb }) => {
  const [hourlyRate,setHourlyRate]=useState(user.hourly_rate||50);
  const [savingRate,setSavingRate]=useState(false);

  const confirmedApps=(appointments||[]).filter(a=>String(a.barber_id||a.barberId)===String(user.id)&&a.status==='confirmed');
  const manualApps=user.manual_appointments||[];
  const allApps=[...confirmedApps,...manualApps];
  const dayNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const appsByDay=Array(7).fill(0);
  allApps.forEach(app=>{ if (app.date) { const dow=new Date(app.date+'T00:00:00').getDay(); appsByDay[dow]++; } });
  const dayData=dayNames.map((label,i)=>({label,value:appsByDay[i]}));
  const recentRevenue=confirmedApps.slice(-6).map((a,i)=>({label:`#${i+1}`,value:Number(a.price)||0}));
  const slots=user.available_slots||{};
  const totalOpen=Object.values(slots).reduce((acc,s)=>acc+(s?.length||0),0);
  const totalBooked=allApps.length;
  const occupancy=totalOpen+totalBooked>0?Math.round((totalBooked/(totalOpen+totalBooked))*100):0;
  const avgMinPerApp=45, totalMinWorked=allApps.length*avgMinPerApp, totalHrsWorked=(totalMinWorked/60).toFixed(1);
  const earnedAtRate=((totalMinWorked/60)*hourlyRate).toFixed(2);
  const totalRevenue=confirmedApps.reduce((acc,a)=>acc+(Number(a.price)||0),0);
  const daysWithSlots=Object.keys(slots).filter(d=>slots[d]?.length>0).length;
  const idleHrs=Math.max(0,daysWithSlots*8-totalMinWorked/60).toFixed(1);

  const saveHourlyRate=async(rate)=>{
    if (isGuest) return;
    setSavingRate(true);
    try { await sb.from('profiles').update({hourly_rate:rate}).eq('id',user.id); onUpdateProfile({...user,hourly_rate:rate}); }
    catch(_){}
    setSavingRate(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Atendimentos</p>
          <p className="text-2xl font-black text-slate-900">{allApps.length}</p>
          <p className="text-[10px] text-green-600 font-bold mt-0.5">↑ {confirmedApps.length} confirmados</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Faturado</p>
          <p className="text-2xl font-black text-slate-900">R$ {totalRevenue}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{totalHrsWorked}h trabalhadas</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Aproveitamento da Agenda</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{width:`${occupancy}%`,background:occupancy>=70?'#22c55e':occupancy>=40?'#3b82f6':'#f59e0b'}}/>
          </div>
          <span className="font-black text-sm text-slate-900 w-10 text-right">{occupancy}%</span>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"/><span className="text-[10px] font-bold text-slate-500">Trabalhando: {totalHrsWorked}h</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"/><span className="text-[10px] font-bold text-slate-500">Ocioso: {idleHrs}h</span></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Atendimentos por Dia da Semana</p>
        <SimpleBarChart data={dayData} color="#3b82f6" height={72}/>
      </div>
      {recentRevenue.length>0&&(
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Valores Últimos Atendimentos</p>
          <SimpleBarChart data={recentRevenue} color="#10b981" height={72}/>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3"><TrendingUp size={16} className="text-blue-500"/><p className="font-bold text-slate-900 text-sm">Análise de Valor de Tempo</p></div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Minha hora vale:</label>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
            <input type="number" value={hourlyRate} onChange={e=>setHourlyRate(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-blue-400"/>
          </div>
          <button onClick={()=>saveHourlyRate(hourlyRate)} disabled={savingRate||isGuest}
            className="px-3 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50">
            {savingRate?'...':'Salvar'}
          </button>
        </div>
        <div className="space-y-2">
          {[{label:'30 minutos',mins:30},{label:'1 hora',mins:60},{label:'2 horas',mins:120},{label:'Dia de trabalho (8h)',mins:480}].map(({label,mins})=>(
            <div key={mins} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">{label}</span>
              <span className="text-xs font-black text-green-600">R$ {((mins/60)*hourlyRate).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total trabalhado (estimado)</p>
          <p className="text-lg font-black text-blue-800">{totalHrsWorked}h → R$ {earnedAtRate}</p>
          <p className="text-[9px] text-blue-500 mt-0.5">Baseado em {allApps.length} atendimentos × 45 min médios</p>
        </div>
      </div>
    </div>
  );
};

// ─── COPY LINK BUTTON ─────────────────────────────────────────────────────────
const CopyLinkButton = ({ barber }) => {
  const [copied,setCopied]=useState(false);
  const slug=barber.slug||generateSlug(barber.name||'profissional',barber.id);
  const url=getPublicUrl(slug);
  const handleCopy=()=>{ navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }); };
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
      <Link size={14} className="text-slate-400 flex-shrink-0"/>
      <p className="text-[10px] text-slate-400 font-mono truncate flex-1">{url}</p>
      <button onClick={handleCopy}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${copied?'bg-green-100 text-green-700':'bg-slate-900 text-white hover:bg-slate-700'}`}>
        {copied?<><CheckCircle size={12}/> Copiado</>:<><Copy size={12}/> Copiar</>}
      </button>
    </div>
  );
};

// ─── BASE COMPONENTS ──────────────────────────────────────────────────────────
const Button = ({ children, onClick, variant='primary', className='', disabled, loading }) => {
  const variants={ primary:"bg-slate-900 text-white hover:bg-black shadow-lg", secondary:"bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20", outline:"border-2 border-slate-200 text-slate-600 hover:border-slate-900", success:"bg-green-600 text-white hover:bg-green-700" };
  return (
    <button onClick={onClick} disabled={disabled||loading}
      className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}>
      {loading?<Loader2 className="animate-spin" size={20}/>:children}
    </button>
  );
};

const Card = ({ children, selected, onClick }) => (
  <div onClick={onClick} className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected?'border-blue-600 bg-blue-50/50':'border-transparent bg-white shadow-sm hover:border-slate-200'}`}>
    {selected&&<div className="absolute top-3 right-3 text-blue-600"><CheckCircle2 size={18} fill="currentColor" className="text-white"/></div>}
    {children}
  </div>
);

const MonthCalendar = ({ availableSlots, selectedDate, onSelectDate, onMonthChange }) => {
  const today=new Date();
  const [calYear,setCalYear]=useState(today.getFullYear());
  const [calMonth,setCalMonth]=useState(today.getMonth());
  const daysInMonth=getDaysInMonth(calYear,calMonth);
  const firstDayOfMonth=new Date(calYear,calMonth,1).getDay();
  const goPrev=()=>{ const d=new Date(calYear,calMonth-1,1); if (d>=new Date(today.getFullYear(),today.getMonth(),1)) { setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); if (onMonthChange) onMonthChange(d.getFullYear(),d.getMonth()); } };
  const goNext=()=>{ const d=new Date(calYear,calMonth+1,1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); if (onMonthChange) onMonthChange(d.getFullYear(),d.getMonth()); };
  const isPrevDisabled=calYear===today.getFullYear()&&calMonth===today.getMonth();
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrev} disabled={isPrevDisabled} className={`p-2 rounded-full transition-all ${isPrevDisabled?'text-slate-200 cursor-not-allowed':'text-slate-600 hover:bg-slate-100'}`}><ChevronLeft size={18}/></button>
        <span className="font-black text-sm text-slate-900">{MONTH_NAMES[calMonth]} {calYear}</span>
        <button onClick={goNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"><ChevronRight size={18}/></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['D','S','T','Q','Q','S','S'].map((d,i)=><div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({length:firstDayOfMonth},(_,i)=><div key={`e-${i}`}/>)}
        {Array.from({length:daysInMonth},(_,i)=>{
          const day=i+1, dateStr=formatDate(calYear,calMonth,day);
          const daySlots=availableSlots?.[dateStr]||[], isAvailable=daySlots.length>0;
          const isSelected=selectedDate===dateStr;
         const isPast=new Date(calYear,calMonth,day)<new Date(today.getFullYear(),today.getMonth(),today.getDate());
          return (
            <button key={i} disabled={!isAvailable||isPast} onClick={()=>onSelectDate(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-bold border transition-all
                ${isSelected?'bg-slate-900 text-white border-slate-900 shadow-lg scale-105':isAvailable&&!isPast?'bg-white text-slate-600 border-slate-200 hover:border-slate-400':'bg-slate-50 text-slate-200 border-transparent opacity-40 cursor-not-allowed'}`}>
              {day}
              {isAvailable&&!isSelected&&!isPast&&<div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"/>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── PRIVACY MODAL ────────────────────────────────────────────────────────────
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full max-w-md max-h-[80vh] rounded-3xl p-8 overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-black mb-4">Política de Privacidade</h2>
        <div className="text-xs text-slate-600 space-y-4 leading-relaxed">
          <p><strong>1. Coleta de Dados:</strong> Coletamos seu nome, telefone e localização para facilitar o agendamento de serviços de beleza.</p>
          <p><strong>2. Uso de Localização:</strong> Sua localização é utilizada apenas enquanto o app está em uso.</p>
          <p><strong>3. Exclusão de Conta:</strong> Você pode excluir sua conta e todos os seus dados a qualquer momento.</p>
          <p><strong>4. Compartilhamento:</strong> Seus dados são compartilhados apenas com o profissional escolhido.</p>
        </div>
        <Button onClick={onClose} className="mt-8">Entendi</Button>
      </div>
    </div>
  );
};

// ─── WELCOME POPUP ────────────────────────────────────────────────────────────
const WelcomePopup = ({ onClose }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}/>
    <div className="relative bg-white w-full max-w-[360px] h-[70vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
      <div className="flex-1 w-full overflow-hidden"><img src={imgPopup} alt="Bem-vindo" className="w-full h-full object-cover"/></div>
      <div className="p-6 bg-white w-full flex items-center justify-center"><Button variant="secondary" onClick={onClose} className="w-full py-4 text-lg shadow-xl shadow-blue-600/20">Começar Agora</Button></div>
    </div>
  </div>
);

// ─── GUEST MODE MODAL ─────────────────────────────────────────────────────────
const GuestModeModal = ({ isOpen, onClose, onSelectGuestMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl">
        <h2 className="text-xl font-black text-slate-900 mb-1 text-center">Explorar como Convidado</h2>
        <p className="text-xs text-slate-400 text-center mb-7">Escolha como deseja visualizar o app</p>
        <div className="space-y-3">
          <button onClick={()=>onSelectGuestMode('client')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40 transition-all active:scale-95 text-left">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200"><User size={22} className="text-white"/></div>
            <div><p className="font-black text-slate-900 text-sm">Ver como Cliente</p><p className="text-[10px] text-slate-400 mt-0.5">Explore serviços, profissionais e agendamentos</p></div>
          </button>
          <button onClick={()=>onSelectGuestMode('barber')} className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-slate-700 transition-all active:scale-95 text-left">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0"><Scissors size={22} className="text-white"/></div>
            <div><p className="font-black text-slate-900 text-sm">Ver como Profissional</p><p className="text-[10px] text-slate-400 mt-0.5">Simule o painel, agenda e serviços (sem salvar)</p></div>
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-5 text-slate-400 font-bold text-xs py-2">Cancelar</button>
      </div>
    </div>
  );
};

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
const WelcomeScreen = ({ onSelectMode, isDark, onToggleDark }) => {
  const [showPrivacy,setShowPrivacy]=useState(false), [showGuestModal,setShowGuestModal]=useState(false);
  const handleGuestMode=(guestType)=>{ setShowGuestModal(false); onSelectMode(guestType==='client'?'guest':'guest-barber'); };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
      style={{backgroundImage:`url('/backgr.png')`,backgroundSize:'cover',backgroundPosition:'center'}}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-0"/>
      <div className="absolute top-6 right-6 z-20"><DarkModeToggle isDark={isDark} onToggle={onToggleDark}/></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-2xl shadow-blue-900/50"><Scissors size={40} className="text-white"/></div>
        <h1 className="text-4xl font-black text-white italic mb-2 tracking-tighter">SALÃO<span className="text-blue-500">DIGITAL</span></h1>
        <div className="w-full max-w-xs space-y-3 mt-10">
          <Button variant="secondary" onClick={()=>onSelectMode('client')}><User size={16}/> Sou Cliente</Button>
          <Button variant="primary" onClick={()=>setShowGuestModal(true)} className="bg-slate-700 hover:bg-slate-600 text-white border-none shadow-lg"><Eye size={16}/> Explorar como Convidado</Button>
          <div className="py-2 flex items-center gap-4"><div className="h-[1px] bg-white/20 flex-1"/><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ou</span><div className="h-[1px] bg-white/20 flex-1"/></div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-900/40" onClick={()=>onSelectMode('barber')}><Scissors size={16}/> Sou Profissional</Button>
          <button onClick={()=>setShowPrivacy(true)} className="mt-6 text-[10px] text-slate-400 underline uppercase tracking-widest font-bold opacity-60 hover:opacity-100">Política de Privacidade</button>
        </div>
      </div>
      <PrivacyModal isOpen={showPrivacy} onClose={()=>setShowPrivacy(false)}/>
      <GuestModeModal isOpen={showGuestModal} onClose={()=>setShowGuestModal(false)} onSelectGuestMode={handleGuestMode}/>
    </div>
  );
};
// ════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN — login/cadastro de barbeiros e clientes
// ════════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN — login/cadastro de barbeiros e clientes
//// ⚠️ Troque pelo Bundle ID real do app (o mesmo do App ID na Apple e do campo "Client IDs" do provider Apple no Supabase)
const APPLE_CLIENT_ID = 'COLOQUE_AQUI_SEU_BUNDLE_ID';

const generateNonce = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
};

const sha256Hex = async (text) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const AuthScreen = ({ userType, onBack, onLogin, onRegister, isDark, onToggleDark }) => {
  const [mode, setMode] = useState('login');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginBy, setLoginBy] = useState('phone');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Usuário vindo de login social (Google ou Apple) que ainda não tem perfil
  const [socialUser, setSocialUser] = useState(null);
  const [phoneForSocial, setPhoneForSocial] = useState('');
  const [nameForSocial, setNameForSocial] = useState('');

  const [noAccountHint, setNoAccountHint] = useState(false);

  const [duplicateHint, setDuplicateHint] = useState(null);

  const regNameValid = regName.trim().length >= 2;
  const regPhoneValid = getPhoneDigits(regPhone).length === 11;
  const regEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim());
  const regPasswordValid = regPassword.length >= 6;

  const loginPhoneDigits = getPhoneDigits(loginPhone).length;
  const loginPhoneValid = loginPhoneDigits === 10 || loginPhoneDigits === 11;
  const loginEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim());
  const loginPasswordValid = loginPassword.length >= 6;

  const phoneSocialValid = getPhoneDigits(phoneForSocial).length === 11;
  const socialNameKnown = !!(socialUser && socialUser.name && socialUser.name.trim().length >= 2);
  const socialNameValid = socialNameKnown || nameForSocial.trim().length >= 2;

  const handleRegPhoneChange = (e) => setRegPhone(applyPhoneMask(e.target.value));
  const handleLoginPhoneChange = (e) => setLoginPhone(applyPhoneMask(e.target.value));
  const handlePhoneSocialChange = (e) => setPhoneForSocial(applyPhoneMask(e.target.value));

  const classifyDuplicateError = (err) => {
    const msg = (err && err.message) || '';
    const lower = msg.toLowerCase();
    const isDup =
      lower.includes('duplicate') ||
      lower.includes('unique') ||
      lower.includes('já existe') ||
      lower.includes('already exists') ||
      lower.includes('já cadastrado');
    if (!isDup) return null;
    if (lower.includes('phone') || lower.includes('telefone')) return 'phone';
    if (lower.includes('email') || lower.includes('e-mail')) return 'email';
    return 'other';
  };

  const friendlyAuthError = (err, fallback) => {
    const kind = classifyDuplicateError(err);
    if (kind === 'phone') return 'Já existe uma conta com este telefone. Faça login em vez de cadastrar.';
    if (kind === 'email') return 'Já existe uma conta com este e-mail. Faça login em vez de cadastrar.';
    if (kind === 'other') return 'Já existe uma conta com esses dados.';
    return (err && err.message) || fallback;
  };

  const getPhoneVariants = (digits) => {
    const variants = [digits];
    if (digits.length === 11 && digits[2] === '9') {
      variants.push(digits.slice(0, 2) + digits.slice(3));
    }
    return variants;
  };

  const phoneAlreadyRegistered = async (digits) => {
    const { data, error } = await supabase.rpc('phone_exists', {
      p_phones: getPhoneVariants(digits),
    });
    if (error) throw new Error('Não foi possível verificar o telefone. Tente novamente.');
    return data === true;
  };

  const redirectToLoginWithPhone = (digits) => {
    setLoginBy('phone');
    setLoginPhone(applyPhoneMask(digits));
    setLoginPassword('');
    setNoAccountHint(false);
    setMode('login');
    setError('Este telefone já tem uma conta cadastrada. Faça login para continuar.');
  };

  const handleRegister = async () => {
    setError('');
    if (!regNameValid) { setError('Digite seu nome (pelo menos 2 letras).'); return; }
    if (!regPhoneValid) { setError('WhatsApp deve ter 11 dígitos (DDD + número com 9).'); return; }
    if (!regEmailValid) { setError('Digite um e-mail válido.'); return; }
    if (!regPasswordValid) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }

    setLoading(true);
    try {
      const email = regEmail.trim().toLowerCase();
      const phone = getPhoneDigits(regPhone);

      if (await phoneAlreadyRegistered(phone)) {
        redirectToLoginWithPhone(phone);
        return;
      }

      await onRegister(
        regName.trim(),
        phone,
        regPassword,
        null,
        email
      );
    } catch (err) {
      setError(friendlyAuthError(err, 'Erro ao cadastrar. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setNoAccountHint(false);

    if (loginBy === 'phone') {
      if (!loginPhoneValid) { setError('WhatsApp deve ter 10 ou 11 dígitos.'); return; }
      setLoading(true);
      try {
        await onLogin(getPhoneDigits(loginPhone), loginPassword || null, null, 'phone');
      } catch (err) {
        setError(err.message || 'Não foi possível entrar. Verifique telefone e senha.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!loginEmailValid) { setError('Digite um e-mail válido.'); return; }
    if (!loginPasswordValid) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }

    setLoading(true);
    try {
      const email = loginEmail.trim().toLowerCase();
      await onLogin(email, loginPassword, null, 'email');
    } catch (err) {
      setError(err.message || 'Não encontramos uma conta com este e-mail.');
      setNoAccountHint(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegisterFromEmail = () => {
    setRegName('');
    setRegEmail(loginEmail.trim());
    setRegPassword(loginPassword);
    setRegPhone('');
    setError('');
    setNoAccountHint(false);
    setMode('register');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      setError('Erro ao conectar com o Google. Tente novamente.');
      setGoogleLoading(false);
    }
  };

  // Verifica se há sessão de login social (Google/Apple).
  // Se já existe perfil -> entra direto. Se não existe -> pede telefone (primeiro login).
  const checkSocialSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const provider = user?.app_metadata?.provider;
    if (!user || (provider !== 'google' && provider !== 'apple')) return;

    let { data: existingProfile } = await supabase
      .from('profiles').select('*').eq('id', user.id).maybeSingle();

    if (!existingProfile && user.email) {
      const { data: byEmail, error: emailLookupErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .eq('role', userType)
        .not('phone', 'is', null)
        .neq('phone', '')
        .maybeSingle();
      if (emailLookupErr) {
        console.error('[AuthScreen] Falha ao buscar perfil por e-mail (' + provider + '):', emailLookupErr);
      }
      existingProfile = byEmail || null;
    }

    if (existingProfile) {
      try { await onLogin(existingProfile.phone, null, existingProfile); }
      catch (err) { setError(err.message || 'Erro ao entrar com ' + (provider === 'apple' ? 'Apple.' : 'Google.')); }
    } else {
      setSocialUser({
        id: user.id,
        provider,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
      });
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setAppleLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // Fluxo nativo (iOS): token direto da Apple -> Supabase
        const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');

        const rawNonce = generateNonce();
        const hashedNonce = await sha256Hex(rawNonce);

        const result = await SignInWithApple.authorize({
          clientId: APPLE_CLIENT_ID,
          redirectURI: '',
          scopes: 'email name',
          nonce: hashedNonce,
        });

        const idToken = result?.response?.identityToken;
        if (!idToken) throw new Error('Não recebemos a autorização da Apple.');

        const { error: signInErr } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: idToken,
          nonce: rawNonce,
        });
        if (signInErr) throw signInErr;

        // A Apple só envia o nome UMA vez (no primeiro login): salvar imediatamente
        const given = result.response.givenName || '';
        const family = result.response.familyName || '';
        const fullName = (given + ' ' + family).trim();
        if (fullName) {
          const { error: metaErr } = await supabase.auth.updateUser({
            data: { full_name: fullName, name: fullName },
          });
          if (metaErr) console.error('[AuthScreen] Falha ao salvar nome da Apple:', metaErr);
        }

        await checkSocialSession();
        setAppleLoading(false);
        return;
      }

      // Web: fluxo por redirecionamento (precisa do Services ID configurado no Supabase)
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin },
      });
      if (oauthErr) throw oauthErr;
    } catch (err) {
      const msg = ((err && err.message) || '').toLowerCase();
      const code = String((err && err.code) || '');
      const cancelled = msg.includes('cancel') || msg.includes('1001') || code === '1001';
      if (!cancelled) {
        console.error('[AuthScreen] Erro no login Apple:', err);
        setError('Erro ao conectar com a Apple. Tente novamente.');
      }
      setAppleLoading(false);
    }
  };

  useEffect(() => {
    checkSocialSession();
  }, []);

  const handleSaveSocialPhone = async () => {
    if (!socialNameValid) { setError('Digite seu nome (pelo menos 2 letras).'); return; }
    if (!phoneSocialValid) { setError('WhatsApp inválido.'); return; }
    setLoading(true); setError('');
    try {
      const digits = getPhoneDigits(phoneForSocial);

      if (await phoneAlreadyRegistered(digits)) {
        await supabase.auth.signOut();
        setSocialUser(null);
        setPhoneForSocial('');
        setNameForSocial('');
        redirectToLoginWithPhone(digits);
        return;
      }

      const finalName = socialNameKnown ? socialUser.name.trim() : nameForSocial.trim();

      await onRegister(
        finalName,
        digits,
        socialUser.provider + '-' + socialUser.id,
        { ...socialUser, name: finalName },
        socialUser.email,
      );
    } catch (err) {
      setError(friendlyAuthError(err, 'Erro ao finalizar cadastro.'));
    } finally {
      setLoading(false);
    }
  };

  if (socialUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6">
          <button onClick={() => { setSocialUser(null); setPhoneForSocial(''); setNameForSocial(''); setError(''); supabase.auth.signOut(); }}
            className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24}/></button>
        </div>
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden mb-3 border-2 border-slate-200">
              {socialUser.avatar_url
                ? <img src={socialUser.avatar_url} className="w-full h-full object-cover" alt="Avatar"/>
                : <User size={28} className="text-slate-400"/>}
            </div>
            {socialNameKnown && <p className="font-black text-slate-900 text-base">{socialUser.name}</p>}
            <p className="text-xs text-slate-400">{socialUser.email}</p>
          </div>
          <h2 className="text-lg font-black text-center text-slate-900 mb-1">
            {socialNameKnown ? 'Só falta o WhatsApp' : 'Só faltam seu nome e WhatsApp'}
          </h2>
          <p className="text-center text-slate-400 text-xs mb-6">Precisamos do seu número para confirmar agendamentos.</p>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg border border-red-100">{error}</div>}
          <div className="space-y-4">
            {!socialNameKnown && (
              <div>
                <input type="text" value={nameForSocial} onChange={e => setNameForSocial(e.target.value)}
                  placeholder="Seu nome (aparece pros clientes)"
                  maxLength={60}
                  className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                    ${nameForSocial.length > 0 ? (socialNameValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                {nameForSocial.length > 0 && !socialNameValid && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Digite pelo menos 2 letras</p>
                )}
              </div>
            )}
            <div>
              <input type="tel" value={phoneForSocial} onChange={handlePhoneSocialChange}
                placeholder="WhatsApp: (41) 99999-9999"
                className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                  ${phoneForSocial.length > 0 ? (phoneSocialValid ? 'border-green-400' : 'border-amber-300') : 'border-slate-200 focus:border-blue-500'}`}/>
              {phoneForSocial.length > 0 && (
                <p className={`text-[10px] font-bold mt-1 ml-1 ${phoneSocialValid ? 'text-green-600' : 'text-amber-500'}`}>
                  {getPhoneDigits(phoneForSocial).length}/11 dígitos {phoneSocialValid ? '✓' : ''}
                </p>
              )}
            </div>
            <Button onClick={handleSaveSocialPhone} loading={loading} disabled={!phoneSocialValid || !socialNameValid}>
              Finalizar cadastro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 left-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24}/></button>
      </div>
      <div className="absolute top-6 right-6">
        <DarkModeToggle isDark={isDark} onToggle={onToggleDark}/>
      </div>

      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-center mb-2">
          {userType === 'barber' ? 'Área Profissional' : 'Área do Cliente'}
        </h2>
        <p className="text-center text-slate-400 mb-6 text-sm">
          {mode === 'login' ? 'Faça login para continuar' : 'Crie sua conta agora'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg border border-red-100">{error}</div>
        )}

        <div className="space-y-4">
          <button onClick={handleGoogleLogin} disabled={googleLoading || appleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-60 shadow-sm">
            {googleLoading
              ? <Loader2 size={18} className="animate-spin text-slate-400"/>
              : <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24v9.02h13.204c-.572 3.048-2.3 5.628-4.9 7.356v6.108h7.932c4.644-4.272 7.296-10.572 7.296-17.78z" fill="#4285F4"/>
                  <path d="M24 48c6.48 0 11.916-2.148 15.888-5.832l-7.932-6.108c-2.148 1.44-4.896 2.292-7.956 2.292-6.12 0-11.304-4.14-13.164-9.696H2.64v6.3C6.6 42.78 14.76 48 24 48z" fill="#34A853"/>
                  <path d="M10.836 28.656A14.82 14.82 0 0 1 9.96 24c0-1.62.276-3.192.876-4.656v-6.3H2.64A23.956 23.956 0 0 0 0 24c0 3.876.924 7.548 2.64 10.956l8.196-6.3z" fill="#FBBC05"/>
                  <path d="M24 9.552c3.456 0 6.552 1.188 8.988 3.528l6.732-6.732C35.904 2.388 30.468 0 24 0 14.76 0 6.6 5.22 2.64 13.044l8.196 6.3c1.86-5.556 7.044-9.792 13.164-9.792z" fill="#EA4335"/>
                </svg>}
            {googleLoading ? 'Conectando...' : 'Continuar com Google'}
          </button>

          <button onClick={handleAppleLogin} disabled={appleLoading || googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black border-2 border-black rounded-xl font-bold text-sm text-white hover:bg-slate-900 active:scale-95 transition-all disabled:opacity-60 shadow-sm">
            {appleLoading
              ? <Loader2 size={18} className="animate-spin text-white"/>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>}
            {appleLoading ? 'Conectando...' : 'Continuar com Apple'}
          </button>

          <div className="flex items-center gap-2">
            <div className="h-[1px] bg-slate-200 flex-1"/>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ou</span>
            <div className="h-[1px] bg-slate-200 flex-1"/>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                  placeholder="Seu nome (aparece pros clientes)"
                  maxLength={60}
                  className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                    ${regName.length > 0 ? (regNameValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                {regName.length > 0 && !regNameValid && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Digite pelo menos 2 letras</p>
                )}
              </div>

              <div>
                <input type="tel" value={regPhone} onChange={handleRegPhoneChange}
                  placeholder="WhatsApp: (41) 99999-9999"
                  className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                    ${regPhone.length > 0 ? (regPhoneValid ? 'border-green-400' : 'border-amber-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                {regPhone.length > 0 && (
                  <p className={`text-[10px] font-bold mt-1 ml-1 ${regPhoneValid ? 'text-green-600' : 'text-amber-500'}`}>
                    {getPhoneDigits(regPhone).length}/11 dígitos {regPhoneValid ? '✓' : ''}
                  </p>
                )}
              </div>

              <div>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                  placeholder="E-mail"
                  className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                    ${regEmail.length > 0 ? (regEmailValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                {regEmail.length > 0 && !regEmailValid && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">E-mail inválido</p>
                )}
              </div>

              <div className="relative">
                <input type={showRegPassword ? 'text' : 'password'} value={regPassword}
                  onChange={e => setRegPassword(e.target.value)} placeholder="Senha (mín. 6 caracteres)"
                  className={`w-full p-3 pr-10 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                    ${regPassword.length > 0 ? (regPasswordValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                <button onClick={() => setShowRegPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showRegPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>

              <Button onClick={handleRegister} loading={loading}>Cadastrar</Button>
            </>
          )}

          {mode === 'login' && (
            <>
              <div className="flex rounded-xl overflow-hidden border-2 border-slate-200">
                <button onClick={() => { setLoginBy('phone'); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-tight transition-all
                    ${loginBy === 'phone' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                  📱 Telefone
                </button>
                <button onClick={() => { setLoginBy('email'); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-black uppercase tracking-tight transition-all
                    ${loginBy === 'email' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
                  ✉️ E-mail
                </button>
              </div>

              {loginBy === 'phone' && (
                <>
                  <div>
                    <input type="tel" value={loginPhone} onChange={handleLoginPhoneChange}
                      placeholder="WhatsApp: (41) 99999-9999"
                      className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                        ${loginPhone.length > 0 ? (loginPhoneValid ? 'border-green-400' : 'border-amber-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                    {loginPhone.length > 0 && (
                      <p className={`text-[10px] font-bold mt-1 ml-1 ${loginPhoneValid ? 'text-green-600' : 'text-amber-500'}`}>
                        {getPhoneDigits(loginPhone).length} dígitos {loginPhoneValid ? '✓' : '(precisa de 10 ou 11)'}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input type={showLoginPassword ? 'text' : 'password'} value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)} placeholder="Senha (opcional para contas antigas)"
                      className="w-full p-3 pr-10 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors"/>
                    <button onClick={() => setShowLoginPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showLoginPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold text-center -mt-2">
                    Contas criadas antes desta versão podem entrar só com o telefone
                  </p>
                </>
              )}

              {loginBy === 'email' && (
                <>
                  <div>
                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                      placeholder="E-mail"
                      className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                        ${loginEmail.length > 0 ? (loginEmailValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                    {loginEmail.length > 0 && !loginEmailValid && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">E-mail inválido</p>
                    )}
                  </div>
                  <div className="relative">
                    <input type={showLoginPassword ? 'text' : 'password'} value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)} placeholder="Senha (mín. 6 caracteres)"
                      className={`w-full p-3 pr-10 bg-slate-50 border-2 rounded-xl outline-none transition-colors
                        ${loginPassword.length > 0 ? (loginPasswordValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`}/>
                    <button onClick={() => setShowLoginPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showLoginPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                  {noAccountHint && (
                    <button onClick={handleGoToRegisterFromEmail}
                      type="button"
                      className="w-full text-xs font-bold text-blue-600 -mt-2">
                      Não encontramos essa conta. Criar cadastro com este e-mail →
                    </button>
                  )}
                </>
              )}

              <Button onClick={handleLogin} loading={loading}>Entrar</Button>
            </>
          )}

          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="w-full text-blue-600 font-bold text-sm mt-2">
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

const BarberOnboarding = ({ user, onComplete, onSkip, supabase: sb }) => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const TOTAL_STEPS = 5;

  const today = new Date();

  const [address, setAddress] = useState(user.address || '');
  const [selectedServices, setSelectedServices] = useState(user.my_services || []);
  const [duration, setDuration] = useState(user.appointment_duration || '30min');
  const [capturedLocation, setCapturedLocation] = useState({ lat: user.latitude, lng: user.longitude });

  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [workPhotos, setWorkPhotos] = useState(user.work_photos || []);
  const [uploadingWorkPhoto, setUploadingWorkPhoto] = useState(false);

  const [availableSlots, setAvailableSlots] = useState(user.available_slots || {});
  const [selectedDateConfig, setSelectedDateConfig] = useState(today.toISOString().split('T')[0]);
  const [configCalYear, setConfigCalYear] = useState(today.getFullYear());
  const [configCalMonth, setConfigCalMonth] = useState(today.getMonth());

  const [isVisible, setIsVisible] = useState(user.is_visible || false);

  const filteredTimeSlots = duration === '1h' ? GLOBAL_TIME_SLOTS.filter(s => s.endsWith(':00')) : GLOBAL_TIME_SLOTS;
  const daysInConfigMonth = getDaysInMonth(configCalYear, configCalMonth);
  const isPrevConfigDisabled = configCalYear === today.getFullYear() && configCalMonth === today.getMonth();
  const goConfigPrev = () => { if (!isPrevConfigDisabled) { const d = new Date(configCalYear, configCalMonth - 1, 1); setConfigCalYear(d.getFullYear()); setConfigCalMonth(d.getMonth()); } };
  const goConfigNext = () => { const d = new Date(configCalYear, configCalMonth + 1, 1); setConfigCalYear(d.getFullYear()); setConfigCalMonth(d.getMonth()); };
  const slotsForSelectedDay = availableSlots[selectedDateConfig] || [];

  const toggleSlotForDate = (date, slot) => {
    const slotsForDay = [...(availableSlots[date] || [])];
    const isOpen = slotsForDay.includes(slot);
    const updatedDaySlots = isOpen ? slotsForDay.filter(s => s !== slot) : [...slotsForDay, slot].sort();
    setAvailableSlots(prev => ({ ...prev, [date]: updatedDaySlots }));
  };

  const selectAllSlotsForDay = (date) => {
    setAvailableSlots(prev => ({ ...prev, [date]: [...filteredTimeSlots] }));
  };

  const deselectAllSlotsForDay = (date) => {
    setAvailableSlots(prev => ({ ...prev, [date]: [] }));
  };

  const markAllDaysInMonth = () => {
    setAvailableSlots(prev => {
      const next = { ...prev };
      for (let i = 1; i <= daysInConfigMonth; i++) {
        const date = formatDate(configCalYear, configCalMonth, i);
        next[date] = [...filteredTimeSlots];
      }
      return next;
    });
  };

  const unmarkAllDaysInMonth = () => {
    setAvailableSlots(prev => {
      const next = { ...prev };
      for (let i = 1; i <= daysInConfigMonth; i++) {
        const date = formatDate(configCalYear, configCalMonth, i);
        next[date] = [];
      }
      return next;
    });
  };

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) { alert('Geolocalização não disponível'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCapturedLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        alert('Localização capturada!');
      },
      () => alert('Erro ao capturar localização.')
    );
  };

  const toggleService = (id, defaultPrice) => {
    const exists = selectedServices.find(s => s.id === id);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.id !== id));
    } else {
      setSelectedServices(prev => [...prev, { id, price: defaultPrice }]);
    }
  };

  const handleUploadAvatar = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await sb.storage
        .from('barber-photos')
        .upload(fileName, arrayBuffer, { contentType: file.type || 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = sb.storage.from('barber-photos').getPublicUrl(fileName);
      setAvatarUrl(publicUrl);
    } catch (err) {
      console.error('[handleUploadAvatar onboarding]', err);
      alert('Erro ao carregar foto: ' + (err?.message || 'tente novamente.'));
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handleUploadWorkPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (workPhotos.length >= 10) { alert('Máximo 10 fotos.'); return; }
    setUploadingWorkPhoto(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const fileName = `work-${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await sb.storage
        .from('barber-photos')
        .upload(fileName, arrayBuffer, { contentType: file.type || 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = sb.storage.from('barber-photos').getPublicUrl(fileName);
      setWorkPhotos(prev => [...prev, publicUrl]);
    } catch (err) {
      console.error('[handleUploadWorkPhoto onboarding]', err);
      alert('Erro: ' + (err?.message || 'tente novamente.'));
    } finally {
      setUploadingWorkPhoto(false);
      event.target.value = '';
    }
  };

  const handleRemoveWorkPhoto = (index) => {
    setWorkPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const slug = generateSlug(user.name, user.id);
      const updateData = {
        address,
        latitude: capturedLocation?.lat || null,
        longitude: capturedLocation?.lng || null,
        my_services: selectedServices,
        appointment_duration: duration,
        avatar_url: avatarUrl,
        work_photos: workPhotos,
        available_slots: availableSlots,
        is_visible: isVisible,
        onboarding_done: true,
        slug,
      };
      await sb.from('profiles').update(updateData).eq('id', user.id);
      onComplete({ ...user, ...updateData });
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      const slug = generateSlug(user.name, user.id);
      await sb.from('profiles').update({ onboarding_done: true, slug }).eq('id', user.id);
      onSkip({ ...user, onboarding_done: true, slug });
    } catch (e) {
      onSkip({ ...user, onboarding_done: true });
    } finally {
      setSaving(false);
    }
  };

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-black text-slate-900 text-base">Configure seu Perfil</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passo {step} de {TOTAL_STEPS}</p>
          </div>
          <button onClick={handleSkip} disabled={saving} className="text-slate-400 font-bold text-xs bg-slate-100 px-4 py-2 rounded-full">
            {saving ? 'Aguarde...' : 'Pular tudo'}
          </button>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}/>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-md mx-auto w-full pb-32">
        {step === 1 && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-2"><MapPin size={28} className="text-blue-600"/></div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Onde você atende?</h2>
              <p className="text-sm text-slate-500">Clientes vão encontrar você pelo endereço.</p>
            </div>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Ex: Rua das Flores, 123 — Curitiba/PR"
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:border-blue-500 transition-colors"/>
            <button onClick={handleCaptureLocation}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 ${capturedLocation?.lat ? 'bg-green-50 border-green-500 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-400'}`}>
              <MapPin size={18}/>{capturedLocation?.lat ? '✓ Localização capturada!' : 'Capturar Minha Localização'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-2"><Scissors size={28} className="text-purple-600"/></div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Quais serviços você oferece?</h2>
              <p className="text-sm text-slate-500">Selecione os serviços. Ajuste os preços depois.</p>
            </div>
            {MASTER_SERVICES.map(s => {
              const isActive = selectedServices.some(sv => sv.id === s.id);
              return (
                <button key={s.id} onClick={() => toggleService(s.id, s.defaultPrice)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-95 text-left ${isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {React.cloneElement(s.icon, { size: 16 })}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>R$ {s.defaultPrice} · {s.duration}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-green-400 border-green-400' : 'border-slate-300'}`}>
                    {isActive && <Check size={12} className="text-white"/>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-2"><Clock size={28} className="text-amber-600"/></div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Duração dos atendimentos</h2>
              <p className="text-sm text-slate-500">Define o intervalo mínimo entre horários.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { value: '30min', label: '30 minutos', icon: '⏱' },
                { value: '1h', label: '1 hora', icon: '🕐' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setDuration(opt.value)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all active:scale-95 ${duration === opt.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                  <p className="text-2xl mb-2">{opt.icon}</p>
                  <p className="font-black text-sm">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-2"><Camera size={28} className="text-pink-600"/></div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Mostre seu trabalho</h2>
              <p className="text-sm text-slate-500">Foto de perfil e fotos dos seus cortes atraem mais clientes.</p>
            </div>

            <div className="flex flex-col items-center py-2">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                  {avatarUrl
                    ? <img src={avatarUrl} className="w-full h-full object-cover" alt="Foto de perfil"/>
                    : <User size={40} className="text-slate-300"/>}
                </div>
                <label htmlFor="onboarding-avatar-upload"
                  className={`absolute bottom-0 right-0 p-2.5 rounded-full cursor-pointer shadow-md transition-all
                    ${uploadingAvatar ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {uploadingAvatar ? <Loader2 size={16} className="text-white animate-spin"/> : <Camera size={16} className="text-white"/>}
                </label>
                <input id="onboarding-avatar-upload" type="file" accept="image/*" className="hidden"
                  onChange={handleUploadAvatar} disabled={uploadingAvatar}/>
              </div>
              <p className="text-[11px] text-slate-400 font-bold mt-3 text-center">
                {avatarUrl ? '✓ Foto de perfil adicionada' : 'Toque na câmera para escolher uma foto'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Fotos do Trabalho</h3>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                  {workPhotos.length}/10
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {workPhotos.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={url} alt={`Trabalho ${i + 1}`} className="w-full h-full object-cover"/>
                    <button onClick={() => handleRemoveWorkPhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                      <XCircle size={14}/>
                    </button>
                  </div>
                ))}
                {workPhotos.length < 10 && (
                  <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                    ${uploadingWorkPhoto ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400'}`}>
                    {uploadingWorkPhoto
                      ? <Loader2 size={20} className="text-blue-500 animate-spin"/>
                      : <><Image size={20} className="text-slate-400 mb-1"/><span className="text-[9px] font-black text-slate-400 uppercase">Adicionar</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadWorkPhoto} disabled={uploadingWorkPhoto}/>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-2"><CalendarDays size={28} className="text-blue-600"/></div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Configure sua agenda</h2>
              <p className="text-sm text-slate-500">Marque os dias e horários em que você atende. Ajuste depois quando quiser.</p>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={goConfigPrev} disabled={isPrevConfigDisabled}
                className={`p-2 rounded-full transition-all ${isPrevConfigDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}>
                <ChevronLeft size={18}/>
              </button>
              <span className="font-black text-sm text-slate-900">{MONTH_NAMES[configCalMonth]} {configCalYear}</span>
              <button onClick={goConfigNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all">
                <ChevronRight size={18}/>
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={markAllDaysInMonth} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95">✓ Marcar Mês</button>
              <button onClick={unmarkAllDaysInMonth} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95 hover:bg-red-600">✕ Limpar Mês</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(configCalYear, configCalMonth, 1).getDay() }, (_, i) => (
                <div key={`vazio-${i}`} className="aspect-square"/>
              ))}
              {Array.from({ length: daysInConfigMonth }, (_, i) => {
                const fullDate = formatDate(configCalYear, configCalMonth, i + 1);
                const isSelected = selectedDateConfig === fullDate;
                const slotsQty = (availableSlots[fullDate] || []).length;
                const isAvail = slotsQty > 0;
                const isLow = slotsQty > 0 && slotsQty < 4;
                return (
                  <button key={i} onClick={() => setSelectedDateConfig(fullDate)}
                    className={`aspect-square rounded-xl text-xs font-bold border transition-all
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                      ${isAvail ? (isLow ? 'bg-amber-500 text-white border-amber-500' : 'bg-green-600 text-white border-green-600') : 'bg-red-500 text-white border-red-500'}`}>
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-600 rounded-sm"/>
                <span className="text-[9px] text-slate-500 font-bold">Livre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded-sm"/>
                <span className="text-[9px] text-slate-500 font-bold">Poucas vagas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-sm"/>
                <span className="text-[9px] text-slate-500 font-bold">Fechado</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-xs text-slate-900">Horários — {selectedDateConfig.split('-').reverse().join('/')}</h4>
                <div className="flex gap-1.5">
                  <button onClick={() => selectAllSlotsForDay(selectedDateConfig)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase active:scale-95">+ Todos</button>
                  <button onClick={() => deselectAllSlotsForDay(selectedDateConfig)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase active:scale-95 hover:bg-red-600">− Todos</button>
                </div>
              </div>
              <div className="h-[1px] bg-slate-200 mb-3"/>
              <div className="grid grid-cols-4 gap-2">
                {filteredTimeSlots.map(slot => {
                  const isOpen = slotsForSelectedDay.includes(slot);
                  return (
                    <button key={slot} onClick={() => toggleSlotForDate(selectedDateConfig, slot)}
                      className={`py-2 text-[10px] font-bold rounded-lg border transition-all active:scale-95
                        ${isOpen ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-red-500 text-white border-red-500 hover:bg-red-600'}`}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="avatar"/> : <User size={18} className="text-slate-400"/>}
              </div>
              <div className="min-w-0">
                <p className="text-white font-black text-sm truncate">{user.name}</p>
                <p className="text-slate-400 text-[10px] font-mono break-all">{getPublicUrl(generateSlug(user.name, user.id))}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Deixar perfil visível agora</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {isVisible ? 'Clientes já podem ver e agendar com você' : 'Ative quando estiver pronto para receber clientes'}
                </p>
              </div>
              <div onClick={() => setIsVisible(v => !v)}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${isVisible ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isVisible ? 'translate-x-6' : 'translate-x-0'}`}/>
              </div>
            </div>

            <button onClick={handleFinish} disabled={saving}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin" size={22}/> : <><CheckCircle size={22}/> Finalizar e Ir para a Agenda</>}
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-10">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-sm active:scale-95 transition-all">
              ← Voltar
            </button>
          )}
          {step < TOTAL_STEPS && (
            <button onClick={() => setStep(s => s + 1)}
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg">
              Próximo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// BARBER ONBOARDING — configuração inicial do perfil (endereço, serviços, etc.)
// ════════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// TOP PROFESSIONALS — carrossel de destaque na home
// ════════════════════════════════════════════════════════════════════════════
const TopProfessionalsSection = ({ barbers }) => {
  const visibleBarbers = barbers.filter(b => b.is_visible && ((b.my_services || []).length > 0 || b.avatar_url));

  const topBarbers = useMemo(() => {
    const featured = visibleBarbers.filter(b => b.featured_rank).sort((a, b) => a.featured_rank - b.featured_rank);
    const others = visibleBarbers.filter(b => !b.featured_rank).sort((a, b) => getBarberRating(b) - getBarberRating(a));
    return [...featured, ...others].slice(0, 3);
  }, [visibleBarbers]);

  if (!topBarbers.length) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Melhores Profissionais</h3>
        <div className="flex items-center gap-1">
          <Star size={10} className="text-amber-400 fill-amber-400"/>
          <span className="text-[9px] font-bold text-slate-400">Top 3</span>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {topBarbers.map(barber => {
          const rating = getBarberRating(barber);
          const specs = (barber.my_services || [])
            .slice(0, 2)
            .map(s => {
              const m = MASTER_SERVICES.find(ms => ms.id === s.id);
              return m?.name || '';
            })
            .filter(Boolean);

          return (
            <div key={barber.id} className="flex-shrink-0 w-[152px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 pt-5 pb-6 flex justify-center">
                {barber.plano_ativo && (
                  <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-0.5"><Zap size={8} className="text-white"/></div>
                )}
                {barber.featured_rank && (
                  <div className="absolute top-2 left-2 bg-amber-500 rounded-full px-1.5 py-0.5 text-[8px] font-black text-white">★{barber.featured_rank}</div>
                )}
                <StoryRing rating={rating} size={72} animate>
                  {barber.avatar_url
                    ? <img src={barber.avatar_url} className="w-full h-full object-cover" alt={barber.name}/>
                    : <div className="w-full h-full flex items-center justify-center bg-slate-700"><User size={22} className="text-slate-400"/></div>}
                </StoryRing>
              </div>
              <div className="px-3 pt-3 pb-3">
                <p className="font-black text-slate-900 text-xs leading-tight truncate">{barber.name}</p>
                {barber.bio && <p className="text-[9px] text-blue-500 font-bold italic mt-0.5 truncate">"{barber.bio}"</p>}
                <div className="flex items-center gap-1.5 mt-1 mb-2">
                  <StarRating rating={rating}/>
                  <span className="text-[9px] font-black text-amber-500">{rating}</span>
                </div>
                {specs.map((s, i) => (
                  <span key={i} className="text-[8px] font-bold text-slate-500 bg-slate-50 rounded-md px-1.5 py-0.5 truncate block mb-0.5">{s}</span>
                ))}
                {barber.distanceLabel && (
                  <div className="flex items-center gap-0.5 mt-1">
                    <MapPin size={9} className="text-blue-400"/>
                    <span className="text-[9px] font-bold text-blue-500">{barber.distanceLabel}</span>
                  </div>
                )}
                {(barber.admin_tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {(barber.admin_tags || []).slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-[7px] font-bold bg-purple-50 text-purple-500 border border-purple-100 px-1 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
/// ─── PUBLIC BARBER PAGE ───────────────────────────────────────────────────────

// Helpers (pode deixar fora do componente)
const timeToMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

// Converte "30 min", "1h", "1h30", "1h 30min" em minutos (fallback 30)
const parseDuration = (str) => {
  if (!str) return 30;
  const s = String(str).toLowerCase();
  const h = s.match(/(\d+)\s*h/);
  const m = s.match(/(\d+)\s*(?:min|m(?!\w)|$)/) || (h ? s.match(/h\s*(\d+)/) : null);
  const total = (h ? parseInt(h[1]) * 60 : 0) + (m ? parseInt(m[1]) : 0);
  return total > 0 ? total : (parseInt(s) || 30);
};

const formatDuration = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (h && m) return `${h}h${String(m).padStart(2, '0')}`;
  if (h) return `${h}h`;
  return `${m} min`;
};

// Data local no formato YYYY-MM-DD (sem bug de fuso horário)
const localISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// "Hoje", "Amanhã" ou "sex. 12/10"
const dateLabel = (dateStr) => {
  const now = new Date();
  if (dateStr === localISO(now)) return 'Hoje';
  const tom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (dateStr === localISO(tom)) return 'Amanhã';
  const [y, m, d] = dateStr.split('-').map(Number);
  const wd = new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short' });
  return `${wd} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
};

const PublicBarberPage = ({ barber }) => {
  const [bookStep,setBookStep]=useState(0), [selectedServices,setSelectedServices]=useState([]), [selectedDate,setSelectedDate]=useState(null), [selectedTime,setSelectedTime]=useState(null), [clientName,setClientName]=useState(''), [clientPhone,setClientPhone]=useState(''), [submitting,setSubmitting]=useState(false), [copied,setCopied]=useState(false);
  const [menuProducts,setMenuProducts]=useState([]), [menuCategories,setMenuCategories]=useState([]);
  const [lightbox,setLightbox]=useState(null);
  const panelRef=useRef(null);
  const rating=getBarberRating(barber), badges=getBadges(barber), workPhotos=barber.work_photos||[];
  const masterServices=(barber.my_services||[]).map(s=>{ const master=MASTER_SERVICES.find(m=>m.id===s.id); return master?{...master,price:s.price}:null; }).filter(Boolean);
  const customServices=(barber.custom_services||[]).map(cs=>({...cs,icon:<Scissors size={20}/>,isCustom:true}));
  const services=[...masterServices,...customServices];
  const barberPhone=String(barber.phone||'').replace(/\D/g,'');

  // ── Cor escolhida no cardápio ──
  const theme = MENU_THEMES[barber.menu_color] || MENU_THEMES.blue;

  // ── Tags do admin (no lugar do selo "Pro") ──
  const adminTags = Array.isArray(barber.admin_tags) ? barber.admin_tags.filter(Boolean) : [];
  const otherBadges = badges.filter(b => !/^\s*pro\b/i.test(String(b.label || '')));
  const showBadges = adminTags.length > 0 ? otherBadges : badges;

  // ── Vitrine do cardápio (somente visualização) ──
  useEffect(()=>{
    let cancelled=false;
    (async()=>{
      try {
        const [p,c]=await Promise.all([
          supabase.from('products').select('*').eq('barber_id',barber.id).order('created_at',{ascending:false}),
          supabase.from('product_categories').select('*').eq('barber_id',barber.id).order('created_at',{ascending:true}),
        ]);
        if (cancelled) return;
        setMenuProducts((p.data||[]).filter(x=>x.stock===null||x.stock===undefined||x.stock>0));
        setMenuCategories(c.data||[]);
      } catch(_) {}
    })();
    return()=>{ cancelled=true; };
  },[barber.id]);

  // Ao abrir/trocar de etapa, leva o cliente até o painel de agendamento
  useEffect(()=>{
    if (bookStep>0&&bookStep<4&&panelRef.current) panelRef.current.scrollIntoView({behavior:'smooth',block:'start'});
  },[bookStep]);

  const uncategorized=menuProducts.filter(p=>!p.category_id||!menuCategories.some(c=>c.id===p.category_id));
  const menuSections=[
    ...menuCategories.map(c=>({id:c.id,name:c.name,items:menuProducts.filter(p=>p.category_id===c.id)})),
    ...(uncategorized.length?[{id:'none',name:menuCategories.length?'Outros':'Produtos',items:uncategorized}]:[]),
  ].filter(s=>s.items.length>0);

  // ── Totais dos serviços escolhidos ──
  const totalPrice = selectedServices.reduce((acc, s) => acc + (Number(s.price) || 0), 0);
  const totalMinutes = selectedServices.reduce((acc, s) => acc + parseDuration(s.duration), 0);
  const servicesLabel = selectedServices.map(s => s.name).join(' + ');
  const isSelected = (service) => selectedServices.some(s => s.id === service.id);

  // ── Intervalo entre os horários e quantos blocos o atendimento ocupa ──
  const slotInterval = GLOBAL_TIME_SLOTS.length > 1
    ? (timeToMin(GLOBAL_TIME_SLOTS[1]) - timeToMin(GLOBAL_TIME_SLOTS[0])) || 30
    : 30;
  const slotsNeeded = Math.max(1, Math.ceil(totalMinutes / slotInterval));

  const isPastSlot = (date, time) => {
    if (!date) return false;
    const [y, m, d] = date.split('-').map(Number);
    const now = new Date();
    if (y === now.getFullYear() && (m - 1) === now.getMonth() && d === now.getDate()) {
      const [th, tm] = time.split(':').map(Number);
      return th < now.getHours() || (th === now.getHours() && tm <= now.getMinutes());
    }
    return false;
  };

  // Horário só é válido se TODOS os blocos seguidos estiverem livres
  const isTimeAvailable = (date, startIdx) => {
    const free = barber.available_slots?.[date] || [];
    const start = GLOBAL_TIME_SLOTS[startIdx];
    if (!start || isPastSlot(date, start)) return false;
    for (let i = 0; i < slotsNeeded; i++) {
      const slot = GLOBAL_TIME_SLOTS[startIdx + i];
      if (!slot) return false;
      if (timeToMin(slot) - timeToMin(start) !== i * slotInterval) return false; // sem "buracos" (ex: almoço)
      if (!free.includes(slot)) return false;
    }
    return true;
  };

  // ── Inteligência: próximo horário livre e vagas de hoje ──
  const todayStr = localISO(new Date());
  const findNextAvailable = () => {
    const dates = Object.keys(barber.available_slots || {}).filter(d => d >= todayStr).sort();
    for (const d of dates) {
      for (let idx = 0; idx < GLOBAL_TIME_SLOTS.length; idx++) {
        if (isTimeAvailable(d, idx)) return { date: d, time: GLOBAL_TIME_SLOTS[idx] };
      }
    }
    return null;
  };
  const nextAvailable = findNextAvailable();
  const freeToday = GLOBAL_TIME_SLOTS.filter((_, idx) => isTimeAvailable(todayStr, idx)).length;

  const handleShare=async()=>{
    const url=window.location.href;
    if (navigator.share) { try { await navigator.share({ title: barber.name, text: `Agende com ${barber.name}`, url }); return; } catch(_) {} }
    navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  // Adiciona/remove serviço da seleção (e zera data/hora, pois a duração mudou)
  const handleToggleService=(service)=>{
    setSelectedServices(prev => prev.some(s=>s.id===service.id) ? prev.filter(s=>s.id!==service.id) : [...prev, service]);
    setSelectedDate(null); setSelectedTime(null);
  };

  const resetBooking=()=>{ setBookStep(0); setSelectedServices([]); setSelectedDate(null); setSelectedTime(null); setClientName(''); setClientPhone(''); };

  const handleSubmitBooking=async()=>{
    if (!clientName.trim()||!clientPhone.trim()) { alert('Preencha seu nome e WhatsApp.'); return; }
    if (selectedServices.length===0||!selectedDate||!selectedTime) { alert('Escolha serviço, data e horário.'); return; }
    setSubmitting(true);
    try {
      // Uma linha por bloco ocupado (ex: 2 serviços de 30min = 14:00 e 14:30)
      const startIdx = GLOBAL_TIME_SLOTS.indexOf(selectedTime);
      const blocks = GLOBAL_TIME_SLOTS.slice(startIdx, startIdx + slotsNeeded);
      const base = { date:selectedDate, barber_id:barber.id, client_id:null, client_name:clientName.trim(), phone:clientPhone.trim(), status:'pending' };
      const rows = blocks.map((t,i)=>({
        ...base,
        time: t,
        service_name: i===0 ? servicesLabel : `${servicesLabel} (continuação)`,
        price: i===0 ? totalPrice : 0
      }));
      const {error}=await supabase.from('appointments').insert(rows);
      if (error) throw error;
      setBookStep(4);
    } catch(e) { alert('Erro ao agendar: '+e.message); } finally { setSubmitting(false); }
  };

  // ───────────── TELA DE SUCESSO ─────────────
  if (bookStep===4) {
    const waMsg = encodeURIComponent(`Olá ${barber.name}! Acabei de agendar ${servicesLabel} para ${selectedDate?.split('-').reverse().join('/')} às ${selectedTime}. Meu nome é ${clientName}.`);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200 animate-bounce"><CheckCircle size={48} className="text-white"/></div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">Tudo certo! 🎉</h2>
        <p className="text-slate-600 text-sm mb-1">Seu pedido foi enviado para <b>{barber.name}</b>.</p>
        <p className="text-slate-400 text-xs mb-8">Você receberá a confirmação pelo WhatsApp.</p>
        <div className="bg-white rounded-3xl p-5 w-full max-w-xs text-left space-y-3 mb-6 border border-slate-100 shadow-lg">
          <div className="flex justify-between gap-4"><span className="text-xs text-slate-400">{selectedServices.length>1?'Serviços':'Serviço'}</span><span className="text-xs font-black text-slate-900 text-right">{servicesLabel}</span></div>
          <div className="flex justify-between"><span className="text-xs text-slate-400">Quando</span><span className="text-xs font-black text-slate-900">{selectedDate&&dateLabel(selectedDate)} · {selectedTime}</span></div>
          <div className="flex justify-between"><span className="text-xs text-slate-400">Duração</span><span className="text-xs font-black text-slate-900">{formatDuration(totalMinutes)}</span></div>
          <div className="flex justify-between pt-3 border-t border-slate-100"><span className="text-xs text-slate-400">Valor</span><span className="text-sm font-black text-green-600">R$ {totalPrice}</span></div>
        </div>
        {barberPhone&&(
          <a href={`https://wa.me/55${barberPhone}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="w-full max-w-xs py-3.5 bg-green-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-200 mb-3">
            <Phone size={16}/> Avisar no WhatsApp
          </a>
        )}
        <button onClick={resetBooking} className={`${theme.text} font-bold text-sm`}>Fazer outro agendamento</button>
      </div>
    );
  }

  // ───────────── PÁGINA PRINCIPAL ─────────────
  const stepNames = ['Serviços', 'Horário', 'Seus dados'];

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* ══ HERO ══ */}
      <div className={`${theme.solid} pb-10 pt-12 px-6 relative overflow-hidden`}>
        {barber.avatar_url&&<img src={barber.avatar_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-125"/>}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70"/>
        <a href="/" className="absolute top-3 right-4 z-20 text-[10px] font-bold text-white/60 hover:text-white transition-colors">Login</a>

        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="mb-4">
            <StoryRing rating={rating} size={120} animate>
              {barber.avatar_url?<img src={barber.avatar_url} className="w-full h-full object-cover" alt={barber.name}/>:<div className="w-full h-full flex items-center justify-center bg-slate-700"><User size={40} className="text-slate-400"/></div>}
            </StoryRing>
          </div>
          <h1 className="text-white font-black text-3xl leading-tight mb-1 mt-1">{barber.name}</h1>
          {barber.bio&&<p className="text-white/80 text-sm font-bold italic mb-2">"{barber.bio}"</p>}
          {barber.address&&<p className="text-white/60 text-xs flex items-center justify-center gap-1 mb-3"><MapPin size={11}/>{barber.address}</p>}

          {/* Tags do admin + selos */}
          {(adminTags.length>0||showBadges.length>0)&&(
            <div className="flex flex-wrap gap-1.5 justify-center mb-4">
              {adminTags.map((t,i)=><span key={`tag-${i}`} className="bg-white/15 border border-white/25 text-white text-[10px] font-black px-2.5 py-1 rounded-full">{t}</span>)}
              {showBadges.map((b,i)=><span key={`b-${i}`} className={`flex items-center gap-0.5 px-2 py-1 rounded-full font-bold text-[9px] ${b.color}`}>{b.icon} {b.label}</span>)}
            </div>
          )}

          {/* Disponibilidade em tempo real */}
          {nextAvailable?(
            <div className="mb-5 flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-2">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"/><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"/></span>
                <span className="text-white text-xs font-bold">Próximo horário: {dateLabel(nextAvailable.date)} às {nextAvailable.time}</span>
              </div>
              {freeToday>0&&freeToday<=4&&<span className="text-amber-300 text-[11px] font-black">🔥 Só {freeToday} {freeToday>1?'horários livres':'horário livre'} hoje</span>}
            </div>
          ):(
            <div className="mb-5 bg-white/10 border border-white/15 rounded-full px-4 py-2"><span className="text-white/80 text-xs font-bold">Agenda cheia no momento</span></div>
          )}

          {/* Mini estatísticas */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs mb-5">
            <div className="bg-white/10 rounded-2xl py-2.5"><p className="text-white font-black text-lg leading-none">{services.length}</p><p className="text-white/60 text-[9px] font-bold uppercase mt-1">Serviços</p></div>
            <div className="bg-white/10 rounded-2xl py-2.5"><p className="text-white font-black text-lg leading-none">{workPhotos.length}</p><p className="text-white/60 text-[9px] font-bold uppercase mt-1">Trabalhos</p></div>
            <div className="bg-white/10 rounded-2xl py-2.5"><p className="text-white font-black text-lg leading-none">{freeToday}</p><p className="text-white/60 text-[9px] font-bold uppercase mt-1">Vagas hoje</p></div>
          </div>

          <div className="flex gap-2 w-full max-w-xs">
            <button onClick={()=>setBookStep(1)} className={`flex-1 py-4 bg-white ${theme.text} rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg`}><CalendarDays size={17}/> Agendar horário</button>
            {barberPhone&&(
              <a href={`https://wa.me/55${barberPhone}`} target="_blank" rel="noopener noreferrer" className="px-4 py-4 bg-green-600 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all" title="Falar no WhatsApp"><Phone size={17}/></a>
            )}
            <button onClick={handleShare} className={`px-4 py-4 rounded-2xl font-black flex items-center justify-center active:scale-95 transition-all ${copied?'bg-green-500 text-white':'bg-white/15 text-white hover:bg-white/25'}`} title="Compartilhar">
              {copied?<CheckCircle size={17}/>:<Copy size={17}/>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* ══ PAINEL DE AGENDAMENTO ══ */}
        {bookStep>0&&bookStep<4&&(
          <div ref={panelRef} className="bg-white -mt-5 relative rounded-3xl border border-slate-100 shadow-xl overflow-hidden scroll-mt-4">
            <div className="px-5 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-slate-900 text-base">{stepNames[bookStep-1]}</h3>
                <button onClick={resetBooking} className="text-slate-400 font-bold text-xs">Cancelar</button>
              </div>
              <div className="flex gap-1.5">
                {[1,2,3].map(n=><div key={n} className={`h-1.5 flex-1 rounded-full transition-all ${n<=bookStep?theme.solid:'bg-slate-100'}`}/>)}
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-2">Passo {bookStep} de 3</p>
            </div>
            <div className="p-5">
              {bookStep===1&&(
                <div>
                  <p className="text-[11px] text-slate-400 font-bold mb-3">💡 Monte seu combo: você pode marcar mais de um serviço no mesmo horário.</p>
                  <div className="space-y-2">{services.map(s=>{
                    const sel=isSelected(s);
                    return (
                      <button key={s.id} onClick={()=>handleToggleService(s)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-95 text-left ${sel?`${theme.border} ${theme.soft}`:'border-slate-100 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sel?`${theme.solid} text-white`:'bg-slate-100'}`}>{sel?<CheckCircle size={17}/>:React.cloneElement(s.icon,{size:17})}</div>
                          <div><p className="font-bold text-sm text-slate-900">{s.name}</p><p className="text-[10px] text-slate-400">{s.duration}</p></div>
                        </div>
                        <p className="font-black text-green-600 text-sm">R$ {s.price}</p>
                      </button>
                    );
                  })}</div>
                  {selectedServices.length>0&&(
                    <div className="mt-4 bg-slate-50 rounded-2xl p-3 flex justify-between items-center border border-slate-100">
                      <div><p className="font-black text-slate-900 text-xs">{selectedServices.length} {selectedServices.length>1?'serviços':'serviço'} · {formatDuration(totalMinutes)}</p><p className="text-[10px] text-slate-400 truncate max-w-[180px]">{servicesLabel}</p></div>
                      <p className="font-black text-green-600">R$ {totalPrice}</p>
                    </div>
                  )}
                  <button onClick={()=>setBookStep(2)} disabled={selectedServices.length===0} className={`w-full mt-4 py-4 ${theme.solid} text-white rounded-2xl font-black text-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}>
                    {selectedServices.length===0?'Selecione ao menos um serviço':`Continuar → R$ ${totalPrice}`}
                  </button>
                </div>
              )}
              {bookStep===2&&(
                <div>
                  <button onClick={()=>setBookStep(1)} className="text-xs text-slate-400 font-bold mb-4 flex items-center gap-1 text-left"><ChevronLeft size={14} className="shrink-0"/> <span>{servicesLabel} · {formatDuration(totalMinutes)} · R$ {totalPrice}</span></button>

                  {/* Atalho inteligente */}
                  {nextAvailable&&!(selectedDate===nextAvailable.date&&selectedTime===nextAvailable.time)&&(
                    <button onClick={()=>{ setSelectedDate(nextAvailable.date); setSelectedTime(nextAvailable.time); }}
                      className="w-full mb-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all">
                      ⚡ Primeiro horário livre: {dateLabel(nextAvailable.date)} às {nextAvailable.time}
                    </button>
                  )}

                  <MonthCalendar availableSlots={barber.available_slots} selectedDate={selectedDate} onSelectDate={d=>{ setSelectedDate(d); setSelectedTime(null); }}/>
                  {selectedDate&&(
                    <div className="mt-5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Horários · {dateLabel(selectedDate)}</p>
                      <div className="grid grid-cols-4 gap-2">
                        {GLOBAL_TIME_SLOTS.map((t,idx)=>{
                          const avail = isTimeAvailable(selectedDate, idx);
                          return <button key={t} disabled={!avail} onClick={()=>setSelectedTime(t)} className={`py-2.5 rounded-xl font-bold text-xs transition-all ${selectedTime===t?`${theme.solid} text-white shadow-lg scale-105`:avail?'bg-white text-slate-600 border border-slate-200 hover:border-slate-400':'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>{t}</button>;
                        })}
                      </div>
                      {slotsNeeded>1&&<p className="text-[10px] text-slate-400 mt-3">Mostrando apenas horários com {formatDuration(totalMinutes)} livres em sequência.</p>}
                      {GLOBAL_TIME_SLOTS.every((_,idx)=>!isTimeAvailable(selectedDate, idx))&&<p className="text-xs text-amber-600 font-bold mt-3">Sem horário suficiente nesse dia. Tente outra data ou remova um serviço.</p>}
                    </div>
                  )}
                  {selectedTime&&selectedDate&&<button onClick={()=>setBookStep(3)} className={`w-full mt-5 py-4 ${theme.solid} text-white rounded-2xl font-black text-sm active:scale-95 transition-all`}>Próximo → {dateLabel(selectedDate)} às {selectedTime}</button>}
                </div>
              )}
              {bookStep===3&&(
                <div className="space-y-4">
                  <button onClick={()=>setBookStep(2)} className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1"><ChevronLeft size={14}/> {selectedDate&&dateLabel(selectedDate)} às {selectedTime}</button>
                  <div className={`${theme.soft} rounded-2xl p-4`}>
                    <div className="space-y-1.5">
                      {selectedServices.map(s=>(
                        <div key={s.id} className="flex justify-between items-center"><p className="font-bold text-slate-900 text-xs">{s.name} <span className="text-slate-400 font-normal">· {s.duration}</span></p><p className="font-bold text-slate-600 text-xs">R$ {s.price}</p></div>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
                      <div><p className="font-black text-slate-900 text-sm">Total · {formatDuration(totalMinutes)}</p><p className="text-[10px] text-slate-500">{selectedDate&&dateLabel(selectedDate)} às {selectedTime}</p></div>
                      <p className="font-black text-green-600 text-lg">R$ {totalPrice}</p>
                    </div>
                  </div>
                  <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Seu nome</label><input type="text" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Nome e sobrenome" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"/></div>
                  <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">WhatsApp</label><input type="tel" value={clientPhone} onChange={e=>setClientPhone(applyPhoneMask(e.target.value))} placeholder="(41) 99999-9999" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-slate-400 transition-colors"/></div>
                  <button onClick={handleSubmitBooking} disabled={submitting} className={`w-full py-4 ${theme.solid} text-white rounded-2xl font-black text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}>
                    {submitting?<Loader2 className="animate-spin" size={18}/>:<><CheckCircle size={18}/> Confirmar Agendamento</>}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold">🔒 Seus dados são usados apenas para este agendamento.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ TRABALHOS ══ */}
        {workPhotos.length>0&&(
          <div className="mt-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Trabalhos recentes</p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
              {workPhotos.map((url,i)=>(
                <button key={i} onClick={()=>setLightbox(url)} className="flex-shrink-0 snap-start w-36 h-44 rounded-3xl overflow-hidden bg-slate-200 shadow-md active:scale-95 transition-all">
                  <img src={url} alt={`Trabalho ${i+1}`} className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ SERVIÇOS ══ */}
        <div className="mt-8">
          <div className="flex items-end justify-between mb-3 px-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviços</p>
            <span className={`${theme.text} text-[10px] font-bold`}>toque para montar seu combo</span>
          </div>
          <div className="space-y-2">{services.map(s=>{
            const sel=isSelected(s);
            return (
              <button key={s.id} onClick={()=>handleToggleService(s)} className={`w-full rounded-2xl border-2 p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer ${sel?`${theme.soft} ${theme.border} shadow-md`:'bg-white border-transparent shadow-sm hover:border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sel?`${theme.solid} text-white`:'bg-slate-100 text-slate-600'}`}>{React.cloneElement(s.icon,{size:18})}</div>
                  <div className="text-left"><p className="font-bold text-sm text-slate-900">{s.name}</p><p className="text-[10px] text-slate-400">⏱ {s.duration}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-green-600 text-sm">R$ {s.price}</p>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${sel?`${theme.solid} ${theme.border}`:'border-slate-200'}`}>{sel&&<CheckCircle size={13} className="text-white"/>}</div>
                </div>
              </button>
            );
          })}</div>
        </div>

        {/* ══ E ainda contamos com mais... (vitrine, só visualização, sem preço) ══ */}
        {menuSections.length>0&&(
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-1">
              <div className={`h-px flex-1 ${theme.soft}`}/>
              <h2 className="text-sm font-black text-slate-900 text-center">E ainda contamos com mais...</h2>
              <div className={`h-px flex-1 ${theme.soft}`}/>
            </div>
            <p className="text-center text-[11px] text-slate-400 font-bold mb-5">Aproveite seu horário e experimente 😋</p>
            {menuSections.map(s=>(
              <div key={s.id} className="mb-6">
                <h3 className={`font-black text-sm mb-3 px-1 ${theme.text}`}>{s.name}</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
                  {s.items.map(p=>(
                    <div key={p.id} className="flex-shrink-0 snap-start w-36">
                      <div className="relative w-36 h-36 rounded-3xl bg-slate-100 overflow-hidden shadow-md">
                        {p.photo_url?<img src={p.photo_url} className="w-full h-full object-cover" alt={p.name}/>:<div className="w-full h-full flex items-center justify-center text-slate-300"><Tag size={24}/></div>}
                      </div>
                      <p className="font-black text-slate-900 text-xs mt-2 truncate">{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Agendamento via</p>
          <a href="/" className="font-black text-slate-400 italic text-sm block cursor-pointer hover:opacity-80 transition-opacity">SALÃO<span className="text-blue-500">DIGITAL</span></a>
        </div>
      </div>

      {/* ══ BARRA FLUTUANTE DO COMBO ══ */}
      {bookStep===0&&selectedServices.length>0&&(
        <div className="fixed bottom-0 inset-x-0 p-4 z-40">
          <button onClick={()=>setBookStep(2)} className={`max-w-md mx-auto w-full ${theme.solid} text-white rounded-2xl py-4 px-5 flex items-center justify-between font-black text-sm shadow-2xl active:scale-95 transition-all`}>
            <span className="flex items-center gap-2"><span className="bg-white/25 w-7 h-7 rounded-full flex items-center justify-center text-xs">{selectedServices.length}</span>{formatDuration(totalMinutes)}</span>
            <span>Escolher horário · R$ {totalPrice} →</span>
          </button>
        </div>
      )}

      {/* ══ LIGHTBOX ══ */}
      {lightbox&&(
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4" onClick={()=>setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"><X size={22}/></button>
          <img src={lightbox} alt="Trabalho" className="max-w-full max-h-[85vh] rounded-2xl object-contain"/>
        </div>
      )}
    </div>
  );
};
// ─── CLIENT APP ───────────────────────────────────────────────────────────────
// ─── CARDÁPIO PÚBLICO (CLIENTE) ───────────────────────────────────────────────
const PublicMenuPage = ({ slug }) => {
  const [barber, setBarber] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeCat, setActiveCat] = useState('all');
  const [cart, setCart] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientName, setClientName] = useState(() => { try { return localStorage.getItem('menu_client_name') || ''; } catch (_) { return ''; } });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const load = async () => {
    const { data: prof } = await supabase.from('profiles').select('id,name,avatar_url,bio,menu_color').eq('slug', slug).maybeSingle();
    if (!prof) { setNotFound(true); setLoading(false); return; }
    setBarber(prof);
    const [p, c] = await Promise.all([
      supabase.from('products').select('*').eq('barber_id', prof.id).order('created_at', { ascending: false }),
      supabase.from('product_categories').select('*').eq('barber_id', prof.id).order('created_at', { ascending: true }),
    ]);
    setProducts(p.data || []); setCategories(c.data || []); setLoading(false);
  };
  useEffect(() => { load(); }, [slug]);

  const theme = MENU_THEMES[barber?.menu_color] || MENU_THEMES.blue;
  const hasStock = (p) => p.stock === null || p.stock === undefined || p.stock > 0;

  const add = (p) => setCart(prev => {
    const cur = prev[p.id] || 0;
    if (p.stock !== null && p.stock !== undefined && cur >= p.stock) return prev;
    return { ...prev, [p.id]: cur + 1 };
  });
  const remove = (p) => setCart(prev => {
    const cur = prev[p.id] || 0;
    const n = { ...prev };
    if (cur <= 1) delete n[p.id]; else n[p.id] = cur - 1;
    return n;
  });

  const cartItems = products.filter(p => cart[p.id]).map(p => ({ ...p, qty: cart[p.id] }));
  const total = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);
  const visible = activeCat === 'all' ? products : products.filter(p => p.category_id === activeCat);

  const submit = async () => {
    if (!clientName.trim()) { alert('Digite seu nome.'); return; }
    setSending(true);
    try { localStorage.setItem('menu_client_name', clientName.trim()); } catch (_) {}
    const { error } = await supabase.rpc('place_menu_order', {
      p_barber: String(barber.id),
      p_client: clientName.trim(),
      p_items: cartItems.map(i => ({ product_id: String(i.id), qty: i.qty })),
    });
    setSending(false);
    if (error) { alert(error.message); load(); return; }
    setCart({}); setShowCheckout(false); setDone(true); load();
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" size={28}/></div>;
  if (notFound) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-center"><p className="text-slate-500 font-bold">Cardápio não encontrado.</p></div>;

  if (done) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle size={40} className="text-green-600"/></div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Pedido enviado!</h2>
      <p className="text-slate-500 text-sm mb-8">{barber.name} já recebeu o seu pedido.</p>
      <button onClick={() => setDone(false)} className={`px-6 py-3 ${theme.solid} text-white rounded-xl font-black text-sm active:scale-95 transition-all`}>Fazer outro pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <div className={`${theme.solid} px-6 pt-10 pb-8 text-center`}>
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 mx-auto mb-3 border-4 border-white/40">
          {barber.avatar_url ? <img src={barber.avatar_url} className="w-full h-full object-cover" alt={barber.name}/>
            : <div className="w-full h-full flex items-center justify-center"><User size={30} className="text-white"/></div>}
        </div>
        <h1 className="text-white font-black text-xl leading-tight">{barber.name}</h1>
        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Cardápio</p>
      </div>

      <div className="max-w-md mx-auto px-4">
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-4">
            {[{ id: 'all', name: 'Todos' }, ...categories].map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all ${activeCat === c.id ? `${theme.solid} text-white` : 'bg-white border border-slate-200 text-slate-500'}`}>{c.name}</button>
            ))}
          </div>
        )}

        {visible.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-16">Nenhum produto disponível.</p>
        ) : (
          <div className="space-y-3 mt-2">
            {visible.map(p => {
              const qty = cart[p.id] || 0;
              const ok = hasStock(p);
              return (
                <div key={p.id} className={`flex items-center gap-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-3 ${ok ? '' : 'opacity-50'}`}>
                  <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" alt={p.name}/>
                      : <div className="w-full h-full flex items-center justify-center text-slate-300"><Tag size={22}/></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm leading-tight">{p.name}</p>
                    <p className={`font-black text-sm mt-1 ${theme.text}`}>R$ {Number(p.price).toFixed(2)}</p>
                    {!ok && <p className="text-[10px] font-black text-red-500 uppercase mt-0.5">Esgotado</p>}
                  </div>
                  {ok && (qty === 0 ? (
                    <button onClick={() => add(p)} className={`w-10 h-10 rounded-full ${theme.solid} text-white text-xl font-black active:scale-90 transition-all`}>+</button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => remove(p)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black active:scale-90">−</button>
                      <span className="w-5 text-center font-black text-sm">{qty}</span>
                      <button onClick={() => add(p)} className={`w-8 h-8 rounded-full ${theme.solid} text-white font-black active:scale-90`}>+</button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {count > 0 && !showCheckout && (
        <div className="fixed bottom-0 inset-x-0 p-4 z-40">
          <button onClick={() => setShowCheckout(true)} className={`max-w-md mx-auto w-full ${theme.solid} text-white rounded-2xl py-4 px-5 flex items-center justify-between font-black text-sm shadow-xl active:scale-95 transition-all`}>
            <span>🛒 {count} {count > 1 ? 'itens' : 'item'}</span>
            <span>Ver pedido · R$ {total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-slate-900/70" onClick={() => setShowCheckout(false)}/>
          <div className="relative bg-white w-full max-w-md rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-black text-slate-900 text-lg mb-4">Seu pedido</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-slate-700">{i.qty}x {i.name}</span>
                  <span className="font-bold text-slate-900">R$ {(Number(i.price) * i.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="font-black text-slate-900">Total</span>
                <span className={`font-black ${theme.text}`}>R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Seu nome</label>
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Como podemos te chamar?"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-slate-400 mb-4"/>
            <button onClick={submit} disabled={sending || !clientName.trim()}
              className={`w-full py-4 ${theme.solid} text-white rounded-xl font-black text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2`}>
              {sending ? <Loader2 className="animate-spin" size={18}/> : 'Enviar pedido'}
            </button>
            <button onClick={() => setShowCheckout(false)} className="w-full text-slate-400 font-bold text-xs mt-3">Voltar ao cardápio</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ClientApp = ({ user, barbers, onLogout, onBookingSubmit, appointments, onUpdateStatus, MASTER_SERVICES: MS, isDark, onToggleDark }) => {
  const [view,setView]=useState('home'), [step,setStep]=useState(1), [bookingData,setBookingData]=useState({service:null,barber:null,price:null,date:null,time:null}), [userCoords,setUserCoords]=useState(null);
  const handleDeleteAccount=async()=>{
    if (!window.confirm("Deseja realmente excluir sua conta? Todos os seus dados serão apagados permanentemente.")) return;
    try { await supabase.from('appointments').delete().eq('client_id',user.id); await supabase.from('profiles').delete().eq('id',user.id); alert("Conta removida."); onLogout(); }
    catch(error) { alert("Erro ao excluir. Tente novamente."); }
  };
  useEffect(()=>{ if ("geolocation" in navigator) navigator.geolocation.getCurrentPosition(pos=>setUserCoords({lat:pos.coords.latitude,lng:pos.coords.longitude}),err=>console.error(err.message),{enableHighAccuracy:true}); },[]);
  const processedBarbers=useMemo(()=>(barbers||[]).filter(b=>b.is_visible).map(b=>{ const dist=calculateDistance(userCoords?.lat,userCoords?.lng,b.latitude,b.longitude); const label=dist!==null?(dist<1?`${Math.floor(dist*1000)} m`:`${dist.toFixed(1)} km`):null; return {...b,distance:dist,distanceLabel:label}; }).sort((a,b)=>{ if (a.distance===null) return 1; if (b.distance===null) return -1; return a.distance-b.distance; }),[barbers,userCoords]);
  const LOW_AVAILABILITY_THRESHOLD=3; // se sobrarem até 3 horários livres no dia, eles ficam amarelos (pouca vaga)
  const availableTimesToday=useMemo(()=>{
    if (!bookingData.date||!bookingData.barber) return [];
    const daySlots=bookingData.barber?.available_slots?.[bookingData.date]||[];
    const now=new Date();
    const [y,m,d]=bookingData.date.split('-').map(Number);
    const isToday=y===now.getFullYear()&&(m-1)===now.getMonth()&&d===now.getDate();
    return GLOBAL_TIME_SLOTS.filter(t=>{
      if (!daySlots.includes(t)) return false;
      if (isToday) {
        const [th,tm]=t.split(':').map(Number);
        if (th<now.getHours()||(th===now.getHours()&&tm<=now.getMinutes())) return false;
      }
      return true;
    });
  },[bookingData.date,bookingData.barber]);
  const handleFinish=async()=>{
    try {
      if (user?.isGuest) { alert("Para realizar um agendamento real, por favor crie sua conta!"); onLogout(); return; }
      if (!bookingData.date||!bookingData.time) { alert("Por favor, selecione o dia e o horário antes de confirmar."); return; }
      const payload={date:bookingData.date,time:bookingData.time,barber_id:bookingData.barber?.id,client_id:user?.id,client_name:user?.name||"Cliente",phone:user?.phone||"Sem telefone",service_name:bookingData.service?.name||"Serviço",price:Number(bookingData.price)||0,status:'pending'};
      if (!payload.barber_id) { alert("Erro: profissional não encontrado."); return; }
      const {error}=await supabase.from('appointments').insert([payload]);
      if (error) throw error;
      setView('success');
    } catch(error) { alert("Falha ao agendar: "+error.message); }
  };
  if (view==='success') return <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white"><Check size={60} className="text-green-500 mb-4"/><h2 className="text-2xl font-bold mb-8">Agendamento Realizado!</h2><Button onClick={()=>{ setView('home'); setStep(1); }}>Voltar ao Início</Button></div>;
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white p-4 flex justify-between items-center border-b shadow-sm sticky top-0 z-20">
        <h1 className="font-black italic">SALÃO<span className="text-blue-600">DIGITAL</span></h1>
        <div className="flex items-center gap-3">
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark}/>
          <button onClick={onLogout} className="text-red-500 font-bold text-xs flex items-center gap-1"><LogOut size={14}/> {user?.isGuest?'Entrar':'Sair'}</button>
        </div>
      </header>
      <main className="p-6 max-w-md mx-auto">
        {view==='home'&&(
          <div className="space-y-1">
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl mb-2">
              <h2 className="text-xl font-bold mb-4 italic">Olá, {user.name.split(' ')[0]}</h2>
              <div className="flex gap-2"><Button variant="secondary" onClick={()=>setView('booking')}>Novo Agendamento</Button><Button variant="outline" className="text-white border-white/20" onClick={()=>setView('history')}>Histórico</Button></div>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Galeria</h3>
              <div className="flex gap-2 overflow-x-auto pb-4">
                {[imgMp,imgMao].map((img,i)=><div key={i} className="w-[280px] h-[200px] bg-slate-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100"><img src={img} alt="Galeria" className="w-full h-full object-cover"/></div>)}
              </div>
            </div>
            <TopProfessionalsSection barbers={processedBarbers}/>
          </div>
        )}
        {view==='history'&&(
          <div className="space-y-4">
            <button onClick={()=>setView('home')} className="text-slate-400 font-bold text-sm mb-4 flex items-center gap-1"><ArrowLeft size={16}/> Voltar</button>
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-lg text-slate-900">Meus Agendamentos</h3>
              <button onClick={handleDeleteAccount} className="text-[9px] text-red-400 font-bold uppercase tracking-tighter border-b border-red-100 pb-0.5">Excluir Conta</button>
            </div>
            {(appointments||[]).filter(a=>String(a.client_id)===String(user.id)).length===0
              ? <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">Ainda não tem agendamentos.</div>
              : <div className="space-y-3">{(appointments||[]).filter(a=>String(a.client_id)===String(user.id)).sort((a,b)=>new Date(`${b.date}T${b.time}`)-new Date(`${a.date}T${a.time}`)).map(app=>{
                  const professional=(barbers||[]).find(b=>String(b.id)===String(app.barber_id));
                  return (
                    <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><User size={18}/></div>
                        <div><p className="font-bold text-slate-900 text-sm">{app.service_name}</p><p className="text-[10px] text-blue-600 font-bold">Profissional: {professional?.name||"Profissional"}</p><p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={10}/>{app.date?.split('-').reverse().join('/')} às {app.time}</p></div>
                      </div>
                      <button onClick={()=>{ if (window.confirm("Reagendar? O horário atual será cancelado.")) { const serviceObj=MS.find(s=>s.name===app.service_name); setBookingData({service:serviceObj,barber:professional,price:app.price}); if (typeof onUpdateStatus==='function') onUpdateStatus(app.id,'rejected'); setView('booking'); setStep(3); } }} className="flex flex-col items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><CalendarDays size={20}/><span className="text-[9px] font-bold uppercase">Reagendar</span></button>
                    </div>
                  );
                })}</div>}
          </div>
        )}
        {view==='booking'&&(
          <div className="space-y-4">
            <button onClick={()=>setStep(step-1)} className={`${step===1?'hidden':'block'} text-slate-400 font-bold text-sm mb-2`}>← Voltar</button>
            {step===1&&(
              <div className="flex flex-col h-full relative">
                <div className="flex-1 pb-24">
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Escolha o Serviço</h3>
                  <div className="space-y-3">{MS.map(s=>(
                    <Card key={s.id} selected={bookingData.service?.id===s.id} onClick={()=>setBookingData({...bookingData,service:s})}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3"><div className={`p-2 rounded-lg transition-colors ${bookingData.service?.id===s.id?'bg-blue-600 text-white':'bg-slate-100'}`}>{s.icon}</div><div><p className="font-bold text-slate-900">{s.name}</p><p className="text-xs text-slate-400 font-medium">{s.duration}</p></div></div>
                        {bookingData.service?.id===s.id&&<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"/>}
                      </div>
                    </Card>
                  ))}</div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
                  <div className="max-w-md mx-auto"><Button className={`w-full py-4 rounded-2xl font-bold text-sm ${!bookingData.service?'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none':'bg-blue-600 text-white active:scale-95'}`} onClick={()=>setStep(2)} disabled={!bookingData.service}>{bookingData.service?`Próximo: ${bookingData.service.name}`:'Selecione um serviço'}</Button></div>
                </div>
              </div>
            )}
            {step===2&&(
              <div className="flex flex-col h-full relative">
                <div className="flex-1 pb-24">
                  <h3 className="font-bold text-lg mb-2 text-slate-900">Escolha o Profissional</h3>
                  <div className="grid grid-cols-2 gap-3">{processedBarbers.filter(b=>b.my_services?.some(s=>s.id===bookingData.service?.id)).map(b=>{
                    const displayPrice=b.my_services?.find(s=>s.id===bookingData.service?.id)?.price||0, isSelected=bookingData.barber?.id===b.id, rating=getBarberRating(b);
                    return (
                      <div key={b.id} onClick={()=>setBookingData({...bookingData,barber:b,price:displayPrice})} className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected?'border-slate-900 bg-slate-50':'border-white bg-white shadow-sm'}`}>
                        <div className="mb-2"><StoryRing rating={rating} size={64}>{b.avatar_url?<img src={b.avatar_url} className="w-full h-full object-cover" alt="avatar"/>:<div className="w-full h-full flex items-center justify-center bg-slate-200"><User size={20} className="text-slate-400"/></div>}</StoryRing></div>
                        <p className="font-bold text-sm truncate w-full text-center text-slate-900 mt-1">{b.name}</p>
                        {b.bio&&<p className="text-[8px] text-blue-500 font-bold italic text-center truncate w-full">"{b.bio}"</p>}
                        <BadgeList barber={b} small/>
                        {b.distanceLabel&&<p className="text-[10px] text-blue-600 font-black flex items-center gap-1 mt-1"><MapPin size={10}/>{b.distanceLabel}</p>}
                        <p className="mt-2 text-green-600 font-black text-sm">R$ {displayPrice}</p>
                      </div>
                    );
                  })}</div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
                  <div className="max-w-md mx-auto"><Button className={`w-full py-4 rounded-2xl font-bold text-sm ${!bookingData.barber?'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none':'bg-blue-600 text-white active:scale-95'}`} onClick={()=>setStep(3)} disabled={!bookingData.barber}>Próximo</Button></div>
                </div>
              </div>
            )}
            {step===3&&(
              <div className="flex flex-col h-full relative">
                <div className="flex-1 pb-24">
                  <h3 className="font-bold text-lg mb-4">Data e Hora</h3>
                  <MonthCalendar availableSlots={bookingData.barber?.available_slots} selectedDate={bookingData.date} onSelectDate={dateStr=>setBookingData({...bookingData,date:dateStr,time:null})}/>
                  <div className="mt-6">
                    {bookingData.date?<>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Horários para {bookingData.date.split('-').reverse().join('/')}</label>
                      <div className="grid grid-cols-4 gap-2">
                        {GLOBAL_TIME_SLOTS.map(t=>{ 
                          let isPast = false;
                          if (bookingData.date) {
                            const [y, m, d] = bookingData.date.split('-').map(Number);
                            const now = new Date();
                            if (y === now.getFullYear() && (m - 1) === now.getMonth() && d === now.getDate()) {
                              const [th, tm] = t.split(':').map(Number);
                              if (th < now.getHours() || (th === now.getHours() && tm <= now.getMinutes())) {
                                isPast = true;
                              }
                            }
                          }
                          const isAvail = bookingData.barber?.available_slots?.[bookingData.date]?.includes(t) && !isPast;
                          const isLow = isAvail && availableTimesToday.length<=LOW_AVAILABILITY_THRESHOLD;
                          const slotColor = bookingData.time===t?'bg-slate-900 text-white shadow-lg scale-105':!isAvail?'bg-red-50 text-red-300 border border-red-100 cursor-not-allowed':isLow?'bg-amber-50 text-amber-700 border border-amber-200 hover:border-amber-400':'bg-green-50 text-green-700 border border-green-200 hover:border-green-400';
                          return <button key={t} disabled={!isAvail} onClick={()=>setBookingData({...bookingData,time:t})} className={`py-2 rounded-lg font-bold text-xs transition-all ${slotColor}`}>{t}</button>; 
                        })}
                      </div>
                    </>: <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center"><Calendar size={24} className="mx-auto text-slate-300 mb-2"/><p className="text-xs text-slate-400 font-bold">Selecione um dia acima primeiro</p></div>}
                  </div>
                  {bookingData.time&&bookingData.date&&<div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100"><p className="text-xs text-amber-600 font-bold uppercase mb-1">Resumo</p><div className="flex justify-between items-center"><span className="font-bold text-slate-900">{bookingData.service?.name}</span><span className="font-bold text-slate-900">R$ {bookingData.price}</span></div><p className="text-sm text-slate-500 mt-1">Com {bookingData.barber?.name} às {bookingData.time}</p></div>}
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
                  <div className="max-w-md mx-auto"><Button className={`w-full py-4 rounded-2xl font-bold text-sm ${!bookingData.time||!bookingData.date?'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none':'bg-blue-600 text-white active:scale-95'}`} onClick={handleFinish} disabled={!bookingData.time||!bookingData.date}>Confirmar Agendamento</Button></div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── BARBER DASHBOARD ─────────────────────────────────────────────────────────
// ─── CORES DO CARDÁPIO ────────────────────────────────────────────────────────
const MENU_THEMES = {
  blue:  { label: 'Azul',   solid: 'bg-blue-600',  text: 'text-blue-600',  soft: 'bg-blue-50',  border: 'border-blue-600' },
  green: { label: 'Verde',  solid: 'bg-green-600', text: 'text-green-600', soft: 'bg-green-50', border: 'border-green-600' },
  gray:  { label: 'Cinza',  solid: 'bg-slate-500', text: 'text-slate-600', soft: 'bg-slate-100', border: 'border-slate-500' },
  pink:  { label: 'Rosa',   solid: 'bg-pink-500',  text: 'text-pink-600',  soft: 'bg-pink-50',  border: 'border-pink-500' },
  black: { label: 'Preto',  solid: 'bg-slate-900', text: 'text-slate-900', soft: 'bg-slate-100', border: 'border-slate-900' },
};

// ─── LOJA / CARDÁPIO (PAINEL DO PROFISSIONAL) ─────────────────────────────────
const ShopBarSection = ({ effectiveUser, isGuestBarber, sb }) => {
  const [tab, setTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodPhotoFile, setProdPhotoFile] = useState(null);
  const [prodPhotoPreview, setProdPhotoPreview] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  const [period, setPeriod] = useState('today');
  const [salesOrders, setSalesOrders] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);

  const [color, setColor] = useState(effectiveUser?.menu_color || 'blue');
  const [copied, setCopied] = useState(false);

  const barberId = effectiveUser?.id;
  const menuUrl = effectiveUser?.slug ? `${window.location.origin}/cardapio/${effectiveUser.slug}` : '';
  const qrUrl = menuUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(menuUrl)}` : '';

  const beep = () => {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      const ctx = new C(); const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; g.gain.value = 0.15; o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 250);
    } catch (_) {}
  };

  const fetchShop = useCallback(async (silent) => {
    if (isGuestBarber || !barberId) return;
    if (!silent) setLoading(true);
    try {
      const [p, c, o] = await Promise.all([
        sb.from('products').select('*').eq('barber_id', barberId).order('created_at', { ascending: false }),
        sb.from('product_categories').select('*').eq('barber_id', barberId).order('created_at', { ascending: true }),
        sb.from('menu_orders').select('*, menu_order_items(*)').eq('barber_id', barberId).eq('status', 'novo').order('created_at', { ascending: false }),
      ]);
      if (p.data) setProducts(p.data);
      if (c.data) setCategories(c.data);
      if (o.data) setOrders(o.data);
    } catch (err) { console.error('Erro ao carregar loja:', err); }
    finally { if (!silent) setLoading(false); }
  }, [sb, barberId, isGuestBarber]);

  useEffect(() => { fetchShop(false); }, [fetchShop]);

  // Pedidos em tempo real (+ atualização a cada 20s como garantia)
  useEffect(() => {
    if (isGuestBarber || !barberId) return;
    const channel = sb.channel(`menu-rt-${barberId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'menu_orders', filter: `barber_id=eq.${barberId}` }, () => {
        fetchShop(true); beep(); setFlash(true); setTimeout(() => setFlash(false), 5000);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'menu_orders', filter: `barber_id=eq.${barberId}` }, () => fetchShop(true))
      .subscribe();
    const t = setInterval(() => fetchShop(true), 20000);
    return () => { sb.removeChannel(channel); clearInterval(t); };
  }, [sb, barberId, isGuestBarber, fetchShop]);

  // ── Vendas ──
  const fetchSales = useCallback(async () => {
    if (isGuestBarber || !barberId) return;
    setLoadingSales(true);
    try {
      const d = new Date();
      if (period === 'today') d.setHours(0, 0, 0, 0);
      else d.setDate(d.getDate() - (period === '7' ? 7 : 30));
      const { data } = await sb.from('menu_orders').select('*, menu_order_items(*)')
        .eq('barber_id', barberId).neq('status', 'cancelado').gte('created_at', d.toISOString())
        .order('created_at', { ascending: false });
      setSalesOrders(data || []);
    } catch (err) { console.error(err); }
    finally { setLoadingSales(false); }
  }, [sb, barberId, isGuestBarber, period]);

  useEffect(() => { if (tab === 'sales') fetchSales(); }, [tab, fetchSales]);

  const salesByProduct = (() => {
    const map = {};
    salesOrders.forEach(o => (o.menu_order_items || []).forEach(i => {
      const k = i.product_name || 'Produto';
      if (!map[k]) map[k] = { name: k, qty: 0, total: 0 };
      map[k].qty += Number(i.qty || 1);
      map[k].total += Number(i.price || 0) * Number(i.qty || 1);
    }));
    return Object.values(map).sort((a, b) => b.total - a.total);
  })();
  const salesTotal = salesOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const salesItems = salesByProduct.reduce((s, p) => s + p.qty, 0);

  // ── Pedidos ──
  const markDelivered = async (o) => {
    await sb.from('menu_orders').update({ status: 'entregue' }).eq('id', o.id);
    fetchShop(true);
  };
  const cancelOrder = async (o) => {
    if (!window.confirm(`Cancelar o pedido de ${o.client_name}? O estoque volta.`)) return;
    const { error } = await sb.rpc('cancel_menu_order', { p_order: String(o.id) });
    if (error) alert('Erro: ' + error.message);
    fetchShop(true);
  };

  // ── Categorias ──
  const addCategory = async () => {
    if (isGuestBarber) { alert('Crie sua conta para usar o cardápio.'); return; }
    if (!newCatName.trim()) return;
    const { data, error } = await sb.from('product_categories').insert({ barber_id: barberId, name: newCatName.trim() }).select().single();
    if (error) { alert('Erro: ' + error.message); return; }
    setCategories(prev => [...prev, data]); setNewCatName('');
  };
  const deleteCategory = async (c) => {
    if (!window.confirm(`Excluir a categoria "${c.name}"? Os produtos dela ficam sem categoria.`)) return;
    await sb.from('products').update({ category_id: null }).eq('category_id', c.id);
    await sb.from('product_categories').delete().eq('id', c.id);
    setCategories(prev => prev.filter(x => x.id !== c.id));
    setProducts(prev => prev.map(p => p.category_id === c.id ? { ...p, category_id: null } : p));
  };

  // ── Produtos ──
  const openNewProduct = () => {
    setEditingProduct(null); setProdName(''); setProdPrice(''); setProdCat(''); setProdStock('');
    setProdPhotoFile(null); setProdPhotoPreview(''); setShowProductModal(true);
  };
  const openEditProduct = (p) => {
    setEditingProduct(p); setProdName(p.name); setProdPrice(String(p.price)); setProdCat(p.category_id || '');
    setProdStock(p.stock === null || p.stock === undefined ? '' : String(p.stock));
    setProdPhotoFile(null); setProdPhotoPreview(p.photo_url || ''); setShowProductModal(true);
  };
  const handleProductPhotoChange = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setProdPhotoFile(file); setProdPhotoPreview(URL.createObjectURL(file));
  };

  const saveProduct = async () => {
    if (isGuestBarber) { alert('Cadastre produtos após criar sua conta.'); return; }
    const price = parseFloat(String(prodPrice).replace(',', '.'));
    if (!prodName.trim() || isNaN(price)) { alert('Preencha nome e valor do produto.'); return; }
    setSavingProduct(true);
    try {
      let photo_url = editingProduct?.photo_url || '';
      if (prodPhotoFile) {
        const buf = await prodPhotoFile.arrayBuffer();
        const ext = (prodPhotoFile.name.split('.').pop() || 'jpg').toLowerCase();
        const fileName = `product-${barberId}-${Date.now()}.${ext}`;
        const { error: upErr } = await sb.storage.from('barber-photos').upload(fileName, buf, { contentType: prodPhotoFile.type || 'image/jpeg' });
        if (upErr) throw upErr;
        photo_url = sb.storage.from('barber-photos').getPublicUrl(fileName).data.publicUrl;
      }
      const stock = prodStock.trim() === '' ? null : Math.max(0, parseInt(prodStock, 10) || 0);
      const payload = { name: prodName.trim(), price, photo_url, category_id: prodCat || null, stock };
      if (editingProduct) {
        const { data, error } = await sb.from('products').update(payload).eq('id', editingProduct.id).select().single();
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === data.id ? data : p));
      } else {
        const { data, error } = await sb.from('products').insert({ ...payload, barber_id: barberId }).select().single();
        if (error) throw error;
        setProducts(prev => [data, ...prev]);
      }
      setShowProductModal(false);
    } catch (err) { console.error(err); alert('Erro ao salvar produto: ' + (err?.message || '')); }
    finally { setSavingProduct(false); }
  };

  const deleteProductItem = async (p) => {
    if (!window.confirm(`Remover "${p.name}" do cardápio?`)) return;
    const { error } = await sb.from('products').delete().eq('id', p.id);
    if (error) { alert('Erro ao remover: ' + error.message); return; }
    setProducts(prev => prev.filter(x => x.id !== p.id));
  };

  const adjustStock = async (p, delta) => {
    if (p.stock === null || p.stock === undefined) return;
    const next = Math.max(0, p.stock + delta);
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, stock: next } : x));
    await sb.from('products').update({ stock: next }).eq('id', p.id);
  };

  // ── Cardápio: cor e link ──
  const changeColor = async (key) => {
    setColor(key);
    if (isGuestBarber) return;
    const { error } = await sb.from('profiles').update({ menu_color: key }).eq('id', barberId);
    if (error) alert('Erro ao salvar a cor: ' + error.message);
  };
  const copyLink = () => {
    navigator.clipboard.writeText(menuUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const catName = (id) => categories.find(c => c.id === id)?.name;
  const timeOf = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const TABS = [
    { id: 'orders', label: 'Pedidos' },
    { id: 'products', label: 'Produtos' },
    { id: 'sales', label: 'Vendas' },
    { id: 'menu', label: 'Cardápio' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
          <Tag size={20} className="text-amber-500"/> Loja
        </h2>
        <p className="text-xs text-slate-400">Cardápio digital com QR Code, estoque e vendas</p>
      </div>

      {isGuestBarber && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-bold">
          ⚠️ Crie sua conta para ter seu cardápio e receber pedidos.
        </div>
      )}

      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`relative py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
            {t.label}
            {t.id === 'orders' && orders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">{orders.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ══ PEDIDOS ══ */}
      {tab === 'orders' && (
        <section className="space-y-3">
          {flash && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-black text-center animate-pulse">
              🔔 Novo pedido recebido!
            </div>
          )}
          {loading ? <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={22}/></div>
          : orders.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-slate-400 text-sm">Nenhum pedido novo.</p>
              <p className="text-[10px] text-slate-300 mt-1">Os pedidos aparecem aqui na hora.</p>
            </div>
          ) : orders.map(o => (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-100 border-l-4 border-l-amber-500 shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-black text-slate-900">{o.client_name}</p>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Clock size={10}/> {timeOf(o.created_at)}</p>
                </div>
                <p className="font-black text-green-600">R$ {Number(o.total).toFixed(2)}</p>
              </div>
              <div className="space-y-0.5 mb-3">
                {(o.menu_order_items || []).map(i => (
                  <div key={i.id} className="flex justify-between text-[11px] text-slate-600">
                    <span>{i.qty}x {i.product_name}</span>
                    <span className="font-bold">R$ {(Number(i.price) * Number(i.qty)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => markDelivered(o)} className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                  <CheckCircle size={14}/> Entregue
                </button>
                <button onClick={() => cancelOrder(o)} className="p-2.5 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                  <XCircle size={18}/>
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ══ PRODUTOS ══ */}
      {tab === 'products' && (
        <div className="space-y-5">
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-black text-slate-900 text-sm mb-3">Categorias</h3>
            <div className="flex gap-2 mb-3">
              <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Ex: Bebidas, Petiscos..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-400"/>
              <button onClick={addCategory} disabled={!newCatName.trim()}
                className="px-4 bg-slate-900 text-white rounded-xl text-xs font-black uppercase disabled:opacity-40 active:scale-95 transition-all">Adicionar</button>
            </div>
            {categories.length === 0 ? <p className="text-[11px] text-slate-400">Nenhuma categoria ainda.</p> : (
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <span key={c.id} className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold pl-3 pr-1.5 py-1.5 rounded-full">
                    {c.name}
                    <button onClick={() => deleteCategory(c)} className="w-5 h-5 rounded-full bg-white text-slate-400 hover:text-red-500 flex items-center justify-center"><X size={11}/></button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-sm">Produtos ({products.length})</h3>
              <button onClick={openNewProduct} className="flex items-center gap-1 text-[10px] font-black text-white bg-slate-900 px-3 py-2 rounded-xl active:scale-95 transition-all">
                <PlusCircle size={12}/> Novo
              </button>
            </div>
            {loading ? <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={22}/></div>
            : products.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl"><p className="text-slate-400 text-sm">Nenhum produto cadastrado ainda.</p></div>
            ) : (
              <div className="space-y-2">
                {products.map(p => {
                  const tracked = p.stock !== null && p.stock !== undefined;
                  return (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0">
                          {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" alt={p.name}/>
                            : <div className="w-full h-full flex items-center justify-center text-slate-400"><Tag size={16}/></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate">{p.name}</p>
                          <p className="text-[11px] text-blue-600 font-bold">R$ {Number(p.price).toFixed(2)}
                            {catName(p.category_id) && <span className="text-slate-400 font-bold"> · {catName(p.category_id)}</span>}
                          </p>
                        </div>
                        <button onClick={() => openEditProduct(p)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500"><Edit3 size={14}/></button>
                        <button onClick={() => deleteProductItem(p)} className="p-2 bg-white border border-slate-200 rounded-lg text-red-500"><Trash2 size={14}/></button>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase text-slate-400">Estoque</span>
                        {tracked ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => adjustStock(p, -1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-slate-600 active:scale-90">−</button>
                            <span className={`min-w-[28px] text-center text-sm font-black ${p.stock === 0 ? 'text-red-500' : 'text-slate-900'}`}>{p.stock}</span>
                            <button onClick={() => adjustStock(p, 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-slate-600 active:scale-90">+</button>
                          </div>
                        ) : <span className="text-[10px] text-slate-400 font-bold">Sem controle</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ══ VENDAS ══ */}
      {tab === 'sales' && (
        <section className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[{ id: 'today', l: 'Hoje' }, { id: '7', l: '7 dias' }, { id: '30', l: '1 mês' }].map(p => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                className={`py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${period === p.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>{p.l}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900 text-white rounded-2xl p-3"><p className="text-[9px] text-slate-400 font-bold uppercase">Vendido</p><p className="text-base font-black">R$ {salesTotal.toFixed(2)}</p></div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3"><p className="text-[9px] text-slate-400 font-bold uppercase">Pedidos</p><p className="text-base font-black text-slate-900">{salesOrders.length}</p></div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3"><p className="text-[9px] text-slate-400 font-bold uppercase">Itens</p><p className="text-base font-black text-slate-900">{salesItems}</p></div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-black text-slate-900 text-sm mb-3">Produtos vendidos</h3>
            {loadingSales ? <div className="py-6 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={22}/></div>
            : salesByProduct.length === 0 ? <p className="text-center text-slate-400 text-sm py-6">Nenhuma venda nesse período.</p>
            : (
              <div className="space-y-2">
                {salesByProduct.map(p => (
                  <div key={p.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="min-w-0"><p className="font-bold text-sm text-slate-900 truncate">{p.name}</p><p className="text-[10px] text-slate-400">{p.qty} vendido(s)</p></div>
                    <p className="font-black text-green-600 text-sm">R$ {p.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[9px] text-slate-400 mt-3">Pedidos cancelados não entram na conta.</p>
          </div>
        </section>
      )}

      {/* ══ CARDÁPIO (link, QR, cor) ══ */}
      {tab === 'menu' && (
        <section className="space-y-5">
          <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-sm p-5 text-center">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Seu cardápio</p>
            {menuUrl ? (
              <>
                <img src={qrUrl} alt="QR Code do cardápio" className="w-48 h-48 mx-auto rounded-2xl border border-slate-100 mb-3"/>
                <p className="text-[10px] text-slate-400 mb-3">Este QR Code e este link são fixos: nunca mudam. Pode imprimir e colar no balcão.</p>
                <div className="bg-slate-50 rounded-xl px-3 py-2 mb-3"><p className="text-[11px] font-bold text-slate-600 break-all">{menuUrl}</p></div>
                <div className="flex gap-2">
                  <button onClick={copyLink} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'}`}>
                    {copied ? <CheckCircle size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : 'Copiar link'}
                  </button>
                  <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase text-center active:scale-95 transition-all">Abrir</a>
                </div>
                <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-blue-600 font-bold mt-3 underline">Abrir QR Code em tela cheia (para imprimir)</a>
              </>
            ) : <p className="text-sm text-slate-400 py-6">Seu perfil ainda não tem um endereço (slug). Saia e entre de novo; se continuar, me avise.</p>}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-black text-slate-900 text-sm mb-3">Cor do cardápio</h3>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(MENU_THEMES).map(([key, t]) => (
                <button key={key} onClick={() => changeColor(key)} className="flex flex-col items-center gap-1.5 active:scale-95 transition-all">
                  <div className={`w-11 h-11 rounded-full ${t.solid} flex items-center justify-center ${color === key ? 'ring-4 ring-offset-2 ring-slate-300' : ''}`}>
                    {color === key && <CheckCircle size={18} className="text-white"/>}
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Modal Produto ── */}
      {showProductModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowProductModal(false)}/>
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-slate-900 text-lg mb-4">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
            <label className="block mb-4">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden cursor-pointer">
                {prodPhotoPreview ? <img src={prodPhotoPreview} className="w-full h-full object-cover" alt="Prévia"/> : <Camera size={22} className="text-slate-400"/>}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleProductPhotoChange}/>
              <p className="text-center text-[10px] text-slate-400 font-bold mt-2">Toque para escolher a foto</p>
            </label>
            <input value={prodName} onChange={e => setProdName(e.target.value)} placeholder="Nome do produto"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-400 mb-3"/>
            <input value={prodPrice} onChange={e => setProdPrice(e.target.value.replace(/[^0-9.,]/g, ''))} placeholder="Valor (R$)" inputMode="decimal"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-400 mb-3"/>
            <select value={prodCat} onChange={e => setProdCat(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-400 mb-3">
              <option value="">Sem categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input value={prodStock} onChange={e => setProdStock(e.target.value.replace(/\D/g, ''))} placeholder="Estoque (vazio = sem controle)" inputMode="numeric"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-400 mb-5"/>
            <div className="flex gap-2">
              <button onClick={() => setShowProductModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase">Cancelar</button>
              <button onClick={saveProduct} disabled={savingProduct} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase disabled:opacity-50">
                {savingProduct ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BarberDashboard = ({ user, appointments, onUpdateStatus, onLogout, onUpdateProfile, supabase: sb, isGuestBarber, isDark, onToggleDark }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isPaying, setIsPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const today = new Date();
  const [selectedDateConfig, setSelectedDateConfig] = useState(today.toISOString().split('T')[0]);
  const [configCalYear, setConfigCalYear] = useState(today.getFullYear());
  const [configCalMonth, setConfigCalMonth] = useState(today.getMonth());
  const [showAllPending, setShowAllPending] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualSlotTarget, setManualSlotTarget] = useState(null);
  const [manualName, setManualName] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcPrice, setNewSvcPrice] = useState('');
  const [newSvcDuration, setNewSvcDuration] = useState('45min');
  const [showAddCustomSvc, setShowAddCustomSvc] = useState(false);
  const [showClientHistory, setShowClientHistory] = useState(false);
  const [focusComandaId, setFocusComandaId] = useState(null);

  const [dayModalDate, setDayModalDate] = useState(null);
const pressTimer = useRef(null);
const longPressFired = useRef(false);


  // Estado de confirmação de exclusão escondida
  const [deleteClickCount, setDeleteClickCount] = useState(0);
  const [showHiddenDelete, setShowHiddenDelete] = useState(false);
  

  const [guestBarberState, setGuestBarberState] = useState({
    ...user, name: 'Profissional Demo', plano_ativo: false, is_visible: false,
    my_services: [], available_slots: {}, manual_appointments: [], appointment_duration: '30min',
    address: '', avatar_url: '', work_photos: [], custom_services: [], bio: '',
  });

  const effectiveUser = isGuestBarber ? guestBarberState : user;
  const effectiveOnUpdateProfile = isGuestBarber ? setGuestBarberState : onUpdateProfile;

  const [tempBio, setTempBio] = useState(effectiveUser?.bio || '');
  const [tempAddress, setTempAddress] = useState(effectiveUser?.address || '');

  
  const appointmentDuration = effectiveUser.appointment_duration || '30min';
  const filteredTimeSlots = appointmentDuration === '1h' ? GLOBAL_TIME_SLOTS.filter(s => s.endsWith(':00')) : GLOBAL_TIME_SLOTS;
  const isContApp = (a) => typeof a.service_name === 'string' && a.service_name.endsWith(' (continuação)');
  const _tm = (t) => { const [h, m] = String(t || '00:00').split(':').map(Number); return h * 60 + m; };
  const _step = GLOBAL_TIME_SLOTS.length > 1 ? (_tm(GLOBAL_TIME_SLOTS[1]) - _tm(GLOBAL_TIME_SLOTS[0])) || 30 : 30;

  // Devolve o atendimento principal + as linhas de continuação dele (mesmo cliente, mesma data, horários seguidos)
  const getBlocks = (main, pool) => {
    const blocks = [main];
    if (!main.time) return blocks;
    const conts = pool.filter(isContApp);
    const used = new Set();
    let last = main;
    while (true) {
      const next = conts.find(c => !used.has(c.id) && c.time && c.date === main.date && c.client_name === main.client_name && _tm(c.time) - _tm(last.time) === _step);
      if (!next) break;
      used.add(next.id);
      blocks.push(next);
      last = next;
    }
    return blocks;
  };

  const myAppointments = (appointments || []).filter(a => String(a.barber_id || a.barberId) === String(effectiveUser.id) && a.status !== 'rejected');
  const pendingAll = myAppointments.filter(a => a.status === 'pending').sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const pending = pendingAll.filter(a => !isContApp(a));
  const confirmedAll = myAppointments.filter(a => a.status === 'confirmed');
  const confirmed = confirmedAll.filter(a => !isContApp(a));
  const manualAppointments = effectiveUser.manual_appointments || [];
  const allAppointments = [...confirmed, ...manualAppointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const allAppointmentsFull = [...confirmedAll, ...manualAppointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const revenue = confirmed.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const dedupedPending = pending.filter((app, index, self) => index === self.findIndex(t => t.id === app.id));
  const pendingToShow = showAllPending ? dedupedPending : dedupedPending.slice(0, 3);
  const totalAppointmentsForGoal = confirmed.length + manualAppointments.length;

  const uniqueClients = useMemo(() => {
    const map = {};
    [...confirmed, ...manualAppointments].forEach(a => {
      const phone = (a.phone || '').replace(/\D/g, '');
      const name = a.client_name || a.client || '';
      const key = phone || name;
      if (!key) return;
      if (!map[key]) map[key] = { name, phone, count: 0, lastDate: '', services: [] };
      map[key].count++;
      if (!map[key].lastDate || a.date > map[key].lastDate) map[key].lastDate = a.date;
      const svcName = a.service_name || a.service || '';
      if (svcName && !map[key].services.includes(svcName)) map[key].services.push(svcName);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [confirmed, manualAppointments]);

  const daysInConfigMonth = getDaysInMonth(configCalYear, configCalMonth);
  const isPrevConfigDisabled = configCalYear === today.getFullYear() && configCalMonth === today.getMonth();
  const goConfigPrev = () => { if (!isPrevConfigDisabled) { const d = new Date(configCalYear, configCalMonth - 1, 1); setConfigCalYear(d.getFullYear()); setConfigCalMonth(d.getMonth()); } };
  const goConfigNext = () => { const d = new Date(configCalYear, configCalMonth + 1, 1); setConfigCalYear(d.getFullYear()); setConfigCalMonth(d.getMonth()); };
  const slotsForSelectedDay = effectiveUser.available_slots?.[selectedDateConfig] || [];

  const setSlotAvailability = async (date, slot, makeAvailable) => {
    const currentSlots = effectiveUser.available_slots || {};
    const slotsForDay = currentSlots[date] || [];
    let newSlots;
    if (makeAvailable) { if (!slotsForDay.includes(slot)) newSlots = [...slotsForDay, slot].sort(); else return; }
    else { if (slotsForDay.includes(slot)) newSlots = slotsForDay.filter(s => s !== slot); else return; }
    const updatedAvailableSlots = { ...currentSlots, [date]: newSlots };
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedAvailableSlots });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ available_slots: updatedAvailableSlots }).eq('id', effectiveUser.id);
      if (error) console.error("Erro ao salvar horários:", error.message);
    }
  };


    // Abre/fecha VÁRIOS horários do mesmo dia de uma vez (evita uma chamada sobrescrever a outra)
  const setSlotsAvailability = async (date, times, makeAvailable) => {
    const currentSlots = effectiveUser.available_slots || {};
    let day = [...(currentSlots[date] || [])];
    times.forEach(t => {
      if (makeAvailable) { if (!day.includes(t)) day.push(t); }
      else day = day.filter(s => s !== t);
    });
    day.sort();
    const updated = { ...currentSlots, [date]: day };
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updated });
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ available_slots: updated }).eq('id', effectiveUser.id);
      if (error) console.error('Erro ao salvar horários:', error.message);
    }
  };

  const toggleSlotForDate = async (date, slot) => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const slotsForDay = [...(currentSlots[date] || [])];
    const isAvailable = slotsForDay.includes(slot);
 
    // Um toque: abre se estiver fechado, fecha se estiver aberto
    const updatedDaySlots = isAvailable
      ? slotsForDay.filter(s => s !== slot)
      : [...slotsForDay, slot].sort();
 
    const updatedSlots = { ...currentSlots, [date]: updatedDaySlots };
    const filteredManual = (effectiveUser.manual_appointments || [])
      .filter(a => !(a.date === date && a.time === slot));
 
    effectiveOnUpdateProfile({
      ...effectiveUser,
      available_slots: updatedSlots,
      manual_appointments: filteredManual,
    });
 
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles')
        .update({ available_slots: updatedSlots, manual_appointments: filteredManual })
        .eq('id', effectiveUser.id);
      if (error) console.error('Erro ao salvar horário:', error.message);
    }
  };

  const getDayAppointments = (date) =>
    allAppointments
      .filter(a => a.date === date)
      .filter((a, i, self) => i === self.findIndex(t => t.id === a.id))
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
 
  // Horários já ocupados naquela data
  const getBookedTimes = (date) => getDayAppointments(date).map(a => a.time);
 
  // Vagas realmente livres do dia (abertas e sem cliente)
  const freeSlotsCount = (date) => {
    const abertos = effectiveUser.available_slots?.[date] || [];
    const ocupados = getBookedTimes(date);
    return abertos.filter(s => !ocupados.includes(s)).length;
  };
 
  const bookedForSelected = getBookedTimes(selectedDateConfig);
  const freeForSelected = slotsForSelectedDay.filter(s => !bookedForSelected.includes(s));
 
  // Long press no dia do calendário
  const startDayPress = (fullDate) => {
    longPressFired.current = false;
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      setDayModalDate(fullDate);
      if (navigator.vibrate) navigator.vibrate(30);
    }, 450);
  };
  const endDayPress = () => clearTimeout(pressTimer.current);
  const handleDayClick = (fullDate) => {
    if (longPressFired.current) { longPressFired.current = false; return; }
    setSelectedDateConfig(fullDate);
  };
 
  const cancelAppointmentQuick = async (app) => {
    if (isGuestBarber) {
      const filtered = (effectiveUser.manual_appointments || []).filter(m => m.id !== app.id);
      effectiveOnUpdateProfile({ ...effectiveUser, manual_appointments: filtered });
      return;
    }

    const blocks = app.isManual ? [app] : getBlocks(app, allAppointmentsFull);
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const slotsForDay = [...(currentSlots[app.date] || [])];
    blocks.forEach(b => { if (b.time && !slotsForDay.includes(b.time)) slotsForDay.push(b.time); });
    slotsForDay.sort();
    const updatedSlots = { ...currentSlots, [app.date]: slotsForDay };

    if (app.isManual) {
      const filteredManual = (effectiveUser.manual_appointments || []).filter(m => m.id !== app.id);
      effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedSlots, manual_appointments: filteredManual });
      const { error } = await sb.from('profiles')
        .update({ available_slots: updatedSlots, manual_appointments: filteredManual })
        .eq('id', effectiveUser.id);
      if (error) console.error('Erro ao cancelar reserva manual:', error.message);
    } else {
      effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedSlots });
      const { error } = await sb.from('profiles')
        .update({ available_slots: updatedSlots })
        .eq('id', effectiveUser.id);
      if (error) console.error('Erro ao liberar horário:', error.message);
      for (const b of blocks) await onUpdateStatus(b.id, 'rejected');
    }
  };



  const handleManualBookingConfirm = async (saveWithClient) => {
    if (!manualSlotTarget) return;
    const { date, slot } = manualSlotTarget;
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const slotsForDay = [...(currentSlots[date] || [])];
    const updatedDaySlots = slotsForDay.filter(s => s !== slot);
    if (saveWithClient && manualName.trim() !== '') {
      const newManualApp = { id: `manual-${Date.now()}`, client: manualName.trim(), date, time: slot, price: Number(manualValue) || 0, status: 'confirmed', isManual: true };
      const updatedManualApps = [...(effectiveUser.manual_appointments || []), newManualApp];
      effectiveOnUpdateProfile({ ...effectiveUser, available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: updatedManualApps });
      
      if (!isGuestBarber) {
        const { error } = await sb.from('profiles').update({ available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: updatedManualApps }).eq('id', effectiveUser.id);
        if (error) console.error("Erro no agendamento manual:", error.message);
      }
    } else {
      const finalSlots = { ...currentSlots, [date]: updatedDaySlots };
      effectiveOnUpdateProfile({ ...effectiveUser, available_slots: finalSlots });
      
      if (!isGuestBarber) {
        const { error } = await sb.from('profiles').update({ available_slots: finalSlots }).eq('id', effectiveUser.id);
        if (error) console.error("Erro ao fechar horário:", error.message);
      }
    }
    setShowManualModal(false); setManualSlotTarget(null); setManualName(''); setManualValue('');
  };

  const selectAllSlotsForDay = async (date) => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const updatedSlots = { ...currentSlots, [date]: [...filteredTimeSlots] };
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedSlots });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ available_slots: updatedSlots }).eq('id', effectiveUser.id);
      if (error) console.error(error.message);
    }
  };

  const deselectAllSlotsForDay = async (date) => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const updatedSlots = { ...currentSlots, [date]: [] };
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedSlots });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ available_slots: updatedSlots }).eq('id', effectiveUser.id);
      if (error) console.error(error.message);
    }
  };

  const markAllDaysInMonth = async () => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    for (let i = 1; i <= daysInConfigMonth; i++) { const date = formatDate(configCalYear, configCalMonth, i); currentSlots[date] = [...filteredTimeSlots]; }
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: { ...currentSlots } });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ available_slots: { ...currentSlots } }).eq('id', effectiveUser.id);
      if (error) console.error(error.message);
    }
  };

  const unmarkAllDaysInMonth = async () => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    for (let i = 1; i <= daysInConfigMonth; i++) { const date = formatDate(configCalYear, configCalMonth, i); currentSlots[date] = []; }
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: { ...currentSlots } });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ available_slots: { ...currentSlots } }).eq('id', effectiveUser.id);
      if (error) console.error(error.message);
    }
  };

  const addCustomService = async () => {
    if (!newSvcName.trim() || !newSvcPrice) return;
    const newSvc = { id: `custom-${Date.now()}`, name: newSvcName.trim(), price: Number(newSvcPrice), duration: newSvcDuration, isCustom: true };
    const updatedCustom = [...(effectiveUser.custom_services || []), newSvc];
    effectiveOnUpdateProfile({ ...effectiveUser, custom_services: updatedCustom });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ custom_services: updatedCustom }).eq('id', effectiveUser.id);
      if (error) console.error(error.message);
    }
    setNewSvcName(''); setNewSvcPrice(''); setNewSvcDuration('45min'); setShowAddCustomSvc(false);
  };

  const removeCustomService = async (id) => {
    const updatedCustom = (effectiveUser.custom_services || []).filter(cs => cs.id !== id);
    effectiveOnUpdateProfile({ ...effectiveUser, custom_services: updatedCustom });
    
    if (!isGuestBarber) {
      const { error } = await sb.from('profiles').update({ custom_services: updatedCustom }).eq('id', effectiveUser.id);
      if (error) console.error(error.message);
    }
  };

  const handlePayment = async () => {
    if (isGuestBarber) { alert("Para ativar o plano, faça login como profissional!"); return; }
    setIsPaying(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://salaodigital.onrender.com';
      const response = await fetch(`${API_BASE_URL}/criar-pagamento`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ barberId: effectiveUser.id, price: 29.90, title: "Plano Profissional - Ilimitado" }) });
      const data = await response.json();
      if (data.init_point) window.location.href = data.init_point;
      else alert("Erro ao gerar link.");
    } catch (_) { alert("Erro ao conectar ao pagamento."); }
    finally { setIsPaying(false); }
  };

  const toggleService = (serviceId, defaultPrice) => {
    const currentServices = effectiveUser.my_services || [];
    const exists = currentServices.find(s => s.id === serviceId);
    if (!exists && !effectiveUser.plano_ativo && currentServices.length >= 3) { setShowPayModal(true); return; }
    const newServices = exists ? currentServices.filter(s => s.id !== serviceId) : [...currentServices, { id: serviceId, price: defaultPrice }];
    effectiveOnUpdateProfile({ ...effectiveUser, my_services: newServices });
  };

  const updateServicePrice = (serviceId, newPrice) => {
    const newServices = (effectiveUser.my_services || []).map(s => s.id === serviceId ? { ...s, price: Number(newPrice) } : s);
    effectiveOnUpdateProfile({ ...effectiveUser, my_services: newServices });
  };

const handleUploadAvatar = async (event) => {
  if (isGuestBarber) { alert("Para alterar foto, faça login como profissional!"); return; }
  const file = event.target.files[0];
  if (!file) return;
  try {
    // Lê o arquivo pra memória JÁ, antes que o Android invalide a URI content://
    const arrayBuffer = await file.arrayBuffer();
    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const fileName = `avatar-${effectiveUser.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await sb.storage
      .from('barber-photos')
      .upload(fileName, arrayBuffer, { contentType: file.type || 'image/jpeg', upsert: false });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = sb.storage.from('barber-photos').getPublicUrl(fileName);
    const updated = { ...effectiveUser, avatar_url: publicUrl };
    effectiveOnUpdateProfile(updated);
    if (!isGuestBarber) await sb.from('profiles').update({ avatar_url: publicUrl }).eq('id', effectiveUser.id);
    alert('Foto atualizada!');
  } catch (err) {
    console.error('[handleUploadAvatar]', err);
    alert('Erro ao carregar foto: ' + (err?.message || 'tente novamente.'));
  } finally {
    event.target.value = '';
  }
};

const handleUploadWorkPhoto = async (event) => {
  if (isGuestBarber) { alert("Para adicionar fotos, faça login!"); return; }
  const file = event.target.files[0];
  if (!file) return;
  const currentPhotos = effectiveUser.work_photos || [];
  if (currentPhotos.length >= 10) { alert("Máximo 10 fotos."); return; }
  setUploadingPhoto(true);
  try {
    // Mesma correção: ler pra memória antes de subir
    const arrayBuffer = await file.arrayBuffer();
    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const fileName = `work-${effectiveUser.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await sb.storage
      .from('barber-photos')
      .upload(fileName, arrayBuffer, { contentType: file.type || 'image/jpeg', upsert: false });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = sb.storage.from('barber-photos').getPublicUrl(fileName);
    const newPhotos = [...currentPhotos, publicUrl];
    effectiveOnUpdateProfile({ ...effectiveUser, work_photos: newPhotos });
    await sb.from('profiles').update({ work_photos: newPhotos }).eq('id', effectiveUser.id);
  } catch (error) {
    console.error('[handleUploadWorkPhoto]', error);
    alert('Erro: ' + (error?.message || 'tente novamente.'));
  } finally {
    setUploadingPhoto(false);
    event.target.value = '';
  }
};
  const handleDeleteAccount = async () => {
    if (isGuestBarber) return;
    if (!window.confirm("⚠️ Tem certeza? Todos os dados, agendamentos e fotos serão APAGADOS permanentemente. Esta ação não pode ser desfeita.")) return;
    if (!window.confirm("Confirme novamente: deseja excluir sua conta profissional?")) return;
    try {
      await sb.from('appointments').delete().eq('barber_id', effectiveUser.id);
      await sb.from('profiles').delete().eq('id', effectiveUser.id);
      localStorage.removeItem('salao_user_data');
      alert("Conta excluída.");
      onLogout();
    } catch (e) { alert("Erro ao excluir: " + e.message); }
  };

  // ✅ SALVA A BIO COM TRATAMENTO DE ERROS CORRETO
  const saveBio = async () => {
    if (isGuestBarber) return;
    
    const bioFormatada = (tempBio || '').slice(0, 15);
    effectiveOnUpdateProfile({ ...effectiveUser, bio: bioFormatada });
    
    const { error } = await sb
      .from('profiles')
      .update({ bio: bioFormatada })
      .eq('id', effectiveUser.id);

    if (error) {
      console.error("Erro ao salvar bio:", error.message);
      alert('Erro ao salvar no banco de dados.');
    } else {
      alert('Biografia salva com sucesso!');
    }
  };
// ✅ SALVA O ENDEREÇO QUANDO APERTA OK
  const saveAddress = async () => {
    if (isGuestBarber) return;
    
    // Atualiza a tela
    effectiveOnUpdateProfile({ ...effectiveUser, address: tempAddress });
    
    // Salva no banco de dados
    const { error } = await sb
      .from('profiles')
      .update({ address: tempAddress })
      .eq('id', effectiveUser.id);

    if (error) {
      console.error("Erro ao salvar endereço:", error.message);
      alert('Erro ao salvar o endereço no banco de dados.');
    } else {
      alert('Endereço salvo com sucesso!');
    }
  };
// ✅ SINCRONIZA SE O PERFIL MUDAR DE CONTA
  useEffect(() => {
    setTempBio(effectiveUser?.bio || '');
    setTempAddress(effectiveUser?.address || ''); // Adicione esta linha
  }, [effectiveUser?.bio, effectiveUser?.address]); // Adicione o address aqui na lista
  
  useEffect(() => {
  // Suponha que você tenha um estado 'user' que guarda os dados do barbeiro logado
  if (user && user.id) {
    setupPushNotifications(user.id);
  }
}, [user]);

  // Lógica do botão escondido de excluir
  const handleHiddenVersionClick = () => {
    const next = deleteClickCount + 1;
    setDeleteClickCount(next);
    if (next >= 5) {
      setShowHiddenDelete(true);
      setDeleteClickCount(0);
    }
  };

  const rating = getBarberRating(effectiveUser);
  const tabs = ['home', 'reports', 'shop', 'config'];
  const tabLabels = { home: 'Agenda', reports: 'Relatórios', shop: 'Loja', config: 'Ajustes' };
  const tabIcons = { home: Calendar, reports: BarChart2, shop: Tag, config: Settings };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {isGuestBarber && (
        <div className="bg-amber-500 text-white px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0"><Eye size={14} className="flex-shrink-0" /><p className="text-[11px] font-black uppercase tracking-tight truncate">Modo Demo — Nada será salvo</p></div>
          <button onClick={onLogout} className="flex-shrink-0 bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg active:scale-95 whitespace-nowrap">Fazer Login</button>
        </div>
      )}

      {/* Modal reserva manual */}
      {showManualModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowManualModal(false)} />
          <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <h3 className="font-black text-slate-900 text-lg mb-1">Reservar Horário</h3>
            <p className="text-xs text-slate-400 mb-5">{manualSlotTarget?.slot} • {manualSlotTarget?.date?.split('-').reverse().join('/')}</p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nome do Cliente</label>
                <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Ex: Maria Silva"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Valor (R$) — opcional</label>
                <input type="number" value={manualValue} onChange={e => setManualValue(e.target.value)} placeholder="0,00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleManualBookingConfirm(true)}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-95 transition-all">
                {manualName.trim() ? '✓ Reservar com Cliente' : '✓ Apenas Fechar Horário'}
              </button>
              <button onClick={() => handleManualBookingConfirm(false)}
                className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm active:scale-95">
                Fechar sem Cliente
              </button>
              <button onClick={() => setShowManualModal(false)} className="w-full py-2 text-slate-400 font-bold text-xs">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
       {dayModalDate && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setDayModalDate(null)}/>
          <div className="relative bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl">
 
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-base leading-none mb-1">
                  {dayModalDate.split('-').reverse().join('/')}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  {getDayAppointments(dayModalDate).length} cliente(s) · {freeSlotsCount(dayModalDate)} vaga(s) livre(s)
                </p>
              </div>
              <button onClick={() => setDayModalDate(null)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 active:scale-95 transition-all">
                <X size={18}/>
              </button>
            </div>
 
            <div className="p-5 overflow-y-auto flex-1">
              {getDayAppointments(dayModalDate).length === 0 ? (
                <div className="py-10 text-center">
                  <CalendarDays size={28} className="mx-auto text-slate-200 mb-2"/>
                  <p className="text-xs font-bold text-slate-400">Nenhum cliente marcado nesse dia</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getDayAppointments(dayModalDate).map(app => (
                    <div key={app.id}
                      className={`flex items-center gap-3 bg-white border rounded-2xl p-3 shadow-sm
                        ${app.isManual ? 'border-amber-200 border-l-4 border-l-amber-500' : 'border-slate-100 border-l-4 border-l-green-500'}`}>
                      <div className="bg-blue-600 text-white rounded-xl px-2.5 py-2 text-[11px] font-black">
                        {app.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {app.client_name || app.client || 'Cliente'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase truncate">
                          {app.service_name || app.service || 'Serviço'}
                          {app.isManual && ' · Manual'}
                        </p>
                        {Number(app.price) > 0 && (
                          <p className="text-[10px] text-green-600 font-black mt-0.5">R$ {app.price}</p>
                        )}
                      </div>
                      <button onClick={() => cancelAppointmentQuick(app)}
                        title="Cancelar cliente"
                        className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center active:scale-90 hover:bg-red-600 transition-all flex-shrink-0">
                        <X size={16}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
 
            <div className="p-5 border-t border-slate-100">
              <button onClick={() => { setSelectedDateConfig(dayModalDate); setDayModalDate(null); }}
                className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-tight active:scale-95 transition-all">
                Editar horários desse dia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal pagamento ── */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32}/>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Libere Serviços Ilimitados</h2>
            {isGuestBarber ? (
              <>
                <p className="text-slate-500 text-sm mb-6">Para ativar o plano, crie uma conta de profissional.</p>
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
                  onClick={() => { setShowPayModal(false); onLogout(); }}>
                  Criar conta / Fazer Login
                </button>
              </>
            ) : (
              <>
                <p className="text-slate-500 text-sm mb-6">
                  Você atingiu o limite de <b>3 serviços gratuitos</b>.
                </p>
                <button className="w-full py-4 bg-green-500 text-white rounded-xl font-bold"
                  onClick={handlePayment} disabled={isPaying}>
                  {isPaying ? 'Processando...' : 'Liberar Tudo (R$ 29,90/mês)'}
                </button>
              </>
            )}
            <button onClick={() => setShowPayModal(false)}
              className="text-slate-400 text-sm font-bold block w-full mt-3">
              Agora não
            </button>
          </div>
        </div>
      )}
 
    {/* ── Modal pagamento ── */}
    {showPayModal && (
      <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32}/>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Libere Serviços Ilimitados</h2>
          {isGuestBarber ? (
            <>
              <p className="text-slate-500 text-sm mb-6">Para ativar o plano, crie uma conta de profissional.</p>
              <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold"
                onClick={() => { setShowPayModal(false); onLogout(); }}>
                Criar conta / Fazer Login
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-6">
                Você atingiu o limite de <b>3 serviços gratuitos</b>.
              </p>
              <button className="w-full py-4 bg-green-500 text-white rounded-xl font-bold"
                onClick={handlePayment} disabled={isPaying}>
                {isPaying ? 'Processando...' : 'Liberar Tudo (R$ 29,90/mês)'}
              </button>
            </>
          )}
          <button onClick={() => setShowPayModal(false)}
            className="text-slate-400 text-sm font-bold block w-full mt-3">
            Agora não
          </button>
        </div>
      </div>
    )}
 
    {/* ── Header ── */}
    <header className="bg-white p-6 border-b border-slate-100 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <StoryRing rating={rating} size={44}>
              {effectiveUser.avatar_url
                ? <img src={effectiveUser.avatar_url} className="w-full h-full object-cover" alt="Avatar"/>
                : <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <User size={16} className="text-slate-400"/>
                  </div>}
            </StoryRing>
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {isGuestBarber ? 'Painel Demo' : `Painel ${effectiveUser.plano_ativo ? 'Pro' : 'Grátis'}`}
            </h2>
            {effectiveUser.bio && (
              <p className="text-[9px] text-blue-500 font-bold italic">"{effectiveUser.bio}"</p>
            )}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${effectiveUser.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}/>
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                {effectiveUser.is_visible ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark}/>
          <button onClick={onLogout} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500">
            <LogOut size={18}/>
          </button>
        </div>
      </div>
    </header>
 
    <main className="p-6 max-w-md mx-auto pb-24">
 
      {/* ══════════════════════════ HOME TAB ══════════════════════════ */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {!isGuestBarber && <CopyLinkButton barber={effectiveUser}/>}
 
          {/* Métricas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-wider">Faturamento</p>
              <p className="text-2xl font-black">R$ {revenue}</p>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-wider">Agendamentos</p>
              <div className="flex gap-2 items-baseline">
                <p className="text-2xl font-black text-slate-900">{confirmed.length}</p>
                {dedupedPending.length > 0 && (
                  <span className="text-xs text-orange-500 font-bold">({dedupedPending.length} novos)</span>
                )}
              </div>
            </div>
          </div>
 
          {/* ── PRÓXIMOS 5 ATENDIMENTOS (com lembrete WhatsApp) ── */}
          {(() => {
            const now = new Date();
            const nowDateStr = now.toISOString().split('T')[0];
            const nowTimeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
            const upcoming = allAppointments.filter(a => {
              if (!a.date || !a.time) return false;
              if (a.date > nowDateStr) return true;
              if (a.date === nowDateStr && a.time > nowTimeStr) return true;
              return false;
            }).slice(0, 5);
 
            if (!upcoming.length) return null;
 
            const sendReminder = (app) => {
              const nome = app.client_name || app.client || 'Cliente';
              const servico = app.service_name || app.service || 'seu serviço';
              const hora = app.time || '';
              const dia = app.date ? app.date.split('-').reverse().join('/') : '';
              const fone = (app.phone || '').replace(/\D/g,'');
              const msg = encodeURIComponent(
                `Olá ${nome}! 👋 Lembrando que você tem um agendamento hoje às ${hora} para ${servico}. Te esperamos! ✂️💈`
              );
              if (fone) {
                window.open(`https://wa.me/55${fone}?text=${msg}`, '_blank');
              } else {
                alert(`Sem número de WhatsApp para ${nome}.\nAgendamento: ${dia} às ${hora}.`);
              }
            };
 
            const isToday = (dateStr) => dateStr === nowDateStr;
            const isSoon = (dateStr, timeStr) => {
              if (dateStr !== nowDateStr) return false;
              const [h,m] = timeStr.split(':').map(Number);
              const apptMin = h*60+m;
              const nowMin = now.getHours()*60+now.getMinutes();
              return apptMin - nowMin <= 120 && apptMin > nowMin;
            };
 
            return (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Bell size={14} className="text-blue-500"/>
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">Próximos Atendimentos</h3>
                  <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {upcoming.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {upcoming.map((app, idx) => {
                    const nome = app.client_name || app.client || '—';
                    const servico = app.service_name || app.service || 'Serviço';
                    const dia = app.date ? app.date.split('-').reverse().join('/') : '';
                    const hora = app.time || '';
                    const fone = (app.phone || '').replace(/\D/g,'');
                    const today = isToday(app.date);
                    const soon = isSoon(app.date, app.time);
 
                    return (
                      <div key={app.id || idx}
                        className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3
                          ${soon ? 'border-orange-200 border-l-4 border-l-orange-400' : 'border-slate-100 border-l-4 border-l-blue-400'}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="font-black text-slate-900 text-sm truncate">{nome}</p>
                            {soon && (
                              <span className="text-[9px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full animate-pulse">
                                Em breve!
                              </span>
                            )}
                            {today && !soon && (
                              <span className="text-[9px] font-black bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                                Hoje
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{servico}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock size={10} className="text-blue-400"/>
                            <span className="text-[10px] text-blue-500 font-bold">{dia} às {hora}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => sendReminder(app)}
                          title="Enviar lembrete no WhatsApp"
                          className={`flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all active:scale-95
                            ${fone
                              ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                              : 'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                          <Phone size={14}/>
                          <span className="text-[8px] font-black uppercase">Lembrar</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] text-slate-400 mt-2 text-center font-bold">
                  💡 Toque em "Lembrar" para avisar o cliente pelo WhatsApp
                </p>
              </section>
            );
          })()}
 
          {/* ── Histórico de Clientes ── */}
          <section>
            <button onClick={() => setShowClientHistory(!showClientHistory)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                  <History size={18} className="text-purple-500"/>
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">Meus Clientes</p>
                  <p className="text-[10px] text-slate-400">
                    {uniqueClients.length} pessoa{uniqueClients.length !== 1 ? 's' : ''} atendida{uniqueClients.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {uniqueClients.length}
                </span>
                <ChevronRight size={16} className={`text-slate-400 transition-transform ${showClientHistory ? 'rotate-90' : ''}`}/>
              </div>
            </button>
            {showClientHistory && (
              <div className="mt-2 space-y-2">
                {uniqueClients.length === 0
                  ? <div className="py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-slate-400 text-sm">Nenhum cliente ainda.</p>
                    </div>
                  : uniqueClients.map((c, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-black text-purple-600">{c.name?.charAt(0)?.toUpperCase() || '?'}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate">{c.name || 'Cliente'}</p>
                          <p className="text-[10px] text-slate-400">
                            {c.count} visita{c.count !== 1 ? 's' : ''} · último: {c.lastDate ? c.lastDate.split('-').reverse().join('/') : '—'}
                          </p>
                          {c.services.length > 0 && (
                            <p className="text-[9px] text-blue-500 font-bold truncate mt-0.5">
                              {c.services.slice(0,2).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                      {c.phone
                        ? <a href={`https://wa.me/55${c.phone}`} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold text-[10px] active:scale-95 transition-all">
                            <Phone size={11}/>
                            {c.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                          </a>
                        : <span className="flex-shrink-0 text-[9px] text-slate-300 font-bold">Sem tel.</span>}
                    </div>
                  ))}
              </div>
            )}
          </section>
 
          {/* ── Novas Solicitações ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                Novas Solicitações
                {dedupedPending.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    {dedupedPending.length}
                  </span>
                )}
              </h3>
              {dedupedPending.length > 3 && (
                <button onClick={() => setShowAllPending(!showAllPending)}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-tight border-b border-blue-200">
                  {showAllPending ? 'Ver menos' : `Ver todos (${dedupedPending.length})`}
                </button>
              )}
            </div>
            {dedupedPending.length === 0
              ? <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <p className="text-slate-400 text-sm">Nenhuma solicitação nova.</p>
                </div>
              : pendingToShow.map(app => (
                <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-1">{app.client_name || app.client}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{app.service_name || 'Serviço'}</p>
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold mt-2 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                        <Clock size={12} strokeWidth={3}/>
                        <span className="text-[10px]">{app.time} • {app.date?.split('-').reverse().join('/')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-sm">R$ {app.price}</p>
                      <span className="text-[8px] text-orange-500 font-black uppercase">Pendente</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      if (isGuestBarber) { alert('Para aceitar agendamentos, faça login!'); return; }
                      if (!app.id) return;
                      try {
                        const blocks = getBlocks(app, pendingAll);
                        for (const b of blocks) await onUpdateStatus(b.id, 'confirmed');
                        const times = blocks.map(b => b.time).filter(Boolean);
                        if (app.date && times.length) await setSlotsAvailability(app.date, times, false);
                        const msg = `Olá ${app.client_name || app.client}! Seu agendamento foi CONFIRMADO! ✅%0A📅 ${app.date?.split('-').reverse().join('/')} às ${app.time}`;
                        const fone = app.phone?.toString().replace(/\D/g,'');
                        if (fone) window.location.href = `https://wa.me/55${fone}?text=${msg}`;
                      } catch (err) { console.error(err); }
                    }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95">
                      <CheckCircle size={14}/> Aceitar
                    </button>
                    <button onClick={() => !isGuestBarber && getBlocks(app, pendingAll).forEach(b => onUpdateStatus(b.id, 'rejected'))}
                      className="p-3 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                      <XCircle size={18}/>
                    </button>
                  </div>
                </div>
              ))}
          </section>
 
          {/* ── Agenda do dia / próximos ── */}
          {(() => {
            // ── Agrupa blocos "(continuação)" no atendimento principal ──
            const _toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
            const _toTime = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
            const _interval = GLOBAL_TIME_SLOTS.length > 1
              ? (_toMin(GLOBAL_TIME_SLOTS[1]) - _toMin(GLOBAL_TIME_SLOTS[0])) || 30
              : 30;
            const _isCont = (a) => typeof a.service_name === 'string' && a.service_name.endsWith(' (continuação)');

            const unique = allAppointments.filter((app, i, self) => i === self.findIndex(t => t.id === app.id));
            const mains = unique.filter(a => !_isCont(a));
            const conts = unique.filter(_isCont);
            const used = new Set();

            // Cada atendimento principal vira UM card; as continuações ficam dentro dele (não aparecem separadas)
            const groupedAppointments = mains.map(m => {
              const blocks = [m];
              let last = m;
              while (true) {
                const next = conts.find(c =>
                  !used.has(c.id) &&
                  c.date === m.date &&
                  c.client_name === m.client_name &&
                  _toMin(c.time) - _toMin(last.time) === _interval
                );
                if (!next) break;
                used.add(next.id);
                blocks.push(next);
                last = next;
              }
              return { ...m, blocks };
            });

            return (
          <section>
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500"/> Agenda Completa
            </h3>
            {groupedAppointments.length === 0
              ? <div className="py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-slate-400 text-sm">Sua agenda está vazia.</p>
                </div>
              : <div className="space-y-3">
                  {groupedAppointments.map(app => {
                    const lastBlock = app.blocks[app.blocks.length - 1];
                    const timeLabel = app.blocks.length > 1 && app.time && lastBlock.time
                      ? `${app.time}–${_toTime(_toMin(lastBlock.time) + _interval)}`
                      : app.time;
                    return (
                    <div key={app.id}
                      className={`flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm
                        ${app.isManual ? 'border-amber-200 border-l-4 border-l-amber-500' : 'border-slate-100 border-l-4 border-l-green-500'}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-black text-slate-900 text-sm">{app.client_name || app.client}</p>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase
                            ${app.isManual ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {app.isManual ? 'Manual' : 'Confirmado'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{app.service_name || app.service || 'Serviço'}</p>
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold mt-0.5">
                          <Clock size={12} strokeWidth={3}/>
                          <span className="text-[10px]">{timeLabel} • {app.date?.split('-').reverse().join('/')}</span>
                        </div>
                      </div>
                      <button onClick={() => {
                        setActiveTab('shop');
                        setFocusComandaId(`__open__${app.id}`);
                      }} title="Abrir comanda do Loja para este atendimento"
                        className="flex flex-col items-center justify-center gap-1 ml-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 hover:bg-amber-100 transition-all active:scale-95">
                        <Tag size={18}/>
                        <span className="text-[8px] font-black uppercase">Bar</span>
                      </button>
                      <button onClick={() => {
                        if (window.confirm(`Cancelar o horário de ${app.client_name || app.client}?`)) {
                          if (app.isManual) {
                            const filtered = (effectiveUser.manual_appointments || []).filter(m => m.id !== app.id);
                            effectiveOnUpdateProfile({ ...effectiveUser, manual_appointments: filtered });
                            if (!isGuestBarber) sb.from('profiles').update({ manual_appointments: filtered }).eq('id', effectiveUser.id);
                            if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
                          } else {
                            // Rejeita e libera TODOS os blocos do atendimento
                            app.blocks.forEach(b => {
                              if (!isGuestBarber) onUpdateStatus(b.id, 'rejected');
                              if (b.date && b.time) setSlotAvailability(b.date, b.time, true);
                            });
                          }
                        }
                      }} className="flex flex-col items-center justify-center gap-1 ml-4 p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                        <XCircle size={20}/>
                        <span className="text-[8px] font-black uppercase">Cancelar</span>
                      </button>
                    </div>
                    );
                  })}
                </div>}
          </section>
            );
          })()}
        </div>
      )}
      {/* ══════════════════════════ SERVICES TAB ══════════════════════════ */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <button onClick={() => setActiveTab('config')}
            className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-tight">
            <ArrowLeft size={14}/> Voltar para Ajustes
          </button>
          <div className="p-4 bg-blue-50 rounded-2xl mb-4">
            <p className="text-xs text-blue-700 font-medium">
              {isGuestBarber ? 'Modo Demo — explore os serviços (sem salvar)'
                : effectiveUser.plano_ativo ? 'Assinatura Profissional Ativa'
                : `Limite Grátis: ${effectiveUser.my_services?.length || 0}/3`}
            </p>
          </div>
          {MASTER_SERVICES.map(service => {
            const userServiceData = effectiveUser.my_services?.find(s => s.id === service.id);
            const isActive = !!userServiceData;
            return (
              <div key={service.id} className={`p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-slate-900 bg-white shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleService(service.id, service.defaultPrice)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {service.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{service.name}</p>
                      <p className="text-[10px] text-slate-400">{service.duration}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full"/>}
                  </div>
                </div>
                {isActive && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">PREÇO (R$)</span>
                    <input type="number" value={userServiceData.price || ''}
                      onChange={e => updateServicePrice(service.id, e.target.value)}
                      className="w-24 text-right font-black text-lg bg-slate-50 rounded-md px-2 py-1 outline-none"/>
                  </div>
                )}
              </div>
            );
          })}
 
          {/* Serviços personalizados */}
          <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <PlusCircle size={16} className="text-purple-600"/> Serviços Personalizados
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Aparecem apenas no seu link de agendamento</p>
              </div>
              <button onClick={() => setShowAddCustomSvc(!showAddCustomSvc)}
                className={`p-2 rounded-xl transition-all ${showAddCustomSvc ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'}`}>
                {showAddCustomSvc ? <X size={16}/> : <Plus size={16}/>}
              </button>
            </div>
            {(effectiveUser.custom_services || []).length > 0 && (
              <div className="space-y-2 mb-3">
                {(effectiveUser.custom_services || []).map(cs => (
                  <div key={cs.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{cs.name}</p>
                      <p className="text-[10px] text-slate-500">{cs.duration} · R$ {cs.price}</p>
                    </div>
                    <button onClick={() => removeCustomService(cs.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {showAddCustomSvc && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Novo Serviço</p>
                <input type="text" value={newSvcName} onChange={e => setNewSvcName(e.target.value)} placeholder="Ex: Progressiva, Coloração..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-400 transition-colors"/>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                    <input type="number" value={newSvcPrice} onChange={e => setNewSvcPrice(e.target.value)} placeholder="Preço"
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-colors"/>
                  </div>
                  <select value={newSvcDuration} onChange={e => setNewSvcDuration(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                    {['30min','45min','1h','1h 30min','2h'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button onClick={addCustomService} disabled={!newSvcName.trim() || !newSvcPrice}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <Plus size={16}/> Adicionar Serviço
                </button>
              </div>
            )}
          </div>
        </div>
      )}
 
      {/* ══════════════════════════ CONFIG TAB ════════════════════════════ */}
      {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Atalho para gestão de serviços */}
            <button onClick={() => setActiveTab('services')}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Scissors size={16} className="text-blue-500"/>
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 text-sm">Meus Serviços</p>
                  <p className="text-[10px] text-slate-400">Gerencie os serviços e preços oferecidos</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400"/>
            </button>

            {/* Fotos do trabalho */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Fotos do Trabalho</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Máx. 10 fotos · exibidas no link público</p>
                </div>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                  {(effectiveUser.work_photos || []).length}/10
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(effectiveUser.work_photos || []).map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={url} alt={`Trabalho ${i+1}`} className="w-full h-full object-cover"/>
                    <button onClick={() => handleRemoveWorkPhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                      <XCircle size={14}/>
                    </button>
                  </div>
                ))}
                {(effectiveUser.work_photos || []).length < 10 && (
                  <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                    ${uploadingPhoto ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400'}`}>
                    {uploadingPhoto
                      ? <Loader2 size={20} className="text-blue-500 animate-spin"/>
                      : <><Image size={20} className="text-slate-400 mb-1"/><span className="text-[9px] font-black text-slate-400 uppercase">Adicionar</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadWorkPhoto} disabled={uploadingPhoto}/>
                  </label>
                )}
              </div>
            </section>
 
          {/* Configurações do perfil */}
<section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
  <h3 className="font-bold text-slate-900 mb-6">Configurações do Perfil</h3>
  <div className="flex flex-col items-center mb-6">
    <div className="relative">
      <StoryRing rating={rating} size={96}>
        {effectiveUser.avatar_url
          ? <img src={effectiveUser.avatar_url} className="w-full h-full object-cover" alt="Avatar"/>
          : <div className="w-full h-full flex items-center justify-center bg-slate-100"><User size={32} className="text-slate-300"/></div>}
      </StoryRing>
      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md">
        <Camera size={16}/>
      </label>
      <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar}/>
    </div>
  </div>
  <div className="space-y-4">
    {/* ✅ BIO COM BOTÃO OK */}
    <div>
      <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between mb-1">
        <span className="flex items-center gap-1"><Type size={11}/> Bio (tagline)</span>
        <span className={`font-black text-[10px] ${(tempBio || '').length >= 15 ? 'text-red-500' : (tempBio || '').length >= 12 ? 'text-amber-500' : 'text-slate-400'}`}>
          {(tempBio || '').length}/15
        </span>
      </label>
      <div className="flex gap-2">
        <input 
          type="text" 
          maxLength={15} 
          value={tempBio || ''} 
          onChange={(e) => setTempBio(e.target.value)} 
          placeholder="Ex: Especialista em..."
          className="flex-1 bg-slate-50 p-3 rounded-xl border-2 border-slate-200 text-sm font-medium outline-none focus:border-blue-400 transition-colors"
        />
        <button 
          onClick={saveBio}
          className="px-4 py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap flex items-center gap-1"
        >
          ✓ OK
        </button>
      </div>
      {tempBio && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
          <span className="text-[9px] text-slate-400">Preview  :</span>
          <span className="text-[10px] text-blue-600 font-bold italic">"{tempBio}"</span>
        </div>
      )}
                </div>
 
             {/* Endereço */}
<div>
  <label className="text-[10px] font-bold text-slate-400 uppercase">Endereço</label>
  <div className="flex gap-2 mt-1">
    <input
      type="text"
      value={tempAddress} 
      onChange={(e) => setTempAddress(e.target.value)} 
      placeholder="Digite seu endereço completo..."
      className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-400"
    />
    <button
      onClick={saveAddress} 
      className="px-4 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-blue-700 active:scale-95 transition-all"
    >
      OK
    </button>
  </div>
</div>
                <button onClick={() => {
                  if (isGuestBarber) { alert('Para salvar localização, faça login!'); return; }
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(pos => {
                      effectiveOnUpdateProfile({...effectiveUser, latitude: pos.coords.latitude, longitude: pos.coords.longitude});
                      alert('Localização capturada!');
                    });
                  }
                }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                  <MapPin size={14}/> Capturar Minha Localização
                </button>
              </div>
 
              {/* Toggle visibilidade */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Loja Visível para Clientes</h3>
                  {isGuestBarber && <p className="text-[10px] text-amber-500 font-bold mt-0.5">Faça login para ativar</p>}
                </div>
                <div onClick={() => {
                  if (isGuestBarber) { alert('Para ativar sua loja, faça login!'); return; }
                  const updated = {...effectiveUser, is_visible: !effectiveUser.is_visible};
                  effectiveOnUpdateProfile(updated);
                  if (!isGuestBarber) sb.from('profiles').update({is_visible: !effectiveUser.is_visible}).eq('id', effectiveUser.id);
                }} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${effectiveUser.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${effectiveUser.is_visible ? 'translate-x-6' : 'translate-x-0'}`}/>
                </div>
              </div>
 
              {/* Duração */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm mb-1">Duração do Atendimento</p>
                <div className="flex gap-2">
                  {['30min','1h'].map(dur => (
                    <button key={dur} onClick={async () => {
                      const updated = {...effectiveUser, appointment_duration: dur};
                      effectiveOnUpdateProfile(updated);
                      if (!isGuestBarber) await sb.from('profiles').update({appointment_duration: dur}).eq('id', effectiveUser.id).catch(console.error);
                    }} className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all active:scale-95
                      ${appointmentDuration===dur ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                      {dur==='30min' ? '⏱ 30 min' : '🕐 1 hora'}
                    </button>
                  ))}
                </div>
              </div>
            </section>
 
            {!isGuestBarber && <CopyLinkButton barber={effectiveUser}/>}
 
             {/* ── Agenda ── */}
            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div onClick={() => setShowCalendar(!showCalendar)}
                className="p-5 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20}/>
                  <h3 className="font-bold text-sm">Horários Disponíveis</h3>
                </div>
                <ChevronRight size={18} className={`transition-transform ${showCalendar ? 'rotate-90' : ''}`}/>
              </div>
              {showCalendar && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={goConfigPrev} disabled={isPrevConfigDisabled}
                      className={`p-2 rounded-full transition-all ${isPrevConfigDisabled?'text-slate-200 cursor-not-allowed':'text-slate-600 hover:bg-slate-100'}`}>
                      <ChevronLeft size={18}/>
                    </button>
                    <span className="font-black text-sm text-slate-900">{MONTH_NAMES[configCalMonth]} {configCalYear}</span>
                    <button onClick={goConfigNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all">
                      <ChevronRight size={18}/>
                    </button>
                  </div>
 
                  <div className="flex gap-2 mb-3">
                    <button onClick={markAllDaysInMonth} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95">✓ Marcar Mês</button>
                    <button onClick={unmarkAllDaysInMonth} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95 hover:bg-red-600">✕ Limpar Mês</button>
                  </div>
 
                  {/* Aviso do toque longo */}
                  <div className="flex items-center justify-center gap-1.5 mb-3 py-2 bg-blue-50 rounded-xl border border-blue-100">
                    <Clock size={12} className="text-blue-500"/>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-tight">
                      Segure em um dia para ver os clientes
                    </span>
                  </div>
 
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['D','S','T','Q','Q','S','S'].map((d,i) => <div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>)}
                  </div>
 
                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {Array.from({length: new Date(configCalYear, configCalMonth, 1).getDay()}, (_, i) => (
                      <div key={`vazio-${i}`} className="aspect-square"/>
                    ))}
                    {Array.from({length: daysInConfigMonth}, (_,i) => {
                      const fullDate = formatDate(configCalYear, configCalMonth, i+1);
                      const isSelected = selectedDateConfig === fullDate;
                      const slotsQty = freeSlotsCount(fullDate);
                      const agendados = getDayAppointments(fullDate).length;
                      const isAvail = slotsQty > 0;
                      const isLow = slotsQty > 0 && slotsQty < 4;
                      return (
                        <button key={i}
                          onClick={() => handleDayClick(fullDate)}
                          onTouchStart={() => startDayPress(fullDate)}
                          onTouchEnd={endDayPress}
                          onTouchMove={endDayPress}
                          onTouchCancel={endDayPress}
                          onMouseDown={() => startDayPress(fullDate)}
                          onMouseUp={endDayPress}
                          onMouseLeave={endDayPress}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`aspect-square rounded-xl text-xs font-bold border transition-all relative select-none
                            ${isSelected ? 'ring-2 ring-blue-500' : ''}
                            ${isAvail ? (isLow ? 'bg-amber-500 text-white border-amber-500' : 'bg-green-600 text-white border-green-600') : 'bg-red-500 text-white border-red-500'}`}>
                          {i+1}
                          {agendados > 0 ? (
                            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-blue-600 text-white text-[8px] font-black rounded-full border border-white flex items-center justify-center">
                              {agendados}
                            </span>
                          ) : isLow && !isSelected ? (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full border border-white"/>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
 
                  {/* Legenda */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-green-600 rounded-sm"/>
                      <span className="text-[9px] text-slate-500 font-bold">Livre</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-amber-500 rounded-sm"/>
                      <span className="text-[9px] text-slate-500 font-bold">Poucas vagas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-sm"/>
                      <span className="text-[9px] text-slate-500 font-bold">Fechado</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 bg-blue-600 rounded-sm"/>
                      <span className="text-[9px] text-slate-500 font-bold">Agendado</span>
                    </div>
                  </div>
 
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Horários — {selectedDateConfig.split('-').reverse().join('/')}</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                          {freeForSelected.length} de {filteredTimeSlots.length} abertos
                          {bookedForSelected.length > 0 && (
                            <span className="ml-1 text-blue-500 font-black">· {bookedForSelected.length} agendado(s)</span>
                          )}
                          {freeForSelected.length > 0 && freeForSelected.length < 4 && (
                            <span className="ml-1 text-amber-500 font-black">· Poucas vagas!</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => selectAllSlotsForDay(selectedDateConfig)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase active:scale-95">+ Todos</button>
                        <button onClick={() => deselectAllSlotsForDay(selectedDateConfig)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase active:scale-95 hover:bg-red-600">− Todos</button>
                      </div>
                    </div>
                    <div className="h-[1px] bg-slate-200 mb-3"/>
 
                    <div className="grid grid-cols-4 gap-2">
                      {filteredTimeSlots.map(slot => {
                        const isOpen = effectiveUser.available_slots?.[selectedDateConfig]?.includes(slot);
                        const isBooked = bookedForSelected.includes(slot); // já tem cliente = travado
 
                        // Bloqueia horários passados de hoje
                        const now = new Date();
                        const [selYear, selMonth, selDay] = selectedDateConfig.split('-').map(Number);
 
                        const isToday =
                          selYear === now.getFullYear() &&
                          (selMonth - 1) === now.getMonth() &&
                          selDay === now.getDate();
 
                        let isPastSlot = false;
 
                        if (isToday) {
                          const [slotHour, slotMinute] = slot.split(':').map(Number);
                          const currentHour = now.getHours();
                          const currentMinute = now.getMinutes();
 
                          if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
                            isPastSlot = true;
                          }
                        }
 
                        return (
                          <button
                            key={slot}
                            disabled={isPastSlot || isBooked}
                            onClick={() => toggleSlotForDate(selectedDateConfig, slot)}
                            title={isBooked ? 'Horário com cliente agendado' : undefined}
                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all active:scale-95
                              ${isBooked
                                ? 'bg-blue-600 text-white border-blue-600 cursor-not-allowed'
                                : isPastSlot
                                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-70'
                                  : isOpen
                                    ? 'bg-green-600 text-white border-green-600 shadow-sm'
                                    : 'bg-red-500 text-white border-red-500 hover:bg-red-600'}`}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>
 

            
            {/* Status do plano */}
            <div className="pt-2 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-2xl border border-slate-200 w-full">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status do Plano</p>
                {isGuestBarber ? (
                  <>
                    <p className="text-sm font-black text-slate-900 mt-1">Modo Demonstração 👁️</p>
                    <button onClick={onLogout} className="mt-3 text-blue-600 font-bold text-xs">Criar conta / Fazer Login</button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-slate-900 mt-1">
                      {effectiveUser.plano_ativo ? 'Assinatura Profissional Ativa ✅' : 'Versão Beta'}
                    </p>
                    {!effectiveUser.plano_ativo && (
                      <button onClick={() => setShowPayModal(true)} className="mt-3 text-blue-600 font-bold text-xs">
                        Fazer Upgrade agora
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
 
            {isGuestBarber && (
              <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center">
                <p className="text-2xl mb-2">✂️</p>
                <h3 className="font-black text-slate-900 mb-1">Gostou do que viu?</h3>
                <p className="text-xs text-slate-500 mb-4">Crie sua conta profissional e comece a receber agendamentos hoje!</p>
                <button onClick={onLogout} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-95 transition-all">
                  Criar conta grátis
                </button>
              </section>
            )}
 
            {/* Botão escondido excluir conta (5 cliques no rodapé) */}
            <p onClick={handleHiddenVersionClick}
              className="text-[9px] text-slate-400 mt-4 text-center uppercase font-bold tracking-tighter pb-4 cursor-default select-none">
              Salão Digital © 2026 · {APP_VERSION}
            </p>
            {showHiddenDelete && !isGuestBarber && (
              <div className="pb-6 text-center">
                <button onClick={handleDeleteAccount}
                  className="text-[10px] text-red-400 font-bold underline underline-offset-2 hover:text-red-600 transition-colors">
                  ⚠️ Excluir minha conta permanentemente
                </button>
              </div>
            )}
          </div>
        )}
     {/* ══════════════════════════ REPORTS TAB ═══════════════════════════ */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="mb-2">
            <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <BarChart2 size={20} className="text-blue-500"/> Relatórios
            </h2>
            <p className="text-xs text-slate-400">Análise do seu desempenho e tempo de trabalho</p>
          </div>
          {isGuestBarber && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-bold">
              ⚠️ Modo demo — os dados são simulados.
            </div>
          )}

          <ReportsSection
            appointments={appointments}
            user={effectiveUser}
            isGuest={isGuestBarber}
            onUpdateProfile={effectiveOnUpdateProfile}
            supabase={sb}
          />

          {/* ── Meta dos 30 ── */}
          <GoalCard
            totalAppointments={totalAppointmentsForGoal}
            slug={effectiveUser.slug}
            isGuest={isGuestBarber}
          />

          {/* ── Suporte Direto ao Administrador ── */}
          <SupportChat user={effectiveUser} isGuest={isGuestBarber} />
        </div>
      )}

      {/* ══════════════════════════ SHOP/BAR TAB ══════════════════════════ */}
      {activeTab === 'shop' && (
        <ShopBarSection
          effectiveUser={effectiveUser}
          isGuestBarber={isGuestBarber}
          sb={sb}
          activeAppointments={allAppointments}
          focusComandaId={focusComandaId}
          setFocusComandaId={setFocusComandaId}
        />
      )}
    </main>

    <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} tabLabels={tabLabels} tabIcons={tabIcons}/>
  </div>
);
};
 
// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [currentMode, setCurrentMode] = useState(null);
  const [user, setUser] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isGuestBarber, setIsGuestBarber] = useState(false);
  const [publicBarber, setPublicBarber] = useState(null);
  const [publicComandaNumero, setPublicComandaNumero] = useState(null);
  const [publicMenuSlug, setPublicMenuSlug] = useState(null); // ← NOVO
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('salao_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
 
  useEffect(() => {
    injectDarkModeCSS(isDark);
    localStorage.setItem('salao_dark_mode', isDark);
  }, [isDark]);
 
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('salao_dark_mode') === null) setIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
 
  const handleToggleDark = () => {
    setIsDark(d => {
      const newVal = !d;
      localStorage.setItem('salao_dark_mode', newVal);
      return newVal;
    });
  };
 
  useEffect(() => {
    const checkPublicRoute = async () => {
      const path = window.location.pathname;
      if (!path || path === '/') { setLoading(false); restoreSession(); return; }
 
      // Rota admin
      if (path === '/estrela2016-v2') { setLoading(false); return; }

      // Rota do cardápio público ← NOVO
      if (path.startsWith('/cardapio/')) {
        const s = path.split('/cardapio/')[1]?.replace(/\/$/, '');
        if (s) { setPublicMenuSlug(s); setLoading(false); return; }
      }

      // Rota da vitrine da comanda (acesso via QR Code ou número)
      if (path.startsWith('/comanda/')) {
        const numero = path.split('/comanda/')[1]?.replace(/\/$/, '');
        if (numero) { setPublicComandaNumero(numero); setLoading(false); return; }
      }
 
      const slug = path.replace(/^\//, '').replace(/\/$/, '');
      if (!slug) { setLoading(false); restoreSession(); return; }
      try {
        const { data } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
        if (data) { setPublicBarber(data); setLoading(false); return; }
      } catch (_) {}
      setLoading(false);
      restoreSession();
    };
 
    const restoreSession = async () => {
      try {
        const saved = localStorage.getItem('salao_user_data');
        if (!saved) return;
        const parsedUser = JSON.parse(saved);
        if (!parsedUser?.id || parsedUser?.isGuest) return;
        const { data: freshData } = await supabase.from('profiles').select('*').eq('id', parsedUser.id).maybeSingle();
        if (freshData) {
          setUser(freshData);
          setCurrentMode(freshData.role);
          localStorage.setItem('salao_user_data', JSON.stringify(freshData));
        }
      } catch (err) { console.error('Erro ao restaurar sessão:', err); }
    };
 
    checkPublicRoute();
  }, []);
 
  useEffect(() => {
    const fetchData = async () => {
      const { data: bData } = await supabase.from('profiles').select('*').eq('role', 'barber');
      if (bData) setBarbers(bData);
      if (!user || user.isGuest || isGuestBarber) return;
      const { data: aData } = await supabase
        .from('appointments').select('*')
        .or(`client_id.eq.${user.id},barber_id.eq.${user.id}`);
      if (aData) {
        const formatted = aData.map(a => ({
          ...a,
          client: a.client_name,
          service: a.service_name,
          barberId: a.barber_id,
        }));
        setAppointments(formatted);
      }
    };
    if (!loading) fetchData();
 
    // Realtime
    if (!loading && user && !user.isGuest) {
      const channel = supabase.channel(`app-rt-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments',
          filter: `barber_id=eq.${user.id}` }, () => fetchData())
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [user, isGuestBarber, loading]);
 
  const handleSelectMode = (mode) => {
    if (mode === 'guest') {
      setUser({ id: 'guest', name: 'Visitante', isGuest: true });
      setCurrentMode('client');
      setIsGuestBarber(false);
    } else if (mode === 'guest-barber') {
      setUser({ id: 'guest-barber', name: 'Profissional Demo', isGuest: true, isGuestBarber: true });
      setCurrentMode('barber');
      setIsGuestBarber(true);
    } else {
      setCurrentMode(mode);
      setIsGuestBarber(false);
    }
  };
 
  const handleLogin = async (identifier, password, directProfile = null, loginBy = 'phone') => {
     if (directProfile) {
       setUser(directProfile);
       setCurrentMode(directProfile.role);
       localStorage.setItem('salao_user_data', JSON.stringify(directProfile));
       return;
     }
 
     let query = supabase.from('profiles').select('*').eq('role', currentMode);
 
     if (loginBy === 'email') {
       query = query.eq('email', identifier).eq('password', password);
     } else {
       // telefone: senha é opcional (quem criou antes não tem email)
       query = query.eq('phone', identifier);
       if (password) query = query.eq('password', password);
     }
 
     const { data, error } = await query.single();
     if (error || !data) throw new Error('Dados incorretos. Verifique e tente novamente.');
     localStorage.setItem('salao_user_data', JSON.stringify(data));
     setUser(data);
     setIsGuestBarber(false);
   };
 
   const handleRegister = async (name, phone, password, googleUser = null, email = '') => {
     const slug = generateSlug(name, Date.now());
     const { data, error } = await supabase.from('profiles').insert([{
       name, phone, password,
       email: email || '',          // ← campo novo na tabela
       role: currentMode,
       is_visible: false, has_access: false, plano_ativo: true,
       my_services: [], available_slots: {}, available_dates: [],
       avatar_url: googleUser?.avatar_url || '', work_photos: [], custom_services: [],
       slug, onboarding_done: false, bio: '',
     }]).select().single();
     if (error) {
       if (error.code === '23505') throw new Error('Este WhatsApp já está cadastrado!');
       throw new Error(error.message);
     }
     const realSlug = generateSlug(name, data.id);
     await supabase.from('profiles').update({ slug: realSlug }).eq('id', data.id);
     const finalData = { ...data, slug: realSlug };
     localStorage.setItem('salao_user_data', JSON.stringify(finalData));
     setUser(finalData);
     setIsGuestBarber(false);
   };
 
  const handleUpdateStatus = async (appointmentId, status) => {
    if (user?.isGuest || isGuestBarber) return;
    const { error } = await supabase.from('appointments').update({ status }).eq('id', appointmentId);
    if (!error) {
      if (status === 'rejected') setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      else setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
    }
  };
 
  const handleUpdateProfile = async (updatedUser) => {
    try {
      const dataToSave = {
        address: updatedUser.address,
        latitude: updatedUser.latitude,
        longitude: updatedUser.longitude,
        avatar_url: updatedUser.avatar_url,
        is_visible: updatedUser.is_visible,
        plano_ativo: updatedUser.plano_ativo,
        my_services: updatedUser.my_services,
        available_dates: updatedUser.available_dates,
        available_slots: updatedUser.available_slots,
        manual_appointments: updatedUser.manual_appointments,
        appointment_duration: updatedUser.appointment_duration,
        work_photos: updatedUser.work_photos,
        custom_services: updatedUser.custom_services,
        slug: updatedUser.slug,
        onboarding_done: updatedUser.onboarding_done,
        hourly_rate: updatedUser.hourly_rate,
        bio: updatedUser.bio || '',
      };
      const { error } = await supabase.from('profiles').update(dataToSave).eq('id', updatedUser.id);
      if (error) throw error;
      setUser(updatedUser);
      localStorage.setItem('salao_user_data', JSON.stringify(updatedUser));
    } catch (error) { alert('Erro ao salvar: ' + error.message); }
  };
 
  const handleLogout = () => {
    localStorage.removeItem('salao_user_data');
    setUser(null);
    setCurrentMode(null);
    setIsGuestBarber(false);
  };
 
  const isAdminRoute = window.location.pathname === '/estrela2016-v2';
  const isFirstTimeBarber = user && currentMode === 'barber' && !isGuestBarber && user.onboarding_done === false;
 
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"/>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sincronizando...</p>
      </div>
    );
  }
 
  if (isAdminRoute) return <AdminDashboard/>;
  if (publicMenuSlug) return <PublicMenuPage slug={publicMenuSlug}/>; // ← NOVO
  if (publicComandaNumero) return <ComandaStorefrontPage numero={publicComandaNumero}/>;
  if (publicBarber) return <PublicBarberPage barber={publicBarber}/>;
 
  return (
    <>
      {showWelcome && !user && <WelcomePopup onClose={() => setShowWelcome(false)}/>}
      {!currentMode && !user && (
        <WelcomeScreen onSelectMode={handleSelectMode} isDark={isDark} onToggleDark={handleToggleDark}/>
      )}
      {currentMode && !user && (
        <AuthScreen userType={currentMode} onBack={() => setCurrentMode(null)}
          onLogin={handleLogin} onRegister={handleRegister}
          isDark={isDark} onToggleDark={handleToggleDark}/>
      )}
      {user && (
        currentMode === 'barber'
          ? isFirstTimeBarber
            ? <BarberOnboarding user={user} supabase={supabase}
                onComplete={u => { setUser(u); localStorage.setItem('salao_user_data', JSON.stringify(u)); }}
                onSkip={u => { setUser(u); localStorage.setItem('salao_user_data', JSON.stringify(u)); }}/>
            : <BarberDashboard
                user={user}
                appointments={appointments}
                onLogout={handleLogout}
                onUpdateStatus={handleUpdateStatus}
                onUpdateProfile={handleUpdateProfile}
                MASTER_SERVICES={MASTER_SERVICES}
                GLOBAL_TIME_SLOTS={GLOBAL_TIME_SLOTS}
                supabase={supabase}
                isGuestBarber={isGuestBarber}
                isDark={isDark}
                onToggleDark={handleToggleDark}/>
          : <ClientApp
              user={user}
              barbers={barbers}
              appointments={appointments}
              onLogout={handleLogout}
              onBookingSubmit={() => {}}
              onUpdateStatus={handleUpdateStatus}
              MASTER_SERVICES={MASTER_SERVICES}
              isDark={isDark}
              onToggleDark={handleToggleDark}/>
      )}
    </>
  );
}