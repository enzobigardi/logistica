import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Package, Users, Building2, ShoppingCart,
  Warehouse, Factory, Truck, BarChart3, Leaf, FileText,
  Settings, Bell, Search, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, MapPin, LogOut, X, Plus, Filter, Download,
  RefreshCw, Star, Calendar, DollarSign, Activity,
  Layers, UserCheck, Fuel, Recycle, Shield, Home,
  Lock, User, Eye, Edit, Trash2, ChevronDown, ChevronUp,
  ArrowUpRight, ArrowDownRight, Route, Zap, Target,
  MoreVertical, Check, Circle, Inbox, Send, Archive,
  PieChart as PieIcon, LineChart as LineIcon, BarChart2,
  Maximize2, Info, Globe, Phone, Mail, ExternalLink,
  Package2, AlertCircle, ThumbsUp, Repeat, Menu
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Module =
  | "dashboard" | "products" | "suppliers" | "customers"
  | "procurement" | "inventory" | "warehouse" | "production"
  | "distribution" | "transport" | "kpis" | "sustainability"
  | "reports" | "settings";
type Role = "Administrador" | "Supervisor" | "Operador";
interface AppUser { name: string; role: Role; email: string; initials: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const stockData = [
  { month: "Jan", entrada: 4200, saida: 3100, saldo: 8400 },
  { month: "Fev", entrada: 3800, saida: 2900, saldo: 9300 },
  { month: "Mar", entrada: 5100, saida: 4200, saldo: 10200 },
  { month: "Abr", entrada: 4700, saida: 3800, saldo: 11100 },
  { month: "Mai", entrada: 6200, saida: 5100, saldo: 12200 },
  { month: "Jun", entrada: 5800, saida: 4600, saldo: 13400 },
];
const productionData = [
  { day: "Seg", meta: 500, real: 487, efic: 97.4 },
  { day: "Ter", meta: 500, real: 512, efic: 102.4 },
  { day: "Qua", meta: 500, real: 498, efic: 99.6 },
  { day: "Qui", meta: 500, real: 534, efic: 106.8 },
  { day: "Sex", meta: 500, real: 471, efic: 94.2 },
  { day: "Sáb", meta: 300, real: 289, efic: 96.3 },
];
const deliveryPie = [
  { name: "Entregue", value: 68, color: "#10b981" },
  { name: "Em rota", value: 18, color: "#2563eb" },
  { name: "Atrasado", value: 9, color: "#f59e0b" },
  { name: "Cancelado", value: 5, color: "#ef4444" },
];
const costData = [
  { month: "Jan", custo: 182000, prev: 190000 },
  { month: "Fev", custo: 168000, prev: 175000 },
  { month: "Mar", custo: 195000, prev: 185000 },
  { month: "Abr", custo: 172000, prev: 180000 },
  { month: "Mai", custo: 210000, prev: 200000 },
  { month: "Jun", custo: 198000, prev: 205000 },
];
const radarData = [
  { subject: "Estoque", A: 88 },
  { subject: "Produção", A: 96 },
  { subject: "Entrega", A: 91 },
  { subject: "Compras", A: 84 },
  { subject: "Armazém", A: 73 },
  { subject: "Qualidade", A: 94 },
];
const products = [
  { id: "PRD-001", name: "Parafuso Sextavado M8", cat: "Fixadores", supplier: "MetalBras Ltda", qty: 4800, min: 500, loc: "A-12-03", weight: "0,08 kg", status: "ok" },
  { id: "PRD-002", name: "Válvula de Pressão 3/4\"", cat: "Hidráulica", supplier: "HidroSul S.A.", qty: 87, min: 100, loc: "B-05-14", weight: "1,2 kg", status: "low" },
  { id: "PRD-003", name: "Correia Dentada TR-180", cat: "Transmissão", supplier: "BeltTech Brasil", qty: 230, min: 50, loc: "C-08-02", weight: "0,45 kg", status: "ok" },
  { id: "PRD-004", name: "Óleo Lubrificante 20L", cat: "Lubrificantes", supplier: "PetroQuímica SP", qty: 42, min: 80, loc: "D-01-07", weight: "17 kg", status: "low" },
  { id: "PRD-005", name: "Motor Elétrico 5CV", cat: "Elétrica", supplier: "EletroMax Ind.", qty: 15, min: 10, loc: "E-03-01", weight: "28 kg", status: "ok" },
  { id: "PRD-006", name: "Tubo PVC 100mm (6m)", cat: "Tubulação", supplier: "PlastFlex Brasil", qty: 620, min: 200, loc: "F-11-05", weight: "4,2 kg", status: "ok" },
  { id: "PRD-007", name: "Rolamento SKF 6205", cat: "Rolamentos", supplier: "SKF Brasil", qty: 340, min: 100, loc: "A-03-08", weight: "0,12 kg", status: "ok" },
  { id: "PRD-008", name: "Fusível 20A NH", cat: "Elétrica", supplier: "EletroMax Ind.", qty: 28, min: 50, loc: "B-08-02", weight: "0,05 kg", status: "low" },
];
const suppliers = [
  { id: "FOR-001", name: "MetalBras Ltda", cnpj: "12.345.678/0001-90", city: "São Paulo, SP", contact: "Carlos Mendes", phone: "(11) 3456-7890", email: "carlos@metalbras.com.br", rating: 4.8, orders: 142, spend: 487000, status: "ativo", since: "Mar 2019" },
  { id: "FOR-002", name: "HidroSul S.A.", cnpj: "23.456.789/0001-11", city: "Porto Alegre, RS", contact: "Ana Ferreira", phone: "(51) 2345-6789", email: "ana@hidrosul.com.br", rating: 4.2, orders: 98, spend: 213000, status: "ativo", since: "Jun 2020" },
  { id: "FOR-003", name: "BeltTech Brasil", cnpj: "34.567.890/0001-22", city: "Curitiba, PR", contact: "Paulo Rocha", phone: "(41) 3456-8901", email: "paulo@belttech.com.br", rating: 4.6, orders: 67, spend: 128000, status: "ativo", since: "Ago 2021" },
  { id: "FOR-004", name: "PetroQuímica SP", cnpj: "45.678.901/0001-33", city: "Campinas, SP", contact: "Juliana Lima", phone: "(19) 3234-5678", email: "juliana@petroquimica.com.br", rating: 3.9, orders: 203, spend: 892000, status: "inativo", since: "Jan 2018" },
  { id: "FOR-005", name: "EletroMax Ind.", cnpj: "56.789.012/0001-44", city: "Belo Horizonte, MG", contact: "Roberto Silva", phone: "(31) 3456-2345", email: "roberto@eletromax.com.br", rating: 4.5, orders: 55, spend: 176000, status: "ativo", since: "Nov 2022" },
  { id: "FOR-006", name: "PlastFlex Brasil", cnpj: "67.890.123/0001-55", city: "Joinville, SC", contact: "Fernanda Teixeira", phone: "(47) 3456-7890", email: "fernanda@plastflex.com.br", rating: 4.3, orders: 89, spend: 94000, status: "ativo", since: "Feb 2021" },
];
const orders = [
  { id: "OC-2024-0891", supplier: "MetalBras Ltda", date: "24/06/2024", delivery: "01/07/2024", total: 38450, status: "aprovado", items: 12, priority: "alta" },
  { id: "OC-2024-0892", supplier: "HidroSul S.A.", date: "24/06/2024", delivery: "03/07/2024", total: 12800, status: "aguardando", items: 5, priority: "normal" },
  { id: "OC-2024-0893", supplier: "BeltTech Brasil", date: "23/06/2024", delivery: "28/06/2024", total: 7200, status: "entregue", items: 3, priority: "baixa" },
  { id: "OC-2024-0894", supplier: "EletroMax Ind.", date: "22/06/2024", delivery: "30/06/2024", total: 89600, status: "em_transito", items: 8, priority: "alta" },
  { id: "OC-2024-0895", supplier: "PlastFlex Brasil", date: "21/06/2024", delivery: "—", total: 4350, status: "cancelado", items: 2, priority: "baixa" },
  { id: "OC-2024-0890", supplier: "MetalBras Ltda", date: "20/06/2024", delivery: "25/06/2024", total: 21900, status: "entregue", items: 7, priority: "normal" },
];
const deliveries = [
  { id: "ENT-0412", client: "Construtora Omega S.A.", dest: "São Paulo, SP", driver: "Marcos Oliveira", vehicle: "Mercedes Axor — ABG-5821", date: "25/06 14:30", status: "Em rota", weight: "3,4 t", vol: "12 m³" },
  { id: "ENT-0413", client: "Indústrias Prata Ltda", dest: "Guarulhos, SP", driver: "José Santos", vehicle: "Scania R450 — CDE-3190", date: "25/06 10:00", status: "Entregue", weight: "1,8 t", vol: "6 m³" },
  { id: "ENT-0414", client: "Comércio Delta ME", dest: "Osasco, SP", driver: "Ricardo Nunes", vehicle: "VW Constellation — FGH-7432", date: "25/06 08:15", status: "Atrasado", weight: "0,9 t", vol: "4 m³" },
  { id: "ENT-0415", client: "Grupo Alfa Logística", dest: "Barueri, SP", driver: "Paulo Lima", vehicle: "Volvo FH — IJK-2201", date: "26/06 09:00", status: "Em separação", weight: "5,1 t", vol: "18 m³" },
  { id: "ENT-0416", client: "Beta Distribuidora", dest: "Santo André, SP", driver: "Fábio Rocha", vehicle: "Mercedes Actros — LMN-4320", date: "26/06 11:30", status: "Em separação", weight: "2,2 t", vol: "8 m³" },
];
const sustainData = [
  { month: "Jan", co2: 48.2, fuel: 12400, recyc: 3200 },
  { month: "Fev", co2: 44.1, fuel: 11800, recyc: 3600 },
  { month: "Mar", co2: 51.7, fuel: 13100, recyc: 2900 },
  { month: "Abr", co2: 46.3, fuel: 12200, recyc: 4100 },
  { month: "Mai", co2: 43.8, fuel: 11500, recyc: 4400 },
  { month: "Jun", co2: 41.2, fuel: 10900, recyc: 4800 },
];
const alerts = [
  { id: 1, type: "critical", icon: AlertTriangle, text: "Óleo Lubrificante 20L abaixo do estoque mínimo", time: "5 min", read: false },
  { id: 2, type: "critical", icon: AlertTriangle, text: "Válvula de Pressão 3/4\" — reposição urgente", time: "12 min", read: false },
  { id: 3, type: "info", icon: CheckCircle2, text: "OC-2024-0893 entregue com sucesso", time: "1h 20min", read: false },
  { id: 4, type: "info", icon: Truck, text: "4 entregas confirmadas para amanhã", time: "2h", read: true },
  { id: 5, type: "warn", icon: Clock, text: "ENT-0414 — atraso de 45 min na entrega", time: "3h", read: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => n.toLocaleString("pt-BR");
const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

function Badge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    ok: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: "Normal" },
    low: { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", label: "Estoque Baixo" },
    ativo: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: "Ativo" },
    inativo: { cls: "bg-slate-100 text-slate-500 ring-1 ring-slate-200", label: "Inativo" },
    aprovado: { cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", label: "Aprovado" },
    aguardando: { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", label: "Aguardando" },
    entregue: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: "Entregue" },
    em_transito: { cls: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", label: "Em Trânsito" },
    cancelado: { cls: "bg-red-50 text-red-600 ring-1 ring-red-200", label: "Cancelado" },
    "Em rota": { cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", label: "Em Rota" },
    Entregue: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", label: "Entregue" },
    Atrasado: { cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", label: "Atrasado" },
    "Em separação": { cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", label: "Em Separação" },
    alta: { cls: "bg-red-50 text-red-600 ring-1 ring-red-200", label: "Alta" },
    normal: { cls: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", label: "Normal" },
    baixa: { cls: "bg-slate-50 text-slate-400 ring-1 ring-slate-100", label: "Baixa" },
  };
  const { cls, label } = cfg[status] || { cls: "bg-slate-100 text-slate-500", label: status };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${cls}`}>{label}</span>;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">{rating}</span>
    </span>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const h = 32, w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "", suffix = "" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color || p.fill }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-800">{prefix}{typeof p.value === "number" ? fmt(p.value) : p.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}
        style={{ scrollbarWidth: "thin" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-bold text-base text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (u: AppUser) => void }) {
  const [email, setEmail] = useState("admin@flowlog.com.br");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);

  const demo = [
    { label: "Administrador", email: "admin@flowlog.com.br", pass: "admin123", color: "bg-violet-500" },
    { label: "Supervisor", email: "supervisor@flowlog.com.br", pass: "super123", color: "bg-blue-500" },
    { label: "Operador", email: "operador@flowlog.com.br", pass: "oper123", color: "bg-slate-400" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    setTimeout(() => {
      if (email === "admin@flowlog.com.br" && password === "admin123")
        onLogin({ name: "Ricardo Almeida", role: "Administrador", email, initials: "RA" });
      else if (email === "supervisor@flowlog.com.br" && password === "super123")
        onLogin({ name: "Mariana Costa", role: "Supervisor", email, initials: "MC" });
      else if (email === "operador@flowlog.com.br" && password === "oper123")
        onLogin({ name: "João Ferreira", role: "Operador", email, initials: "JF" });
      else { setErr("E-mail ou senha incorretos."); setLoading(false); }
    }, 900);
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] bg-[#0f1c3a] p-12 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-[#2563eb]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] bg-[#7c3aed]/15 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>FlowLog</div>
              <div className="text-blue-400/70 text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5">ERP Logístico</div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Gestão logística integrada de ponta a ponta
            </h1>
            <p className="text-blue-300/70 text-sm leading-relaxed mb-12">
              Controle toda a sua cadeia — de suprimentos à entrega — em uma única plataforma corporativa.
            </p>
            <div className="space-y-4">
              {[
                { icon: Package2, label: "Estoque em tempo real", desc: "Visibilidade total de todos os depósitos" },
                { icon: Route, label: "Rastreamento de frota", desc: "Monitoramento ao vivo de todas as entregas" },
                { icon: BarChart2, label: "Indicadores estratégicos", desc: "KPIs e dashboards para decisão executiva" },
              ].map(f => (
                <div key={f.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                    <f.icon size={16} className="text-blue-300" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{f.label}</div>
                    <div className="text-blue-300/60 text-xs">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-8 border-t border-white/10">
            <div className="flex -space-x-2">
              {["RA","MC","JF","PL"].map((i,idx) => (
                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#0f1c3a]" style={{ zIndex: 4-idx }}>
                  {i}
                </div>
              ))}
            </div>
            <p className="text-blue-300/60 text-xs">+24 usuários ativos agora</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-[#2563eb] rounded-xl flex items-center justify-center">
              <Layers size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>FlowLog ERP</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Entrar no sistema</h2>
            <p className="text-slate-500 text-sm mb-7">Utilize suas credenciais corporativas</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Senha</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline">Esqueci a senha</button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
              {err && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
                  <AlertCircle size={14} className="shrink-0" />{err}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] active:scale-[0.99] text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-blue-200 mt-2">
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <Shield size={15} />}
                {loading ? "Autenticando…" : "Acessar Sistema"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-3">Acesso rápido (demo)</p>
              <div className="space-y-2">
                {demo.map(d => (
                  <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.pass); setErr(""); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left group">
                    <div className={`w-7 h-7 ${d.color} rounded-lg flex items-center justify-center shrink-0`}>
                      <User size={13} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-700">{d.label}</div>
                      <div className="text-[11px] text-slate-400">{d.email}</div>
                    </div>
                    <ChevronRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-slate-400 text-xs mt-6">© 2024 FlowLog ERP · v3.2.1</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: null },
  { id: "products", label: "Produtos", icon: Package, group: "Operações" },
  { id: "suppliers", label: "Fornecedores", icon: Building2, group: "Operações" },
  { id: "customers", label: "Clientes", icon: Users, group: "Operações" },
  { id: "procurement", label: "Suprimentos", icon: ShoppingCart, group: "Operações" },
  { id: "inventory", label: "Estoque", icon: Layers, group: "Operações" },
  { id: "warehouse", label: "Armazenagem", icon: Warehouse, group: "Operações" },
  { id: "production", label: "Produção", icon: Factory, group: "Produção" },
  { id: "distribution", label: "Distribuição", icon: Package2, group: "Produção" },
  { id: "transport", label: "Transporte", icon: Truck, group: "Produção" },
  { id: "kpis", label: "Indicadores", icon: BarChart3, group: "Análise" },
  { id: "sustainability", label: "Sustentabilidade", icon: Leaf, group: "Análise" },
  { id: "reports", label: "Relatórios", icon: FileText, group: "Análise" },
  { id: "settings", label: "Configurações", icon: Settings, group: "Sistema" },
] as const;

function Sidebar({ active, onNav, collapsed, user }: { active: Module; onNav: (m: Module) => void; collapsed: boolean; user: AppUser }) {
  const groups = ["Operações", "Produção", "Análise", "Sistema"];
  const roleColor = { Administrador: "bg-violet-500", Supervisor: "bg-blue-500", Operador: "bg-slate-400" }[user.role];

  return (
    <aside className={`flex flex-col bg-[#0a1628] h-full transition-all duration-300 ease-in-out ${collapsed ? "w-[60px]" : "w-[220px]"} shrink-0 border-r border-white/5`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 h-14 border-b border-white/8 shrink-0 ${collapsed ? "justify-center px-2" : "px-4"}`}>
        <div className="w-7 h-7 bg-[#2563eb] rounded-lg flex items-center justify-center shrink-0">
          <Layers size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-[15px] leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>FlowLog</div>
            <div className="text-blue-400/50 text-[9px] tracking-[0.2em] uppercase leading-none mt-0.5">ERP</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3" style={{ scrollbarWidth: "none" }}>
        {/* Dashboard — no group */}
        {nav.filter(n => !n.group).map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <div key={item.id} className={`px-2 mb-0.5`}>
              <button onClick={() => onNav(item.id as Module)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/40" : "text-slate-400 hover:text-white hover:bg-white/6"}
                  ${collapsed ? "justify-center" : ""}`}>
                <Icon size={16} className="shrink-0" />
                {!collapsed && <span className="truncate text-[13px]">{item.label}</span>}
              </button>
            </div>
          );
        })}

        {/* Grouped items */}
        {groups.map(group => {
          const items = nav.filter(n => n.group === group);
          return (
            <div key={group} className="mt-4">
              {!collapsed && (
                <div className="px-4 mb-1">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-[0.1em]">{group}</span>
                </div>
              )}
              {collapsed && <div className="mx-2 mb-1 h-px bg-white/8" />}
              <div className="px-2 space-y-0.5">
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button key={item.id} onClick={() => onNav(item.id as Module)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all
                        ${isActive ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/40" : "text-slate-500 hover:text-white hover:bg-white/6"}
                        ${collapsed ? "justify-center" : ""}`}>
                      <Icon size={15} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className={`border-t border-white/8 p-3 shrink-0`}>
        {collapsed ? (
          <div className={`w-8 h-8 ${roleColor} rounded-full flex items-center justify-center text-white text-[11px] font-bold mx-auto`}>
            {user.initials}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 ${roleColor} rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
              {user.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-white text-xs font-semibold truncate">{user.name}</div>
              <div className="text-slate-500 text-[11px] truncate">{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ collapsed, onToggle, module: mod, user, onLogout }: {
  collapsed: boolean; onToggle: () => void; module: string; user: AppUser; onLogout: () => void;
}) {
  const label = nav.find(n => n.id === mod)?.label || "Dashboard";
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(alerts);
  const unread = notifs.filter(n => !n.read).length;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0 z-20 relative">
      <button onClick={onToggle}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
        {collapsed ? <Menu size={15} /> : <ChevronLeft size={15} />}
      </button>

      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-slate-400">FlowLog ERP</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-700 font-semibold">{label}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Buscar no sistema…"
            className="w-52 pl-8 pr-3 py-1.5 text-[13px] border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all" />
        </div>

        <div ref={ref} className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 transition-colors">
            <Bell size={15} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-semibold text-sm text-slate-800">Notificações</span>
                <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
                  className="text-xs text-blue-600 hover:underline font-medium">Marcar todas como lidas</button>
              </div>
              <div className="max-h-72 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                {notifs.map(n => {
                  const Icon = n.icon;
                  const color = n.type === "critical" ? "text-red-500" : n.type === "warn" ? "text-amber-500" : "text-emerald-500";
                  const bg = n.type === "critical" ? "bg-red-50" : n.type === "warn" ? "bg-amber-50" : "bg-emerald-50";
                  return (
                    <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 ${!n.read ? "bg-blue-50/30" : ""}`}>
                      <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon size={14} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-700 leading-snug">{n.text}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.time} atrás</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button onClick={onLogout}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-slate-400 transition-colors">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, gradient, trend, trendVal, spark }: {
  icon: any; label: string; value: string; sub?: string;
  gradient: string; trend?: "up" | "down"; trendVal?: string; spark?: number[];
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient} shadow-sm`}>
          <Icon size={18} className="text-white" />
        </div>
        <div className="text-right">
          {trend && trendVal && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold mb-1 justify-end ${trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
              {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trendVal}
            </div>
          )}
          {spark && <Sparkline data={spark} color={trend === "up" ? "#10b981" : "#ef4444"} />}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-0.5 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
      <div className="text-[13px] font-semibold text-slate-700">{label}</div>
      {sub && <div className="text-[12px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onNav }: { onNav: (m: Module) => void }) {
  const [period, setPeriod] = useState<"7d" | "30d" | "6m">("6m");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Bom dia, Ricardo 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Quarta-feira, 25 de junho de 2024 · São Paulo, SP</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {(["7d","30d","6m"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? "bg-[#2563eb] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "6 meses"}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertTriangle size={16} className="text-amber-500 shrink-0" />
        <span className="text-sm text-amber-700 font-medium">2 produtos com estoque abaixo do mínimo requerem reposição imediata.</span>
        <button onClick={() => onNav("inventory")} className="ml-auto text-xs font-semibold text-amber-700 hover:underline shrink-0 flex items-center gap-1">
          Ver estoque <ExternalLink size={11} />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Package} label="Itens em Estoque" value="48.291" sub="12 produtos em alerta" gradient="bg-gradient-to-br from-blue-500 to-blue-600" trend="up" trendVal="+3.2%" spark={[42,44,43,46,47,48,48.3]} />
        <KpiCard icon={ShoppingCart} label="Pedidos Pendentes" value="187" sub="23 aguardando aprovação" gradient="bg-gradient-to-br from-amber-400 to-amber-500" trend="down" trendVal="-5.1%" spark={[210,205,200,198,195,190,187]} />
        <KpiCard icon={Truck} label="Entregas Ativas" value="34" sub="4 com atraso" gradient="bg-gradient-to-br from-sky-500 to-sky-600" trend="up" trendVal="+8.0%" spark={[28,30,29,31,32,33,34]} />
        <KpiCard icon={DollarSign} label="Faturamento Mensal" value="R$ 4,87M" sub="meta: R$ 4,5M" gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" trend="up" trendVal="+8.2%" spark={[4.1,4.2,4.3,4.4,4.6,4.7,4.87]} />
        <KpiCard icon={Factory} label="Produção Diária" value="487 un" sub="97,4% da meta" gradient="bg-gradient-to-br from-violet-500 to-violet-600" trend="down" trendVal="-2.6%" spark={[510,495,512,534,498,487,487]} />
        <KpiCard icon={Activity} label="Custo Logístico" value="R$ 198K" sub="4,1% do faturamento" gradient="bg-gradient-to-br from-rose-500 to-rose-600" trend="down" trendVal="-5.7%" spark={[210,205,198,195,200,202,198]} />
        <KpiCard icon={Target} label="Nível de Serviço" value="96,4%" sub="pedidos no prazo" gradient="bg-gradient-to-br from-teal-500 to-teal-600" trend="up" trendVal="+0.8%" spark={[94,93,95,96,95.8,96.2,96.4]} />
        <KpiCard icon={Zap} label="Eficiência Geral" value="91,2%" sub="vs 89,5% mês anterior" gradient="bg-gradient-to-br from-indigo-500 to-indigo-600" trend="up" trendVal="+1.7%" spark={[88,89,89.5,90,90.8,91,91.2]} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Movimentação de Estoque</h3>
              <p className="text-xs text-slate-400 mt-0.5">Entradas e saídas mensais</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />Entrada</div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />Saída</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={stockData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g-entrada" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-saida" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="entrada" name="Entrada" stroke="#2563eb" fill="url(#g-entrada)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#2563eb" }} />
              <Area type="monotone" dataKey="saida" name="Saída" stroke="#10b981" fill="url(#g-saida)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#10b981" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <h3 className="font-bold text-sm text-slate-800 mb-1">Status das Entregas</h3>
          <p className="text-xs text-slate-400 mb-4">Total: 1.847 este mês</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={deliveryPie} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={4} dataKey="value" strokeWidth={0}>
                {deliveryPie.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip suffix="%" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {deliveryPie.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-slate-500 flex-1">{d.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, background: d.color }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-8 text-right">{d.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Produção Semanal</h3>
              <p className="text-xs text-slate-400 mt-0.5">Meta vs. realizado</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">99,3% da meta</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={productionData} barGap={4} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="meta" name="Meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="real" name="Realizado" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Custo Logístico</h3>
              <p className="text-xs text-slate-400 mt-0.5">Real vs. previsto (R$)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={costData} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip prefix="R$ " />} />
              <Line type="monotone" dataKey="prev" name="Previsto" stroke="#e2e8f0" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="custo" name="Realizado" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent deliveries */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-800">Entregas Recentes</h3>
          <button onClick={() => onNav("transport")} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            Ver todas <ExternalLink size={11} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {deliveries.slice(0, 4).map(d => (
            <div key={d.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
              <div className="w-[80px] text-[11px] font-mono font-semibold text-slate-400 shrink-0">{d.id}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700 truncate">{d.client}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} />{d.dest}</div>
              </div>
              <div className="text-xs text-slate-400 hidden md:block">{d.driver}</div>
              <div className="text-xs text-slate-400 hidden lg:flex items-center gap-1"><Clock size={10} />{d.date}</div>
              <Badge status={d.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────────
function ProductsModule() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low">("all");
  const [selected, setSelected] = useState<typeof products[0] | null>(null);
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" }>({ col: "id", dir: "asc" });

  const filtered = products
    .filter(p => filter === "all" || p.status === "low")
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()));

  function toggleSort(col: string) {
    setSort(s => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" });
  }
  const SortIcon = ({ col }: { col: string }) => sort.col === col
    ? (sort.dir === "asc" ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />)
    : <ChevronDown size={12} className="text-slate-300" />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Gestão de Produtos</h1>
          <p className="text-sm text-slate-500">{products.length} produtos · {products.filter(p => p.status === "low").length} em alerta</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <Upload size={13} /> Importar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <Download size={13} /> Exportar
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-all shadow-sm shadow-blue-200">
            <Plus size={13} /> Novo Produto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou categoria…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300" />
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {[{ id: "all", label: "Todos" }, { id: "low", label: "⚠ Críticos" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.id ? "bg-[#2563eb] text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
          <Filter size={13} /> Filtros
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[["id","Código"],["name","Produto"],["cat","Categoria"],["supplier","Fornecedor"],["qty","Qtd"],["loc","Localização"],["status","Status"]].map(([col, label]) => (
                  <th key={col} onClick={() => toggleSort(col)}
                    className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none">
                    <div className="flex items-center gap-1">{label}<SortIcon col={col} /></div>
                  </th>
                ))}
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selected?.id === p.id ? "bg-blue-50/50" : ""}`}
                  onClick={() => setSelected(p)}>
                  <td className="px-4 py-3.5 font-mono text-[11px] font-medium text-slate-400">{p.id}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.weight}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-medium">{p.cat}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{p.supplier}</td>
                  <td className="px-4 py-3.5">
                    <div className={`font-bold text-sm ${p.qty < p.min ? "text-red-500" : "text-slate-800"}`}>{fmt(p.qty)}</div>
                    <div className="text-[11px] text-slate-400">mín: {fmt(p.min)}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">{p.loc}</td>
                  <td className="px-4 py-3.5"><Badge status={p.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={13} /></button>
                      <button onClick={e => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors"><Edit size={13} /></button>
                      <button onClick={e => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">{filtered.length} de {products.length} produtos</span>
          <div className="flex gap-1">
            {[1,2,3,"…",12].map((n,i) => (
              <button key={i} className={`w-7 h-7 text-xs rounded-lg ${n===1 ? "bg-[#2563eb] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}>{n}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Side detail */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">{selected.id}</div>
                <Badge status={selected.status} />
              </div>
            </div>
            {[
              ["Categoria", selected.cat],
              ["Fornecedor", selected.supplier],
              ["Qtd. em Estoque", fmt(selected.qty) + " un"],
              ["Estoque Mínimo", fmt(selected.min) + " un"],
              ["Localização", selected.loc],
              ["Peso", selected.weight],
            ].map(([k, v]) => (
              <div key={k as string} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-xs text-slate-500 font-medium">{k}</span>
                <span className="text-xs font-semibold text-slate-800">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 text-xs font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-colors">Editar Produto</button>
              <button className="flex-1 py-2 text-xs font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">Histórico</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Suppliers ────────────────────────────────────────────────────────────────
function SuppliersModule() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<typeof suppliers[0] | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Fornecedores</h1>
          <p className="text-sm text-slate-500">{suppliers.filter(s=>s.status==="ativo").length} ativos · {suppliers.filter(s=>s.status==="inativo").length} inativos</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-0.5 bg-white border border-slate-200 rounded-xl p-1">
            {[{id:"grid",icon:BarChart2},{id:"list",icon:Activity}].map(v=>(
              <button key={v.id} onClick={()=>setView(v.id as any)}
                className={`w-8 h-7 rounded-lg flex items-center justify-center transition-all ${view===v.id ? "bg-[#2563eb] text-white" : "text-slate-400 hover:text-slate-600"}`}>
                <v.icon size={13} />
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] shadow-sm shadow-blue-200 transition-all">
            <Plus size={13} /> Novo Fornecedor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} onClick={() => setSelected(s)}
            className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all cursor-pointer ${selected?.id===s.id ? "border-blue-400 shadow-md" : "border-slate-200 hover:border-slate-300"}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                  {s.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{s.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">{s.cnpj}</div>
                </div>
              </div>
              <Badge status={s.status} />
            </div>
            <div className="space-y-1.5 text-xs text-slate-500 mb-4">
              <div className="flex items-center gap-2"><MapPin size={11} className="text-slate-400" />{s.city}</div>
              <div className="flex items-center gap-2"><UserCheck size={11} className="text-slate-400" />{s.contact}</div>
              <div className="flex items-center gap-2"><Phone size={11} className="text-slate-400" />{s.phone}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl mb-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Pedidos</div>
                <div className="text-sm font-bold text-slate-800">{s.orders}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">Gasto Total</div>
                <div className="text-sm font-bold text-slate-800">{fmtBRL(s.spend)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Stars rating={s.rating} />
              <div className="flex gap-1">
                <button onClick={e=>{e.stopPropagation()}} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"><Eye size={12} /></button>
                <button onClick={e=>{e.stopPropagation()}} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"><Edit size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name || ""} wide>
        {selected && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informações</h3>
              {[["CNPJ",selected.cnpj],["Cidade",selected.city],["Contato",selected.contact],["Telefone",selected.phone],["E-mail",selected.email],["Cliente desde",selected.since]].map(([k,v])=>(
                <div key={k as string} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs text-slate-500">{k}</span>
                  <span className="text-xs font-semibold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Desempenho</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{label:"Pedidos",value:selected.orders},{label:"Gasto Total",value:fmtBRL(selected.spend)},{label:"Avaliação",value:`${selected.rating}/5`},{label:"Status",value:selected.status==="ativo"?"Ativo":"Inativo"}].map(x=>(
                  <div key={x.label} className="p-3 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">{x.label}</div>
                    <div className="font-bold text-sm text-slate-800 mt-0.5">{x.value}</div>
                  </div>
                ))}
              </div>
              <Stars rating={selected.rating} />
              <button className="w-full py-2 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] transition-colors">Ver Histórico Completo</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Procurement ──────────────────────────────────────────────────────────────
function ProcurementModule() {
  const [tab, setTab] = useState<"all"|"aprovado"|"aguardando"|"em_transito"|"entregue"|"cancelado">("all");
  const [search, setSearch] = useState("");
  const tabs = [
    { id: "all", label: "Todos", count: orders.length },
    { id: "aguardando", label: "Aguardando", count: orders.filter(o=>o.status==="aguardando").length },
    { id: "aprovado", label: "Aprovado", count: orders.filter(o=>o.status==="aprovado").length },
    { id: "em_transito", label: "Em Trânsito", count: orders.filter(o=>o.status==="em_transito").length },
    { id: "entregue", label: "Entregue", count: orders.filter(o=>o.status==="entregue").length },
    { id: "cancelado", label: "Cancelado", count: orders.filter(o=>o.status==="cancelado").length },
  ];
  const filtered = orders.filter(o => (tab === "all" || o.status === tab) && o.supplier.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Suprimentos & Compras</h1>
          <p className="text-sm text-slate-500">Ordens de compra — junho/2024</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] shadow-sm shadow-blue-200 transition-all">
          <Plus size={13} /> Nova Solicitação
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total de OCs", value: "142", icon: FileText, color: "text-blue-600 bg-blue-50" },
          { label: "Aguardando", value: "23", icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Em Trânsito", value: "18", icon: Truck, color: "text-indigo-600 bg-indigo-50" },
          { label: "Gasto no Mês", value: "R$ 487K", icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 ${c.color} rounded-xl flex items-center justify-center shrink-0`}>
              <c.icon size={16} />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</div>
              <div className="text-xs text-slate-400">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100">
          <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all mr-1
                  ${tab === t.id ? "bg-[#2563eb] text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                {t.label}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${tab===t.id ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{t.count}</span>
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar fornecedor…"
              className="w-44 pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {["Nº OC","Fornecedor","Data Emissão","Entrega Prev.","Itens","Valor Total","Prioridade","Status",""].map(h=>(
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(o=>(
              <tr key={o.id} className="hover:bg-blue-50/20 transition-colors group">
                <td className="px-4 py-3.5 font-mono text-[12px] font-semibold text-blue-600">{o.id}</td>
                <td className="px-4 py-3.5 font-semibold text-slate-800 text-sm">{o.supplier}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs">{o.date}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs">{o.delivery}</td>
                <td className="px-4 py-3.5 text-center font-semibold text-slate-600">{o.items}</td>
                <td className="px-4 py-3.5 font-bold text-slate-800">{fmtBRL(o.total)}</td>
                <td className="px-4 py-3.5"><Badge status={o.priority} /></td>
                <td className="px-4 py-3.5"><Badge status={o.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"><Eye size={12} /></button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors"><Edit size={12} /></button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><MoreVertical size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400">{filtered.length} ordens exibidas</div>
      </div>
    </div>
  );
}

// ─── Transport ────────────────────────────────────────────────────────────────
function TransportModule() {
  const [selected, setSelected] = useState(deliveries[0]);
  const [activeStep, setActiveStep] = useState(3);

  const steps = [
    { time: "08:15", label: "Pedido emitido", loc: "Armazém Central — Guarulhos" },
    { time: "09:30", label: "Separação concluída", loc: "Setor de Picking — Dock 3" },
    { time: "10:45", label: "Saída do armazém", loc: "Portaria — NF-e 91234 emitida" },
    { time: "13:20", label: "Em rota de entrega", loc: "Via Dutra, km 218" },
    { time: "~16:00", label: "Previsão de entrega", loc: selected.dest },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Transporte & Rastreamento</h1>
          <p className="text-sm text-slate-500">34 operações ativas · 4 com atraso</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] shadow-sm shadow-blue-200 transition-all">
          <Plus size={13} /> Nova Expedição
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-800">Entregas do Dia — 25/06/2024</span>
            <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"><RefreshCw size={11} /> Atualizar</button>
          </div>
          <div className="divide-y divide-slate-100">
            {deliveries.map(d => (
              <div key={d.id} onClick={() => setSelected(d)}
                className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-all
                  ${selected.id===d.id ? "bg-blue-50/60 border-l-2 border-l-blue-500" : "hover:bg-slate-50/60 border-l-2 border-l-transparent"}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] font-semibold text-slate-400">{d.id}</span>
                    <Badge status={d.status} />
                  </div>
                  <div className="font-semibold text-sm text-slate-800">{d.client}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={10} />{d.dest}</span>
                    <span>·</span>
                    <span>{d.weight}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400 flex items-center gap-1 justify-end"><Clock size={10} />{d.date}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{d.driver}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline + detail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800">Rastreamento</h3>
              <span className="font-mono text-xs font-semibold text-blue-600">{selected.id}</span>
            </div>

            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#2563eb] rounded-lg flex items-center justify-center shrink-0">
                  <Truck size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-800">{selected.vehicle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{selected.driver}</div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>{selected.weight}</span>
                    <span>·</span>
                    <span>{selected.vol}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-0">
              {steps.map((s, i) => {
                const done = i <= activeStep - 1;
                const current = i === activeStep - 1;
                return (
                  <div key={i} className="flex gap-3 cursor-pointer" onClick={() => setActiveStep(i + 1)}>
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10 mt-0.5 transition-all
                        ${current ? "bg-[#2563eb] border-[#2563eb] shadow-md shadow-blue-300" : done ? "bg-[#2563eb] border-[#2563eb]" : "bg-white border-slate-200"}`}>
                        {done ? <Check size={10} className="text-white" /> : <Circle size={6} className={i === activeStep ? "text-blue-400" : "text-slate-300"} />}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[32px] transition-colors ${done ? "bg-[#2563eb]" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <div className="pb-5">
                      <div className={`text-sm font-semibold transition-colors ${done ? "text-slate-800" : "text-slate-400"}`}>{s.label}</div>
                      <div className="text-xs text-slate-400">{s.time} · {s.loc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────
function KPIsModule() {
  const kpiCards = [
    { label: "Giro de Estoque", value: "8,4×", change: +0.6, desc: "rotações/mês" },
    { label: "Ocupação Armazém", value: "73%", change: +2.1, desc: "capacidade total" },
    { label: "Tempo Médio Entrega", value: "1,8 dias", change: -0.2, desc: "vs 2,0 dias anterior" },
    { label: "Nível de Serviço", value: "96,4%", change: +0.8, desc: "pedidos no prazo" },
    { label: "Pedidos Entregues", value: "1.847", change: +12.3, desc: "este mês" },
    { label: "Pedidos Atrasados", value: "67", change: -8.1, desc: "este mês" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Indicadores Estratégicos</h1>
        <p className="text-sm text-slate-500">KPIs operacionais · junho/2024 vs maio/2024</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{k.label}</span>
              <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${k.change>=0 ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                {k.change>=0 ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                {k.change>=0?"+":""}{k.change}%
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800 tracking-tight mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.value}</div>
            <div className="text-xs text-slate-400">{k.desc}</div>
            <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${k.change>=0 ? "bg-emerald-500" : "bg-amber-400"}`}
                style={{ width: `${Math.min(95, 60 + Math.abs(k.change) * 3)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-800 mb-5">Eficiência Operacional (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              {m:"Jan",v:88.2,t:90},{m:"Fev",v:89.7,t:90},{m:"Mar",v:87.1,t:90},
              {m:"Abr",v:91.4,t:90},{m:"Mai",v:93.2,t:90},{m:"Jun",v:96.4,t:90}
            ]} barGap={6} margin={{top:0,right:5,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="m" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <YAxis domain={[80,100]} tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Bar dataKey="t" name="Meta" fill="#e2e8f0" radius={[4,4,0,0]} maxBarSize={32} />
              <Bar dataKey="v" name="Realizado" fill="#2563eb" radius={[4,4,0,0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-800 mb-5">Performance por Setor</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#cbd5e1" }} />
              <Radar name="Desempenho" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2} />
              <Tooltip content={<CustomTooltip suffix="%" />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Sustainability ───────────────────────────────────────────────────────────
function SustainabilityModule() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Logística Sustentável</h1>
        <p className="text-sm text-slate-500">Indicadores ambientais · junho/2024</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Fuel, label: "Combustível (L)", value: "10.900", change: "-12%", ok: true, gradient: "from-blue-500 to-blue-600" },
          { icon: Leaf, label: "Emissão CO₂ (t)", value: "41,2", change: "-14,5%", ok: true, gradient: "from-emerald-500 to-emerald-600" },
          { icon: Recycle, label: "Reciclagem (kg)", value: "4.800", change: "+50%", ok: true, gradient: "from-teal-500 to-teal-600" },
          { icon: AlertTriangle, label: "Resíduos (kg)", value: "320", change: "-8%", ok: true, gradient: "from-amber-400 to-amber-500" },
        ].map(c=>(
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className={`w-10 h-10 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
              <c.icon size={18} className="text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-0.5 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.value}</div>
            <div className="text-xs text-slate-400 mb-2">{c.label}</div>
            <div className={`text-xs font-bold flex items-center gap-1 ${c.ok ? "text-emerald-600" : "text-red-500"}`}>
              <TrendingDown size={11} />{c.change} vs mês anterior
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-800 mb-5">Emissão de CO₂ (t/mês)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={sustainData} margin={{top:0,right:5,left:-10,bottom:0}}>
              <defs>
                <linearGradient id="sust-co2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" t" />} />
              <Area type="monotone" dataKey="co2" name="CO₂" stroke="#10b981" fill="url(#sust-co2)" strokeWidth={2.5} dot={false} activeDot={{r:5}} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-800 mb-5">Reciclagem Mensal (kg)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sustainData} margin={{top:0,right:5,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" kg" />} />
              <Bar dataKey="recyc" name="Reciclagem" fill="#14b8a6" radius={[4,4,0,0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsModule() {
  const [generating, setGenerating] = useState<string | null>(null);
  const rpts = [
    { title: "Movimentação de Estoque", desc: "Entradas, saídas e saldo por produto e período", icon: Layers, cat: "Estoque", color: "from-blue-500 to-blue-600" },
    { title: "Ordens de Compra", desc: "Histórico completo por fornecedor com valores", icon: ShoppingCart, cat: "Suprimentos", color: "from-amber-400 to-amber-500" },
    { title: "Desempenho de Entregas", desc: "Pontualidade, atrasos e cancelamentos", icon: Truck, cat: "Transporte", color: "from-sky-500 to-sky-600" },
    { title: "Produção Diária/Mensal", desc: "Unidades produzidas vs. meta por período", icon: Factory, cat: "Produção", color: "from-violet-500 to-violet-600" },
    { title: "Custo Logístico", desc: "Custos detalhados por modal, rota e fornecedor", icon: DollarSign, cat: "Financeiro", color: "from-emerald-500 to-emerald-600" },
    { title: "KPIs Consolidados", desc: "Todos os indicadores em um único relatório gerencial", icon: BarChart3, cat: "Estratégico", color: "from-indigo-500 to-indigo-600" },
    { title: "Inventário Físico", desc: "Posição atual do estoque com localização detalhada", icon: Package, cat: "Estoque", color: "from-teal-500 to-teal-600" },
    { title: "Emissões de CO₂", desc: "Relatório ambiental por frota e período", icon: Leaf, cat: "Sustentabilidade", color: "from-green-500 to-green-600" },
  ];

  function generate(title: string, type: string) {
    setGenerating(`${title}-${type}`);
    setTimeout(() => setGenerating(null), 1500);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Central de Relatórios</h1>
        <p className="text-sm text-slate-500">Exporte em PDF, Excel ou CSV com filtros avançados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rpts.map(r => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon size={17} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 mb-0.5">{r.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-lg">{r.cat}</span>
              </div>
              <div className="flex gap-2">
                {["PDF","Excel","CSV"].map(type => {
                  const key = `${r.title}-${type}`;
                  const isGen = generating === key;
                  return (
                    <button key={type} onClick={() => generate(r.title, type)} disabled={!!generating}
                      className="flex-1 py-2 text-[11px] font-bold border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center justify-center gap-1 text-slate-600 disabled:opacity-50">
                      {isGen ? <RefreshCw size={10} className="animate-spin" /> : <Download size={10} />}
                      {isGen ? "…" : type}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsModule({ user }: { user: AppUser }) {
  const [tab, setTab] = useState<"users"|"system"|"backup">("users");
  const [saved, setSaved] = useState(false);
  const sysUsers = [
    { name: "Ricardo Almeida", email: "admin@flowlog.com.br", role: "Administrador", last: "Agora", active: true },
    { name: "Mariana Costa", email: "supervisor@flowlog.com.br", role: "Supervisor", last: "2h atrás", active: true },
    { name: "João Ferreira", email: "operador@flowlog.com.br", role: "Operador", last: "5h atrás", active: false },
    { name: "Fernanda Lima", email: "operador2@flowlog.com.br", role: "Operador", last: "Ontem", active: false },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Configurações</h1>
        <p className="text-sm text-slate-500">Usuários, permissões e configurações do sistema</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200 pb-0">
        {[{id:"users",label:"Usuários",icon:Users},{id:"system",label:"Sistema",icon:Settings},{id:"backup",label:"Backup & Logs",icon:Archive}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px
              ${tab===t.id ? "border-[#2563eb] text-[#2563eb]" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Usuários do Sistema</h3>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-all">
              <Plus size={12} /> Novo Usuário
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {["Usuário","E-mail","Perfil","Último Acesso","Status",""].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sysUsers.map(u=>(
                  <tr key={u.email} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                          ${u.role==="Administrador" ? "bg-violet-500" : u.role==="Supervisor" ? "bg-blue-500" : "bg-slate-400"}`}>
                          {u.name.split(" ").slice(0,2).map(n=>n[0]).join("")}
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-400">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg
                        ${u.role==="Administrador" ? "bg-violet-100 text-violet-700" : u.role==="Supervisor" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{u.last}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <span className="text-xs text-slate-500">{u.active ? "Online" : "Offline"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-amber-500"><Edit size={12}/></button>
                        <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500"><Trash2 size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "system" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            {[
              {k:"Nome da Empresa",v:"FlowLog Logística S.A.",type:"text"},
              {k:"CNPJ",v:"12.345.678/0001-99",type:"text"},
              {k:"Fuso Horário",v:"America/Sao_Paulo (GMT-3)",type:"select"},
              {k:"Moeda Padrão",v:"BRL — Real Brasileiro",type:"select"},
              {k:"Método de Valoração",v:"FIFO",type:"select"},
            ].map(f=>(
              <div key={f.k} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-slate-100 last:border-0">
                <label className="text-sm font-semibold text-slate-700">{f.k}</label>
                <div className="col-span-2">
                  <input defaultValue={f.v}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm ${saved ? "bg-emerald-500 text-white" : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-blue-200"}`}>
            {saved ? <><Check size={14}/> Salvo!</> : <><Shield size={14}/> Salvar Configurações</>}
          </button>
        </div>
      )}

      {tab === "backup" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 font-bold text-sm text-slate-800">Histórico de Backups</div>
            <div className="divide-y divide-slate-100">
              {[
                {date:"25/06/2024 03:00",type:"Automático",size:"2,4 GB",ok:true},
                {date:"24/06/2024 03:00",type:"Automático",size:"2,3 GB",ok:true},
                {date:"23/06/2024 14:12",type:"Manual",size:"2,3 GB",ok:true},
                {date:"22/06/2024 03:00",type:"Automático",size:"2,2 GB",ok:false},
              ].map((b,i)=>(
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${b.ok ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{b.date}</div>
                    <div className="text-xs text-slate-400">{b.type} · {b.size}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-semibold text-blue-600 hover:underline">Restaurar</button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><Download size={12}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#2563eb] text-white rounded-xl hover:bg-[#1d4ed8] transition-all shadow-sm shadow-blue-200">
            <Send size={14} /> Iniciar Backup Manual
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
function PlaceholderModule({ title, desc, icon: Icon }: { title: string; desc: string; icon: any }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h1>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
          <Icon size={28} className="text-white" />
        </div>
        <h3 className="font-bold text-lg text-slate-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">Módulo em operação. Dados carregados e prontos para uso.</p>
        <button className="px-6 py-2.5 bg-[#2563eb] text-white text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all shadow-sm shadow-blue-200">
          Abrir Módulo Completo
        </button>
      </div>
    </div>
  );
}

// ─── Upload helper (used by import) ──────────────────────────────────────────
function Upload(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [module, setModule] = useState<Module>("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <LoginPage onLogin={setUser} />;

  function renderModule() {
    switch (module) {
      case "dashboard": return <Dashboard onNav={setModule} />;
      case "products": return <ProductsModule />;
      case "suppliers": return <SuppliersModule />;
      case "procurement": return <ProcurementModule />;
      case "transport": return <TransportModule />;
      case "kpis": return <KPIsModule />;
      case "sustainability": return <SustainabilityModule />;
      case "reports": return <ReportsModule />;
      case "settings": return <SettingsModule user={user} />;
      case "customers": return <PlaceholderModule title="Clientes" desc="Gestão completa da carteira de clientes" icon={Users} />;
      case "inventory": return <PlaceholderModule title="Controle de Estoque" desc="Movimentações, FIFO/LIFO, lotes e datas de validade" icon={Layers} />;
      case "warehouse": return <PlaceholderModule title="Armazenagem" desc="Mapa digital do armazém, picking e packing" icon={Warehouse} />;
      case "production": return <PlaceholderModule title="Produção" desc="Ordens de produção e consumo de matéria-prima" icon={Factory} />;
      case "distribution": return <PlaceholderModule title="Distribuição" desc="Expedição, conferência e histórico de envios" icon={Package2} />;
      default: return <Dashboard onNav={setModule} />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar active={module} onNav={setModule} collapsed={collapsed} user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} module={module} user={user} onLogout={() => setUser(null)} />
        <main className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
