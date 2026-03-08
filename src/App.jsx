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
  CheckCircle, ArrowLeft 
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

const GLOBAL_TIME_SLOTS = ['08:00', '8:30', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '19:30', '20:00', '21:00'];

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

// --- COMPONENTE DE POLÍTICA DE PRIVACIDADE ---
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
        <img 
          src={imgPopup} 
          alt="Bem-vindo" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 bg-white w-full flex items-center justify-center">
        <Button 
          variant="secondary" 
          onClick={onClose} 
          className="w-full py-4 text-lg shadow-xl shadow-blue-600/20"
        >
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
      style={{
        backgroundImage: `url('/backgr.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
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
          <Button variant="secondary" onClick={() => onSelectMode('client')}>
            Sou Cliente
          </Button>

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

          <Button 
            variant="outline" 
            className="text-white border-white/20 hover:bg-white/5" 
            onClick={() => onSelectMode('barber')}
          >
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

  // Função para Login Social (Google/Apple)
  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
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
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nome Completo" 
              className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" 
            />
          )}
          
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="WhatsApp (DDD + Número)" 
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" 
          />
          
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Senha" 
            className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-blue-500" 
          />
          
          <Button onClick={handleSubmit} loading={loading}>
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </Button>

          {/* Divisor Visual */}
          <div className="flex items-center gap-2 my-2">
            <div className="h-[1px] bg-slate-200 flex-1"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ou entre com</span>
            <div className="h-[1px] bg-slate-200 flex-1"></div>
          </div>

         
          
          <button 
            onClick={() => {setMode(mode === 'login' ? 'register' : 'login'); setError('')}} 
            className="w-full text-blue-600 font-bold text-sm mt-2"
          >
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </div>
      </div>
    </div>
  );
};
const ClientApp = ({ user, barbers, onLogout, onBookingSubmit, appointments, onUpdateStatus, MASTER_SERVICES }) => {
  const [view, setView] = useState('home');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({ service: null, barber: null, price: null, date: null, time: null });
  const [userCoords, setUserCoords] = useState(null);
  useEffect(() => {
  // 1. Verificar se existe usuário salvo localmente ao abrir o app
  const savedUser = localStorage.getItem('salao_user');
  if (savedUser) {
    const userData = JSON.parse(savedUser);
    setUser(userData);
    setUserMode(userData.type); // 'client' ou 'barber'
  }

  // 2. Ouvir mudanças de autenticação do Supabase
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      // Aqui você buscaria os dados do perfil no seu banco e salvaria no localStorage
      // localStorage.setItem('salao_user', JSON.stringify(perfil));
    }
    if (event === 'SIGNED_OUT') {
      localStorage.removeItem('salao_user');
      setUser(null);
    }
  });

  return () => authListener.subscription.unsubscribe();
}, []);

  // --- NOVA FUNÇÃO PARA EXCLUSÃO DE CONTA (REQUISITO APPLE) ---
  const handleDeleteAccount = async () => {
    const confirmacao = window.confirm(
      "Deseja realmente excluir sua conta? Todos os seus dados e agendamentos serão apagados permanentemente conforme as diretrizes da App Store."
    );

    if (confirmacao) {
      try {
        // Deleta agendamentos do cliente
        const { error: errorApp } = await supabase
          .from('appointments')
          .delete()
          .eq('client_id', user.id);

        if (errorApp) throw errorApp;

        // Deleta perfil do cliente
        const { error: errorProf } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (errorProf) throw errorProf;

        alert("Sua conta e seus dados foram removidos.");
        onLogout(); 
      } catch (error) {
        console.error("Erro ao excluir:", error.message);
        alert("Erro ao processar exclusão. Tente novamente.");
      }
    }
  };
  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // Garante que o redirecionamento seja para a URL base atual
          redirectTo: `${window.location.origin}`,
          // Garante que o Google peça a conta sempre, evitando sessões "presas"
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          console.log("📍 Localização do cliente capturada com sucesso!");
        },
        (err) => {
          console.error("❌ Erro ao obter localização:", err.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof fetchBarbers === 'function') fetchBarbers(); 
      if (typeof fetchAppointments === 'function') fetchAppointments();
      console.log("Dados atualizados silenciosamente!");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const processedBarbers = useMemo(() => {
    return (barbers || [])
      .filter(b => b.is_visible)
      .map(b => {
        const dist = calculateDistance(
          userCoords?.lat, 
          userCoords?.lng, 
          b.latitude, 
          b.longitude
        );
        
        let label = null;
        if (dist !== null) {
          if (dist < 1) {
            label = `${Math.floor(dist * 1000)} m`;
          } else {
            label = `${dist.toFixed(1)} km`; 
          }
        }

        return {
          ...b,
          distance: dist,     
          distanceLabel: label 
        };
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

      console.log("Enviando horário para o banco...", payload);

      const { error } = await supabase
        .from('appointments')
        .insert([payload]);

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
      <Button onClick={() => {setView('home'); setStep(1);}}>Voltar ao Início</Button>
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
                <div className="w-[280px] h-[200px] bg-slate-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                  <img src={imgMp} alt="Material" className="w-full h-full object-cover" />
                </div>
                <div className="w-[280px] h-[200px] bg-slate-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                  <img src={imgMao} alt="Mão" className="w-full h-full object-cover" />
                </div>
                <div className="w-[280px] h-[200px] bg-slate-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                  <img src={imgTes} alt="Tesoura" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
  <div className="space-y-4 animate-in slide-in-from-right">
    <button 
      onClick={() => setView('home')} 
      className="text-slate-400 font-bold text-sm mb-4 flex items-center gap-1 hover:text-slate-600 transition-colors"
    >
      <ArrowLeft size={16} /> Voltar
    </button>

    {/* TÍTULO E BOTÃO DE EXCLUIR ALINHADOS */}
    <div className="flex justify-between items-end mb-4">
      <h3 className="font-bold text-lg text-slate-900">Meus Agendamentos</h3>
      <button 
        onClick={handleDeleteAccount}
        className="text-[9px] text-red-400 font-bold uppercase tracking-tighter border-b border-red-100 pb-0.5 hover:text-red-600 transition-colors"
      >
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
                    if(window.confirm("Deseja reagendar este serviço? O horário atual será cancelado.")) {
                      const serviceObj = MASTER_SERVICES.find(s => s.name === app.service_name);
                      setBookingData({
                        service: serviceObj,
                        barber: professional,
                        price: app.price
                      });
                      
                      if (typeof onUpdateStatus === 'function') {
                        onUpdateStatus(app.id, 'rejected');
                      }
                      
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
                <>
                  <h3 className="font-bold text-lg mb-4">Escolha o Serviço</h3>
                  <div className="space-y-3">
                    {MASTER_SERVICES.map(s => (
                      <Card key={s.id} selected={bookingData.service?.id === s.id} onClick={() => setBookingData({...bookingData, service: s})}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">{s.icon}</div>
                            <div>
                                <p className="font-bold">{s.name}</p>
                                <p className="text-xs text-slate-400">{s.duration}</p>
                            </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button className="mt-4 w-full" onClick={() => setStep(2)} disabled={!bookingData.service}>Próximo</Button>
                </>
            )}

            {step === 2 && (
              <>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Escolha o Profissional</h3>
                <p className="text-xs text-slate-400 mb-4">Mostrando preço para: <b>{bookingData.service?.name}</b></p>
                
                <div className="grid grid-cols-2 gap-3">
                  {processedBarbers
                    .filter(b => b.my_services?.some(s => s.id === bookingData.service?.id))
                    .map((b, index) => {
                      const displayPrice = b.my_services?.find(s => s.id === bookingData.service?.id)?.price || 0;
                      const isSelected = bookingData.barber?.id === b.id;
                      
                      return (
                        <div 
                          key={b.id} 
                          onClick={() => setBookingData({...bookingData, barber: b, price: displayPrice})}
                          className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-slate-900 bg-slate-50' : 'border-white bg-white shadow-sm'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-full bg-slate-200 mb-2 overflow-hidden border border-slate-100">
                            {b.avatar_url ? (
                              <img src={b.avatar_url} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User size={24} />
                              </div>
                            )}
                          </div>
                          
                          <p className="font-bold text-sm truncate w-full text-center text-slate-900">{b.name}</p>
                          <div className="flex flex-col items-center mt-1 w-full">
                            {b.address && (
                              <p className="text-[9px] text-slate-400 line-clamp-1 text-center px-1 mb-0.5">
                                {b.address}
                              </p>
                            )}
                            
                            {b.distanceLabel ? (
                              <p className="text-[10px] text-blue-600 font-black flex items-center gap-1">
                                <MapPin size={10}/> {b.distanceLabel}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-300 italic">Distância indisponível</p>
                            )}
                          </div>

                          <p className="mt-3 text-green-600 font-black text-sm">R$ {displayPrice}</p>
                        </div>
                      );
                    })}
                </div>
                <Button className="mt-6 w-full" onClick={() => setStep(3)} disabled={!bookingData.barber}>
                  Próximo
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="font-bold text-lg mb-4">Data e Hora</h3>
                
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Selecione um dia disponível</label>
                
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {['D','S','T','Q','Q','S','S'].map(d => (
                    <div key={d} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>
                  ))}

                  {Array.from({ length: 31 }, (_, i) => {
                   const dia = (i + 1).toString().padStart(2, '0');
                   const dataFormatada = `2026-03-${dia}`; 
                   const daySlots = bookingData.barber?.available_slots?.[dataFormatada] || [];
                   const isAvailable = daySlots.length > 0;
                   const isSelected = bookingData.date === dataFormatada;

                    return (
                      <button
                        key={i}
                        disabled={!isAvailable}
                        onClick={() => setBookingData({...bookingData, date: dataFormatada, time: null})}
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-bold border transition-all
                          ${isSelected 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                            : isAvailable 
                              ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-400' 
                              : 'bg-slate-50 text-slate-200 border-transparent opacity-50 cursor-not-allowed'}`}
                      >
                        {i + 1}
                        {isAvailable && !isSelected && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5"></div>}
                      </button>
                    );
                  })}
                </div>
                
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
                            onClick={() => setBookingData({...bookingData, time: t})} 
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

                <Button 
                  className="mt-6 w-full py-4 text-lg" 
                  onClick={handleFinish} 
                  disabled={!bookingData.time || !bookingData.date}
                >
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

const BarberDashboard = ({ user, appointments, onUpdateStatus, onLogout, onUpdateProfile, supabase }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isPaying, setIsPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDateConfig, setSelectedDateConfig] = useState(new Date().toISOString().split('T')[0]);

  // Filtros de agendamentos
  const myAppointments = (appointments || []).filter(a => 
    String(a.barber_id || a.barberId) === String(user.id) && a.status !== 'rejected'
  );

  const pending = myAppointments.filter(a => a.status === 'pending').sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });

  const confirmed = myAppointments.filter(a => a.status === 'confirmed');
  
  const agendaOrdenada = [...confirmed].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
  });

  const revenue = confirmed.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  // Sincronização e Verificação de Pagamento
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Sincronizando dados...");
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

  // Gerenciamento de Slots
  const setSlotAvailability = async (date, slot, makeAvailable) => {
    const currentSlots = user.available_slots || {};
    const slotsForDay = currentSlots[date] || [];

    let newSlots;
    if (makeAvailable) {
      if (!slotsForDay.includes(slot)) {
        newSlots = [...slotsForDay, slot].sort();
      } else return;
    } else {
      if (slotsForDay.includes(slot)) {
        newSlots = slotsForDay.filter(s => s !== slot);
      } else return;
    }

    const updatedAvailableSlots = { ...currentSlots, [date]: newSlots };
    onUpdateProfile({ ...user, available_slots: updatedAvailableSlots });

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ available_slots: updatedAvailableSlots })
        .eq('id', user.id);
      if (error) throw error;
    } catch (err) {
      console.error("Erro ao salvar no Supabase:", err.message);
    }
  };

  const toggleSlotForDate = async (date, slot) => {
    const currentSlots = user.available_slots || {};
    const slotsForDay = currentSlots[date] || [];
    const isAvailable = slotsForDay.includes(slot);
    await setSlotAvailability(date, slot, !isAvailable);
  };

  const handleDeleteAppointment = async (app) => {
    if(confirm("Deseja realmente excluir este agendamento permanentemente?")) {
        onUpdateStatus(app.id, 'rejected');
        if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
    }
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

    let newServices = exists 
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
      const { error: uploadError } = await supabase.storage
        .from('barber-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('barber-photos')
        .getPublicUrl(fileName);

      onUpdateProfile({ ...user, avatar_url: publicUrl });
      alert('Foto atualizada!');
    } catch (error) {
      alert('Erro ao carregar foto.');
    }
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
            <LogOut size={18}/>
          </button>
        </div>
      </header>

      <nav className="px-6 py-4 flex gap-2 overflow-x-auto bg-white border-b border-slate-100 sticky top-[80px] z-10">
        <button onClick={() => setActiveTab('home')} className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${activeTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-50'}`}>Início</button>
        <button onClick={() => setActiveTab('services')} className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${activeTab === 'services' ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-50'}`}>Serviços</button>
        <button onClick={() => setActiveTab('config')} className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${activeTab === 'config' ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-50'}`}>Perfil & Agenda</button>
      </nav>

      <main className="p-6 max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Faturamento</p>
                <p className="text-2xl font-black">R$ {revenue}</p>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Agendamentos</p>
                <div className="flex gap-2 items-baseline">
                    <p className="text-2xl font-black text-slate-900">{confirmed.length}</p>
                    <span className="text-xs text-orange-500 font-bold">({pending.length} novos)</span>
                </div>
              </div>
            </div>

            <section>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                Novas Solicitações
                {pending.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pending.length}</span>}
              </h3>
              {pending.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-400 text-sm">Nenhuma solicitação nova.</p>
                </div>
              ) : (
                pending.map(app => (
                  <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-slate-900">{app.client}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{app.service_name || 'Serviço'}</p>
                        <div className="flex items-center gap-1 text-blue-600 font-bold text-xs mt-1">
                            <Clock size={12} /> {app.time} - {app.date?.split('-').reverse().join('/')}
                        </div>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">R$ {app.price}</p>
                    </div>
                    <div className="flex gap-2">
                     <button 
  onClick={async () => {
    // Trocamos app.id por app.client_id
    if (!app.client_id) {
      alert("Erro: Este cliente não possui um ID válido.");
      return;
    }

    try {
      // 1. Atualiza usando o client_id
      await onUpdateStatus(app.client_id, 'confirmed'); 
      
      // 2. Ocupa o slot
      if (app.date && app.time) {
        await setSlotAvailability(app.date, app.time, false);
      }
      
      // 3. WhatsApp...
      const mensagem = `Olá ${app.client}! Seu agendamento foi CONFIRMADO! ✅%0A📅 ${app.date?.split('-').reverse().join('/')} às ${app.time}`;
      const fone = app.phone?.toString().replace(/\D/g, '');
      if (fone) window.open(`https://api.whatsapp.com/send?phone=55${fone}&text=${mensagem}`, '_blank');
      
    } catch (err) {
      console.error("Erro na confirmação:", err);
      alert("Falha ao salvar confirmação.");
    }
  }} 
  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
>
  <CheckCircle size={14} /> Aceitar
</button>

{/* Botão REJEITAR */}
<button onClick={() => {
  onUpdateStatus(app.client_id, 'rejected'); // Trocado para client_id
  if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
}} className="p-3 bg-orange-50 text-orange-500 rounded-xl">
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
                  {agendaOrdenada.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border-l-4 border-green-500 shadow-sm">
                       <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-slate-900 text-sm">{app.client}</p>
                            <span className="text-[8px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">Confirmado</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{app.service_name || 'Serviço'}</p>
                          <p className="text-[10px] text-blue-600 font-bold mt-1">{app.time} • {app.date?.split('-').reverse().join('/')}</p>
                       </div>
                       <button 
                        onClick={() => {
                          if(window.confirm(`Deseja CANCELAR o horário de ${app.client}?`)) {
                            onUpdateStatus(app.id, 'rejected');
                            if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
                          }
                        }}
                        className="flex flex-col items-center gap-1 p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <XCircle size={20} />
                        <span className="text-[8px] font-bold uppercase">Cancelar</span>
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
                      <input type="number" value={userServiceData.price || ''} onChange={(e) => updateServicePrice(service.id, e.target.value)} className="w-24 text-right font-black text-lg bg-slate-50 rounded-md px-2 py-1 outline-none"/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6">Configurações do Perfil</h3>
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
                            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <User size={40} className="m-auto mt-6 text-slate-300"/>}
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
                        <input type="text" value={user.address || ''} onChange={(e) => onUpdateProfile({ ...user, address: e.target.value })} className="w-full mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-medium"/>
                    </div>
                    <button onClick={() => {
                        if ("geolocation" in navigator) {
                            navigator.geolocation.getCurrentPosition((pos) => {
                                onUpdateProfile({ ...user, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                                alert("Localização capturada!");
                            });
                        }
                    }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                        <MapPin size={14} /> Atualizar Localização GPS
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Loja Visível para Clientes</h3>
                    <div onClick={() => onUpdateProfile({ ...user, is_visible: !user.is_visible })} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${user.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${user.is_visible ? 'translate-x-6' : 'translate-x-0'}`}/>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <div onClick={() => setShowCalendar(!showCalendar)} className="p-5 flex items-center justify-between bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <CalendarDays size={20} />
                        <h3 className="font-bold text-sm">Horários Disponíveis</h3>
                    </div>
                    <ChevronRight size={18} className={showCalendar ? 'rotate-90' : ''} />
                </div>
                {showCalendar && (
                    <div className="p-5">
                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {Array.from({ length: 31 }, (_, i) => {
                                const day = String(i + 1).padStart(2, '0');
                                const fullDate = `2026-03-${day}`; 
                                const isSelected = selectedDateConfig === fullDate;
                                const isAvailable = user.available_slots?.[fullDate]?.length > 0;
                                return (
                                    <button key={i} onClick={() => setSelectedDateConfig(fullDate)} className={`aspect-square rounded-xl text-xs font-bold border transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isAvailable ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                            <h4 className="font-bold text-xs mb-4">Slots para {selectedDateConfig.split('-').reverse().join('/')}</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {GLOBAL_TIME_SLOTS.map(slot => (
                                    <button key={slot} onClick={() => toggleSlotForDate(selectedDateConfig, slot)} className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${user.available_slots?.[selectedDateConfig]?.includes(slot) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600'}`}>
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className="pt-4 text-center">
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
               <p className="text-[9px] text-slate-400 mt-6 uppercase font-bold tracking-tighter">Salão Digital © 2026 - Todos os direitos reservados</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default function App() {
  const [currentMode, setCurrentMode] = useState(null); 
  const [user, setUser] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);

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
  const handleLogin = async (phone, password) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .eq('password', password)
      .eq('role', currentMode)
      .single();

    if (error || !data) throw new Error('Telefone ou senha incorretos.');
    setUser(data);
  };

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
        my_services: [],
        available_slots: GLOBAL_TIME_SLOTS,
        available_dates: [], 
        avatar_url: '',
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Este WhatsApp já está cadastrado!');
      throw new Error(error.message);
    }

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

    const { data: saved, error } = await supabase
      .from('appointments')
      .insert([newBooking])
      .select()
      .single();

    if (!error && saved) {
      setAppointments(prev => [...prev, {
        ...saved,
        client: saved.client_name,
        service: saved.service_name,
        barberId: saved.barber_id,
        barber_name: saved.barber_name,
        time: saved.time,
        date: saved.date,
        phone: saved.phone
      }]);
      alert("Agendamento realizado!");
    } else {
      console.error("Erro detalhado:", error);
      alert("Erro ao agendar: " + (error?.message || "Erro de conexão"));
    }
  };

  const handleUpdateStatus = async (clientId, status) => { // Nomeamos como clientId para clareza
  if (user?.isGuest) return; 

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('client_id', clientId); // FILTRO PELA COLUNA CLIENT_ID

  if (!error) {
    if (status === 'rejected') {
      setAppointments(prev => prev.filter(a => a.client_id !== clientId));
    } else {
      setAppointments(prev => prev.map(a => a.client_id === clientId ? { ...a, status } : a));
    }
  } else {
    console.error("Erro 400 resolvido:", error);
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
        available_slots: updatedUser.available_slots 
      };

      const { error } = await supabase
        .from('profiles')
        .update(dataToSave)
        .eq('id', updatedUser.id);

      if (error) throw error;
      setUser(updatedUser);
    } catch (error) {
      console.error("Erro completo:", error);
      alert("Erro ao salvar: " + error.message);
    }
  };
  return (
    <>
      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}

      {(!currentMode && !user) ? (
        <WelcomeScreen onSelectMode={handleSelectMode} />
      ) : !user ? (
        <AuthScreen 
          userType={currentMode} 
          onBack={() => setCurrentMode(null)} 
          onLogin={handleLogin} 
          onRegister={handleRegister} 
        />
      ) : currentMode === 'barber' ? (
        <BarberDashboard 
          user={user} 
          appointments={appointments} 
          onLogout={() => { setUser(null); setCurrentMode(null); }} 
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
          onLogout={() => { setUser(null); setCurrentMode(null); }}
          onBookingSubmit={handleBookingSubmit}
          onUpdateStatus={handleUpdateStatus}
          MASTER_SERVICES={MASTER_SERVICES}
        />
      )}
    </>
  );
}