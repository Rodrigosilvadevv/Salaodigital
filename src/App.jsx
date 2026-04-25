import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  CheckCircle, ArrowLeft, Send, Headphones, Copy, Link, Image, Shield, Award, Zap, ExternalLink,
  BarChart2, TrendingUp, Moon, Sun, ScanLine, Video, VideoOff, RefreshCw, PlusCircle, X,
  Gift, QrCode, Type, FileText
} from 'lucide-react';

const APP_VERSION = 'v6.0';

const supabaseUrl = 'https://llswpmdogevsnsrhnsrw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3dwbWRvZ2V2c25zcmhuc3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjg0ODQyOSwiZXhwIjoyMDg4NDI0NDI5fQ.6-GC3bxG3MZrywItAY04mqLzwWcKJVWLjFBVDx7ahCk';
export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── DARK MODE — CSS VARS INTELIGENTE ─────────────────────────────────────────
const injectDarkModeCSS = (isDark) => {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  let styleEl = document.getElementById('dm-override');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dm-override';
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    *, *::before, *::after {
      transition: background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease, box-shadow 0.25s ease !important;
    }

    :root {
      --c-bg: #f8fafc;
      --c-surface: #ffffff;
      --c-surface2: #f1f5f9;
      --c-border: #e2e8f0;
      --c-border2: #cbd5e1;
      --c-text: #0f172a;
      --c-text2: #475569;
      --c-muted: #94a3b8;
      --c-shadow: rgba(0,0,0,0.08);
      --c-shadow-xl: rgba(0,0,0,0.15);
    }

    [data-theme="dark"] {
      --c-bg: #0f172a;
      --c-surface: #1e293b;
      --c-surface2: #273548;
      --c-border: #334155;
      --c-border2: #475569;
      --c-text: #f1f5f9;
      --c-text2: #cbd5e1;
      --c-muted: #64748b;
      --c-shadow: rgba(0,0,0,0.4);
      --c-shadow-xl: rgba(0,0,0,0.6);
    }

    [data-theme="dark"] body { background-color: #0f172a !important; }
    [data-theme="dark"] .bg-white { background-color: #1e293b !important; }
    [data-theme="dark"] .bg-slate-50 { background-color: #0f172a !important; }
    [data-theme="dark"] .bg-slate-100 { background-color: #1e293b !important; }
    [data-theme="dark"] .bg-slate-200 { background-color: #273548 !important; }
    [data-theme="dark"] .text-slate-900 { color: #f1f5f9 !important; }
    [data-theme="dark"] .text-slate-800 { color: #e2e8f0 !important; }
    [data-theme="dark"] .text-slate-700 { color: #cbd5e1 !important; }
    [data-theme="dark"] .text-slate-600 { color: #94a3b8 !important; }
    [data-theme="dark"] .text-slate-500 { color: #64748b !important; }
    [data-theme="dark"] .border-slate-100 { border-color: #334155 !important; }
    [data-theme="dark"] .border-slate-200 { border-color: #334155 !important; }
    [data-theme="dark"] .shadow-sm { box-shadow: 0 1px 3px rgba(0,0,0,0.5) !important; }
    [data-theme="dark"] .shadow-xl { box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important; }
    [data-theme="dark"] .bg-amber-50 { background-color: #1c1a0e !important; }
    [data-theme="dark"] .bg-blue-50 { background-color: #0c1929 !important; }
    [data-theme="dark"] .bg-green-50 { background-color: #0a1f12 !important; }
    [data-theme="dark"] .bg-purple-50 { background-color: #150d1f !important; }
    [data-theme="dark"] .bg-red-50 { background-color: #1f0d0d !important; }
    [data-theme="dark"] input, [data-theme="dark"] select, [data-theme="dark"] textarea {
      background-color: #273548 !important;
      color: #f1f5f9 !important;
      border-color: #334155 !important;
    }
    [data-theme="dark"] input::placeholder { color: #64748b !important; }
  `;
};

// ─── SCANNER CSS ──────────────────────────────────────────────────────────────
const injectScannerCSS = () => {
  if (document.getElementById('scanner-css')) return;
  const style = document.createElement('style');
  style.id = 'scanner-css';
  style.textContent = `
    @keyframes scanLine {
      0%   { top: 5%; opacity: 1; }
      49%  { opacity: 1; }
      50%  { top: 90%; opacity: 0.8; }
      100% { top: 5%; opacity: 1; }
    }
    @keyframes scanPulse {
      0%, 100% { border-color: rgba(59,130,246,0.5); }
      50% { border-color: rgba(59,130,246,0.9); }
    }
    .scan-line {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, #60a5fa 20%, #93c5fd 50%, #60a5fa 80%, transparent 100%);
      box-shadow: 0 0 14px 4px rgba(96,165,250,0.7);
      animation: scanLine 2s ease-in-out infinite;
      z-index: 10; pointer-events: none;
    }
    .scan-overlay-border {
      position: absolute; inset: 0;
      border: 2px solid rgba(59,130,246,0.4); border-radius: 12px;
      animation: scanPulse 2s ease-in-out infinite; pointer-events: none;
    }
    .scan-corner { position: absolute; width: 20px; height: 20px; border-color: #3b82f6; border-style: solid; opacity: 0.9; }
    .scan-corner-tl { top: 6px; left: 6px; border-width: 3px 0 0 3px; border-radius: 3px 0 0 0; }
    .scan-corner-tr { top: 6px; right: 6px; border-width: 3px 3px 0 0; border-radius: 0 3px 0 0; }
    .scan-corner-bl { bottom: 6px; left: 6px; border-width: 0 0 3px 3px; border-radius: 0 0 0 3px; }
    .scan-corner-br { bottom: 6px; right: 6px; border-width: 0 3px 3px 0; border-radius: 0 0 3px 0; }
    @keyframes storyPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
    .story-ring-animated { animation: storyPulse 3s ease-in-out infinite; }
    @keyframes goalPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); } 70% { box-shadow: 0 0 0 12px rgba(251,191,36,0); } }
    .goal-pulse { animation: goalPulse 2s ease-in-out infinite; }
  `;
  document.head.appendChild(style);
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const generateSlug = (name, id) => {
  const normalized = name
    .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
  return `${normalized}-${String(id).slice(-4)}`;
};

const getPublicUrl = (slug) => `${window.location.origin}/${slug}`;

// ─── PHONE MASK ───────────────────────────────────────────────────────────────
const applyPhoneMask = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
};

const getPhoneDigits = (phone) => phone.replace(/\D/g, '');

// ─── IMAGE PREPROCESSOR — "FILTRO MÁGICO" ────────────────────────────────────
const preprocessImage = (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parâmetros do filtro
      const contrastFactor = 2.4;  // Aumenta contraste entre texto e fundo
      const brightnessDelta = -30; // Escurece levemente para texto aparecer mais
      const threshold = 145;       // Limiar de binarização (preto ou branco)

      for (let i = 0; i < data.length; i += 4) {
        // 1. Converte para escala de cinza (luminância perceptiva)
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // 2. Aplica contraste e brilho
        let val = (gray - 128) * contrastFactor + 128 + brightnessDelta;
        val = Math.max(0, Math.min(255, val));
        // 3. Binariza: tudo acima do threshold vira branco, abaixo vira preto
        val = val > threshold ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        // Canal alpha inalterado
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(imageSrc); // fallback
    img.src = imageSrc;
  });
};

// ─── PARSER OCR — REGEX EM PORTUGUÊS ──────────────────────────────────────────
const parseOCRResult = (text) => {
  if (!text) return { date: '', time: '', clientName: '', phone: '', service: '' };

  // Data: DD/MM, DD/MM/AAAA, DD-MM-AAAA, DD.MM.AAAA
  const dateRegex = /\b(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{2,4}))?\b/;
  const dateMatch = text.match(dateRegex);
  let date = '';
  if (dateMatch) {
    const d = dateMatch[1].padStart(2, '0');
    const m = dateMatch[2].padStart(2, '0');
    const y = dateMatch[3]
      ? (dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3])
      : new Date().getFullYear().toString();
    date = `${d}/${m}/${y}`;
  }

  // Horário: HH:MM (formato 24h ou 12h)
  const timeRegex = /\b([01]?\d|2[0-3]):([0-5]\d)\b/;
  const timeMatch = text.match(timeRegex);
  const time = timeMatch
    ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`
    : '';

  // Telefone: vários formatos brasileiros
  const phoneRegex = /(?:\(?\d{2}\)?\s?)?(?:9\s?\d{4}|\d{4})\s?[-]?\s?\d{4}/g;
  const phoneMatches = [...text.matchAll(phoneRegex)];
  const phone = phoneMatches.length > 0
    ? phoneMatches[0][0].replace(/\s/g, '')
    : '';

  // Nome do cliente: após palavras-chave ou linha capitalizada
  const nameKeywordRegex = /(?:nome|cliente|paciente|para|com)\s*:?\s*([A-ZÀ-Úa-zà-ú][a-zà-ú]+(?:\s+[A-ZÀ-Úa-zà-ú][a-zà-ú]+){0,3})/i;
  const nameCapRegex = /^([A-ZÀ-Ú][a-zà-ú]{2,}(?:\s+[A-ZÀ-Ú][a-zà-ú]{2,})+)$/m;
  const nameKeyMatch = text.match(nameKeywordRegex);
  const nameCapMatch = text.match(nameCapRegex);
  const clientName = nameKeyMatch
    ? nameKeyMatch[1].trim()
    : (nameCapMatch ? nameCapMatch[1].trim() : '');

  // Serviço: verifica contra lista de serviços cadastrados
  const lowerText = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let service = '';
  for (const s of MASTER_SERVICES) {
    const normalized = s.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Verifica ao menos 5 chars da palavra-chave
    const keyword = normalized.split(' ')[0].slice(0, 5);
    if (keyword.length >= 4 && lowerText.includes(keyword)) {
      service = s.name;
      break;
    }
  }

  // Fallback: procura após "serviço:", "procedimento:", "atend:"
  if (!service) {
    const svcKeyRegex = /(?:servi[cç]o|procedimento|atend|trat)\s*:?\s*(.{3,30})/i;
    const svcMatch = text.match(svcKeyRegex);
    if (svcMatch) service = svcMatch[1].trim().split('\n')[0];
  }

  return { date, time, clientName, phone, service };
};

const MASTER_SERVICES = [
  { id: 1, name: 'Corte Degradê', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'hair' },
  { id: 2, name: 'Barba Terapia', defaultPrice: 40, duration: '30min', icon: <User size={20} />, category: 'beard' },
  { id: 3, name: 'Combo Completo', defaultPrice: 80, duration: '1h 15min', icon: <Star size={20} />, category: 'combo' },
  { id: 4, name: 'Luzes / Platinado', defaultPrice: 120, duration: '2h', icon: <Sparkles size={20} />, category: 'chemical' },
  { id: 6, name: 'Design Sobrancelhas', defaultPrice: 35, duration: '30min', icon: <Eye size={20} />, category: 'eyebrow' },
  { id: 7, name: 'Nail design', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'nail' },
  { id: 8, name: 'Manicure/Pedicure', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'foot' },
  { id: 9, name: 'Limpeza facial', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'face' },
  { id: 10, name: 'Massagem e drenagem', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'dren' },
  { id: 12, name: 'Lash design', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'lash' },
  { id: 13, name: 'Micro Pig Sobrancelha', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'face' },
  { id: 14, name: 'Designer com Henna', defaultPrice: 50, duration: '45min', icon: <Scissors size={20} />, category: 'face' },
];

const GLOBAL_TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00'
];

const MONTH_NAMES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

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
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1));
};

// ─── BADGES ───────────────────────────────────────────────────────────────────
const getBadges = (barber) => {
  const badges = [];
  const services = barber.my_services || [];
  const slots = barber.available_slots || {};
  const totalSlots = Object.values(slots).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  if (barber.plano_ativo) badges.push({ label: 'Pro', color: 'bg-blue-600 text-white', icon: <Zap size={9} /> });
  if (services.length >= 5) badges.push({ label: 'Especialista', color: 'bg-purple-600 text-white', icon: <Award size={9} /> });
  if (totalSlots >= 20) badges.push({ label: 'Agenda Cheia', color: 'bg-green-600 text-white', icon: <Calendar size={9} /> });
  if (barber.avatar_url && barber.address) badges.push({ label: 'Verificado', color: 'bg-slate-900 text-white', icon: <Shield size={9} /> });
  return badges;
};

const BadgeList = ({ barber, small }) => {
  const badges = getBadges(barber);
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {badges.map((b, i) => (
        <span key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full font-bold ${small ? 'text-[8px]' : 'text-[9px]'} ${b.color}`}>
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
};

// ─── RATING ───────────────────────────────────────────────────────────────────
const getBarberRating = (barber) => {
  const badges = getBadges(barber);
  const serviceCount = (barber.my_services || []).length;
  let score = 3.5;
  if (barber.plano_ativo) score += 0.5;
  if (barber.avatar_url) score += 0.3;
  if (barber.address) score += 0.2;
  if (serviceCount >= 5) score += 0.3;
  if (badges.find(b => b.label === 'Verificado')) score += 0.2;
  return Math.min(5, parseFloat(score.toFixed(1)));
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M5 1l1.12 2.27 2.51.36-1.82 1.77.43 2.5L5 6.77l-2.24 1.13.43-2.5L1.37 3.63l2.51-.36z"
            fill={i < full ? '#f59e0b' : (i === full && half ? 'url(#half)' : '#e2e8f0')}
            stroke={i < full || (i === full && half) ? '#f59e0b' : '#cbd5e1'} strokeWidth="0.5" />
          {i === full && half && (
            <defs><linearGradient id="half"><stop offset="50%" stopColor="#f59e0b" /><stop offset="50%" stopColor="#e2e8f0" /></linearGradient></defs>
          )}
        </svg>
      ))}
    </div>
  );
};

// ─── STORY RING ───────────────────────────────────────────────────────────────
const StoryRing = ({ rating, size = 72, children, animate = false }) => {
  const pct = Math.min(1, rating / 5);
  const strokeW = 3;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const ringColor = rating >= 4.5 ? '#f59e0b' : rating >= 4.0 ? '#3b82f6' : rating >= 3.5 ? '#10b981' : '#94a3b8';
  const ratingBg = rating >= 4.5 ? 'bg-amber-500' : rating >= 4.0 ? 'bg-blue-600' : rating >= 3.5 ? 'bg-green-600' : 'bg-slate-500';
  return (
    <div className={`relative inline-flex items-center justify-center ${animate ? 'story-ring-animated' : ''}`} style={{ width: size, height: size }}>
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeW} opacity="0.4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringColor} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ filter: `drop-shadow(0 0 4px ${ringColor}88)` }} />
      </svg>
      <div style={{ width: size - strokeW * 4, height: size - strokeW * 4 }} className="rounded-full overflow-hidden">
        {children}
      </div>
      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 ${ratingBg} text-white rounded-full text-[8px] font-black px-1.5 py-0.5 shadow-lg border border-white leading-none whitespace-nowrap`}>
        ★ {rating}
      </div>
    </div>
  );
};

// ─── DARK MODE TOGGLE ─────────────────────────────────────────────────────────
const DarkModeToggle = ({ isDark, onToggle }) => (
  <button onClick={onToggle} title={isDark ? 'Modo Claro' : 'Modo Escuro'}
    className="relative flex-shrink-0 transition-all active:scale-90" style={{ width: 34, height: 34 }}>
    <div className={`w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-md
      ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300 shadow-yellow-200'}`}>
      {isDark
        ? <Moon size={15} className="text-blue-300" />
        : <Sun size={15} className="text-yellow-500" />}
    </div>
    {/* Indicador animado */}
    <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white transition-all duration-500
      ${isDark ? 'bg-blue-400' : 'bg-yellow-400'}`} />
  </button>
);

// ─── GOAL CARD — META DOS 30 ATENDIMENTOS ─────────────────────────────────────
const GoalCard = ({ totalAppointments, slug, isGuest }) => {
  const META_GOAL = 30;
  const progress = Math.min(100, Math.round((totalAppointments / META_GOAL) * 100));
  const achieved = totalAppointments >= META_GOAL;
  const remaining = META_GOAL - totalAppointments;
  const publicUrl = getPublicUrl(slug || 'profissional');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}&bgcolor=fffbeb&color=92400e&margin=4&qzone=1`;
  const SUPPORT_WHATSAPP = '5541992931394';

  return (
    <div className={`rounded-3xl border-2 overflow-hidden transition-all ${
      achieved
        ? 'border-amber-400 shadow-xl shadow-amber-100'
        : 'border-slate-200 bg-white shadow-sm'
    }`}>
      {/* Header */}
      <div className={`p-4 flex items-center gap-3 ${achieved ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-white'}`}>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${achieved ? 'bg-white/20' : 'bg-amber-100'}`}>
          {achieved
            ? <Gift size={20} className="text-white" />
            : <Award size={20} className="text-amber-500" />}
        </div>
        <div className="flex-1">
          <p className={`font-black text-sm ${achieved ? 'text-white' : 'text-slate-900'}`}>
            Meta dos {META_GOAL} Atendimentos
          </p>
          <p className={`text-[10px] font-bold ${achieved ? 'text-white/80' : 'text-slate-400'}`}>
            {achieved ? '🎉 Parabéns! Você desbloqueou recompensas!' : 'Complete e ganhe prêmios exclusivos!'}
          </p>
        </div>
        {achieved && <span className="text-white text-xl">🏆</span>}
      </div>

      <div className="p-4 bg-white space-y-3">
        {/* Barra de progresso */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500">Progresso</span>
            <span className="text-[10px] font-black text-slate-900">{totalAppointments}/{META_GOAL}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${achieved ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-blue-400 to-blue-600'} ${achieved ? 'goal-pulse' : ''}`}
              style={{ width: `${progress}%` }}
            />
            {/* Milestones */}
            {[25, 50, 75].map(pct => (
              <div key={pct} className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={{ left: `${pct}%` }} />
            ))}
          </div>
          {!achieved && (
            <p className="text-[9px] text-slate-400 mt-1 text-center">
              Faltam {remaining} atendimento{remaining !== 1 ? 's' : ''} para desbloquear!
            </p>
          )}
        </div>

        {/* Prêmios */}
        <div className={`rounded-2xl p-3 border ${achieved ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
          <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${achieved ? 'text-amber-600' : 'text-slate-400'}`}>
            Recompensas ao atingir
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className={`rounded-xl p-2.5 text-center border ${achieved ? 'bg-white border-amber-200' : 'bg-white border-slate-200 opacity-50'}`}>
              <p className="text-xl mb-1">📱</p>
              <p className="text-[9px] font-black text-slate-700 leading-tight">3 Cabos de Carregamento</p>
              <p className="text-[8px] text-slate-400 mt-0.5">Tipo-C ou iPhone</p>
            </div>
            <div className={`rounded-xl p-2.5 text-center border ${achieved ? 'bg-white border-amber-200' : 'bg-white border-slate-200 opacity-50'}`}>
              <p className="text-xl mb-1">🖨️</p>
              <p className="text-[9px] font-black text-slate-700 leading-tight">QR Code Personalizado</p>
              <p className="text-[8px] text-slate-400 mt-0.5">Com seu link</p>
            </div>
          </div>
        </div>

        {/* QR Code e resgate — só aparece se atingiu */}
        {achieved && !isGuest && (
          <div className="space-y-3">
            <div className="flex flex-col items-center bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3">Seu QR Code Exclusivo</p>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-36 h-36 rounded-2xl border-4 border-amber-200 shadow-lg"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <p className="text-[9px] text-amber-600 font-bold mt-2 text-center break-all">{publicUrl}</p>
            </div>
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
                `Olá! Atingi a meta de ${META_GOAL} atendimentos no Salão Digital! Gostaria de resgatar minhas recompensas.\n\nMeu link: ${publicUrl}`
              )}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white rounded-xl font-black text-sm active:scale-95 transition-all shadow-lg shadow-green-100"
            >
              <Phone size={15} /> Resgatar Prêmio no WhatsApp
            </a>
          </div>
        )}

        {achieved && isGuest && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <p className="text-xs text-amber-700 font-bold">Faça login para resgatar seus prêmios!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── WEBCAM SCANNER com preprocessImage + OCR parsing ─────────────────────────
const WebcamScanner = ({ onScanResult }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [preprocessed, setPreprocessed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const startCamera = async () => {
    setError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      setCameraActive(true);
    } catch (err) { setError('Câmera não disponível: ' + err.message); }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null); setCameraActive(false); setScanning(false);
    setRawText(''); setParsedData(null); setProgress(0); setPreviewSrc('');
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);

    // Imagem original
    const rawImageData = canvas.toDataURL('image/jpeg', 0.92);

    setScanning(true); setProgress(5); setRawText(''); setParsedData(null);

    try {
      // ── ETAPA 1: Pré-processamento (Filtro Mágico)
      setProgress(15);
      const processedImageData = await preprocessImage(rawImageData);
      setPreviewSrc(processedImageData);
      setPreprocessed(true);
      setProgress(25);

      // ── ETAPA 2: OCR com Tesseract
      const TesseractModule = await import('tesseract.js').catch(() => null);
      if (!TesseractModule) {
        setRawText('⚠️ Instale tesseract.js:\nnpm install tesseract.js');
        const fakeText = 'João Silva\n14/06/2025\n14:30\nCorte Degradê\n(41) 99999-1234';
        setParsedData(parseOCRResult(fakeText));
        setProgress(100); setScanning(false); return;
      }

      const { createWorker } = TesseractModule;
      setProgress(30);

      const worker = await createWorker(['por', 'eng'], 1, {
        logger: m => {
          if (m.status === 'recognizing text') setProgress(30 + Math.round(m.progress * 60));
        }
      });

      // Reconhece a imagem pré-processada (melhor contraste = mais precisão)
      const { data: { text } } = await worker.recognize(processedImageData);
      await worker.terminate();

      setProgress(100);
      const cleanText = text.trim();
      setRawText(cleanText || 'Nenhum texto detectado. Tente aproximar o caderno e melhorar a iluminação.');

      // ── ETAPA 3: Parsing com regex
      const parsed = parseOCRResult(cleanText);
      setParsedData(parsed);

    } catch (err) {
      setRawText('Erro no OCR: ' + err.message);
      setProgress(0);
    } finally {
      setScanning(false);
    }
  };

  const handleSaveBooking = () => {
    if (!parsedData) return;
    if (!parsedData.date || !parsedData.time) {
      alert('Data e horário são obrigatórios para salvar o agendamento.');
      return;
    }
    if (onScanResult) onScanResult(parsedData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  useEffect(() => {
    injectScannerCSS();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-900 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <ScanLine size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">Scanner de Caderno</p>
          <p className="text-[10px] text-slate-400">Filtro mágico + leitura em português</p>
        </div>
        {cameraActive && (
          <button onClick={stopCamera} className="p-2 bg-red-600/20 rounded-xl">
            <VideoOff size={16} className="text-red-400" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold">{error}</div>}

        {!cameraActive ? (
          <button onClick={startCamera}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-100">
            <Video size={18} /> Abrir Câmera
          </button>
        ) : (
          <div className="space-y-3">
            {/* Câmera */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900" style={{ aspectRatio: '16/9' }}>
              <video ref={videoRef} playsInline muted autoPlay className="w-full h-full object-cover" />
              {scanning && (
                <>
                  <div className="scan-line" />
                  <div className="scan-overlay-border" />
                  <div className="scan-corner scan-corner-tl" /><div className="scan-corner scan-corner-tr" />
                  <div className="scan-corner scan-corner-bl" /><div className="scan-corner scan-corner-br" />
                  <div className="absolute inset-0 flex items-end justify-center pb-4">
                    <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">
                        {progress < 25 ? '🔍 Aplicando filtro mágico...' : `📖 Lendo texto... ${progress}%`}
                      </p>
                      <div className="w-full h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!scanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-dashed border-white/30 rounded-xl w-3/4 h-2/3 flex items-center justify-center">
                    <p className="text-white/50 text-[10px] font-bold text-center px-4">Posicione o caderno aqui</p>
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Preview do filtro */}
            {previewSrc && (
              <div className="rounded-xl overflow-hidden border border-blue-200">
                <button onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-3 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase flex items-center gap-2">
                  <Eye size={12} /> {showPreview ? 'Ocultar' : 'Ver'} imagem após filtro mágico
                </button>
                {showPreview && <img src={previewSrc} alt="Pré-processada" className="w-full" />}
              </div>
            )}

            <button onClick={captureAndScan} disabled={scanning}
              className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50">
              {scanning
                ? <><Loader2 size={16} className="animate-spin" /> Processando...</>
                : <><ScanLine size={16} /> Escanear Caderno</>}
            </button>
          </div>
        )}

        {/* Texto bruto */}
        {rawText && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={12} className="text-slate-400" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Texto detectado</p>
            </div>
            <pre className="text-[10px] text-slate-600 whitespace-pre-wrap font-mono leading-relaxed max-h-24 overflow-y-auto">{rawText}</pre>
            <button onClick={() => { setRawText(''); setParsedData(null); setProgress(0); setPreviewSrc(''); }}
              className="mt-2 text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <RefreshCw size={10} /> Limpar
            </button>
          </div>
        )}

        {/* ── DADOS EXTRAÍDOS + FORMULÁRIO EDITÁVEL ── */}
        {parsedData && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-blue-600" />
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Dados Extraídos — Edite se necessário</p>
            </div>

            {/* Data — obrigatório */}
            <div>
              <label className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase mb-1">
                <span>📅 Data</span>
                <span className="text-red-500 font-black">* Obrigatório</span>
              </label>
              <input type="text"
                value={parsedData.date}
                onChange={e => setParsedData({ ...parsedData, date: e.target.value })}
                placeholder="DD/MM/AAAA"
                className={`w-full bg-white border-2 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${parsedData.date ? 'border-green-400' : 'border-red-300 focus:border-red-400'}`}
              />
            </div>

            {/* Horário — obrigatório */}
            <div>
              <label className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase mb-1">
                <span>⏰ Horário</span>
                <span className="text-red-500 font-black">* Obrigatório</span>
              </label>
              <input type="text"
                value={parsedData.time}
                onChange={e => setParsedData({ ...parsedData, time: e.target.value })}
                placeholder="HH:MM"
                className={`w-full bg-white border-2 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${parsedData.time ? 'border-green-400' : 'border-red-300 focus:border-red-400'}`}
              />
            </div>

            {/* Nome — opcional */}
            <div>
              <label className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase mb-1">
                <span>👤 Nome do Cliente</span>
                <span className="text-slate-400">opcional</span>
              </label>
              <input type="text"
                value={parsedData.clientName}
                onChange={e => setParsedData({ ...parsedData, clientName: e.target.value })}
                placeholder="Nome e sobrenome"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Telefone — opcional */}
            <div>
              <label className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase mb-1">
                <span>📱 Telefone</span>
                <span className="text-slate-400">opcional</span>
              </label>
              <input type="tel"
                value={parsedData.phone}
                onChange={e => setParsedData({ ...parsedData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Serviço — opcional */}
            <div>
              <label className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase mb-1">
                <span>✂️ Serviço</span>
                <span className="text-slate-400">opcional</span>
              </label>
              <input type="text"
                value={parsedData.service}
                onChange={e => setParsedData({ ...parsedData, service: e.target.value })}
                placeholder="Ex: Corte Degradê"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 transition-colors"
              />
              {/* Sugestões de serviços */}
              {!parsedData.service && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {MASTER_SERVICES.slice(0, 4).map(s => (
                    <button key={s.id} onClick={() => setParsedData({ ...parsedData, service: s.name })}
                      className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botão salvar */}
            <button onClick={handleSaveBooking}
              disabled={!parsedData.date || !parsedData.time}
              className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 ${
                saveSuccess ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'
              }`}>
              {saveSuccess
                ? <><CheckCircle size={16} /> Agendamento salvo!</>
                : <><Calendar size={16} /> Salvar Agendamento</>}
            </button>

            {(!parsedData.date || !parsedData.time) && (
              <p className="text-[9px] text-red-500 font-bold text-center">Preencha data e horário para continuar</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SIMPLE BAR CHART ─────────────────────────────────────────────────────────
const SimpleBarChart = ({ data, color = '#3b82f6', height = 80 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
            <span className="text-[8px] font-black text-slate-500">{d.value > 0 ? d.value : ''}</span>
            <div className="w-full rounded-t-lg transition-all duration-700"
              style={{ height: `${Math.max((d.value / max) * (height - 20), d.value > 0 ? 4 : 0)}px`, backgroundColor: color, opacity: 0.7 + 0.3 * (d.value / max) }} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[8px] text-slate-400 font-bold truncate">{d.label}</div>
        ))}
      </div>
    </div>
  );
};

// ─── REPORTS SECTION ──────────────────────────────────────────────────────────
const ReportsSection = ({ appointments, user, onDeleteAccount, isGuest, onUpdateProfile, supabase: sb }) => {
  const [hourlyRate, setHourlyRate] = useState(user.hourly_rate || 50);
  const [savingRate, setSavingRate] = useState(false);

  const confirmedApps = (appointments || []).filter(a =>
    String(a.barber_id || a.barberId) === String(user.id) && a.status === 'confirmed'
  );
  const manualApps = user.manual_appointments || [];
  const allApps = [...confirmedApps, ...manualApps];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const appsByDay = Array(7).fill(0);
  allApps.forEach(app => {
    if (app.date) { const dow = new Date(app.date + 'T00:00:00').getDay(); appsByDay[dow]++; }
  });
  const dayData = dayNames.map((label, i) => ({ label, value: appsByDay[i] }));

  const recentRevenue = confirmedApps.slice(-6).map((a, i) => ({ label: `#${i + 1}`, value: Number(a.price) || 0 }));

  const slots = user.available_slots || {};
  const totalOpen = Object.values(slots).reduce((acc, s) => acc + (s?.length || 0), 0);
  const totalBooked = allApps.length;
  const occupancy = totalOpen + totalBooked > 0 ? Math.round((totalBooked / (totalOpen + totalBooked)) * 100) : 0;

  const avgMinPerApp = 45;
  const totalMinWorked = allApps.length * avgMinPerApp;
  const totalHrsWorked = (totalMinWorked / 60).toFixed(1);
  const earnedAtRate = ((totalMinWorked / 60) * hourlyRate).toFixed(2);
  const totalRevenue = confirmedApps.reduce((acc, a) => acc + (Number(a.price) || 0), 0);
  const daysWithSlots = Object.keys(slots).filter(d => slots[d]?.length > 0).length;
  const idleHrs = Math.max(0, daysWithSlots * 8 - totalMinWorked / 60).toFixed(1);

  const saveHourlyRate = async (rate) => {
    if (isGuest) return;
    setSavingRate(true);
    try { await sb.from('profiles').update({ hourly_rate: rate }).eq('id', user.id); onUpdateProfile({ ...user, hourly_rate: rate }); }
    catch (_) { }
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
              style={{ width: `${occupancy}%`, background: occupancy >= 70 ? '#22c55e' : occupancy >= 40 ? '#3b82f6' : '#f59e0b' }} />
          </div>
          <span className="font-black text-sm text-slate-900 w-10 text-right">{occupancy}%</span>
        </div>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><span className="text-[10px] font-bold text-slate-500">Trabalhando: {totalHrsWorked}h</span></div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /><span className="text-[10px] font-bold text-slate-500">Ocioso: {idleHrs}h</span></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Atendimentos por Dia da Semana</p>
        <SimpleBarChart data={dayData} color="#3b82f6" height={72} />
      </div>

      {recentRevenue.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Valores Últimos Atendimentos</p>
          <SimpleBarChart data={recentRevenue} color="#10b981" height={72} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-blue-500" />
          <p className="font-bold text-slate-900 text-sm">Análise de Rôl de Tempo</p>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Minha hora vale:</label>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
            <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-blue-400" />
          </div>
          <button onClick={() => saveHourlyRate(hourlyRate)} disabled={savingRate || isGuest}
            className="px-3 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold active:scale-95 disabled:opacity-50">
            {savingRate ? '...' : 'Salvar'}
          </button>
        </div>
        <div className="space-y-2">
          {[{ label: '30 minutos', mins: 30 }, { label: '1 hora', mins: 60 }, { label: '2 horas', mins: 120 }, { label: 'Dia de trabalho (8h)', mins: 480 }].map(({ label, mins }) => (
            <div key={mins} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-600">{label}</span>
              <span className="text-xs font-black text-green-600">R$ {((mins / 60) * hourlyRate).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Total trabalhado (estimado)</p>
          <p className="text-lg font-black text-blue-800">{totalHrsWorked}h → R$ {earnedAtRate}</p>
          <p className="text-[9px] text-blue-500 mt-0.5">Baseado em {allApps.length} atendimentos × 45 min médios</p>
        </div>
      </div>

      {!isGuest && (
        <div className="text-center pt-2 pb-8">
          <button onClick={onDeleteAccount} className="text-[10px] text-red-300 font-bold underline underline-offset-2 hover:text-red-500 transition-colors">
            Excluir minha conta
          </button>
        </div>
      )}
    </div>
  );
};

// ─── COPY LINK BUTTON ─────────────────────────────────────────────────────────
const CopyLinkButton = ({ barber }) => {
  const [copied, setCopied] = useState(false);
  const slug = barber.slug || generateSlug(barber.name || 'profissional', barber.id);
  const url = getPublicUrl(slug);
  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
      <Link size={14} className="text-slate-400 flex-shrink-0" />
      <p className="text-[10px] text-slate-400 font-mono truncate flex-1">{url}</p>
      <button onClick={handleCopy}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-900 text-white hover:bg-slate-700'}`}>
        {copied ? <><CheckCircle size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
      </button>
    </div>
  );
};

// ─── BASE COMPONENTS ──────────────────────────────────────────────────────────
const Button = ({ children, onClick, variant = 'primary', className = '', disabled, loading }) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-lg",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-900",
    success: "bg-green-600 text-white hover:bg-green-700",
  };
  return (
    <button onClick={onClick} disabled={disabled || loading}
      className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}>
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
};

const Card = ({ children, selected, onClick }) => (
  <div onClick={onClick} className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${selected ? 'border-blue-600 bg-blue-50/50' : 'border-transparent bg-white shadow-sm hover:border-slate-200'}`}>
    {selected && <div className="absolute top-3 right-3 text-blue-600"><CheckCircle2 size={18} fill="currentColor" className="text-white" /></div>}
    {children}
  </div>
);

const MonthCalendar = ({ availableSlots, selectedDate, onSelectDate, onMonthChange }) => {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();

  const goPrev = () => {
    const d = new Date(calYear, calMonth - 1, 1);
    if (d >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
      if (onMonthChange) onMonthChange(d.getFullYear(), d.getMonth());
    }
  };
  const goNext = () => {
    const d = new Date(calYear, calMonth + 1, 1);
    setCalYear(d.getFullYear()); setCalMonth(d.getMonth());
    if (onMonthChange) onMonthChange(d.getFullYear(), d.getMonth());
  };
  const isPrevDisabled = calYear === today.getFullYear() && calMonth === today.getMonth();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrev} disabled={isPrevDisabled} className={`p-2 rounded-full transition-all ${isPrevDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}><ChevronLeft size={18} /></button>
        <span className="font-black text-sm text-slate-900">{MONTH_NAMES[calMonth]} {calYear}</span>
        <button onClick={goNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"><ChevronRight size={18} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(calYear, calMonth, day);
          const daySlots = availableSlots?.[dateStr] || [];
          const isAvailable = daySlots.length > 0;
          const isSelected = selectedDate === dateStr;
          const isPast = new Date(dateStr) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <button key={i} disabled={!isAvailable || isPast} onClick={() => onSelectDate(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-bold border transition-all
                ${isSelected ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                  : isAvailable && !isPast ? 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    : 'bg-slate-50 text-slate-200 border-transparent opacity-40 cursor-not-allowed'}`}>
              {day}
              {isAvailable && !isSelected && !isPast && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── SUPPORT CHAT ─────────────────────────────────────────────────────────────
const SupportChat = ({ user }) => {
  const [messages, setMessages] = useState([{
    id: 1, from: 'support',
    text: `Olá ${user?.name?.split(' ')[0] || 'profissional'}! 👋 Sou do suporte do Salão Digital. Como posso te ajudar hoje?`,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => { if (messages.length > 1) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const SUPPORT_WHATSAPP = '5541992931394';

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input.trim(), time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    const sentText = input.trim(); setInput(''); setSending(true);
    try { await supabase.from('support_messages').insert([{ barber_id: user?.id, barber_name: user?.name, message: sentText, created_at: new Date().toISOString() }]); } catch (_) { }
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'support',
        text: 'Recebi sua mensagem! Para atendimento mais rápido, clique abaixo para falar com nossa equipe no WhatsApp. 💬',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        whatsapp: `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(`Olá! Sou ${user?.name} (Salão Digital). ${sentText}`)}`
      }]);
      setSending(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"><Headphones size={18} className="text-white" /></div>
        <div>
          <p className="font-bold text-white text-sm">Suporte Salão Digital</p>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full" /><p className="text-[10px] text-slate-400">Online agora</p></div>
        </div>
      </div>
      <div className="h-56 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-sm'}`}>{msg.text}</div>
              {msg.whatsapp && (
                <a href={msg.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl mt-1">
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
              <div className="flex gap-1">{[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Digite sua dúvida..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-400 transition-colors" />
        <button onClick={handleSend} disabled={!input.trim() || sending}
          className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0 hover:bg-blue-700 transition-colors active:scale-95">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── PRIVACY MODAL ────────────────────────────────────────────────────────────
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={onClose} />
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
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
    <div className="relative bg-white w-full max-w-[360px] h-[70vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col">
      <div className="flex-1 w-full overflow-hidden"><img src={imgPopup} alt="Bem-vindo" className="w-full h-full object-cover" /></div>
      <div className="p-6 bg-white w-full flex items-center justify-center">
        <Button variant="secondary" onClick={onClose} className="w-full py-4 text-lg shadow-xl shadow-blue-600/20">Começar Agora</Button>
      </div>
    </div>
  </div>
);

// ─── GUEST MODE MODAL ─────────────────────────────────────────────────────────
const GuestModeModal = ({ isOpen, onClose, onSelectGuestMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-3xl p-7 shadow-2xl">
        <h2 className="text-xl font-black text-slate-900 mb-1 text-center">Explorar como Convidado</h2>
        <p className="text-xs text-slate-400 text-center mb-7">Escolha como deseja visualizar o app</p>
        <div className="space-y-3">
          <button onClick={() => onSelectGuestMode('client')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40 transition-all active:scale-95 text-left">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200"><User size={22} className="text-white" /></div>
            <div><p className="font-black text-slate-900 text-sm">Ver como Cliente</p><p className="text-[10px] text-slate-400 mt-0.5">Explore serviços, profissionais e agendamentos</p></div>
          </button>
          <button onClick={() => onSelectGuestMode('barber')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-slate-700 transition-all active:scale-95 text-left">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0"><Scissors size={22} className="text-white" /></div>
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
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const handleGuestMode = (guestType) => { setShowGuestModal(false); onSelectMode(guestType === 'client' ? 'guest' : 'guest-barber'); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
      style={{ backgroundImage: `url('/backgr.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] z-0" />
      <div className="absolute top-6 right-6 z-20"><DarkModeToggle isDark={isDark} onToggle={onToggleDark} /></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-2xl shadow-blue-900/50">
          <Scissors size={40} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white italic mb-2 tracking-tighter">SALÃO<span className="text-blue-500">DIGITAL</span></h1>
        <div className="w-full max-w-xs space-y-3 mt-10">
          <Button variant="secondary" onClick={() => onSelectMode('client')}><User size={16} /> Sou Cliente</Button>
          <Button variant="primary" onClick={() => setShowGuestModal(true)} className="bg-slate-700 hover:bg-slate-600 text-white border-none shadow-lg">
            <Eye size={16} /> Explorar como Convidado
          </Button>
          <div className="py-2 flex items-center gap-4">
            <div className="h-[1px] bg-white/20 flex-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ou</span>
            <div className="h-[1px] bg-white/20 flex-1" />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-900/40" onClick={() => onSelectMode('barber')}>
            <Scissors size={16} /> Sou Profissional
          </Button>
          <button onClick={() => setShowPrivacy(true)} className="mt-6 text-[10px] text-slate-400 underline uppercase tracking-widest font-bold opacity-60 hover:opacity-100">
            Política de Privacidade
          </button>
        </div>
      </div>
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <GuestModeModal isOpen={showGuestModal} onClose={() => setShowGuestModal(false)} onSelectGuestMode={handleGuestMode} />
    </div>
  );
};

// ─── AUTH SCREEN — com validação 11 dígitos + nome mín. 3 + máscara ───────────
const AuthScreen = ({ userType, onBack, onLogin, onRegister, isDark, onToggleDark }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Campos com validação visual
  const nameValid = name.trim().length >= 3;
  const phoneValid = getPhoneDigits(phone).length === 11;
  const passwordValid = password.length >= 6;

  const handlePhoneChange = (e) => setPhone(applyPhoneMask(e.target.value));

  const handleSubmit = async () => {
    setError('');
    if (mode === 'register') {
      if (name.trim().length < 3) { setError('Nome deve ter pelo menos 3 caracteres.'); return; }
      const digits = getPhoneDigits(phone);
      if (digits.length !== 11) { setError('WhatsApp deve ter 11 dígitos (DDD + número com 9).'); return; }
      if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }
    }
    setLoading(true);
    try {
      if (mode === 'login') await onLogin(getPhoneDigits(phone) || phone, password);
      else await onRegister(name.trim(), getPhoneDigits(phone), password);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 left-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24} /></button>
      </div>
      <div className="absolute top-6 right-6"><DarkModeToggle isDark={isDark} onToggle={onToggleDark} /></div>
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-black text-center mb-2">{userType === 'barber' ? 'Área Profissional' : 'Área do Cliente'}</h2>
        <p className="text-center text-slate-400 mb-6 text-sm">{mode === 'login' ? 'Faça login para continuar' : 'Crie sua conta agora'}</p>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-lg border border-red-100">{error}</div>}
        <div className="space-y-4">
          {mode === 'register' && (
            <div>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome e sobrenome (mín. 3 letras)"
                className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors ${name.length > 0 ? (nameValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`} />
              {name.length > 0 && !nameValid && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Mínimo 3 caracteres</p>}
            </div>
          )}
          <div>
            <input type="tel" value={phone} onChange={handlePhoneChange}
              placeholder="WhatsApp: (41) 99999-9999"
              className={`w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-colors ${phone.length > 0 ? (phoneValid ? 'border-green-400' : 'border-amber-300') : 'border-slate-200 focus:border-blue-500'}`} />
            {phone.length > 0 && (
              <p className={`text-[10px] font-bold mt-1 ml-1 ${phoneValid ? 'text-green-600' : 'text-amber-500'}`}>
                {getPhoneDigits(phone).length}/11 dígitos {phoneValid ? '✓' : ''}
              </p>
            )}
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Senha (mín. 6 caracteres)"
              className={`w-full p-3 pr-10 bg-slate-50 border-2 rounded-xl outline-none transition-colors ${password.length > 0 ? (passwordValid ? 'border-green-400' : 'border-red-300') : 'border-slate-200 focus:border-blue-500'}`} />
            <button onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button onClick={handleSubmit} loading={loading}>{mode === 'login' ? 'Entrar' : 'Cadastrar'}</Button>
          <div className="flex items-center gap-2 my-2">
            <div className="h-[1px] bg-slate-200 flex-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ou</span>
            <div className="h-[1px] bg-slate-200 flex-1" />
          </div>
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="w-full text-blue-600 font-bold text-sm mt-2">
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── BARBER ONBOARDING ────────────────────────────────────────────────────────
const BarberOnboarding = ({ user, onComplete, onSkip, supabase: sb }) => {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const TOTAL_STEPS = 4;
  const [address, setAddress] = useState(user.address || '');
  const [selectedServices, setSelectedServices] = useState(user.my_services || []);
  const [duration, setDuration] = useState(user.appointment_duration || '30min');
  const [capturedLocation, setCapturedLocation] = useState({ lat: user.latitude, lng: user.longitude });

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) { alert('Geolocalização não disponível'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setCapturedLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); alert('Localização capturada!'); },
      () => alert('Erro ao capturar localização.')
    );
  };

  const toggleService = (id, defaultPrice) => {
    const exists = selectedServices.find(s => s.id === id);
    if (exists) setSelectedServices(prev => prev.filter(s => s.id !== id));
    else setSelectedServices(prev => [...prev, { id, price: defaultPrice }]);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const slug = generateSlug(user.name, user.id);
      const updateData = { address, latitude: capturedLocation?.lat || null, longitude: capturedLocation?.lng || null, my_services: selectedServices, appointment_duration: duration, onboarding_done: true, slug };
      await sb.from('profiles').update(updateData).eq('id', user.id);
      onComplete({ ...user, ...updateData });
    } catch (e) { alert('Erro ao salvar: ' + e.message); }
    finally { setSaving(false); }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      const slug = generateSlug(user.name, user.id);
      await sb.from('profiles').update({ onboarding_done: true, slug }).eq('id', user.id);
      onSkip({ ...user, onboarding_done: true, slug });
    } catch (e) { onSkip({ ...user, onboarding_done: true }); }
    finally { setSaving(false); }
  };

  const progressPct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div><h1 className="font-black text-slate-900 text-base">Configure seu Perfil</h1><p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Passo {step} de {TOTAL_STEPS}</p></div>
          <button onClick={handleSkip} disabled={saving} className="text-slate-400 font-bold text-xs bg-slate-100 px-4 py-2 rounded-full">{saving ? 'Aguarde...' : 'Pular tudo'}</button>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
      <div className="flex-1 p-6 max-w-md mx-auto w-full pb-32">
        {step === 1 && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-2"><MapPin size={28} className="text-blue-600" /></div>
            <div><h2 className="text-2xl font-black text-slate-900 mb-1">Onde você atende?</h2><p className="text-sm text-slate-500">Clientes vão encontrar você pelo endereço.</p></div>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Rua das Flores, 123 — Curitiba/PR"
              className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:border-blue-500 transition-colors" />
            <button onClick={handleCaptureLocation}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 ${capturedLocation?.lat ? 'bg-green-50 border-green-500 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-600 hover:border-blue-400'}`}>
              <MapPin size={18} />{capturedLocation?.lat ? '✓ Localização capturada!' : 'Capturar Minha Localização'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-2"><Scissors size={28} className="text-purple-600" /></div>
            <div><h2 className="text-2xl font-black text-slate-900 mb-1">Quais serviços você oferece?</h2><p className="text-sm text-slate-500">Selecione os serviços. Ajuste os preços depois.</p></div>
            {MASTER_SERVICES.map(s => {
              const isActive = selectedServices.some(sv => sv.id === s.id);
              return (
                <button key={s.id} onClick={() => toggleService(s.id, s.defaultPrice)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-95 text-left ${isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-slate-100'}`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                    <div><p className="font-bold text-sm">{s.name}</p><p className={`text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>R$ {s.defaultPrice} · {s.duration}</p></div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-green-400 border-green-400' : 'border-slate-300'}`}>
                    {isActive && <Check size={12} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-2"><Clock size={28} className="text-amber-600" /></div>
            <div><h2 className="text-2xl font-black text-slate-900 mb-1">Duração dos atendimentos</h2><p className="text-sm text-slate-500">Define o intervalo mínimo entre horários.</p></div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[{ value: '30min', label: '30 minutos', icon: '⏱' }, { value: '1h', label: '1 hora', icon: '🕐' }].map(opt => (
                <button key={opt.value} onClick={() => setDuration(opt.value)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all active:scale-95 ${duration === opt.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                  <p className="text-2xl mb-2">{opt.icon}</p><p className="font-black text-sm">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-2"><Link size={28} className="text-green-600" /></div>
            <div><h2 className="text-2xl font-black text-slate-900 mb-1">Seu link de agendamento</h2><p className="text-sm text-slate-500">Compartilhe com seus clientes!</p></div>
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-700 mx-auto mb-3 overflow-hidden flex items-center justify-center">
                {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" /> : <User size={28} className="text-slate-400" />}
              </div>
              <p className="text-white font-black text-lg">{user.name}</p>
              <p className="text-slate-400 text-xs mt-1 font-mono break-all">{getPublicUrl(generateSlug(user.name, user.id))}</p>
            </div>
            <button onClick={handleFinish} disabled={saving}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin" size={22} /> : <><CheckCircle size={22} /> Finalizar e Ir ao Painel</>}
            </button>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-10">
        <div className="max-w-md mx-auto flex gap-3">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-black text-sm active:scale-95 transition-all">← Voltar</button>}
          {step < TOTAL_STEPS && <button onClick={() => setStep(s => s + 1)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg">Próximo →</button>}
        </div>
      </div>
    </div>
  );
};

// ─── TOP PROFESSIONALS ────────────────────────────────────────────────────────
const TopProfessionalsSection = ({ barbers }) => {
  const topBarbers = barbers
    .filter(b => b.is_visible && ((b.my_services || []).length > 0 || b.avatar_url))
    .sort((a, b) => getBarberRating(b) - getBarberRating(a))
    .slice(0, 3);
  if (!topBarbers.length) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Melhores Profissionais</h3>
        <div className="flex items-center gap-1"><Star size={10} className="text-amber-400 fill-amber-400" /><span className="text-[9px] font-bold text-slate-400">Top 3</span></div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {topBarbers.map(barber => {
          const rating = getBarberRating(barber);
          const isPro = barber.plano_ativo;
          const specs = (barber.my_services || []).slice(0, 2).map(s => { const m = MASTER_SERVICES.find(ms => ms.id === s.id); return m?.name || ''; }).filter(Boolean);
          return (
            <div key={barber.id} className="flex-shrink-0 w-[152px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 pt-5 pb-6 flex justify-center">
                {isPro && <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-0.5"><Zap size={8} className="text-white" /></div>}
                <StoryRing rating={rating} size={72} animate>
                  {barber.avatar_url
                    ? <img src={barber.avatar_url} className="w-full h-full object-cover" alt={barber.name} />
                    : <div className="w-full h-full flex items-center justify-center bg-slate-700"><User size={22} className="text-slate-400" /></div>}
                </StoryRing>
              </div>
              <div className="px-3 pt-3 pb-3">
                <p className="font-black text-slate-900 text-xs leading-tight truncate">{barber.name}</p>
                {/* Bio — exibida se existir */}
                {barber.bio && <p className="text-[9px] text-blue-500 font-bold italic mt-0.5 truncate">"{barber.bio}"</p>}
                <div className="flex items-center gap-1.5 mt-1 mb-2"><StarRating rating={rating} /><span className="text-[9px] font-black text-amber-500">{rating}</span></div>
                {specs.map((s, i) => <span key={i} className="text-[8px] font-bold text-slate-500 bg-slate-50 rounded-md px-1.5 py-0.5 truncate block mb-0.5">{s}</span>)}
                {barber.distanceLabel && <div className="flex items-center gap-0.5 mt-1"><MapPin size={9} className="text-blue-400" /><span className="text-[9px] font-bold text-blue-500">{barber.distanceLabel}</span></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── PUBLIC BARBER PAGE ───────────────────────────────────────────────────────
const PublicBarberPage = ({ barber }) => {
  const [bookStep, setBookStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const rating = getBarberRating(barber);
  const badges = getBadges(barber);
  const workPhotos = barber.work_photos || [];

  const masterServices = (barber.my_services || []).map(s => {
    const master = MASTER_SERVICES.find(m => m.id === s.id);
    return master ? { ...master, price: s.price } : null;
  }).filter(Boolean);

  const customServices = (barber.custom_services || []).map(cs => ({ ...cs, icon: <Scissors size={20} />, isCustom: true }));
  const services = [...masterServices, ...customServices];

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  const handleServiceClick = (service) => { setSelectedService(service); setSelectedDate(null); setSelectedTime(null); setBookStep(2); };

  const handleSubmitBooking = async () => {
    if (!clientName.trim() || !clientPhone.trim()) { alert('Preencha seu nome e WhatsApp.'); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('appointments').insert([{
        date: selectedDate, time: selectedTime, barber_id: barber.id, client_id: null,
        client_name: clientName.trim(), phone: clientPhone.trim(),
        service_name: selectedService.name, price: selectedService.price, status: 'pending',
      }]);
      if (error) throw error;
      setBookStep(4);
    } catch (e) { alert('Erro ao agendar: ' + e.message); }
    finally { setSubmitting(false); }
  };

  if (bookStep === 4) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"><CheckCircle size={40} className="text-green-600" /></div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Agendado!</h2>
        <p className="text-slate-500 text-sm mb-2">Sua solicitação foi enviada para <b>{barber.name}</b>.</p>
        <p className="text-slate-500 text-sm mb-8">Aguarde a confirmação pelo WhatsApp.</p>
        <div className="bg-slate-50 rounded-2xl p-4 w-full max-w-xs text-left space-y-2 mb-8 border border-slate-100">
          <div className="flex justify-between"><span className="text-xs text-slate-400">Serviço</span><span className="text-xs font-black text-slate-900">{selectedService?.name}</span></div>
          <div className="flex justify-between"><span className="text-xs text-slate-400">Data</span><span className="text-xs font-black text-slate-900">{selectedDate?.split('-').reverse().join('/')}</span></div>
          <div className="flex justify-between"><span className="text-xs text-slate-400">Horário</span><span className="text-xs font-black text-slate-900">{selectedTime}</span></div>
          <div className="flex justify-between"><span className="text-xs text-slate-400">Valor</span><span className="text-xs font-black text-green-600">R$ {selectedService?.price}</span></div>
        </div>
        <button onClick={() => { setBookStep(0); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); setClientName(''); setClientPhone(''); }} className="text-blue-600 font-bold text-sm">Fazer outro agendamento</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 pb-8 pt-10 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl" /></div>
        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="mb-4">
            <StoryRing rating={rating} size={112} animate>
              {barber.avatar_url
                ? <img src={barber.avatar_url} className="w-full h-full object-cover" alt={barber.name} />
                : <div className="w-full h-full flex items-center justify-center bg-slate-700"><User size={40} className="text-slate-400" /></div>}
            </StoryRing>
          </div>
          <h1 className="text-white font-black text-2xl leading-tight mb-1 mt-2">{barber.name}</h1>
          {/* Bio pública */}
          {barber.bio && (
            <p className="text-blue-300 text-sm font-bold italic mb-1">"{barber.bio}"</p>
          )}
          {barber.address && <p className="text-slate-400 text-xs flex items-center justify-center gap-1 mb-3"><MapPin size={11} />{barber.address}</p>}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mb-5">
              {badges.map((b, i) => <span key={i} className={`flex items-center gap-0.5 px-2 py-1 rounded-full font-bold text-[9px] ${b.color}`}>{b.icon} {b.label}</span>)}
            </div>
          )}
          <div className="flex gap-2 w-full max-w-xs">
            <button onClick={() => setBookStep(1)}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-900/40">
              <CalendarDays size={16} /> Agendar
            </button>
            <button onClick={handleCopyLink}
              className={`px-4 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all text-xs ${copied ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {copied ? <CheckCircle size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Link'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-10">
        {bookStep > 0 && bookStep < 4 && (
          <div className="bg-white mt-4 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">{bookStep === 1 ? 'Escolha o serviço' : bookStep === 2 ? 'Data e horário' : 'Seus dados'}</h3>
              <button onClick={() => setBookStep(0)} className="text-slate-400 font-bold text-xs">Cancelar</button>
            </div>
            <div className="p-4">
              {bookStep === 1 && (
                <div className="space-y-2">
                  {services.map(s => (
                    <button key={s.id} onClick={() => { setSelectedService(s); setBookStep(2); }}
                      className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-slate-300 transition-all active:scale-95 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">{React.cloneElement(s.icon, { size: 16 })}</div>
                        <div><p className="font-bold text-sm text-slate-900">{s.name}</p><p className="text-[10px] text-slate-400">{s.duration}</p></div>
                      </div>
                      <p className="font-black text-green-600 text-sm">R$ {s.price}</p>
                    </button>
                  ))}
                </div>
              )}
              {bookStep === 2 && (
                <div>
                  <button onClick={() => setBookStep(1)} className="text-xs text-slate-400 font-bold mb-4 flex items-center gap-1"><ChevronLeft size={14} /> {selectedService?.name} · R$ {selectedService?.price}</button>
                  <MonthCalendar availableSlots={barber.available_slots} selectedDate={selectedDate} onSelectDate={d => { setSelectedDate(d); setSelectedTime(null); }} />
                  {selectedDate && (
                    <div className="mt-5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Horários disponíveis</p>
                      <div className="grid grid-cols-4 gap-2">
                        {GLOBAL_TIME_SLOTS.map(t => {
                          const avail = barber.available_slots?.[selectedDate]?.includes(t);
                          return (
                            <button key={t} disabled={!avail} onClick={() => setSelectedTime(t)}
                              className={`py-2.5 rounded-lg font-bold text-xs transition-all ${selectedTime === t ? 'bg-slate-900 text-white shadow-lg scale-105' : avail ? 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedTime && selectedDate && (
                    <button onClick={() => setBookStep(3)} className="w-full mt-5 py-4 bg-blue-600 text-white rounded-xl font-black text-sm active:scale-95 transition-all">
                      Próximo → {selectedDate.split('-').reverse().join('/')} às {selectedTime}
                    </button>
                  )}
                </div>
              )}
              {bookStep === 3 && (
                <div className="space-y-4">
                  <button onClick={() => setBookStep(2)} className="text-xs text-slate-400 font-bold mb-2 flex items-center gap-1"><ChevronLeft size={14} /> {selectedDate?.split('-').reverse().join('/')} às {selectedTime}</button>
                  <div className="bg-blue-50 rounded-xl p-3 flex justify-between items-center">
                    <div><p className="font-black text-slate-900 text-sm">{selectedService?.name}</p><p className="text-[10px] text-slate-500">{selectedDate?.split('-').reverse().join('/')} às {selectedTime}</p></div>
                    <p className="font-black text-green-600">R$ {selectedService?.price}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Seu nome</label>
                    <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome e sobrenome"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">WhatsApp</label>
                    <input type="tel" value={clientPhone} onChange={e => setClientPhone(applyPhoneMask(e.target.value))} placeholder="(41) 99999-9999"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <button onClick={handleSubmitBooking} disabled={submitting}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Confirmar Agendamento</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {workPhotos.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Trabalhos</p>
            <div className="grid grid-cols-3 gap-2">
              {workPhotos.map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-200">
                  <img src={url} alt={`Trabalho ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Serviços · <span className="text-blue-500 normal-case font-bold">toque para agendar</span></p>
          <div className="space-y-2">
            {services.map(s => (
              <button key={s.id} onClick={() => handleServiceClick(s)}
                className="w-full bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between active:scale-[0.98] transition-all hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">{React.cloneElement(s.icon, { size: 16 })}</div>
                  <div className="text-left"><p className="font-bold text-sm text-slate-900">{s.name}</p><p className="text-[10px] text-slate-400">{s.duration}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-green-600 text-sm">R$ {s.price}</p>
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"><CalendarDays size={11} className="text-white" /></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Agendamento via</p>
          <p className="font-black text-slate-400 italic text-sm">SALÃO<span className="text-blue-500">DIGITAL</span></p>
        </div>
      </div>
    </div>
  );
};

// ─── CLIENT APP ───────────────────────────────────────────────────────────────
const ClientApp = ({ user, barbers, onLogout, onBookingSubmit, appointments, onUpdateStatus, MASTER_SERVICES: MS, isDark, onToggleDark }) => {
  const [view, setView] = useState('home');
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({ service: null, barber: null, price: null, date: null, time: null });
  const [userCoords, setUserCoords] = useState(null);

  const handleDeleteAccount = async () => {
    if (!window.confirm("Deseja realmente excluir sua conta? Todos os seus dados serão apagados permanentemente.")) return;
    try {
      await supabase.from('appointments').delete().eq('client_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      alert("Conta removida."); onLogout();
    } catch (error) { alert("Erro ao excluir. Tente novamente."); }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => console.error(err.message), { enableHighAccuracy: true }
      );
    }
  }, []);

  const processedBarbers = useMemo(() => (barbers || [])
    .filter(b => b.is_visible)
    .map(b => {
      const dist = calculateDistance(userCoords?.lat, userCoords?.lng, b.latitude, b.longitude);
      const label = dist !== null ? (dist < 1 ? `${Math.floor(dist * 1000)} m` : `${dist.toFixed(1)} km`) : null;
      return { ...b, distance: dist, distanceLabel: label };
    })
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    }), [barbers, userCoords]);

  const handleFinish = async () => {
    try {
      if (user?.isGuest) { alert("Para realizar um agendamento real, por favor crie sua conta!"); onLogout(); return; }
      if (!bookingData.date || !bookingData.time) { alert("Por favor, selecione o dia e o horário antes de confirmar."); return; }
      const payload = {
        date: bookingData.date, time: bookingData.time, barber_id: bookingData.barber?.id,
        client_id: user?.id, client_name: user?.name || "Cliente", phone: user?.phone || "Sem telefone",
        service_name: bookingData.service?.name || "Serviço", price: Number(bookingData.price) || 0, status: 'pending'
      };
      if (!payload.barber_id) { alert("Erro: profissional não encontrado."); return; }
      const { error } = await supabase.from('appointments').insert([payload]);
      if (error) throw error;
      setView('success');
    } catch (error) { alert("Falha ao agendar: " + error.message); }
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
        <div className="flex items-center gap-3">
          <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
          <button onClick={onLogout} className="text-red-500 font-bold text-xs flex items-center gap-1"><LogOut size={14} /> {user?.isGuest ? 'Entrar' : 'Sair'}</button>
        </div>
      </header>
      <main className="p-6 max-w-md mx-auto">
        {view === 'home' && (
          <div className="space-y-1">
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl mb-2">
              <h2 className="text-xl font-bold mb-4 italic">Olá, {user.name.split(' ')[0]}</h2>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setView('booking')}>Novo Agendamento</Button>
                <Button variant="outline" className="text-white border-white/20" onClick={() => setView('history')}>Histórico</Button>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Galeria</h3>
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {[imgMp, imgMao, imgTes].map((img, i) => (
                  <div key={i} className="w-[280px] h-[200px] bg-slate-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-slate-100">
                    <img src={img} alt="Galeria" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <TopProfessionalsSection barbers={processedBarbers} />
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-4">
            <button onClick={() => setView('home')} className="text-slate-400 font-bold text-sm mb-4 flex items-center gap-1"><ArrowLeft size={16} /> Voltar</button>
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-lg text-slate-900">Meus Agendamentos</h3>
              <button onClick={handleDeleteAccount} className="text-[9px] text-red-400 font-bold uppercase tracking-tighter border-b border-red-100 pb-0.5">Excluir Conta</button>
            </div>
            {(appointments || []).filter(a => String(a.client_id) === String(user.id)).length === 0
              ? <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">Ainda não tem agendamentos.</div>
              : <div className="space-y-3">{(appointments || []).filter(a => String(a.client_id) === String(user.id)).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)).map(app => {
                  const professional = (barbers || []).find(b => String(b.id) === String(app.barber_id));
                  return (
                    <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><User size={18} /></div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{app.service_name}</p>
                          <p className="text-[10px] text-blue-600 font-bold">Profissional: {professional?.name || "Profissional"}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={10} />{app.date?.split('-').reverse().join('/')} às {app.time}</p>
                        </div>
                      </div>
                      <button onClick={() => {
                        if (window.confirm("Reagendar? O horário atual será cancelado.")) {
                          const serviceObj = MS.find(s => s.name === app.service_name);
                          setBookingData({ service: serviceObj, barber: professional, price: app.price });
                          if (typeof onUpdateStatus === 'function') onUpdateStatus(app.id, 'rejected');
                          setView('booking'); setStep(3);
                        }
                      }} className="flex flex-col items-center gap-1 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <CalendarDays size={20} /><span className="text-[9px] font-bold uppercase">Reagendar</span>
                      </button>
                    </div>
                  );
                })}</div>}
          </div>
        )}

        {view === 'booking' && (
          <div className="space-y-4">
            <button onClick={() => setStep(step - 1)} className={`${step === 1 ? 'hidden' : 'block'} text-slate-400 font-bold text-sm mb-2`}>← Voltar</button>
            {step === 1 && (
              <div className="flex flex-col h-full relative">
                <div className="flex-1 pb-24">
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Escolha o Serviço</h3>
                  <div className="space-y-3">
                    {MS.map(s => (
                      <Card key={s.id} selected={bookingData.service?.id === s.id} onClick={() => setBookingData({ ...bookingData, service: s })}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${bookingData.service?.id === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{s.icon}</div>
                            <div><p className="font-bold text-slate-900">{s.name}</p><p className="text-xs text-slate-400 font-medium">{s.duration}</p></div>
                          </div>
                          {bookingData.service?.id === s.id && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50">
                  <div className="max-w-md mx-auto">
                    <Button className={`w-full py-4 rounded-2xl font-bold text-sm ${!bookingData.service ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white active:scale-95'}`}
                      onClick={() => setStep(2)} disabled={!bookingData.service}>
                      {bookingData.service ? `Próximo: ${bookingData.service.name}` : 'Selecione um serviço'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                <h3 className="font-bold text-lg mb-2 text-slate-900">Escolha o Profissional</h3>
                <div className="grid grid-cols-2 gap-3">
                  {processedBarbers.filter(b => b.my_services?.some(s => s.id === bookingData.service?.id)).map(b => {
                    const displayPrice = b.my_services?.find(s => s.id === bookingData.service?.id)?.price || 0;
                    const isSelected = bookingData.barber?.id === b.id;
                    const rating = getBarberRating(b);
                    return (
                      <div key={b.id} onClick={() => setBookingData({ ...bookingData, barber: b, price: displayPrice })}
                        className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-slate-900 bg-slate-50' : 'border-white bg-white shadow-sm'}`}>
                        <div className="mb-2">
                          <StoryRing rating={rating} size={64}>
                            {b.avatar_url ? <img src={b.avatar_url} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full flex items-center justify-center bg-slate-200"><User size={20} className="text-slate-400" /></div>}
                          </StoryRing>
                        </div>
                        <p className="font-bold text-sm truncate w-full text-center text-slate-900 mt-1">{b.name}</p>
                        {b.bio && <p className="text-[8px] text-blue-500 font-bold italic text-center truncate w-full">"{b.bio}"</p>}
                        <BadgeList barber={b} small />
                        {b.distanceLabel && <p className="text-[10px] text-blue-600 font-black flex items-center gap-1 mt-1"><MapPin size={10} />{b.distanceLabel}</p>}
                        <p className="mt-2 text-green-600 font-black text-sm">R$ {displayPrice}</p>
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
                <MonthCalendar availableSlots={bookingData.barber?.available_slots} selectedDate={bookingData.date}
                  onSelectDate={dateStr => setBookingData({ ...bookingData, date: dateStr, time: null })} />
                <div className="mt-6">
                  {bookingData.date
                    ? <>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Horários para {bookingData.date.split('-').reverse().join('/')}</label>
                        <div className="grid grid-cols-4 gap-2">
                          {GLOBAL_TIME_SLOTS.map(t => {
                            const isAvail = bookingData.barber?.available_slots?.[bookingData.date]?.includes(t);
                            return (
                              <button key={t} disabled={!isAvail} onClick={() => setBookingData({ ...bookingData, time: t })}
                                className={`py-2 rounded-lg font-bold text-xs transition-all ${bookingData.time === t ? 'bg-slate-900 text-white shadow-lg scale-105' : isAvail ? 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    : <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                        <Calendar size={24} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-slate-400 font-bold">Selecione um dia acima primeiro</p>
                      </div>}
                </div>
                {bookingData.time && bookingData.date && (
                  <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-bold uppercase mb-1">Resumo</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{bookingData.service?.name}</span>
                      <span className="font-bold text-slate-900">R$ {bookingData.price}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Com {bookingData.barber?.name} às {bookingData.time}</p>
                  </div>
                )}
                <Button className="mt-6 w-full py-4 text-lg" onClick={handleFinish} disabled={!bookingData.time || !bookingData.date}>Confirmar Agendamento</Button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// ─── BARBER DASHBOARD ─────────────────────────────────────────────────────────
const BarberDashboard = ({ user, appointments, onUpdateStatus, onLogout, onUpdateProfile, supabase: sb, isGuestBarber, isDark, onToggleDark }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isPaying, setIsPaying] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDateConfig, setSelectedDateConfig] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date();
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

  const [guestBarberState, setGuestBarberState] = useState({
    ...user, name: 'Profissional Demo', plano_ativo: false, is_visible: false,
    my_services: [], available_slots: {}, manual_appointments: [], appointment_duration: '30min',
    address: '', avatar_url: '', work_photos: [], custom_services: [], bio: '',
  });

  const effectiveUser = isGuestBarber ? guestBarberState : user;
  const effectiveOnUpdateProfile = isGuestBarber ? setGuestBarberState : onUpdateProfile;

  const appointmentDuration = effectiveUser.appointment_duration || '30min';
  const filteredTimeSlots = appointmentDuration === '1h' ? GLOBAL_TIME_SLOTS.filter(s => s.endsWith(':00')) : GLOBAL_TIME_SLOTS;

  const myAppointments = (appointments || []).filter(a => String(a.barber_id || a.barberId) === String(effectiveUser.id) && a.status !== 'rejected');
  const pending = myAppointments.filter(a => a.status === 'pending').sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const confirmed = myAppointments.filter(a => a.status === 'confirmed');
  const manualAppointments = effectiveUser.manual_appointments || [];
  const allAppointments = [...confirmed, ...manualAppointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const revenue = confirmed.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const dedupedPending = pending.filter((app, index, self) => index === self.findIndex(t => t.id === app.id));
  const pendingToShow = showAllPending ? dedupedPending : dedupedPending.slice(0, 3);

  // Total de atendimentos para a meta
  const totalAppointmentsForGoal = confirmed.length + manualAppointments.length;

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
    if (!isGuestBarber) await sb.from('profiles').update({ available_slots: updatedAvailableSlots }).eq('id', effectiveUser.id).catch(console.error);
  };

  const toggleSlotForDate = async (date, slot) => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const slotsForDay = [...(currentSlots[date] || [])];
    const isAvailable = slotsForDay.includes(slot);
    if (isAvailable) {
      setManualSlotTarget({ date, slot }); setManualName(''); setManualValue(''); setShowManualModal(true);
    } else {
      const updatedDaySlots = [...slotsForDay, slot];
      const filteredManual = (effectiveUser.manual_appointments || []).filter(a => !(a.date === date && a.time === slot));
      effectiveOnUpdateProfile({ ...effectiveUser, available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: filteredManual });
      if (!isGuestBarber) await sb.from('profiles').update({ available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: filteredManual }).eq('id', effectiveUser.id).catch(console.error);
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
      if (!isGuestBarber) await sb.from('profiles').update({ available_slots: { ...currentSlots, [date]: updatedDaySlots }, manual_appointments: updatedManualApps }).eq('id', effectiveUser.id).catch(console.error);
    } else {
      const finalSlots = { ...currentSlots, [date]: updatedDaySlots };
      effectiveOnUpdateProfile({ ...effectiveUser, available_slots: finalSlots });
      if (!isGuestBarber) await sb.from('profiles').update({ available_slots: finalSlots }).eq('id', effectiveUser.id).catch(console.error);
    }
    setShowManualModal(false); setManualSlotTarget(null); setManualName(''); setManualValue('');
  };

  const selectAllSlotsForDay = async (date) => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const updatedSlots = { ...currentSlots, [date]: [...filteredTimeSlots] };
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedSlots });
    if (!isGuestBarber) await sb.from('profiles').update({ available_slots: updatedSlots }).eq('id', effectiveUser.id).catch(console.error);
  };

  const deselectAllSlotsForDay = async (date) => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    const updatedSlots = { ...currentSlots, [date]: [] };
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: updatedSlots });
    if (!isGuestBarber) await sb.from('profiles').update({ available_slots: updatedSlots }).eq('id', effectiveUser.id).catch(console.error);
  };

  const markAllDaysInMonth = async () => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    for (let i = 1; i <= daysInConfigMonth; i++) { const date = formatDate(configCalYear, configCalMonth, i); currentSlots[date] = [...filteredTimeSlots]; }
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: { ...currentSlots } });
    if (!isGuestBarber) await sb.from('profiles').update({ available_slots: { ...currentSlots } }).eq('id', effectiveUser.id).catch(console.error);
  };

  const unmarkAllDaysInMonth = async () => {
    const currentSlots = { ...(effectiveUser.available_slots || {}) };
    for (let i = 1; i <= daysInConfigMonth; i++) { const date = formatDate(configCalYear, configCalMonth, i); currentSlots[date] = []; }
    effectiveOnUpdateProfile({ ...effectiveUser, available_slots: { ...currentSlots } });
    if (!isGuestBarber) await sb.from('profiles').update({ available_slots: { ...currentSlots } }).eq('id', effectiveUser.id).catch(console.error);
  };

  const addCustomService = async () => {
    if (!newSvcName.trim() || !newSvcPrice) return;
    const newSvc = { id: `custom-${Date.now()}`, name: newSvcName.trim(), price: Number(newSvcPrice), duration: newSvcDuration, isCustom: true };
    const updatedCustom = [...(effectiveUser.custom_services || []), newSvc];
    effectiveOnUpdateProfile({ ...effectiveUser, custom_services: updatedCustom });
    if (!isGuestBarber) await sb.from('profiles').update({ custom_services: updatedCustom }).eq('id', effectiveUser.id).catch(console.error);
    setNewSvcName(''); setNewSvcPrice(''); setNewSvcDuration('45min'); setShowAddCustomSvc(false);
  };

  const removeCustomService = async (id) => {
    const updatedCustom = (effectiveUser.custom_services || []).filter(cs => cs.id !== id);
    effectiveOnUpdateProfile({ ...effectiveUser, custom_services: updatedCustom });
    if (!isGuestBarber) await sb.from('profiles').update({ custom_services: updatedCustom }).eq('id', effectiveUser.id).catch(console.error);
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
    const file = event.target.files[0]; if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${effectiveUser.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await sb.storage.from('barber-photos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = sb.storage.from('barber-photos').getPublicUrl(fileName);
      const updated = { ...effectiveUser, avatar_url: publicUrl };
      effectiveOnUpdateProfile(updated);
      if (!isGuestBarber) await sb.from('profiles').update({ avatar_url: publicUrl }).eq('id', effectiveUser.id);
      alert('Foto atualizada!');
    } catch (_) { alert('Erro ao carregar foto.'); }
  };

  const handleUploadWorkPhoto = async (event) => {
    if (isGuestBarber) { alert("Para adicionar fotos, faça login!"); return; }
    const file = event.target.files[0]; if (!file) return;
    const currentPhotos = effectiveUser.work_photos || [];
    if (currentPhotos.length >= 3) { alert("Máximo 3 fotos."); return; }
    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `work-${effectiveUser.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await sb.storage.from('barber-photos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = sb.storage.from('barber-photos').getPublicUrl(fileName);
      const newPhotos = [...currentPhotos, publicUrl];
      effectiveOnUpdateProfile({ ...effectiveUser, work_photos: newPhotos });
      await sb.from('profiles').update({ work_photos: newPhotos }).eq('id', effectiveUser.id);
    } catch (error) { alert('Erro: ' + error.message); }
    finally { setUploadingPhoto(false); event.target.value = ''; }
  };

  const handleRemoveWorkPhoto = async (index) => {
    if (isGuestBarber) return;
    const currentPhotos = [...(effectiveUser.work_photos || [])];
    currentPhotos.splice(index, 1);
    effectiveOnUpdateProfile({ ...effectiveUser, work_photos: currentPhotos });
    await sb.from('profiles').update({ work_photos: currentPhotos }).eq('id', effectiveUser.id);
  };

  const handleDeleteAccount = async () => {
    if (isGuestBarber) return;
    if (!window.confirm("Deseja realmente excluir sua conta profissional? Todos os dados serão apagados permanentemente.")) return;
    try {
      await sb.from('appointments').delete().eq('barber_id', effectiveUser.id);
      await sb.from('profiles').delete().eq('id', effectiveUser.id);
      localStorage.removeItem('salao_user_data'); alert("Conta excluída."); onLogout();
    } catch (e) { alert("Erro ao excluir: " + e.message); }
  };

  // Salva bio com debounce
  const handleBioChange = async (value) => {
    const trimmed = value.slice(0, 15);
    effectiveOnUpdateProfile({ ...effectiveUser, bio: trimmed });
  };

  const saveBio = async () => {
    if (isGuestBarber) return;
    await sb.from('profiles').update({ bio: effectiveUser.bio || '' }).eq('id', effectiveUser.id).catch(console.error);
  };

  const rating = getBarberRating(effectiveUser);
  const tabs = ['home', 'services', 'config', 'reports'];
  const tabLabels = { home: 'Início', services: 'Serviços', config: 'Perfil & Agenda', reports: 'Relatórios' };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {isGuestBarber && (
        <div className="bg-amber-500 text-white px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0"><Eye size={14} className="flex-shrink-0" /><p className="text-[11px] font-black uppercase tracking-tight truncate">Modo Demo — Nada será salvo</p></div>
          <button onClick={onLogout} className="flex-shrink-0 bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg active:scale-95 whitespace-nowrap">Fazer Login</button>
        </div>
      )}

      {/* Manual booking modal */}
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
              <button onClick={() => handleManualBookingConfirm(true)} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-95 transition-all">{manualName.trim() ? '✓ Reservar com Cliente' : '✓ Apenas Fechar Horário'}</button>
              <button onClick={() => handleManualBookingConfirm(false)} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm active:scale-95">Fechar sem Cliente</button>
              <button onClick={() => setShowManualModal(false)} className="w-full py-2 text-slate-400 font-bold text-xs">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Pay modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32} /></div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Libere Serviços Ilimitados</h2>
            {isGuestBarber ? (
              <><p className="text-slate-500 text-sm mb-6">Para ativar o plano, crie uma conta de profissional.</p><button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold" onClick={() => { setShowPayModal(false); onLogout(); }}>Criar conta / Fazer Login</button></>
            ) : (
              <><p className="text-slate-500 text-sm mb-6">Você atingiu o limite de <b>3 serviços gratuitos</b>.</p><button className="w-full py-4 bg-green-500 text-white rounded-xl font-bold" onClick={handlePayment} disabled={isPaying}>{isPaying ? "Processando..." : "Liberar Tudo (R$ 29,90/mês)"}</button></>
            )}
            <button onClick={() => setShowPayModal(false)} className="text-slate-400 text-sm font-bold block w-full mt-3">Agora não</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white p-6 border-b border-slate-100 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <StoryRing rating={rating} size={44}>
                {effectiveUser.avatar_url ? <img src={effectiveUser.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center bg-slate-100"><User size={16} className="text-slate-400" /></div>}
              </StoryRing>
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">{isGuestBarber ? 'Painel Demo' : `Painel ${effectiveUser.plano_ativo ? 'Pro' : 'Grátis'}`}</h2>
              {effectiveUser.bio && <p className="text-[9px] text-blue-500 font-bold italic">"{effectiveUser.bio}"</p>}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${effectiveUser.is_visible ? 'bg-green-500' : 'bg-slate-300'}`} />
                <p className="text-[10px] text-slate-500 font-bold uppercase">{effectiveUser.is_visible ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
            <button onClick={onLogout} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      {/* Nav tabs */}
      <nav className="px-4 py-3 flex gap-1.5 overflow-x-auto bg-white border-b border-slate-100 sticky top-[80px] z-10 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 py-2 px-3.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5
              ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 bg-slate-50'}
              ${tab === 'reports' ? 'ml-auto' : ''}`}>
            {tab === 'reports' && <BarChart2 size={11} />}
            {tabLabels[tab]}
          </button>
        ))}
      </nav>

      <main className="p-6 max-w-md mx-auto">

        {/* ── HOME TAB ── */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {!isGuestBarber && <CopyLinkButton barber={effectiveUser} />}

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

            {/* META DOS 30 ATENDIMENTOS */}
            <GoalCard
              totalAppointments={totalAppointmentsForGoal}
              slug={effectiveUser.slug}
              isGuest={isGuestBarber}
            />

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  Novas Solicitações
                  {dedupedPending.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{dedupedPending.length}</span>}
                </h3>
                {dedupedPending.length > 3 && (
                  <button onClick={() => setShowAllPending(!showAllPending)} className="text-[10px] font-black text-blue-600 uppercase tracking-tight border-b border-blue-200">
                    {showAllPending ? 'Ver menos' : `Ver todos (${dedupedPending.length})`}
                  </button>
                )}
              </div>
              {dedupedPending.length === 0
                ? <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50"><p className="text-slate-400 text-sm">Nenhuma solicitação nova.</p></div>
                : <>
                    {pendingToShow.map(app => (
                      <div key={app.id} className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1">{app.client_name || app.client}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{app.service_name || 'Serviço'}</p>
                            <div className="flex items-center gap-1.5 text-blue-600 font-bold mt-2 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                              <Clock size={12} strokeWidth={3} />
                              <span className="text-[10px]">{app.time} • {app.date?.split('-').reverse().join('/')}</span>
                            </div>
                          </div>
                          <div className="text-right"><p className="font-black text-slate-900 text-sm">R$ {app.price}</p><span className="text-[8px] text-orange-500 font-black uppercase">Pendente</span></div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => {
                            if (isGuestBarber) { alert("Para aceitar agendamentos, faça login!"); return; }
                            if (!app.id) return;
                            try {
                              await onUpdateStatus(app.id, 'confirmed');
                              if (app.date && app.time) await setSlotAvailability(app.date, app.time, false);
                              const msg = `Olá ${app.client_name || app.client}! Seu agendamento foi CONFIRMADO! ✅%0A📅 ${app.date?.split('-').reverse().join('/')} às ${app.time}`;
                              const fone = app.phone?.toString().replace(/\D/g, '');
                              if (fone) window.location.href = `https://wa.me/55${fone}?text=${msg}`;
                            } catch (err) { console.error(err); }
                          }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all active:scale-95">
                            <CheckCircle size={14} /> Aceitar
                          </button>
                          <button onClick={() => !isGuestBarber && onUpdateStatus(app.id, 'rejected')} className="p-3 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                            <XCircle size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>}
            </section>

            <section className="mt-8">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Calendar size={18} className="text-blue-500" /> Próximos na Agenda</h3>
              {allAppointments.length === 0
                ? <div className="py-8 text-center bg-slate-50 border border-slate-100 rounded-2xl"><p className="text-slate-400 text-sm">Sua agenda está vazia.</p></div>
                : <div className="space-y-3">
                    {allAppointments.filter((app, i, self) => i === self.findIndex(t => t.id === app.id)).map(app => (
                      <div key={app.id} className={`flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm ${app.isManual ? 'border-amber-200 border-l-4 border-l-amber-500' : 'border-slate-100 border-l-4 border-l-green-500'}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-black text-slate-900 text-sm">{app.client_name || app.client}</p>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${app.isManual ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{app.isManual ? 'Manual' : 'Confirmado'}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{app.service_name || 'Serviço'}</p>
                          <div className="flex items-center gap-1.5 text-blue-600 font-bold mt-0.5"><Clock size={12} strokeWidth={3} /><span className="text-[10px]">{app.time} • {app.date?.split('-').reverse().join('/')}</span></div>
                        </div>
                        <button onClick={() => {
                          if (window.confirm(`Cancelar o horário de ${app.client_name || app.client}?`)) {
                            if (app.isManual) {
                              const filtered = (effectiveUser.manual_appointments || []).filter(m => m.id !== app.id);
                              effectiveOnUpdateProfile({ ...effectiveUser, manual_appointments: filtered });
                              if (!isGuestBarber) sb.from('profiles').update({ manual_appointments: filtered }).eq('id', effectiveUser.id);
                              if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
                            } else {
                              if (!isGuestBarber) onUpdateStatus(app.id, 'rejected');
                              if (app.date && app.time) setSlotAvailability(app.date, app.time, true);
                            }
                          }
                        }} className="flex flex-col items-center justify-center gap-1 ml-4 p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                          <XCircle size={20} /><span className="text-[8px] font-black uppercase">Cancelar</span>
                        </button>
                      </div>
                    ))}
                  </div>}
            </section>
          </div>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-2xl mb-4">
              <p className="text-xs text-blue-700 font-medium">
                {isGuestBarber ? 'Modo Demo — explore os serviços (sem salvar)' : effectiveUser.plano_ativo ? 'Assinatura Profissional Ativa' : `Limite Grátis: ${effectiveUser.my_services?.length || 0}/3`}
              </p>
            </div>
            {MASTER_SERVICES.map(service => {
              const userServiceData = effectiveUser.my_services?.find(s => s.id === service.id);
              const isActive = !!userServiceData;
              return (
                <div key={service.id} className={`p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-slate-900 bg-white shadow-md' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleService(service.id, service.defaultPrice)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>{service.icon}</div>
                      <div><p className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{service.name}</p><p className="text-[10px] text-slate-400">{service.duration}</p></div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                      {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                  {isActive && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">PREÇO (R$)</span>
                      <input type="number" value={userServiceData.price || ''} onChange={e => updateServicePrice(service.id, e.target.value)}
                        className="w-24 text-right font-black text-lg bg-slate-50 rounded-md px-2 py-1 outline-none" />
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><PlusCircle size={16} className="text-purple-600" /> Serviços Personalizados</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Aparecem apenas no seu link de agendamento</p>
                </div>
                <button onClick={() => setShowAddCustomSvc(!showAddCustomSvc)} className={`p-2 rounded-xl transition-all ${showAddCustomSvc ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600'}`}>
                  {showAddCustomSvc ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>
              {(effectiveUser.custom_services || []).length > 0 && (
                <div className="space-y-2 mb-3">
                  {(effectiveUser.custom_services || []).map(cs => (
                    <div key={cs.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <div><p className="font-bold text-sm text-slate-900">{cs.name}</p><p className="text-[10px] text-slate-500">{cs.duration} · R$ {cs.price}</p></div>
                      <button onClick={() => removeCustomService(cs.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
              {showAddCustomSvc && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Novo Serviço</p>
                  <input type="text" value={newSvcName} onChange={e => setNewSvcName(e.target.value)} placeholder="Ex: Progressiva, Coloração..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-purple-400 transition-colors" />
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                      <input type="number" value={newSvcPrice} onChange={e => setNewSvcPrice(e.target.value)} placeholder="Preço"
                        className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 transition-colors" />
                    </div>
                    <select value={newSvcDuration} onChange={e => setNewSvcDuration(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
                      {['30min','45min','1h','1h 30min','2h'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <button onClick={addCustomService} disabled={!newSvcName.trim() || !newSvcPrice}
                    className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar Serviço
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONFIG TAB ── */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            {/* Work photos */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="font-bold text-slate-900">Fotos do Trabalho</h3><p className="text-[10px] text-slate-400 mt-0.5">Máx. 3 fotos · exibidas no link público</p></div>
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{(effectiveUser.work_photos || []).length}/3</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(effectiveUser.work_photos || []).map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={url} alt={`Trabalho ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => handleRemoveWorkPhoto(i)} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"><XCircle size={14} /></button>
                  </div>
                ))}
                {(effectiveUser.work_photos || []).length < 3 && (
                  <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${uploadingPhoto ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400'}`}>
                    {uploadingPhoto ? <Loader2 size={20} className="text-blue-500 animate-spin" /> : <><Image size={20} className="text-slate-400 mb-1" /><span className="text-[9px] font-black text-slate-400 uppercase">Adicionar</span></>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadWorkPhoto} disabled={uploadingPhoto} />
                  </label>
                )}
              </div>
            </section>

            {/* Profile config */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Configurações do Perfil</h3>
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <StoryRing rating={rating} size={96}>
                    {effectiveUser.avatar_url ? <img src={effectiveUser.avatar_url} className="w-full h-full object-cover" alt="Avatar" /> : <div className="w-full h-full flex items-center justify-center bg-slate-100"><User size={32} className="text-slate-300" /></div>}
                  </StoryRing>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md"><Camera size={16} /></label>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleUploadAvatar} />
                </div>
              </div>

              <div className="space-y-4">
                {/* BIO — nova funcionalidade, max 15 chars */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1"><Type size={11} /> Bio (tagline)</span>
                    <span className={`font-black text-[10px] ${(effectiveUser.bio?.length || 0) >= 15 ? 'text-red-500' : (effectiveUser.bio?.length || 0) >= 12 ? 'text-amber-500' : 'text-slate-400'}`}>
                      {effectiveUser.bio?.length || 0}/15
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={effectiveUser.bio || ''}
                    onChange={e => handleBioChange(e.target.value)}
                    onBlur={saveBio}
                    placeholder="Ex: Especialista em..."
                    className="w-full bg-slate-50 p-3 rounded-xl border-2 border-slate-200 text-sm font-medium outline-none focus:border-blue-400 transition-colors"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">Aparece no seu perfil, link público e no app. Máx. 15 caracteres.</p>
                  {effectiveUser.bio && (
                    <div className="mt-1.5 p-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
                      <span className="text-[9px] text-slate-400">Preview:</span>
                      <span className="text-[10px] text-blue-600 font-bold italic">"{effectiveUser.bio}"</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Endereço</label>
                  <input type="text" value={effectiveUser.address || ''} onChange={e => effectiveOnUpdateProfile({ ...effectiveUser, address: e.target.value })}
                    className="w-full mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-medium" />
                </div>
                <button onClick={() => {
                  if (isGuestBarber) { alert("Para salvar localização, faça login!"); return; }
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(pos => {
                      effectiveOnUpdateProfile({ ...effectiveUser, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                      alert("Localização capturada!");
                    });
                  }
                }} className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2">
                  <MapPin size={14} /> Capturar Minha Localização
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Loja Visível para Clientes</h3>
                  {isGuestBarber && <p className="text-[10px] text-amber-500 font-bold mt-0.5">Faça login para ativar</p>}
                </div>
                <div onClick={() => {
                  if (isGuestBarber) { alert("Para ativar sua loja, faça login como profissional!"); return; }
                  effectiveOnUpdateProfile({ ...effectiveUser, is_visible: !effectiveUser.is_visible });
                }} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${effectiveUser.is_visible ? 'bg-green-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${effectiveUser.is_visible ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="font-bold text-slate-900 text-sm mb-1">Duração do Atendimento</p>
                <div className="flex gap-2">
                  {['30min', '1h'].map(dur => (
                    <button key={dur} onClick={async () => {
                      const updated = { ...effectiveUser, appointment_duration: dur };
                      effectiveOnUpdateProfile(updated);
                      if (!isGuestBarber) await sb.from('profiles').update({ appointment_duration: dur }).eq('id', effectiveUser.id).catch(console.error);
                    }} className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all active:scale-95 ${appointmentDuration === dur ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                      {dur === '30min' ? '⏱ 30 min' : '🕐 1 hora'}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {!isGuestBarber && <CopyLinkButton barber={effectiveUser} />}

            {/* AGENDA */}
            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div onClick={() => setShowCalendar(!showCalendar)} className="p-5 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-3"><CalendarDays size={20} /><h3 className="font-bold text-sm">Horários Disponíveis</h3></div>
                <ChevronRight size={18} className={`transition-transform ${showCalendar ? 'rotate-90' : ''}`} />
              </div>
              {showCalendar && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={goConfigPrev} disabled={isPrevConfigDisabled} className={`p-2 rounded-full transition-all ${isPrevConfigDisabled ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'}`}><ChevronLeft size={18} /></button>
                    <span className="font-black text-sm text-slate-900">{MONTH_NAMES[configCalMonth]} {configCalYear}</span>
                    <button onClick={goConfigNext} className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all"><ChevronRight size={18} /></button>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <button onClick={markAllDaysInMonth} className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95">✓ Marcar Mês</button>
                    <button onClick={unmarkAllDaysInMonth} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-tight active:scale-95 hover:bg-red-50 hover:text-red-500">✕ Limpar Mês</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="text-[10px] font-black text-slate-300 text-center py-1">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {Array.from({ length: daysInConfigMonth }, (_, i) => {
                      const fullDate = formatDate(configCalYear, configCalMonth, i + 1);
                      const isSelected = selectedDateConfig === fullDate;
                      const isAvail = effectiveUser.available_slots?.[fullDate]?.length > 0;
                      return (
                        <button key={i} onClick={() => setSelectedDateConfig(fullDate)}
                          className={`aspect-square rounded-xl text-xs font-bold border transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isAvail ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">Horários — {selectedDateConfig.split('-').reverse().join('/')}</h4>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">{slotsForSelectedDay.length} de {filteredTimeSlots.length} abertos</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => selectAllSlotsForDay(selectedDateConfig)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase active:scale-95">+ Todos</button>
                        <button onClick={() => deselectAllSlotsForDay(selectedDateConfig)} className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase active:scale-95 hover:bg-red-100 hover:text-red-600">− Todos</button>
                      </div>
                    </div>
                    <div className="h-[1px] bg-slate-200 mb-3" />
                    <div className="grid grid-cols-4 gap-2">
                      {filteredTimeSlots.map(slot => {
                        const isOpen = effectiveUser.available_slots?.[selectedDateConfig]?.includes(slot);
                        return (
                          <button key={slot} onClick={() => toggleSlotForDate(selectedDateConfig, slot)}
                            className={`py-2 text-[10px] font-bold rounded-lg border transition-all active:scale-95 ${isOpen ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* WEBCAM SCANNER */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ScanLine size={16} className="text-blue-500" />
                <h3 className="font-bold text-sm text-slate-900">Scanner de Caderno</h3>
              </div>
              <WebcamScanner onScanResult={(parsedData) => {
                // Aqui você pode usar os dados para criar um agendamento manual
                console.log('Agendamento extraído do caderno:', parsedData);
                if (parsedData.date && parsedData.time) {
                  // Converter data DD/MM/AAAA para YYYY-MM-DD para salvar no slot
                  const parts = parsedData.date.split('/');
                  if (parts.length >= 2) {
                    const year = parts[2] || new Date().getFullYear().toString();
                    const isoDate = `${year}-${parts[1]}-${parts[0]}`;
                    // Criar agendamento manual com os dados extraídos
                    const newApp = {
                      id: `manual-scan-${Date.now()}`,
                      client: parsedData.clientName || 'Cliente (scanner)',
                      date: isoDate,
                      time: parsedData.time,
                      price: 0,
                      status: 'confirmed',
                      isManual: true,
                      service_name: parsedData.service || 'Serviço',
                    };
                    const updatedManual = [...(effectiveUser.manual_appointments || []), newApp];
                    // Fechar o slot na agenda
                    const currentSlots = { ...(effectiveUser.available_slots || {}) };
                    const daySlots = (currentSlots[isoDate] || []).filter(s => s !== parsedData.time);
                    const updatedSlots = { ...currentSlots, [isoDate]: daySlots };
                    effectiveOnUpdateProfile({ ...effectiveUser, manual_appointments: updatedManual, available_slots: updatedSlots });
                    if (!isGuestBarber) {
                      sb.from('profiles').update({ manual_appointments: updatedManual, available_slots: updatedSlots }).eq('id', effectiveUser.id).catch(console.error);
                    }
                  }
                }
              }} />
            </section>

            {/* Plan status */}
            <div className="pt-2 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-2xl border border-slate-200 w-full">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status do Plano</p>
                {isGuestBarber ? (
                  <><p className="text-sm font-black text-slate-900 mt-1">Modo Demonstração 👁️</p><button onClick={onLogout} className="mt-3 text-blue-600 font-bold text-xs">Criar conta / Fazer Login</button></>
                ) : (
                  <><p className="text-sm font-black text-slate-900 mt-1">{effectiveUser.plano_ativo ? 'Assinatura Profissional Ativa ✅' : 'Versão Gratuita'}</p>
                    {!effectiveUser.plano_ativo && <button onClick={() => setShowPayModal(true)} className="mt-3 text-blue-600 font-bold text-xs">Fazer Upgrade agora</button>}</>
                )}
              </div>
            </div>

            {!isGuestBarber && (
              <section>
                <div className="flex items-center gap-2 mb-3"><Headphones size={16} className="text-slate-500" /><h3 className="font-bold text-sm text-slate-900">Falar com Suporte</h3></div>
                <SupportChat user={effectiveUser} />
              </section>
            )}

            {isGuestBarber && (
              <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center">
                <p className="text-2xl mb-2">✂️</p>
                <h3 className="font-black text-slate-900 mb-1">Gostou do que viu?</h3>
                <p className="text-xs text-slate-500 mb-4">Crie sua conta profissional e comece a receber agendamentos hoje!</p>
                <button onClick={onLogout} className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-95 transition-all">Criar conta grátis</button>
              </section>
            )}

            <p className="text-[9px] text-slate-400 mt-4 text-center uppercase font-bold tracking-tighter pb-4">Salão Digital © 2026 · {APP_VERSION}</p>
          </div>
        )}

        {/* ── REPORTS TAB ── */}
        {activeTab === 'reports' && (
          <div className="space-y-2">
            <div className="mb-4">
              <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2"><BarChart2 size={20} className="text-blue-500" /> Relatórios</h2>
              <p className="text-xs text-slate-400">Análise do seu desempenho e tempo de trabalho</p>
            </div>
            {isGuestBarber && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-bold">⚠️ Modo demo — os dados são simulados.</div>
            )}
            <ReportsSection appointments={appointments} user={effectiveUser} onDeleteAccount={handleDeleteAccount} isGuest={isGuestBarber} onUpdateProfile={effectiveOnUpdateProfile} supabase={sb} />
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
  const [isGuestBarber, setIsGuestBarber] = useState(false);
  const [publicBarber, setPublicBarber] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    // Detecta preferência do sistema na primeira visita
    const saved = localStorage.getItem('salao_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    injectDarkModeCSS(isDark);
    injectScannerCSS();
    localStorage.setItem('salao_dark_mode', isDark);
  }, [isDark]);

  // Observa mudanças no tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (localStorage.getItem('salao_dark_mode') === null) {
        setIsDark(e.matches);
      }
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
      const slug = path.replace(/^\//, '').replace(/\/$/, '');
      if (!slug) { setLoading(false); restoreSession(); return; }
      try {
        const { data } = await supabase.from('profiles').select('*').eq('slug', slug).maybeSingle();
        if (data) { setPublicBarber(data); setLoading(false); return; }
      } catch (_) { }
      setLoading(false); restoreSession();
    };

    const restoreSession = async () => {
      try {
        const saved = localStorage.getItem('salao_user_data');
        if (!saved) return;
        const parsedUser = JSON.parse(saved);
        if (!parsedUser?.id || parsedUser?.isGuest) return;
        const { data: freshData } = await supabase.from('profiles').select('*').eq('id', parsedUser.id).maybeSingle();
        if (freshData) { setUser(freshData); setCurrentMode(freshData.role); localStorage.setItem('salao_user_data', JSON.stringify(freshData)); }
      } catch (err) { console.error("Erro ao restaurar sessão:", err); }
    };

    checkPublicRoute();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: bData } = await supabase.from('profiles').select('*').eq('role', 'barber').eq('is_visible', true);
      if (bData) setBarbers(bData);
      if (!user || user.isGuest || isGuestBarber) return;
      const { data: aData } = await supabase.from('appointments').select('*').or(`client_id.eq.${user.id},barber_id.eq.${user.id}`);
      if (aData) {
        const formatted = aData.map(a => ({ ...a, client: a.client_name, service: a.service_name, time: a.time, date: a.date, barberId: a.barber_id }));
        setAppointments(formatted);
      }
    };
    if (!loading) fetchData();
  }, [user, isGuestBarber, loading]);

  const handleSelectMode = (mode) => {
    if (mode === 'guest') { setUser({ id: 'guest', name: 'Visitante', isGuest: true }); setCurrentMode('client'); setIsGuestBarber(false); }
    else if (mode === 'guest-barber') { setUser({ id: 'guest-barber', name: 'Profissional Demo', isGuest: true, isGuestBarber: true }); setCurrentMode('barber'); setIsGuestBarber(true); }
    else { setCurrentMode(mode); setIsGuestBarber(false); }
  };

  const handleLogin = async (phone, password) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('phone', phone).eq('password', password).eq('role', currentMode).single();
    if (error || !data) throw new Error('Telefone ou senha incorretos.');
    localStorage.setItem('salao_user_data', JSON.stringify(data));
    setUser(data); setIsGuestBarber(false);
  };

  const handleRegister = async (name, phone, password) => {
    const slug = generateSlug(name, Date.now());
    const { data, error } = await supabase.from('profiles').insert([{
      name, phone, password, role: currentMode, is_visible: false, has_access: false,
      plano_ativo: true, my_services: [], available_slots: {}, available_dates: [], avatar_url: '',
      work_photos: [], custom_services: [], slug, onboarding_done: false, bio: '',
    }]).select().single();
    if (error) {
      if (error.code === '23505') throw new Error('Este WhatsApp já está cadastrado!');
      throw new Error(error.message);
    }
    const realSlug = generateSlug(name, data.id);
    await supabase.from('profiles').update({ slug: realSlug }).eq('id', data.id);
    const finalData = { ...data, slug: realSlug };
    localStorage.setItem('salao_user_data', JSON.stringify(finalData));
    setUser(finalData); setIsGuestBarber(false);
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
        address: updatedUser.address, latitude: updatedUser.latitude, longitude: updatedUser.longitude,
        avatar_url: updatedUser.avatar_url, is_visible: updatedUser.is_visible, plano_ativo: updatedUser.plano_ativo,
        my_services: updatedUser.my_services, available_dates: updatedUser.available_dates,
        available_slots: updatedUser.available_slots, manual_appointments: updatedUser.manual_appointments,
        appointment_duration: updatedUser.appointment_duration, work_photos: updatedUser.work_photos,
        custom_services: updatedUser.custom_services, slug: updatedUser.slug,
        onboarding_done: updatedUser.onboarding_done, hourly_rate: updatedUser.hourly_rate,
        bio: updatedUser.bio || '',
      };
      const { error } = await supabase.from('profiles').update(dataToSave).eq('id', updatedUser.id);
      if (error) throw error;
      setUser(updatedUser);
      localStorage.setItem('salao_user_data', JSON.stringify(updatedUser));
    } catch (error) { alert("Erro ao salvar: " + error.message); }
  };

  const handleLogout = () => {
    localStorage.removeItem('salao_user_data');
    setUser(null);
    setCurrentMode(null);
    setIsGuestBarber(false);
  };

  const isFirstTimeBarber = user && currentMode === 'barber' && !isGuestBarber && user.onboarding_done === false;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mb-4" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sincronizando...</p>
      </div>
    );
  }

  if (publicBarber) return <PublicBarberPage barber={publicBarber} />;

  return (
    <>
      {showWelcome && !user && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      {!currentMode && !user && (
        <WelcomeScreen onSelectMode={handleSelectMode} isDark={isDark} onToggleDark={handleToggleDark} />
      )}
      {currentMode && !user && (
        <AuthScreen userType={currentMode} onBack={() => setCurrentMode(null)} onLogin={handleLogin} onRegister={handleRegister} isDark={isDark} onToggleDark={handleToggleDark} />
      )}
      {user && (
        currentMode === 'barber'
          ? isFirstTimeBarber
            ? <BarberOnboarding user={user} supabase={supabase}
                onComplete={u => { setUser(u); localStorage.setItem('salao_user_data', JSON.stringify(u)); }}
                onSkip={u => { setUser(u); localStorage.setItem('salao_user_data', JSON.stringify(u)); }} />
            : <BarberDashboard user={user} appointments={appointments} onLogout={handleLogout}
                onUpdateStatus={handleUpdateStatus} onUpdateProfile={handleUpdateProfile}
                MASTER_SERVICES={MASTER_SERVICES} GLOBAL_TIME_SLOTS={GLOBAL_TIME_SLOTS}
                supabase={supabase} isGuestBarber={isGuestBarber}
                isDark={isDark} onToggleDark={handleToggleDark} />
          : <ClientApp user={user} barbers={barbers} appointments={appointments} onLogout={handleLogout}
              onBookingSubmit={() => {}} onUpdateStatus={handleUpdateStatus}
              MASTER_SERVICES={MASTER_SERVICES}
              isDark={isDark} onToggleDark={handleToggleDark} />
      )}
    </>
  );
}