import React, { useState } from "react";
import { Project, PendingItem, Meeting, Client, ApprovalItem, ClientMessage } from "../types";
import { 
  Briefcase, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  FileCheck2, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Layers,
  UserPlus,
  UploadCloud,
  Check,
  AlertCircle,
  Copy,
  Users,
  Trash2,
  Send,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardTabProps {
  projects: Project[];
  meetings: Meeting[];
  pendings: PendingItem[];
  publicationsCount: number;
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  } | null;
  clients: Client[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onAddApproval: (item: ApprovalItem) => void;
  clientMessages: ClientMessage[];
  onAddClientMessage: (msg: ClientMessage) => void;
}

export default function DashboardTab({ 
  projects, 
  meetings, 
  pendings, 
  publicationsCount, 
  currentUser,
  clients,
  onAddClient,
  onDeleteClient,
  onAddApproval,
  clientMessages,
  onAddClientMessage
}: DashboardTabProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Terça");
  
  // Selection/Filtering by Client for Agency view
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>("all");

  // Direct Message states
  const [directMsgText, setDirectMsgText] = useState("");
  const [selectedChatClient, setSelectedChatClient] = useState("");

  // Client registration state
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");
  const [newClientTagline, setNewClientTagline] = useState("");
  const [clientRegSuccess, setClientRegSuccess] = useState<string | null>(null);

  // Post & Legenda upload state
  const [selectedPostClient, setSelectedPostClient] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postDriveLink, setPostDriveLink] = useState("");
  const [postImagePreset, setPostImagePreset] = useState("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800");
  const [postUploadSuccess, setPostUploadSuccess] = useState<string | null>(null);

  // Presets of beautiful premium Unsplash images for easy visual submissions
  const IMAGE_PRESETS = [
    { name: "Sports Premium Red", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" },
    { name: "Luxury Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" },
    { name: "Estúdio Performance", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800" },
    { name: "Aero Fibra de Carbono", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800" },
    { name: "Digital Champagne Neon", url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800" }
  ];

  // Restrict display of info based on active logged customer or selected agency filter
  const activeClientEmail = currentUser?.role === "client" ? currentUser.email : selectedClientFilter;
  
  const isFiltered = activeClientEmail !== "all";

  // Filter datasets
  const filteredProjects = isFiltered 
    ? projects.filter(p => p.clientEmail?.toLowerCase() === activeClientEmail.toLowerCase())
    : projects;

  const filteredMeetings = isFiltered 
    ? meetings.filter(m => m.clientEmail?.toLowerCase() === activeClientEmail.toLowerCase())
    : meetings;

  const filteredPendings = isFiltered 
    ? pendings.filter(pen => pen.clientEmail?.toLowerCase() === activeClientEmail.toLowerCase())
    : pendings;

  // Find exact client multiplier or match
  const matchedClientObj = clients.find(c => c.email.toLowerCase() === activeClientEmail.toLowerCase());
  const multiplier = matchedClientObj ? matchedClientObj.reachMultiplier : 1.0;

  // Statistics derived dynamically
  const plannedCount = filteredProjects.filter(p => p.status === "Briefing" || p.status === "Planejamento").length;
  const inProgressCount = filteredProjects.filter(p => !["Briefing", "Planejamento", "Aprovação", "Publicação"].includes(p.status)).length;
  const awaitingApprovalCount = filteredProjects.filter(p => p.status === "Aprovação").length;
  const publishedCount = isFiltered ? filteredProjects.filter(p => p.status === "Publicação").length : publicationsCount;
  const pendingCountByClient = filteredPendings.length;

  const quickKPIs = [
    { label: "Planejados", value: plannedCount, subtitle: "Fase de concepção estética", icon: Briefcase, color: "text-[#C5A059]" },
    { label: "Em Andamento", value: inProgressCount, subtitle: "Em produção ativa", icon: Clock, color: "text-blue-400" },
    { label: "Aguardando Aprovação", value: awaitingApprovalCount, subtitle: "Peças & Posts em andamento", icon: HelpCircle, color: "text-amber-400" },
    { label: "Prontos de Costura", value: filteredProjects.filter(p => p.progress >= 90 && p.status !== "Publicação").length, subtitle: "Fase de aprovação operacional", icon: FileCheck2, color: "text-emerald-400" },
    { label: "Sincronizados / Publicados", value: publishedCount, subtitle: "Histórico público", icon: CheckCircle2, color: "text-zinc-500" },
    { label: "Pendências de Auditoria", value: pendingCountByClient, subtitle: "Demandas de cliente", icon: Layers, color: "text-rose-400" },
  ];

  const daysOfWeek = [
    { name: "Segunda", date: "08 Jun" },
    { name: "Terça", date: "09 Jun" },
    { name: "Quarta", date: "10 Jun" },
    { name: "Quinta", date: "11 Jun" },
    { name: "Sexta", date: "12 Jun" },
  ];

  // Meet/Calendar events filter
  const getEventsForDay = (day: string) => {
    const defaultMeetings: Record<string, { time: string; title: string; category: string; host: string }[]> = {
      "Segunda": [{ time: "09:00", title: "Brainstorming Criativo - Novos Conceitos", category: "Concepção", host: "Carol (CA.RO TECH)" }],
      "Terça": [
        { time: "10:30", title: "Review de Linhas & Renders Técnicos", category: "Alinhamento", host: "Julio M. (CA.RO TECH)" },
        { time: "15:00", title: "Apresentação de Campanha e Posts de Mídia", category: "Aprovação", host: "Carol (CA.RO TECH)" }
      ],
      "Quarta": [{ time: "14:00", title: "Análise de Métricas do Lightroom Estético", category: "Performance", host: "Marketing Central" }],
      "Quinta": [{ time: "10:30", title: "Alinhamento Estratégico de Marcas Ativas", category: "Comercial", host: "Julio M. (CA.RO TECH)" }],
      "Sexta": [
        { time: "11:00", title: "Fechamento de Pautas Semanais", category: "Planejamento", host: "Lucas H. (CA.RO TECH)" },
        { time: "16:00", title: "Entrega Geral & Transparência Real-Time", category: "Gestão", host: "Conselho CA.RO" }
      ]
    };

    // If client is logged-in, contextualize titles to fit the exact brand
    const clientSuffix = matchedClientObj ? matchedClientObj.name : "Marca Ativa";
    return defaultMeetings[day] ? defaultMeetings[day].map(ev => ({
      ...ev,
      title: isFiltered ? ev.title.replace("Novos Conceitos", `Piloto ${clientSuffix}`).replace("Estrutura", clientSuffix) : ev.title
    })) : [];
  };

  // Handle Client registration
  const handleRegisterClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientRegSuccess(null);

    if (!newClientName || !newClientEmail) {
      alert("Por favor insira nome e e-mail!");
      return;
    }

    const cleanEmail = newClientEmail.trim().toLowerCase();
    
    // Check if client email already exists
    if (clients.some(c => c.email.toLowerCase() === cleanEmail)) {
      alert("Erro: Já existe um cliente cadastrado com esse endereço de e-mail!");
      return;
    }

    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: newClientName.trim(),
      email: cleanEmail,
      password: newClientPassword.trim() || "caro2026",
      tagline: newClientTagline.trim() || "Nova Célula Executiva Cadastrada",
      welcomeMessage: "Sua mesa exclusiva de design técnico com a CA.RO TECH.",
      reachMultiplier: Number((Math.random() * 0.5 + 1.0).toFixed(2)) // random multiplier between 1.0 and 1.5
    };

    onAddClient(newClient);
    setClientRegSuccess(`Cliente "${newClient.name}" cadastrado com sucesso! E-mail de login: ${newClient.email} / Senha: ${newClient.password}`);
    
    // Reset inputs
    setNewClientName("");
    setNewClientEmail("");
    setNewClientPassword("");
    setNewClientTagline("");

    setTimeout(() => {
      setClientRegSuccess(null);
    }, 7000);
  };

  // Handle Post & Legenda submit for Client approval
  const handleSubmeterPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPostUploadSuccess(null);

    const clientEmailToSubmit = selectedPostClient || (clients[0] ? clients[0].email : "");

    if (!postTitle || !postCaption) {
      alert("Por favor insira o título do post e a legenda!");
      return;
    }

    const matchedCli = clients.find(c => c.email.toLowerCase() === clientEmailToSubmit.toLowerCase());
    const clientNameStr = matchedCli ? matchedCli.name : "Cliente Sincronizado";

    const newApproval: ApprovalItem = {
      id: `appr-${Date.now()}`,
      title: postTitle.trim(),
      type: "Post & Legenda",
      thumbnail: postImagePreset,
      captionText: postCaption.trim(),
      description: postDescription.trim() || `Produzido sob demanda para o planejamento estratégico de marca de ${clientNameStr} / Alphaville-Munique.`,
      driveLink: postDriveLink.trim() || undefined,
      status: "Pendente",
      feedback: [],
      clientEmail: clientEmailToSubmit
    };

    onAddApproval(newApproval);
    setPostUploadSuccess(`Post & Legenda "${postTitle}" postado em tempo real para aprovação de ${clientNameStr}!`);
    
    // Reset inputs
    setPostTitle("");
    setPostCaption("");
    setPostDescription("");
    setPostDriveLink("");

    setTimeout(() => {
      setPostUploadSuccess(null);
    }, 6000);
  };

  // Handler for direct messages in Alphaville
  const fallbackEmail = clients[0]?.email || "mundi@tkr.com";
  const activeChatEmail = (currentUser?.role === "client") 
    ? currentUser.email 
    : (selectedClientFilter !== "all" ? selectedClientFilter : (selectedChatClient || fallbackEmail));

  const activeChatClientObj = clients.find(c => c.email.toLowerCase() === activeChatEmail.toLowerCase());

  const handleSendDirectMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directMsgText.trim()) return;

    const senderName = currentUser?.name || "Carol (CA.RO TECH)";
    const senderRole = currentUser?.role || "agency";

    const newMsg: ClientMessage = {
      id: `msg-${Date.now()}`,
      clientEmail: activeChatEmail,
      senderName,
      senderRole,
      text: directMsgText.trim(),
      timestamp: new Date().toLocaleString("pt-BR", { hour12: false })
    };

    onAddClientMessage(newMsg);
    setDirectMsgText("");
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Brand Header Card with subtle grid background */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="luxury-card p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full"
      >
        <div className="absolute inset-0 geo-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 space-y-3.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-[10px] text-[#E5D1B0] tracking-widest uppercase font-tech font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" /> ALLPHAVILE EMPRESARIAL - BARUERI
          </div>
          <h1 className="font-serif text-2xl md:text-3.5xl text-[#F8F9FA] tracking-tight leading-none">
            Mesa de Transparência <span className="italic text-[#E5D1B0]">CA.RO TECH</span>
          </h1>
          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-light">
            Olá, <strong className="text-white font-medium">{currentUser?.name || "Prezado Partner"}</strong> ({currentUser?.role === "agency" ? "Diretora Suprema" : `${matchedClientObj?.name || "Cliente Conectado"}`}). 
            Sua esteira de comunicação síncrona de alta costura digital está configurada e auditada de Alphaville ao servidor europeu.
          </p>
        </div>
        
        {/* Connection status card side with Client Filter Dropdown */}
        <div className="relative z-10 flex flex-col items-start md:items-end justify-between gap-4 bg-zinc-900/60 p-4 border border-white/5 rounded-xl backdrop-blur-sm shrink-0">
          <div>
            <div className="text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-semibold text-left md:text-right">Fuso Técnico Único</div>
            <div className="flex items-center gap-1.5 mt-0.5 justify-start md:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 font-tech">CONEXÃO ATIVA INDEPENDENTE</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">Última checagem: Hoje às 15:14 UTC</div>
          </div>

          {/* If current user is Agency/Admin, enable dropdown selector of dynamic registered clients! */}
          {currentUser?.role === "agency" && (
            <div className="w-full border-t border-white/5 pt-3.5">
              <label className="block text-[9px] text-zinc-400 uppercase tracking-wider font-tech mb-1 font-bold">Filtrar Projetos / Métricas:</label>
              <select
                value={selectedClientFilter}
                onChange={(e) => setSelectedClientFilter(e.target.value)}
                className="w-full py-1.5 px-3 bg-zinc-950 text-white text-xs border border-white/10 focus:border-[#C5A059] rounded-lg outline-none transition-all"
              >
                <option value="all">📁 Visualizar Todos as Contas</option>
                {clients.map(cli => (
                  <option key={cli.id} value={cli.email}>
                     💼 {cli.name} ({cli.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {quickKPIs.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="luxury-card p-5 rounded-xl hover:translate-y-[-2px] hover:border-[#C5A059]/30 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech font-semibold pr-1.5">{kpi.label}</span>
                  <div className="font-serif text-2.5xl font-medium text-white group-hover:text-[#E5D1B0] transition-colors">
                    {kpi.value.toString().padStart(2, "0")}
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-zinc-900/80 border border-white/5 ${kpi.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1 font-light leading-none">
                <span>{kpi.subtitle}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Split section: Calendar of the Week & Latest Activity Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Weekly Calendar - xl:col-span-7 */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="luxury-card p-5 md:p-6 rounded-2xl xl:col-span-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif text-lg text-white">Cronograma & Entregas Semanais</h3>
              </div>
              <span className="text-[10px] text-[#C5A035] font-tech tracking-wider uppercase font-bold">Fuso: SP / Alphaville</span>
            </div>

            {/* Days Selector */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day.name;
                const events = getEventsForDay(day.name);
                const hasEvents = events.length > 0;
                return (
                  <button
                    key={day.name}
                    onClick={() => setSelectedDay(day.name)}
                    className={`p-2.5 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#C5A059] text-zinc-950 font-bold scale-[1.03]" 
                        : "bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800/80 hover:border-white/10"
                    } border border-white/5`}
                  >
                    <span className="text-[10px] font-bold uppercase font-tech tracking-wide">{day.name.slice(0, 3)}</span>
                    <span className={`text-[9px] mt-0.5 ${isSelected ? "text-zinc-900 font-semibold" : "text-zinc-400"}`}>{day.date}</span>
                    {hasEvents && !isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Day Events */}
            <div className="space-y-2.5 min-h-[140px] flex flex-col justify-start">
              {getEventsForDay(selectedDay).length > 0 ? (
                getEventsForDay(selectedDay).map((ev, i) => (
                  <div 
                    key={i} 
                    className="flex text-zinc-100 bg-zinc-900/40 p-3 rounded-xl border border-white/5 items-center justify-between gap-4 transition-all hover:bg-zinc-900/70"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-tech text-[10px] text-[#E5D1B0] bg-[#C5A059]/15 border border-[#C5A059]/25 px-2.5 py-1 rounded">
                        {ev.time}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white tracking-wide">{ev.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-[#C5A059] uppercase tracking-wider font-tech">{ev.category}</span>
                          <span className="text-[10px] text-zinc-500 font-light">Responsável: {ev.host}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-xs py-8">
                  Nenhuma pauta ou compromisso excepcional para esta data.
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-3.5 mt-3.5 flex items-center justify-between text-[11px] text-[#E5D1B0] font-light">
            <span>Dúvidas ou pautas adicionais? Pergunte diretamente ao assessor Oracle na aba I.A.</span>
          </div>
        </motion.div>

        {/* Live Feed & Registered Client List - xl:col-span-5 */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="luxury-card p-5 md:p-6 rounded-2xl xl:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h3 className="font-serif text-lg text-white">Últimas Atualizações</h3>
              </div>
              <span className="text-[9px] font-tech text-emerald-400 tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded uppercase font-semibold">Real-Time</span>
            </div>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              <div className="flex items-start gap-3 relative before:content-[''] before:absolute before:left-2 before:top-6 before:bottom-0 before:w-[1px] before:bg-zinc-800 pb-3">
                <div className="w-4.5 h-4.5 rounded-full bg-[#C5A049]/20 border border-[#C5A049]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#C5A059]" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-tech">ATUAL</div>
                  <h4 className="text-[11px] font-semibold text-white mt-0.5">Módulo 'Post & Legenda' Integrado</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">Posts e suas respectivas legendas agora podem ser revisados e comentados linha-a-linha no Portal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative before:content-[''] before:absolute before:left-2 before:top-6 before:bottom-0 before:w-[1px] before:bg-zinc-800 pb-3">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 font-tech">06 JUN</div>
                  <h4 className="text-[11px] font-semibold text-white mt-0.5">Célula Alphaville Sincronizada</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">Conexão direta para os uploads de mídias de alta fidelidade.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 border border-white/5 rounded-xl mt-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] uppercase text-[#C5A059] tracking-wider font-tech font-bold">Ponto de Contato</div>
              <div className="text-xs text-white tracking-tight mt-0.5 truncate">Suporte Executivo CA.RO TECH</div>
            </div>
            <span className="text-[10px] text-zinc-400 font-tech font-normal">atendimento@carotech.com</span>
          </div>
        </motion.div>

      </div>

      {/* CANAL DE MENSAGENS SÍNCRONAS DIRETO DA PÁGINA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="luxury-card p-5 md:p-6 rounded-2xl border border-white/10 bg-[#0c0c0c] relative overflow-hidden"
      >
        <div className="absolute inset-0 geo-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl text-[#C5A059]">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-white">Canal de Alinhamento Síncrono (Mensagens Diretas)</h3>
              <p className="text-[10px] text-zinc-400">Atendimento rápido, feedbacks e alertas em tempo real direto de Barueri — Alphaville</p>
            </div>
          </div>

          {/* If viewing overall board as agency, let them select who to message */}
          {currentUser?.role === "agency" && selectedClientFilter === "all" ? (
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 border border-white/5 rounded-xl">
              <span className="text-[9px] font-tech text-[#C5A059] uppercase tracking-wider font-bold">Conversando com:</span>
              <select
                value={selectedChatClient || fallbackEmail}
                onChange={(e) => setSelectedChatClient(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold outline-none border-none py-0.5 cursor-pointer"
              >
                {clients.map(cli => (
                  <option key={cli.id} value={cli.email} className="bg-zinc-950 text-white">
                    {cli.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-[10px] text-[#E5D1B0] bg-[#C5A059]/10 border border-[#C5A059]/20 px-3 py-1.5 rounded-lg font-tech uppercase tracking-wide">
              Mesa: <strong className="text-white">{activeChatClientObj?.name || "Geral"}</strong> ({activeChatEmail})
            </div>
          )}
        </div>

        {/* Messaging Container */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Chat Feed Column */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950/60 rounded-xl border border-white/5 p-4 min-h-[285px] max-h-[380px] overflow-hidden">
            
            {/* Scrollable chat messages feed */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {clientMessages.filter(m => m.clientEmail.toLowerCase() === activeChatEmail.toLowerCase()).length > 0 ? (
                clientMessages
                  .filter(m => m.clientEmail.toLowerCase() === activeChatEmail.toLowerCase())
                  .map((msg) => {
                    const isAgency = msg.senderRole === "agency";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAgency ? "items-start" : "items-end"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[9px] text-zinc-500 font-tech">
                          <span className={isAgency ? "text-[#C5A059] font-semibold" : "text-zinc-300 font-semibold"}>
                            {msg.senderName}
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`max-w-[85%] text-xs py-2 px-3.5 rounded-2xl leading-relaxed select-text ${
                            isAgency
                              ? "bg-zinc-900 border border-white/10 text-white rounded-tl-none font-sans"
                              : "bg-[#C5A059]/15 border border-[#C5A059]/20 text-[#E5D1B0] rounded-tr-none font-sans"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-16">
                  <MessageSquare className="w-8 h-8 text-zinc-600 mb-2 stroke-1" />
                  <p className="text-xs font-semibold">Este canal está configurado e pronto.</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Insira mensagens abaixo para interagir com a CA.RO TECH.</p>
                </div>
              )}
            </div>

            {/* Input Submission Panel */}
            <form onSubmit={handleSendDirectMsg} className="flex gap-2">
              <input
                type="text"
                required
                value={directMsgText}
                onChange={(e) => setDirectMsgText(e.target.value)}
                placeholder={
                  currentUser?.role === "agency"
                    ? `Enviar orientação executiva para ${activeChatClientObj?.name || "o cliente"}...`
                    : "Digite uma dúvida, aprovação verbal ou solicitação de suporte aqui..."
                }
                className="flex-1 bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] placeholder-zinc-500 select-text font-sans"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
                title="Enviar Mensagem Síncrona"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

          {/* Quick Context panel side */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-zinc-900/30 rounded-xl border border-white/5 p-4 text-xs font-light space-y-3.5">
            <div className="space-y-3">
              <span className="text-[10px] text-[#C5A059] font-tech uppercase tracking-widest font-bold block">Controle de Status</span>
              
              <div className="space-y-2 text-[11px] text-zinc-350">
                <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-400">Ambiente de Operação:</span>
                  <strong className="text-white font-medium font-tech uppercase">Barueri - SP</strong>
                </div>
                <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-400">Total Mensagens do Canal:</span>
                  <strong className="text-white font-tech">
                    {clientMessages.filter(m => m.clientEmail.toLowerCase() === activeChatEmail.toLowerCase()).length}
                  </strong>
                </div>
                <div className="flex justify-between items-center bg-zinc-950/50 p-2 rounded-lg border border-[#C5A059]/10">
                  <span className="text-zinc-400">Multiplicador Estético:</span>
                  <strong className="text-[#C5A035] font-tech font-bold">{multiplier}x</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/40 border border-[#C5A059]/10 rounded-xl text-[10px] text-zinc-400 leading-normal">
              <span className="block font-semibold text-[#E5D1B0] mb-0.5">💡 Auditoria Ativa</span>
              Nenhuma mensagem é deletada. Todas as orientações, feedbacks e artes são salvas no diário auditado e integradas via localStorage para compliance.
            </div>
          </div>

        </div>

      </motion.div>

      {/* ADMIN CONTROLS EXCLUSIVE SECTION (ROles === 'agency') */}
      {currentUser?.role === "agency" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="luxury-card p-6 rounded-2xl border border-[#C5A059]/40 bg-zinc-950/60"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
            <div className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl text-[#C5A059]">
              <Users className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-white tracking-tight leading-none">Console Supremo de Administração (Carol / ADM)</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Crie ambientes isolados para novos clientes e submeta posts com legendas ricas para aprovação imediata.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMN 1: Register New Client */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 bg-[#C5A059]/15 rounded text-[#C5A059]">
                  <UserPlus className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-[#E5D1B0] uppercase font-tech tracking-wider">1. Cadastrar Novo Cliente</span>
              </div>

              {clientRegSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="font-mono">{clientRegSuccess}</p>
                </div>
              )}

              <form onSubmit={handleRegisterClientSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Nome da Empresa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kagiva Sports"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Login E-mail</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: dadoskagiva@gmail.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Senha de Acesso</label>
                    <input
                      type="text"
                      placeholder="Default: dadoskagiva"
                      value={newClientPassword}
                      onChange={(e) => setNewClientPassword(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Slogan de Luxo</label>
                    <input
                      type="text"
                      placeholder="Ex: Sensibilidade & Design Esportivo"
                      value={newClientTagline}
                      onChange={(e) => setNewClientTagline(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 font-bold select-none text-[10px] font-tech uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Efetuar Cadastro em Alphaville
                </button>
              </form>

              {/* List of current dynamic clients */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech font-bold">Contas Conectadas e Ativas:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {clients.map(cli => (
                    <div key={cli.id} className="p-2.5 bg-zinc-900/60 rounded-xl border border-white/5 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <strong className="text-[#E5D1B0] font-tech font-semibold">{cli.name}</strong>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] bg-zinc-950 border border-white/5 px-1.5 py-0.5 rounded text-zinc-400 font-bold">{cli.reachMultiplier}x</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Aviso supremo: Deseja realmente EXCLUIR e expurgar a conta de "${cli.name}" (${cli.email}) de Alphaville?`)) {
                                onDeleteClient(cli.id);
                              }
                            }}
                            className="text-rose-450 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Deletar Cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono mt-1 select-all">{cli.email}</span>
                      <span className="text-[9px] text-zinc-500 italic truncate mt-0.5 font-light">"{cli.tagline}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMN 2: Upload Post & Legenda For approval */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 bg-[#C5A059]/15 rounded text-[#C5A059]">
                  <UploadCloud className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-[#E5D1B0] uppercase font-tech tracking-wider">2. Subir Post & Legenda para Aprovação</span>
              </div>

              {postUploadSuccess && (
                <div className="p-3 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#E5D1B0] text-xs rounded-xl flex items-start gap-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{postUploadSuccess}</p>
                </div>
              )}

              <form onSubmit={handleSubmeterPostSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Destinatário (Selecione o Cliente)</label>
                    <select
                      value={selectedPostClient}
                      onChange={(e) => setSelectedPostClient(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 focus:border-[#C5A059] rounded-lg p-2.5 text-white outline-none transition-all cursor-pointer"
                    >
                      {clients.map(cli => (
                        <option key={cli.id} value={cli.email}>{cli.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Título do Post / Arte</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Coleção Gold Edition Feed 1"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Legenda Oficial do Post (Visualização Real-time)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="🏆 Onde o design encontra a alta performance... Insira hashtags, quebras de linha e textos com copys excelentes."
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Escolher Pre-set Visual (Wallpaper de Altura)</label>
                    <select
                      value={postImagePreset}
                      onChange={(e) => setPostImagePreset(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 focus:border-[#C5A059] rounded-lg p-2.5 text-white outline-none transition-all cursor-pointer"
                    >
                      {IMAGE_PRESETS.map((img, i) => (
                        <option key={i} value={img.url}>{img.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Metas / Notas Estratégicas</label>
                    <input
                      type="text"
                      placeholder="Ex: Feed Instagram Orgânico e Anúncios."
                      value={postDescription}
                      onChange={(e) => setPostDescription(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">
                    Link do Google Drive (Opcional - Pasta para Vídeos ou Ativos de Alta Definição)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={postDriveLink}
                    onChange={(e) => setPostDriveLink(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-[#E5D1B0] focus:border-[#C5A035] outline-none transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold select-none text-[10px] font-tech uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2 shadow-lg"
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Enviar Post & Legenda para o Portal
                </button>
              </form>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
