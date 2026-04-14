import React, { useState, useEffect, useMemo } from 'react';

import { createClient } from '@supabase/supabase-js';
import imgMao from './img/mao.jpg';
import imgMp from './img/mp.jpg';
import imgPopup from './img/popup.png'; 
import imgTes from './img/tes.jpg';

import { 
  Scissors, User, Calendar, MapPin, Star, CheckCircle2, LogOut, Bell, DollarSign, 
  ChevronLeft, ChevronRight, Check, Trash2, KeyRound, UserPlus, Eye, EyeOff, 
  CreditCard, Lock, Clock, CalendarDays, Sparkles, Palette, Briefcase, Edit3, 
  MessageCircle, Phone, XCircle, History, Loader2,
  Home, Plus, Camera,
  CheckCircle, ArrowLeft, Send, HeadphonesIcon
} from 'lucide-react';

const supabaseUrl = 'https://llswpmdogevsnsrhnsrw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3dwbWRvZ2V2c25zcmhuc3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg0ODQyOSwiZXhwIjoyMDg4NDI0NDI5fQ.6-GC3bxG3MZrywItAY04mqLzwWcKJVWLjFBVDx7ahCk';
  
export const supabase = createClient(supabaseUrl, supabaseKey);


const MASTER_SERVICES = [
  { id: 1, name: 'Corte Degradê', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'hair' },
  { id: 2, name: 'Barba Terapia', defaultPrice: 40, duration: '30min', icon: <User size={20}/>, category: 'beard' },
  { id: 3, name: 'Combo Completo', defaultPrice: 80, duration: '1h 15min', icon: <Star size={20}/>, category: 'combo' },
  { id: 4, name: 'Luzes / Platinado', defaultPrice: 120, duration: '2h', icon: <Sparkles size={20}/>, category: 'chemical' },
  { id: 6, name: 'Design Sobrancelhas', defaultPrice: 35, duration: '30min', icon: <Eye size={20}/>, category: 'eyebrow' },
  { id: 7, name: 'Nail design', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'nail' },
  { id: 8, name: 'Manicure/Pedicure', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'foot' },
  { id: 9, name: 'Limpeza facial', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'face' },
  { id: 10, name: 'Massagem e drenagem', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'dren' },
  { id: 12, name: 'Lash design', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'lash' },
  { id: 13, name: 'Micro Pig Sobrancelha', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'face' },
  { id: 14, name: 'Designer com Henna', defaultPrice: 50, duration: '45min', icon: <Scissors size={20}/>, category: 'face' },
];

const GLOBAL_TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', 
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
  '20:00', '20:30', '21:00', '21:30', '22:00'];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Retorna quantos dias tem o mês
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Formata data como YYYY-MM-DD
const formatDate = (year, month, day) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); 
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled, loading }) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-lg",
    secondary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-900",
    success: "bg-green-600 text-white hover:bg-green-700",
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}>
      {loading ? <Loader2 className="animate-spin" size={20}/> : children}
    </button>
  );
};

const Card = ({ children, selected, onClick }) => (
  <div onClick={onClick} className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? 'border-blue-600 bg-blue-50/50' : 'border-transparent bg-white shadow-sm hover:border-slate-200'}`}>
    {selected && <div className="absolute top-3 right-3 text-blue-600"><CheckCircle2 size={18} fill="currentColor" className="text-white"/></div>}
    {children}
  </div>
);

// ─── CALENDÁRIO REUTILIZÁVEL COM NAVEGAÇÃO DE MÊS ───────────────────────────
const MonthCalendar = ({ availableSlots, selectedDate, onSelectDate, onMonthChange }) => {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(calYear, calMonth);

  const goPrev = () => {
    const d = new Date(calYear, calMonth - 1, 1);
    // Não permite ir para meses anteriores ao atual
    if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCalYear(d.getFullYear());
      setCalMonth(d.getMonth());
      if (onMonthChange) onMonthChange(d.getFullYear(), d.getMonth());
    }
  };

  const goNext = () => {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
    if (onMonthChange) onMonthChange(d.getFullYear(), d.getMonth());
  };

  const isPrevDisabled = calYear === today.getFullYear() && calMonth === today.getMonth();

  return (
    <div>
      {/* Navegação de mês */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          disabled={isPrevDisabled}
          className={`p-2 rounded-full transition-all ${isPrevDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-black text-sm text-slate-900 tracking-tight">
          {MONTH_NAMES[calMonth]} {calYear}
        </span>
        <button
          onClick={goNext}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['D','S','T','Q','Q','S','S'].map((d, i) => (
          <div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(calYear, calMonth, day);
          const daySlots = availableSlots?.[dateStr] || [];
          const isAvailable = daySlots.length > 0;
          const isSelected = selectedDate === dateStr;
          const isPast = new Date(dateStr) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={i}
              disabled={!isAvailable || isPast}
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-bold border transition-all
                ${isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                  : isAvailable && !isPast
                    ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    : 'bg-slate-50 text-slate-200 border-transparent opacity-40 cursor-not-allowed'}`}
            >
              {day}
              {isAvailable && !isSelected && !isPast && (
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── CHAT DE SUPORTE ─────────────────────────────────────────────────────────
const SupportChat = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'support',
      text: `Olá ${user?.name?.split(' ')[0] || 'profissional'}! 👋 Sou do suporte do Salão Digital. Como posso te ajudar hoje?`,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const SUPPORT_WHATSAPP = '5541992931394'; 

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    const sentText = input.trim();
    setInput('');
    setSending(true);

    // Salva mensagem no Supabase (tabela support_messages - opcional)
    try {
      await supabase.from('support_messages').insert([{
        barber_id: user?.id,
        barber_name: user?.name,
        message: sentText,
        created_at: new Date().toISOString()
      }]);
    } catch (_) {}

    // Resposta automática + link WhatsApp
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        from: 'support',
        text: 'Recebi sua mensagem! Para atendimento mais rápido, clique abaixo para falar com nossa equipe no WhatsApp. 💬',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        whatsapp: `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(`Olá! Sou ${user?.name} (Salão Digital). ${sentText}`)}`
      };
      setMessages(prev => [...prev, autoReply]);
      setSending(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header do chat */}
      <div className="p-4 bg-slate-900 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <HeadphonesIcon size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Suporte Salão Digital</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            <p className="text-[10px] text-slate-400">Online agora</p>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      <div className="h-56 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                msg.from === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
              {msg.whatsapp && (
                <a
                  href={msg.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl mt-1"
                >
                  <Phone size={11} /> Abrir WhatsApp do Suporte
                </a>
              )}
              <span className="text-[9px] text-slate-400">{msg.time}</span>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Digite sua dúvida..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0 hover:bg-blue-700 transition-colors active:scale-95"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── POLÍTICA DE PRIVACIDADE ──────────────────────────────────────────────────
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md max-h-[80vh] rounded-3xl p-8 overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-black mb-4">Política de Privacidade</h2>
        <div className="text-xs text-slate-600 space-y-4 leading-relaxed">
          <p><strong>1. Coleta de Dados:</strong> Coletamos seu nome, telefone e localização para facilitar o agendamento de serviços de beleza e calcular a distância até o profissional.</p>
          <p><strong>2. Uso de Localização:</strong> Sua localização é utilizada apenas enquanto o app está em uso para mostrar os profissionais mais próximos.</p>
          <p><strong>3. Exclusão de Conta:</strong> Conforme as normas da App Store, você pode excluir sua conta e todos os seus dados a qualquer momento na aba "Histórico" dentro do seu perfil de cliente.</p>
          <p><strong>4. Compartilhamento:</strong> Seus dados de contato são compartilhados apenas com o profissional escolhido no momento do agendamento.</p>
        </div>
        <Button onClick={onClose} className="mt-8">Entendi</Button>
      </div>
    </div>
  );
};

const WelcomePopup = ({ onClose }) => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative bg-white w-full max-w-[360px] h-[70vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
      <div className="flex-1 w-full overflow-hidden">
        <img src={imgPopup} alt="Bem-vindo" className="w-full h-full object-cover" />
      </div>
      <div className="p-6 bg-white w-full flex items-center justify-center">
        <Button variant="secondary" onClick={onClose} className="w-full py-4 text-lg shadow-xl shadow-blue-600/20">
          Começar Agora
        </Button>
      </div>
    </div>
  </div>
);

const WelcomeScreen = ({ onSelectMode }) => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
      style={{ backgroundImage: `url('/backgr.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-0"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-2xl shadow-blue-900/50">
          <Scissors size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white italic mb-2 tracking-tighter">
          SALÃO<span className="text-blue-500">DIGITAL</span>
        </h1>
        <div className="w-full max-w-xs space-y-3 mt-10">
          <Button variant="secondary" onClick={() => onSelectMode('client')}>Sou Cliente</Button>
          <Button
            variant="outline"
            className="text-white border-white/40 bg-white/5 hover:bg-white/10 backdrop-blur-md"
            onClick={() => onSelectMode('guest')}
          >
            Explorar como Convidado
          </Button>
          <div className="py-2 flex items-center gap-4">
            <div className="h-[1px] bg-white/20 flex-1"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ou</span>
            <div className="h-[1px] bg-white/20 flex-1"></div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none" onClick={() => onSelectMode('barber')}>
            Sou Profissional
          </Button>
          <button
            onClick={() => setShowPrivacy(true)}
            className="mt-6 text-[10px] text-slate-400 underline uppercase tracking-widest font-bold opacity-60 hover:opacity-100"
          >
            Política de Privacidade
          </button>
        </div>
      </div>
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

const AuthScreen = ({ userType, onBack, onLogin, onRegister }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await onLogin(phone, password);
      else await onRegister(name, phone, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm">
        <ChevronLeft size={24} />
      </button>
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-center mb-2">
          {userType === 'barber' ? 'Área Profissional' : 'Área do Cliente'}
        </h2>
        <p className="text-center text-slate-400 mb-6 text-sm">
          {mode === 'login' ? 'Faça login para continuar' : 'Crie sua conta agora'}
        </p>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg">{error}</div>}
        <div className="space-y-4">
          {mode === 'register' && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome Completo"
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" />
          )}
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp (DDD + Número)"
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha"
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" />
          <Button onClick={handleSubmit} loading={loading}>
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </Button>
          <div className="flex items-center gap-2 my-2">
            <div className="h-[1px] bg-slate-200 flex-1"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ou</span>
            <div className="h-[1px] bg-slate-200 flex-1"></div>
          </div>
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="w-full text-blue-600 font-bold text-sm mt-2"
          >
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CLIENT APP ───────────────────────────────────────────────────────────────
const ClientApp = ({ user, barbers, onLogout, onBookingSubmit, appointments, onUpdateStatus, MASTER_SERVICES }) => {
  const [view, setView] = useState('home');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({ service: null, barber: null, price: null, date: null, time: null });
  const [userCoords, setUserCoords] = useState(null);

  // REMOVIDO: useEffect com restaurarSessao que causava erro (setUser/setUserMode/setLoading não existem aqui)

  const handleDeleteAccount = async () => {
    const confirmacao = window.confirm(
      "Deseja realmente excluir sua conta? Todos os seus dados e agendamentos serão apagados permanentemente conforme as diretrizes da App Store."
    );
    if (confirmacao) {
      try {
        const { error: errorApp } = await supabase.from('appointments').delete().eq('client_id', user.id);
        if (errorApp) throw errorApp;
        const { error: errorProf } = await supabase.from('profiles').delete().eq('id', user.id);
        if (errorProf) throw errorProf;
        alert("Sua conta e seus dados foram removidos.");
        onLogout();
      } catch (error) {
        console.error("Erro ao excluir:", error.message);
        alert("Erro ao processar exclusão. Tente novamente.");
      }
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Erro ao obter localização:", err.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const processedBarbers = useMemo(() => {
    return (barbers || [])
      .filter(b => b.is_visible)
      .map(b => {
        const dist = calculateDistance(userCoords?.lat, userCoords?.lng, b.latitude, b.longitude);
        let label = null;
        if (dist !== null) {
          label = dist < 1 ? `${Math.floor(dist * 1000)} m` : `${dist.toFixed(1)} km`;
        }
        return { ...b, distance: dist, distanceLabel: label };
      })
      .sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
  }, [barbers, userCoords]);

  const handleFinish = async () => {
    try {
      if (user?.isGuest) {
        alert("Para realizar um agendamento real, por favor crie sua conta!");
        onLogout();
        return;
      }
      if (!bookingData.date || !bookingData.time) {
        alert("Por favor, selecione o dia e o horário antes de confirmar.");
        return;
      }
      const payload = {
        date: bookingData.date,
        time: bookingData.time,
        barber_id: bookingData.barber?.id,
        client_id: user?.id,
        client_name: user?.name || "Cliente",
        phone: user?.phone || "Sem telefone",
        service_name: bookingData.service?.name || "Serviço",
        price: Number(bookingData.price) || 0,
        status: 'pending'
      };
      if (!payload.barber_id) {
        alert("Erro: O profissional selecionado não foi encontrado. Tente selecioná-lo novamente.");
        return;
      }
      const { error } = await supabase.from('appointments').insert([payload]);
      if (error) throw error;
      setView('success');
    } catch (error) {
      console.error("Erro real ao salvar no banco:", error);
      alert("Falha ao agendar: " + error.message);
    }
  };

  if (view === 'success') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
      <Check size={60} className="text-green-500 mb-4" />
      <h2 className="text-2xl font-bold mb-8">Agendamento Realizado!</h2>
      <Button onClick={() => { setView('home'); setStep(1); }}>Voltar ao Início</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white p-4 flex justify-between items-center border-b shadow-sm sticky top-0 z-20">
        <h1 className="font-black italic">SALÃO<span className="text-blue-600">DIGITAL</span></h1>
        <button onClick={onLogout} className="text-red-500 font-bold text-xs flex items-center gap-1">
          <LogOut size={14}/> {user?.isGuest ? 'Entrar' : 'Sair'}
        </button>
      </header>

      <main className="p-6 max-w-md mx-auto">
        {view === 'home' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
              <h2 className="text-xl font-bold mb-4 italic">Olá, {user.name.split(' ')[0]}</h2>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setView('booking')}>Novo Agendamento</Button>
                <Button variant="outline" className="text-white border-white/20" onClick={() => setView('history')}>Histórico</Button>
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Galeria</h3>
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {[imgMp, imgMao, imgTes].map((img, i) => (
                  <div key={i} className="w-[280px] h-[200px] bg-slate-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                    <img src={img} alt="Galeria" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <button onClick={() => setView('home')} className="text-slate-400 font-bold text-sm mb-4 flex items-center gap-1 hover:text-slate-600 transition-colors">
              <ArrowLeft size={16} /> Voltar
            </button>
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-lg text-slate-900">Meus Agendamentos</h3>
              <button onClick={handleDeleteAccount} className="text-[9px] text-red-400 font-bold uppercase tracking-tighter border-b border-red-100 pb-0.5 hover:text-red-600 transition-colors">
                Excluir Conta
              </button>
            </div>
            {(appointments || []).filter(a => String(a.client_id) === String(user.id)).length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                Ainda não tem agendamentos.
              </div>
            ) : (
              <div className="space-y-3">
                {(appointments || [])
                  .filter(a => String(a.client_id) === String(user.id))
                  .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
                  .map(app => {
                    const professional = (barbers || []).find(b => String(b.id) === String(app.barber_id));
                    return (
                      <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{app.service_name}</p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase">
                              Profissional: {professional?.name || app.barber_name || "Profissional"}
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock size={10} />
                              {app.date ? app.date.split('-').reverse().join('/') : '--/--/--'} às {app.time || '--:--'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm("Deseja reagendar este serviço? O horário atual será cancelado.")) {
                              const serviceObj = MASTER_SERVICES.find(s => s.name === app.service_name);
                              setBookingData({ service: serviceObj, barber: professional, price: app.price });
                              if (typeof onUpdateStatus === 'function') onUpdateStatus(app.id, 'rejected');
                              setView('booking');
                              setStep(3);
                            }
                          }}
                          className="flex flex-col items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <CalendarDays size={20} />
                          <span className="text-[9px] font-bold uppercase">Reagendar</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {view === 'booking' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <button onClick={() => setStep(step - 1)} className={`${step === 1 ? 'hidden' : 'block'} text-slate-400 font-bold text-sm mb-2`}>← Voltar</button>

            {step === 1 && (
              <div className="flex flex-col h-full relative">
                <div className="flex-1 pb-24">
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Escolha o Serviço</h3>
                  <div className="space-y-3">
                    {MASTER_SERVICES.map(s => (
                      <Card key={s.id} selected={bookingData.service?.id === s.id} onClick={() => setBookingData({ ...bookingData, service: s })}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${bookingData.service?.id === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                              {s.icon}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{s.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{s.duration}</p>
                            </div>
                          </div>
                          {bookingData.service?.id === s.id && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
                  <div className="max-w-md mx-auto">
                    <Button
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg ${!bookingData.service ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white shadow-blue-200 active:scale-95'}`}
                      onClick={() => setStep(2)}
                      disabled={!bookingData.service}
                    >
                      {bookingData.service ? `Próximo: Agendar ${bookingData.service.name}` : 'Selecione um serviço'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Escolha o Profissional</h3>
                <p className="text-xs text-slate-400 mb-4">Mostrando preço para: <b>{bookingData.service?.name}</b></p>
                <div className="grid grid-cols-2 gap-3">
                  {processedBarbers
                    .filter(b => b.my_services?.some(s => s.id === bookingData.service?.id))
                    .map((b) => {
                      const displayPrice = b.my_services?.find(s => s.id === bookingData.service?.id)?.price || 0;
                      const isSelected = bookingData.barber?.id === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setBookingData({ ...bookingData, barber: b, price: displayPrice })}
                          className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-slate-900 bg-slate-50' : 'border-white bg-white shadow-sm'}`}
                        >
                          <div className="w-16 h-16 rounded-full bg-slate-200 mb-2 overflow-hidden border border-slate-100">
                            {b.avatar_url ? <img src={b.avatar_url} className="w-full h-full object-cover" alt="avatar" /> : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={24} /></div>
                            )}
                          </div>
                          <p className="font-bold text-sm truncate w-full text-center text-slate-900">{b.name}</p>
                          <div className="flex flex-col items-center mt-1 w-full">
                            {b.address && <p className="text-[9px] text-slate-400 line-clamp-1 text-center px-1 mb-0.5">{b.address}</p>}
                            {b.distanceLabel
                              ? <p className="text-[10px] text-blue-600 font-black flex items-center gap-1"><MapPin size={10}/> {b.distanceLabel}</p>
                              : <p className="text-[10px] text-slate-300 italic">Distância indisponível</p>
                            }
                          </div>
                          <p className="mt-3 text-green-600 font-black text-sm">R$ {displayPrice}</p>
                        </div>
                      );
                    })}
                </div>
                <Button className="mt-6 w-full" onClick={() => setStep(3)} disabled={!bookingData.barber}>Próximo</Button>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-bold text-lg mb-4">Data e Hora</h3>
                <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Selecione um dia disponível</label>

                {/* CALENDÁRIO COM NAVEGAÇÃO DE MÊS */}
                <MonthCalendar
                  availableSlots={bookingData.barber?.available_slots}
                  selectedDate={bookingData.date}
                  onSelectDate={(dateStr) => setBookingData({ ...bookingData, date: dateStr, time: null })}
                />

                <div className="mt-6">
                  {bookingData.date ? (
                    <>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                        Horários para {bookingData.date.split('-').reverse().join('/')}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {GLOBAL_TIME_SLOTS.map(t => {
                          const isSlotAvailable = bookingData.barber?.available_slots?.[bookingData.date]?.includes(t);
                          return (
                            <button
                              key={t}
                              disabled={!isSlotAvailable}
                              onClick={() => setBookingData({ ...bookingData, time: t })}
                              className={`py-2 rounded-lg font-bold text-xs transition-all ${
                                bookingData.time === t ? 'bg-slate-900 text-white shadow-lg scale-105' :
                                isSlotAvailable ? 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400' :
                                'bg-slate-100 text-slate-300 cursor-not-allowed'
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                      <Calendar size={24} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs text-slate-400 font-bold">Selecione um dia acima primeiro</p>
                    </div>
                  )}
                </div>

                {bookingData.time && bookingData.date && (
                  <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 animate-in fade-in zoom-in duration-300">
                    <p className="text-xs text-amber-600 font-bold uppercase mb-1">Resumo</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{bookingData.service?.name}</span>
                      <span className="font-bold text-slate-900">R$ {bookingData.price}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Com {bookingData.barber?.name} às {bookingData.time}</p>
                  </div>
                )}

                <Button className="mt-6 w-full py-4 text-lg" onClick={handleFinish} disabled={!bookingData.time || !bookingData.date}>
                  Confirmar Agendamento
                </Button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── BARBER DASHBOARD ─────────────────────────────────────────────────────────
const BarberDashboard = ({ user, appointments, onUpdateStatus, onLogout, onUpdateProfile, supabase }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isPaying, setIsPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDateConfig, setSelectedDateConfig] = useState(new Date().toISOString().split('T')[0]);
  // Mês do calendário de configuração
  const today = new Date();
  const [configCalYear, setConfigCalYear] = useState(today.getFullYear());
  const [configCalMonth, setConfigCalMonth] = useState(today.getMonth());

  const myAppointments = (appointments || []).filter(a =>
    String(a.barber_id || a.barberId) === String(user.id) && a.status !== 'rejected'
  );
  const pending = myAppointments.filter(a => a.status === 'pending').sort((a, b) =>
    new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );
  const confirmed = myAppointments.filter(a => a.status === 'confirmed');
  const manualAppointments = user.manual_appointments || [];
  const allAppointments = [...confirmed, ...manualAppointments];
  const agendaOrdenada = allAppointments.sort((a, b) =>
    new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );
  const revenue = confirmed.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const status = queryParams.get('status');
    if (status === 'approved' && !user.plano_ativo) {
      alert('Pagamento confirmado! Você agora tem serviços ilimitados.');
      onUpdateProfile({
        ...user,
        plano_ativo: true,
        is_visible: true,
        plano_expiracao: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, onUpdateProfile]);

  const setSlotAvailability = async (date, slot, makeAvailable) => {
    const currentSlots = user.available_slots || {};
    const slotsForDay = currentSlots[date] || [];
    let newSlots;
    if (makeAvailable) {
      if (!slotsForDay.includes(slot)) newSlots = [...slotsForDay, slot].sort();
      else return;
    } else {
      if (slotsForDay.includes(slot)) newSlots = slotsForDay.filter(s => s !== slot);
      else return;
    }
    const updatedAvailableSlots = { ...currentSlots, [date]: newSlots };
    onUpdateProfile({ ...user, available_slots: updatedAvailableSlots });
    try {
      const { error } = await supabase.from('profiles').update({ available_slots: updatedAvailableSlots }).eq('id', user.id);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao salvar no Supabase:", err.message);
    }
  };

  const toggleSlotForDate = async (date, slot) => {
    const currentSlots = { ...(user.available_slots || {}) };
    const slotsForDay = [...(currentSlots[date] || [])];
    const isAvailable = slotsForDay.includes(slot);
    let updatedDaySlots;

    if (isAvailable) {
      const clientName = window.prompt("Reservar este horário?\n\nDigite o nome ou deixe em branco para apenas fechar:");
      if (clientName === null) return;
      updatedDaySlots = slotsForDay.filter(s => s !== slot);
      if (clientName.trim() !== "") {
        const newManualApp = { id: `manual-${Date.now()}`, client: clientName, date, time: slot, status: 'confirmed', isManual: true };
        const updatedManualApps = [...(user.manual_appointments || []), newManualApp];
        onUpdateProfile({ ...user, available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: updatedManualApps });
        await supabase.from('profiles').update({ available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: updatedManualApps }).eq('id', user.id);
        return;
      }
    } else {
      updatedDaySlots = [...slotsForDay, slot];
      const filteredManual = (user.manual_appointments || []).filter(a => !(a.date === date && a.time === slot));
      onUpdateProfile({ ...user, available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: filteredManual });
      await supabase.from('profiles').update({ available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: filteredManual }).eq('id', user.id);
      return;
    }

    const finalSlots = { ...currentSlots, [date]: updatedDaySlots };
    onUpdateProfile({ ...user, available_slots: finalSlots });
    await supabase.from('profiles').update({ available_slots: finalSlots }).eq('id', user.id);
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://salaodigital.onrender.com';
      const response = await fetch(`${API_BASE_URL}/criar-pagamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barberId: user.id, price: 29.90, title: "Plano Profissional - Ilimitado" })
      });
      const data = await response.json();
      if (data.init_point) window.location.href = data.init_point;
      else alert("Erro ao gerar link.");
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar ao pagamento.");
    } finally {
      setIsPaying(false);
    }
  };

  const toggleService = (serviceId, defaultPrice) => {
    const currentServices = user.my_services || [];
    const exists = currentServices.find(s => s.id === serviceId);
    if (!exists && !user.plano_ativo && currentServices.length >= 3) {
      setShowPayModal(true);
      return;
    }
    const newServices = exists
      ? currentServices.filter(s => s.id !== serviceId)
      : [...currentServices, { id: serviceId, price: defaultPrice }];
    onUpdateProfile({ ...user, my_services: newServices });
  };

  const updateServicePrice = (serviceId, newPrice) => {
    const newServices = (user.my_services || []).map(s =>
      s.id === serviceId ? { ...s, price: Number(newPrice) } : s
    );
    onUpdateProfile({ ...user, my_services: newServices });
  };

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('barber-photos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('barber-photos').getPublicUrl(fileName);
      onUpdateProfile({ ...user, avatar_url: publicUrl });
      alert('Foto atualizada!');
    } catch (error) {
      alert('Erro ao carregar foto.');
    }
  };

  // Calendário de configuração com mês dinâmico
  const daysInConfigMonth = getDaysInMonth(configCalYear, configCalMonth);
  const isPrevConfigDisabled = configCalYear === today.getFullYear() && configCalMonth === today.getMonth();

  const goConfigPrev = () => {
    if (!isPrevConfigDisabled) {
      const d = new Date(configCalYear, configCalMonth - 1, 1);
      setConfigCalYear(d.getFullYear());
      setConfigCalMonth(d.getMonth());
    }
  };

  const goConfigNext = () => {
    const d = new Date(configCalYear, configCalMonth + 1, 1);
    setConfigCalYear(d.getFullYear());
    setConfigCalMonth(d.getMonth());
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">

      {showPayModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Libere Serviços Ilimitados</h2>
            <p className="text-slate-500 text-sm mb-6">Você atingiu o limite de <b>3 serviços gratuitos</b>.</p>
            <div className="space-y-3">
              <button className="w-full py-4 bg-green-500 text-white rounded-xl font-bold" onClick={handlePayment} disabled={isPaying}>
                {isPaying ? "Processando..." : "Liberar Tudo (R$ 29,90/mês)"}
              </button>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 text-sm font-bold block w-full">Agora não</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white p-6 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
              {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <User className="w-full h-full p-2 text-slate-400" />}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">Painel {user.plano_ativo ? 'Pro' : 'Grátis'}</h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${user.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{user.is_visible ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <nav className="px-6 py-4 flex gap-2 overflow-x-auto bg-white border-b border-slate-100 sticky top-[80px] z-10">
        {['home', 'services', 'config'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-50'}`}>
            {tab === 'home' ? 'Início' : tab === 'services' ? 'Serviços' : 'Perfil & Agenda'}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-md mx-auto">

        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-wider">Faturamento</p>
                <p className="text-2xl font-black">R$ {revenue}</p>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 tracking-wider">Agendamentos</p>
                <div className="flex gap-2 items-baseline">
                  <p className="text-2xl font-black text-slate-900">{confirmed.length}</p>
                  <span className="text-xs text-orange-500 font-bold">({pending.length} novos)</span>
                </div>
              </div>
            </div>

            <section>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                Novas Solicitações
                {pending.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{pending.length}</span>
                )}
              </h3>
              {pending.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <p className="text-slate-400 text-sm">Nenhuma solicitação nova.</p>
                </div>
              ) : (
                pending
                  .filter((app, index, self) => index === self.findIndex((t) => (t.id || t.client_id) === (app.id || app.client_id)))
                  .map(app => (
                    <div key={app.id || app.client_id} className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 shadow-sm hover:border-blue-100 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-black text-slate-900 leading-none mb-1">{app.client_name || app.client}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{app.service_name || 'Serviço Standard'}</p>
                          <div className="flex items-center gap-1.5 text-blue-600 font-bold mt-2 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                            <Clock size={12} strokeWidth={3} />
                            <span className="text-[10px]">{app.time} • {app.date?.split('-').reverse().join('/')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-sm">R$ {app.price}</p>
                          <span className="text-[8px] text-orange-500 font-black uppercase tracking-tighter">Pendente</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            if (!app.id) return alert("ID inválido.");
                            try {
                              await onUpdateStatus(app.id, 'confirmed');
                              if (app.date && app.time) await setSlotAvailability(app.date, app.time, false);
                              const mensagem = `Olá ${app.client_name || app.client}! Seu agendamento foi CONFIRMADO! ✅%0A📅 ${app.date?.split('-').reverse().join('/')} às ${app.time}`;
                              const fone = app.phone?.toString().replace(/\D/g, '');
                              if (fone) window.location.href = `https://wa.me/55${fone}?text=${mensagem}`;
                            } catch (err) { console.error(err); }
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95"
                        >
                          <CheckCircle size={14} /> Aceitar Solicitação
                        </button>
                        <button
                          onClick={() => onUpdateStatus(app.id, 'rejected')}
                          className="p-3 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </section>

            <section className="mt-8">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" /> Próximos na Agenda
              </h3>
              {agendaOrdenada.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-slate-400 text-sm">Sua agenda está vazia.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {agendaOrdenada
                    .filter((app, index, self) => index === self.findIndex((t) => (t.id || t.client_id) === (app.id || app.client_id)))
                    .map(app => (
                      <div
                        key={app.id || app.client_id}
                        className={`group relative flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${app.isManual ? 'border-amber-200 border-l-4 border-l-amber-500' : 'border-slate-100 border-l-4 border-l-green-500'}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-black text-slate-900 text-sm tracking-tight">{app.client_name || app.client}</p>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${app.isManual ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              {app.isManual ? 'Reserva Manual' : 'Confirmado'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{app.service_name || 'Serviço'}</p>
                            <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                              <Clock size={12} strokeWidth={3} />
                              <span className="text-[10px]">{app.time} • {app.date?.split('-').reverse().join('/')}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja CANCELAR o horário de ${app.client_name || app.client}?`)) {
                              if (app.isManual) {
                                const filtered = (user.manual_appointments || []).filter(m => m.id !== app.id);
                                onUpdateProfile({ ...user, manual_appointments: filtered });
                                supabase.from('profiles').update({ manual_appointments: filtered }).eq('id', user.id);
                                if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
                              } else {
                                onUpdateStatus(app.id, 'rejected');
                                if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
                              }
                            }
                          }}
                          className="flex flex-col items-center justify-center gap-1 ml-4 p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent"
                        >
                          <XCircle size={20} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Cancelar</span>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl mb-4">
              <p className="text-xs text-blue-700 font-medium">
                <span className="font-bold">{user.plano_ativo ? 'Assinatura Profissional Ativa' : `Limite Grátis: ${user.my_services?.length || 0}/3`}</span>
              </p>
            </div>
            {MASTER_SERVICES.map(service => {
              const userServiceData = user.my_services?.find(s => s.id === service.id);
              const isActive = !!userServiceData;
              return (
                <div key={service.id} className={`p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-slate-900 bg-white shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleService(service.id, service.defaultPrice)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>{service.icon}</div>
                      <div>
                        <p className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{service.name}</p>
                        <p className="text-[10px] text-slate-400">{service.duration}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                  {isActive && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">PREÇO (R$)</span>
                      <input type="number" value={userServiceData.price || ''} onChange={(e) => updateServicePrice(service.id, e.target.value)} className="w-24 text-right font-black text-lg bg-slate-50 rounded-md px-2 py-1 outline-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Perfil */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Configurações do Perfil</h3>
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                    {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <User size={40} className="m-auto mt-6 text-slate-300" />}
                  </div>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md">
                    <Camera size={16} />
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Endereço</label>
                  <input type="text" value={user.address || ''} onChange={(e) => onUpdateProfile({ ...user, address: e.target.value })}
                    className="w-full mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-medium" />
                </div>
                <button
                  onClick={() => {
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        onUpdateProfile({ ...user, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                        alert("Localização capturada!");
                      });
                    }
                  }}
                  className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
                >
                  <MapPin size={14} /> Atualizar Localização GPS
                </button>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Loja Visível para Clientes</h3>
                <div onClick={() => onUpdateProfile({ ...user, is_visible: !user.is_visible })} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${user.is_visible ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </section>

            {/* Calendário de disponibilidade com navegação de mês */}
            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div onClick={() => setShowCalendar(!showCalendar)} className="p-5 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20} />
                  <h3 className="font-bold text-sm">Horários Disponíveis</h3>
                </div>
                <ChevronRight size={18} className={`transition-transform ${showCalendar ? 'rotate-90' : ''}`} />
              </div>
              {showCalendar && (
                <div className="p-5">
                  {/* Navegação de mês para config */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={goConfigPrev}
                      disabled={isPrevConfigDisabled}
                      className={`p-2 rounded-full transition-all ${isPrevConfigDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="font-black text-sm text-slate-900">
                      {MONTH_NAMES[configCalMonth]} {configCalYear}
                    </span>
                    <button onClick={goConfigNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['D','S','T','Q','Q','S','S'].map((d, i) => (
                      <div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {Array.from({ length: daysInConfigMonth }, (_, i) => {
                      const day = String(i + 1).padStart(2, '0');
                      const fullDate = formatDate(configCalYear, configCalMonth, i + 1);
                      const isSelected = selectedDateConfig === fullDate;
                      const isAvailable = user.available_slots?.[fullDate]?.length > 0;
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDateConfig(fullDate)}
                          className={`aspect-square rounded-xl text-xs font-bold border transition-all
                            ${isSelected ? 'ring-2 ring-blue-500' : ''}
                            ${isAvailable ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <h4 className="font-bold text-xs mb-4">Slots para {selectedDateConfig.split('-').reverse().join('/')}</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {GLOBAL_TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          onClick={() => toggleSlotForDate(selectedDateConfig, slot)}
                          className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${user.available_slots?.[selectedDateConfig]?.includes(slot) ? 'bg-green-600 text-white border-green-600' : 'bg-white border-slate-200 text-slate-600'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Status do Plano */}
            <div className="pt-2 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-2xl border border-slate-200 w-full">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status do Plano</p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {user.plano_ativo ? 'Assinatura Profissional Ativa ✅' : 'Versão Gratuita'}
                </p>
                {user.plano_ativo && user.plano_expiracao && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    Sua assinatura renova em: <span className="text-blue-600 font-bold">{new Date(user.plano_expiracao).toLocaleDateString('pt-BR')}</span>
                  </p>
                )}
                {!user.plano_ativo && (
                  <button onClick={() => setShowPayModal(true)} className="mt-3 text-blue-600 font-bold text-xs">Fazer Upgrade agora</button>
                )}
              </div>
            </div>

            {/* ── SUPORTE ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <HeadphonesIcon size={16} className="text-slate-500" />
                <h3 className="font-bold text-sm text-slate-900">Falar com Suporte</h3>
              </div>
              <SupportChat user={user} />
            </section>

            <p className="text-[9px] text-slate-400 mt-4 text-center uppercase font-bold tracking-tighter pb-4">
              Salão Digital © 2026 - Todos os direitos reservados
            </p>
          </div>
        )}
      </main>
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

  // ── CORREÇÃO 1: Persistência de sessão (lê localStorage e busca perfil atualizado) ──
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const saved = localStorage.getItem('salao_user_data');
        if (!saved) return;
        const parsedUser = JSON.parse(saved);
        if (!parsedUser?.id || parsedUser?.isGuest) return;

        const { data: freshData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', parsedUser.id)
          .maybeSingle();

        if (freshData) {
          setUser(freshData);
          setCurrentMode(freshData.role);
          localStorage.setItem('salao_user_data', JSON.stringify(freshData));
        }
      } catch (err) {
        console.error("Erro ao restaurar sessão:", err);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Busca barbeiros e agendamentos sempre que o usuário mudar ──
  useEffect(() => {
    const fetchData = async () => {
      const { data: bData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'barber')
        .eq('is_visible', true);
      if (bData) setBarbers(bData);

      if (!user || user.isGuest) return;
      const { data: aData } = await supabase
        .from('appointments')
        .select('*')
        .or(`client_id.eq.${user.id},barber_id.eq.${user.id}`);
      if (aData) {
        const formatted = aData.map(a => ({
          ...a,
          client: a.client_name,
          service: a.service_name,
          time: a.time,
          date: a.date,
          barberId: a.barber_id
        }));
        setAppointments(formatted);
      }
    };
    fetchData();
  }, [user]);

  const handleSelectMode = (mode) => {
    if (mode === 'guest') {
      setUser({ id: 'guest', name: 'Visitante', isGuest: true });
      setCurrentMode('client');
    } else {
      setCurrentMode(mode);
    }
  };

  // ── CORREÇÃO 2: handleLogin salva no localStorage ──
  const handleLogin = async (phone, password) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .eq('password', password)
      .eq('role', currentMode)
      .single();

    if (error || !data) throw new Error('Telefone ou senha incorretos.');

    localStorage.setItem('salao_user_data', JSON.stringify(data)); // ✅ PERSISTÊNCIA
    setUser(data);
  };

  // ── CORREÇÃO 3: handleRegister salva no localStorage ──
  const handleRegister = async (name, phone, password) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        name,
        phone,
        password,
        role: currentMode,
        is_visible: false,
        has_access: false,
        plano_ativo: true,
        my_services: [],
        available_slots: {},
        available_dates: [],
        avatar_url: '',
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Este WhatsApp já está cadastrado!');
      throw new Error(error.message);
    }

    localStorage.setItem('salao_user_data', JSON.stringify(data)); // ✅ PERSISTÊNCIA
    setUser(data);
  };

  const handleBookingSubmit = async (data) => {
    if (user?.isGuest) {
      alert("Modo Convidado: Para realizar um agendamento real, por favor crie uma conta.");
      setUser(null);
      setCurrentMode(null);
      return;
    }
    const newBooking = {
      client_id: user.id,
      client_name: user.name,
      barber_id: data.barber.id,
      barber_name: data.barber.name,
      service_name: data.service.name,
      price: data.price,
      status: 'pending',
      date: data.date,
      phone: data.phone,
      time: data.time
    };
    const { data: saved, error } = await supabase.from('appointments').insert([newBooking]).select().single();
    if (!error && saved) {
      setAppointments(prev => [...prev, {
        ...saved,
        client: saved.client_name,
        service: saved.service_name,
        barberId: saved.barber_id,
      }]);
      alert("Agendamento realizado!");
    } else {
      alert("Erro ao agendar: " + (error?.message || "Erro de conexão"));
    }
  };

  // ── CORREÇÃO 4: handleUpdateStatus filtra por 'id' (não client_id) ──
  const handleUpdateStatus = async (appointmentId, status) => {
    if (user?.isGuest) return;

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId); // ✅ usa 'id', não 'client_id'

    if (!error) {
      if (status === 'rejected') {
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
      } else {
        setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
      }
    } else {
      console.error("Erro ao atualizar status:", error);
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
      };
      const { error } = await supabase.from('profiles').update(dataToSave).eq('id', updatedUser.id);
      if (error) throw error;
      setUser(updatedUser);
      // Atualiza localStorage com dados novos do perfil
      localStorage.setItem('salao_user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Erro completo:", error);
      alert("Erro ao salvar: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('salao_user_data');
    setUser(null);
    setCurrentMode(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sincronizando...</p>
      </div>
    );
  }

  return (
    <>
      {showWelcome && !user && <WelcomePopup onClose={() => setShowWelcome(false)} />}

      {!currentMode && !user && <WelcomeScreen onSelectMode={handleSelectMode} />}

      {currentMode && !user && (
        <AuthScreen
          userType={currentMode}
          onBack={() => setCurrentMode(null)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {user && (
        currentMode === 'barber' ? (
          <BarberDashboard
            user={user}
            appointments={appointments}
            onLogout={handleLogout}
            onUpdateStatus={handleUpdateStatus}
            onUpdateProfile={handleUpdateProfile}
            MASTER_SERVICES={MASTER_SERVICES}
            GLOBAL_TIME_SLOTS={GLOBAL_TIME_SLOTS}
            supabase={supabase}
          />
        ) : (
          <ClientApp
            user={user}
            barbers={barbers}
            appointments={appointments}
            onLogout={handleLogout}
            onBookingSubmit={handleBookingSubmit}
            onUpdateStatus={handleUpdateStatus}
            MASTER_SERVICES={MASTER_SERVICES}
          />
        )
      )}
    </>
  );
}