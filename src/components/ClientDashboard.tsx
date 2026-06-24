import React, { useState, useEffect } from "react";
import { Project, PendingItem, Meeting, Client, ApprovalItem, ClientMessage, Publication } from "../types";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Instagram, 
  Linkedin, 
  FileText, 
  Shield, 
  Calendar, 
  Plus, 
  Sparkles, 
  Send, 
  MessageSquare, 
  Check, 
  X, 
  FileCheck2, 
  AlertTriangle, 
  Download, 
  Clock, 
  Users, 
  Info,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Settings,
  Lock,
  Mail,
  Edit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClientDashboardProps {
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  };
  clients: Client[];
  projects: Project[];
  meetings: Meeting[];
  approvals: ApprovalItem[];
  publications: Publication[];
  pendings: PendingItem[];
  clientMessages: ClientMessage[];
  reports: ClientReport[];
  onAddClientMessage: (msg: ClientMessage) => void;
  onUpdateApproval: (item: ApprovalItem) => void;
  onAddMeeting: (meet: Meeting) => void;
  onUpdateClient: (client: Client) => void;
}

export default function ClientDashboard({
  currentUser,
  clients,
  projects,
  meetings,
  approvals,
  publications,
  pendings,
  clientMessages,
  reports,
  onAddClientMessage,
  onUpdateApproval,
  onAddMeeting,
  onUpdateClient
}: ClientDashboardProps) {
  // Find logged in client
  const clientObj = clients.find(c => c.email.toLowerCase() === currentUser.email.toLowerCase()) || {
    id: "cli-default",
    name: currentUser.name,
    email: currentUser.email,
    tagline: "Partner Premium CA.RO TECH",
    reachMultiplier: 1.2,
    cnpj: "N/A",
    logoUrl: "",
    website: "",
    instagram: "",
    linkedin: "",
    address: "",
    status: "Ativo" as const
  };

  // Filter datasets relative to active client
  const clientProjects = projects.filter(p => p.clientEmail?.toLowerCase() === currentUser.email.toLowerCase());
  const clientMeetings = meetings.filter(m => m.clientEmail?.toLowerCase() === currentUser.email.toLowerCase());
  const clientApprovals = approvals.filter(a => a.clientEmail?.toLowerCase() === currentUser.email.toLowerCase());
  const clientPublications = publications.filter(p => p.clientEmail?.toLowerCase() === currentUser.email.toLowerCase());
  const clientPendings = pendings.filter(p => p.clientEmail?.toLowerCase() === currentUser.email.toLowerCase());

  // Direct Message states
  const [directMsgText, setDirectMsgText] = useState("");
  
  // Meeting request states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [meetRequestSuccess, setMeetRequestSuccess] = useState<string | null>(null);

  // Approval modification comments
  const [activeAdjustId, setActiveAdjustId] = useState<string | null>(null);
  const [adjustComment, setAdjustComment] = useState("");
  
  // Notifications active
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: "alert" | "info" | "success" }[]>([]);

  // Weekly executive report I.A context
  const [weeklyReport, setWeeklyReport] = useState<{
    period: string;
    summary: string;
    growth: string;
    insights: string[];
  } | null>(null);

  // Month selector for client report
  const [selectedReportMonth, setSelectedReportMonth] = useState("Janeiro");
  const [selectedReportYear, setSelectedReportYear] = useState("2026");

  // Profile edit states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editClientPassword, setEditClientPassword] = useState(clientObj.password || "");
  const [editClientName, setEditClientName] = useState(clientObj.name);
  const [editClientTagline, setEditClientTagline] = useState(clientObj.tagline || "");
  const [editClientCnpj, setEditClientCnpj] = useState(clientObj.cnpj || "");
  const [editClientLogoUrl, setEditClientLogoUrl] = useState(clientObj.logoUrl || "");
  const [editClientWebsite, setEditClientWebsite] = useState(clientObj.website || "");
  const [editClientInstagram, setEditClientInstagram] = useState(clientObj.instagram || "");
  const [editClientLinkedin, setEditClientLinkedin] = useState(clientObj.linkedin || "");
  const [editClientAddress, setEditClientAddress] = useState(clientObj.address || "");
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    setEditClientPassword(clientObj.password || "");
    setEditClientName(clientObj.name);
    setEditClientTagline(clientObj.tagline || "");
    setEditClientCnpj(clientObj.cnpj || "");
    setEditClientLogoUrl(clientObj.logoUrl || "");
    setEditClientWebsite(clientObj.website || "");
    setEditClientInstagram(clientObj.instagram || "");
    setEditClientLinkedin(clientObj.linkedin || "");
    setEditClientAddress(clientObj.address || "");
  }, [clientObj]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCli: Client = {
      ...clientObj,
      name: editClientName,
      password: editClientPassword,
      tagline: editClientTagline,
      cnpj: editClientCnpj,
      logoUrl: editClientLogoUrl,
      website: editClientWebsite,
      instagram: editClientInstagram,
      linkedin: editClientLinkedin,
      address: editClientAddress
    };
    onUpdateClient(updatedCli);
    setProfileUpdateSuccess("Perfil e acessos atualizados com sucesso!");
    setTimeout(() => {
      setProfileUpdateSuccess(null);
      setShowProfileModal(false);
    }, 3000);
  };

  const activeReport = reports.find(
    (r) =>
      r.clientEmail.toLowerCase() === currentUser.email.toLowerCase() &&
      r.month === selectedReportMonth &&
      r.year === selectedReportYear
  );

  const handleDownloadMonthlyPDF = () => {
    if (!activeReport) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório Mensal - ${clientObj.name} - ${activeReport.month}/${activeReport.year}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; background-color: #ffffff; color: #111111; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #8F7035; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            .logo-placeholder { font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #8F7035; text-transform: uppercase; }
            .title { font-size: 28px; margin-top: 10px; margin-bottom: 5px; font-style: italic; }
            .meta { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; color: #8F7035; }
            .metric-box { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; background: #f9f9f9; padding: 15px; border-left: 4px solid #8F7035; margin-bottom: 20px; font-size: 14px; }
            .metric-item { display: flex; flex-direction: column; }
            .metric-label { font-size: 10px; text-transform: uppercase; color: #666; }
            .metric-value { font-size: 18px; font-weight: bold; color: #111; }
            .chart-container { margin-top: 20px; margin-bottom: 20px; text-align: center; }
            .chart-img { max-width: 100%; height: auto; border: 1px solid #ddd; padding: 5px; max-height: 300px; object-fit: contain; }
            .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 10px; text-align: center; color: #999; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-placeholder">CA.RO TECH ATELIER</div>
            <div class="title">Relatório de Performance Mensal</div>
            <div class="meta">${clientObj.name} &bull; ${activeReport.month} de ${activeReport.year}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Métricas de Performance Unificadas</div>
            <div class="metric-box">
              <div class="metric-item">
                <span class="metric-label">Alcance (Reach)</span>
                <span class="metric-value">${activeReport.reach.toLocaleString()}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Impressões</span>
                <span class="metric-value">${activeReport.impressions.toLocaleString()}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Engajamento %</span>
                <span class="metric-value">${activeReport.engagement}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Cliques</span>
                <span class="metric-value">${activeReport.clicks.toLocaleString()}</span>
              </div>
            </div>
          </div>

          ${activeReport.imageUrl ? `
          <div class="section">
            <div class="section-title">Gráfico de Performance Estratégica</div>
            <div class="chart-container">
              <img class="chart-img" src="${activeReport.imageUrl}" alt="Gráfico Mensal" />
            </div>
          </div>
          ` : ""}

          <div class="section">
            <div class="section-title">Análise de IA & Considerações Finais</div>
            <p style="white-space: pre-line;">${activeReport.aiAnalysis}</p>
          </div>

          <div class="footer">
            CA.RO TECH &bull; TECNOLOGIA & DESIGN ESTRATÉGICO &bull; BARUERI, SP
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Generate notifications and mock reports dynamically based on actual state
  useEffect(() => {
    const list: typeof notifications = [];
    
    // 1. Pending approvals
    const pendingAppr = clientApprovals.filter(a => a.status === "Pendente");
    if (pendingAppr.length > 0) {
      list.push({
        id: "notif-appr",
        text: `Você possui ${pendingAppr.length} arte(s) pendente(s) de aprovação na sua mesa.`,
        type: "alert"
      });
    }

    // 2. Pending materials / information
    const pendingInfo = clientPendings.filter(p => p.type === "Material" || p.type === "Informação");
    if (pendingInfo.length > 0) {
      list.push({
        id: "notif-info",
        text: `Nossa célula criativa aguarda o envio de materiais para ${pendingInfo.length} pendência(s).`,
        type: "info"
      });
    }

    // 3. Meeting schedule
    if (clientMeetings.length > 0) {
      list.push({
        id: "notif-meet",
        text: `Sua próxima reunião oficial está agendada para ${clientMeetings[0].date}.`,
        type: "success"
      });
    }

    setNotifications(list);

    // Create Report
    setWeeklyReport({
      period: "Semana de 01 a 07 de Junho de 2026",
      growth: `+${((clientObj.reachMultiplier || 1.1) * 12.4).toFixed(1)}%`,
      summary: `A performance semanal de ${clientObj.name} reflete o alinhamento impecável com a direção artística do CA.RO ATELIER. Os ativos digitais ganharam destaque significativo nas plataformas selecionadas, impulsionando a autoridade da marca no ambiente corporativo e nos ecossistemas de luxo.`,
      insights: [
        "A aplicação da paleta champagne-obsidian gerou aumento nas taxas de cliques qualificados.",
        "Renders 3D expostos sob luz de estúdio aumentaram o tempo médio de atenção na página de especificações.",
        "Destaque orgânico no público corporativo com maior engajamento estrutural no LinkedIn."
      ]
    });
  }, [approvals, pendings, meetings]);

  // Handle Send Direct Msg
  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directMsgText.trim()) return;

    const newMsg: ClientMessage = {
      id: `msg-${Date.now()}`,
      clientEmail: currentUser.email,
      senderName: currentUser.name,
      senderRole: "client",
      text: directMsgText.trim(),
      timestamp: new Date().toLocaleString("pt-BR", { hour12: false })
    };

    onAddClientMessage(newMsg);
    setDirectMsgText("");
  };

  // Solicitar Reunião
  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle || !meetingDate || !meetingTime) {
      alert("Preencha título, data e horário.");
      return;
    }

    const newMeet: Meeting = {
      id: `meet-${Date.now()}`,
      date: `${meetingDate} às ${meetingTime}`,
      title: `[Solicitada por Cliente] ${meetingTitle}`,
      attendees: [currentUser.name, "Diretoria (CA.RO TECH)"],
      agenda: meetingAgenda,
      decisions: ["Aguardando realização da conferência."],
      nextActions: [],
      clientEmail: currentUser.email
    };

    onAddMeeting(newMeet);
    setMeetRequestSuccess("Solicitação enviada à diretoria! A agenda foi atualizada localmente.");
    setMeetingTitle("");
    setMeetingDate("");
    setMeetingTime("");
    setMeetingAgenda("");
    
    setTimeout(() => {
      setShowMeetingModal(false);
      setMeetRequestSuccess(null);
    }, 3000);
  };

  // Aprovar Item
  const handleApprove = (item: ApprovalItem) => {
    const updated: ApprovalItem = {
      ...item,
      status: "Aprovado",
      feedback: item.feedback ? [...item.feedback, `Aprovado pelo cliente em ${new Date().toLocaleDateString("pt-BR")}`] : [`Aprovado pelo cliente em ${new Date().toLocaleDateString("pt-BR")}`]
    };
    onUpdateApproval(updated);
  };

  // Pedir Alteração
  const handleRequestAdjustments = (item: ApprovalItem) => {
    if (!adjustComment.trim()) return;
    const commentWithAuthor = `[Ajuste solicitado pelo cliente]: ${adjustComment}`;

    const updated: ApprovalItem = {
      ...item,
      status: "Ajustes Solicitados",
      feedback: item.feedback ? [...item.feedback, commentWithAuthor] : [commentWithAuthor]
    };
    onUpdateApproval(updated);
    setAdjustComment("");
    setActiveAdjustId(null);
  };

  // Download PDF Report Simulator
  const handleDownloadPDF = () => {
    if (!weeklyReport) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório Semanal - ${clientObj.name}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; background-color: #ffffff; color: #111111; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #8F7035; padding-bottom: 20px; margin-bottom: 30px; text-align: center; }
            .logo-placeholder { font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #8F7035; text-transform: uppercase; }
            .title { font-size: 28px; margin-top: 10px; margin-bottom: 5px; font-style: italic; }
            .meta { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; color: #8F7035; }
            .metric-box { background: #f9f9f9; padding: 15px; border-left: 4px solid #8F7035; margin-bottom: 20px; font-size: 14px; }
            .insight-list { padding-left: 20px; }
            .insight-item { margin-bottom: 10px; }
            .footer { margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 10px; text-align: center; color: #999; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-placeholder">CA.RO TECH ATELIER</div>
            <div class="title">Relatório de Performance Semanal</div>
            <div class="meta">${clientObj.name} &bull; ${weeklyReport.period}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Resumo Executivo da Direção</div>
            <p>${weeklyReport.summary}</p>
          </div>

          <div class="section">
            <div class="section-title">Análise de Crescimento Cromático</div>
            <div class="metric-box">
              Crescimento de conversão e alcance estimado de marca esta semana: <strong>${weeklyReport.growth}</strong>.
            </div>
          </div>

          <div class="section">
            <div class="section-title">Insights Críticos da I.A Oracle</div>
            <ul class="insight-list">
              ${weeklyReport.insights.map(ins => `<li class="insight-item">${ins}</li>`).join("")}
            </ul>
          </div>

          <div class="footer">
            CA.RO TECH &bull; TECNOLOGIA & DESIGN ESTRATÉGICO &bull; PRODUTO DE COMPLIANCE AUDITADO
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* 1. NOTIFICATIONS HEADER */}
      {notifications.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2.5"
        >
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-tech uppercase tracking-widest pl-1 font-bold">
            <Info className="w-3.5 h-3.5 text-[#C5A059]" /> Alertas Importantes do Workspace
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 bg-zinc-950/80 backdrop-blur-sm ${
                  notif.type === "alert" 
                    ? "border-rose-500/30 text-rose-350" 
                    : notif.type === "info"
                    ? "border-[#C5A059]/30 text-[#E5D1B0]"
                    : "border-emerald-500/30 text-emerald-350"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {notif.type === "alert" ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : notif.type === "info" ? (
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                  ) : (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs font-sans leading-normal">{notif.text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 2. INSTITUTIONAL CLIENT HEADER SPACE */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 md:p-8 rounded-2xl relative overflow-hidden w-full"
      >
        <div className="absolute inset-0 geo-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Logo / Title */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-3 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center p-2 relative group">
              {clientObj.logoUrl ? (
                <img src={clientObj.logoUrl} alt={clientObj.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-zinc-650" />
              )}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-white font-medium">{clientObj.name}</h1>
              <p className="text-[11px] text-[#C5A059] italic mt-0.5">"{clientObj.tagline}"</p>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-white/10 hover:border-[#C5A059]/40 text-zinc-300 hover:text-white rounded-lg text-[9px] font-tech uppercase tracking-wider transition-all cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-[#C5A059]" /> Meu Perfil e Acessos
              </button>
            </div>
          </div>

          {/* CNPJ, Status, address */}
          <div className="md:col-span-5 space-y-3 text-xs text-left">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-tech text-zinc-500 font-semibold block">CNPJ Institucional</span>
                <span className="font-mono text-zinc-300 font-bold block">{clientObj.cnpj || "Não Informado"}</span>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] uppercase tracking-widest font-tech text-zinc-500 font-semibold block">Status Operacional</span>
                <span className="font-tech text-zinc-300 font-bold block flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> {clientObj.status || "Ativo"}
                </span>
              </div>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] uppercase tracking-widest font-tech text-zinc-500 font-semibold block">Endereço Comercial</span>
              <span className="text-zinc-300 block">{clientObj.address || "Endereço comercial corporativo"}</span>
            </div>
          </div>

          {/* Website / Socials */}
          <div className="md:col-span-3 flex flex-col space-y-2">
            <span className="text-[9px] uppercase tracking-widest font-tech text-zinc-500 font-semibold text-center md:text-left block">Presença Digital</span>
            {clientObj.website ? (
              <a href={clientObj.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 bg-zinc-900 hover:bg-[#C5A059]/10 border border-white/5 hover:border-[#C5A059]/30 rounded-xl transition-all text-[11px] text-zinc-300 hover:text-white cursor-pointer">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Website Oficial</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            ) : null}
            <div className="flex gap-2">
              {clientObj.instagram ? (
                <a href={`https://instagram.com/${clientObj.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-zinc-900 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 rounded-xl transition-all text-[10px] text-zinc-300 hover:text-white cursor-pointer">
                  <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Instagram</span>
                </a>
              ) : null}
              {clientObj.linkedin ? (
                <a href={`https://linkedin.com/company/${clientObj.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-zinc-900 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 rounded-xl transition-all text-[10px] text-zinc-300 hover:text-white cursor-pointer">
                  <Linkedin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>LinkedIn</span>
                </a>
              ) : null}
            </div>
          </div>

        </div>
      </motion.div>

      {/* 3. RELATÓRIO MENSAL COM I.A E DOWNLOAD EM PDF */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 rounded-2xl border border-[#C5A059]/20 bg-[#0c0c0c] relative overflow-hidden"
      >
        <div className="absolute inset-0 geo-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-lg text-white">Relatório Mensal de Performance</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={selectedReportMonth}
              onChange={(e) => setSelectedReportMonth(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              value={selectedReportYear}
              onChange={(e) => setSelectedReportYear(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
            >
              {["2025", "2026", "2027"].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            
            <button 
              onClick={handleDownloadMonthlyPDF}
              disabled={!activeReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#E5D1B0] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold font-tech text-[10px] uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Baixar PDF
            </button>
          </div>
        </div>

        {activeReport ? (
          <div className="relative z-10 space-y-6 text-left">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-zinc-500 font-tech uppercase block">Alcance</span>
                <span className="font-serif text-xl text-white block mt-1">{activeReport.reach.toLocaleString()}</span>
              </div>
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-zinc-500 font-tech uppercase block">Impressões</span>
                <span className="font-serif text-xl text-white block mt-1">{activeReport.impressions.toLocaleString()}</span>
              </div>
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-[#C5A059]/20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#C5A059]/5" />
                <span className="text-[10px] text-[#C5A059] font-tech uppercase block relative z-10">Engajamento</span>
                <span className="font-serif text-xl text-[#C5A059] block mt-1 relative z-10">{activeReport.engagement}%</span>
              </div>
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-zinc-500 font-tech uppercase block">Cliques</span>
                <span className="font-serif text-xl text-white block mt-1">{activeReport.clicks.toLocaleString()}</span>
              </div>
            </div>

            {activeReport.imageUrl && (
              <div className="w-full bg-zinc-900/50 rounded-xl border border-white/5 p-4 overflow-hidden flex justify-center items-center">
                <img src={activeReport.imageUrl} alt="Gráfico de Performance" className="max-h-[350px] object-contain rounded-lg border border-white/10" />
              </div>
            )}

            <div className="bg-zinc-950/80 p-5 rounded-xl border border-[#C5A059]/10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[11px] text-[#C5A059] font-tech uppercase tracking-wider font-bold">Análise Estratégica & Considerações</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-light whitespace-pre-line pl-1">
                {activeReport.aiAnalysis}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center relative z-10 flex flex-col items-center justify-center bg-zinc-900/20 rounded-xl border border-white/5">
            <FileText className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-zinc-400 text-sm font-medium">Nenhum relatório publicado para o período selecionado.</p>
            <p className="text-zinc-600 text-[11px] mt-1.5 font-light">Selecione outro mês ou aguarde a atualização do seu gerente de conta.</p>
          </div>
        )}
      </motion.div>

      {/* 4. MESA KANBAN (SOMENTE LEITURA) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 rounded-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5 text-left">
          <LayoutGrid className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-lg text-white">Mesa Kanban de Projetos - Status de Entrega</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {["Criação", "Design", "Aprovação"].map((colStatus) => {
            const projectsInCol = clientProjects.filter(p => p.status === colStatus);
            return (
              <div key={colStatus} className="bg-zinc-950/60 p-4 rounded-xl border border-white/5 space-y-3.5 min-h-[180px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech font-bold">{colStatus}</span>
                  <span className="text-[9px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-500 font-bold">{projectsInCol.length}</span>
                </div>
                <div className="space-y-2.5">
                  {projectsInCol.length > 0 ? (
                    projectsInCol.map((proj) => (
                      <div key={proj.id} className="p-3 bg-zinc-900/40 border border-white/5 rounded-xl space-y-2">
                        <div className="text-xs font-semibold text-white truncate">{proj.name}</div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500">
                          <span>Progresso:</span>
                          <strong className="text-[#C5A059] font-mono">{proj.progress}%</strong>
                        </div>
                        <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                          <div className="bg-[#C5A059] h-full" style={{ width: `${proj.progress}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-zinc-600 text-center py-6">Nenhum projeto nesta fase.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 5. APROVAÇÕES DO CLIENTE (PEDIR ALTERAÇÃO OU APROVAR) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 rounded-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5 text-left">
          <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-lg text-white">Mesa de Aprovação de Artes e Copys</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {clientApprovals.length > 0 ? (
            clientApprovals.map((item) => (
              <div 
                key={item.id}
                className="bg-zinc-950/60 p-4 border border-white/5 rounded-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <span className="text-[9px] text-[#C5A059] font-tech uppercase tracking-wider">{item.type}</span>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{item.title}</h4>
                    </div>
                    <span className={`text-[9px] font-tech uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                      item.status === "Aprovado" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : item.status === "Ajustes Solicitados" 
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {item.thumbnail && (
                    <div className="w-full h-36 rounded-lg overflow-hidden bg-zinc-900 border border-white/5 relative">
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400 leading-relaxed font-light">{item.description}</p>

                  {item.captionText && (
                    <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/5 space-y-1">
                      <span className="text-[9px] text-[#C5A059] font-tech uppercase tracking-widest font-bold">Legenda Proposta:</span>
                      <p className="text-[10px] text-zinc-350 italic leading-relaxed font-mono whitespace-pre-wrap select-text">{item.captionText}</p>
                    </div>
                  )}

                  {item.feedback && item.feedback.length > 0 && (
                    <div className="space-y-1 bg-zinc-900/30 p-2.5 rounded-lg border border-white/5">
                      <span className="text-[9px] text-zinc-500 font-tech uppercase font-bold">Histórico de Feeds</span>
                      <div className="space-y-1">
                        {item.feedback.map((f, idx) => (
                          <div key={idx} className="text-[10px] text-zinc-400 leading-normal font-mono">• {f}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {item.status === "Pendente" && (
                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item)}
                        className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold font-tech text-[10px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Aprovar Material
                      </button>
                      <button
                        onClick={() => {
                          setActiveAdjustId(activeAdjustId === item.id ? null : item.id);
                          setAdjustComment("");
                        }}
                        className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 text-rose-400 border border-rose-900/20 rounded-lg text-[10px] font-bold font-tech uppercase tracking-widest flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Solicitar Ajuste
                      </button>
                    </div>

                    <AnimatePresence>
                      {activeAdjustId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden pt-2"
                        >
                          <textarea
                            required
                            rows={3}
                            placeholder="Descreva detalhadamente o ajuste solicitado neste material ou legenda..."
                            value={adjustComment}
                            onChange={(e) => setAdjustComment(e.target.value)}
                            className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-450 placeholder-zinc-650 resize-none font-sans"
                          />
                          <button
                            onClick={() => handleRequestAdjustments(item)}
                            className="w-full py-1.5 bg-rose-500/25 hover:bg-rose-500/35 border border-rose-500/30 text-rose-200 font-semibold text-[10px] font-tech uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                          >
                            Confirmar Solicitação de Ajuste
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-zinc-550 text-xs py-8 text-center bg-zinc-900/20 rounded-xl border border-white/5">
              Nenhuma peça pendente de aprovação no momento.
            </div>
          )}
        </div>
      </motion.div>

      {/* 6. INSTAGRAM PUBLICATION GRID WITH SIMULATED AI DETECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2 text-left">
            <Instagram className="w-4 h-4 text-[#C5A059]" />
            <div>
              <h3 className="font-serif text-lg text-white">Publicações Integradas Instagram</h3>
              <p className="text-[10px] text-zinc-500">I.A de reconhecimento ativo monitorando postagens do perfil @{clientObj.instagram?.replace("@", "") || "marca"}</p>
            </div>
          </div>
          <span className="text-[9px] font-tech text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded font-semibold uppercase">Detector Síncrono Ativo</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {clientPublications.length > 0 ? (
            clientPublications.map((pub) => (
              <div 
                key={pub.id} 
                className="bg-zinc-950 border border-white/5 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#C5A059]/30 transition-all group cursor-pointer"
              >
                <div className="aspect-square bg-zinc-900 relative">
                  {pub.fileUrl ? (
                    <img src={pub.fileUrl} alt={pub.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#111] to-zinc-900 flex flex-col items-center justify-center p-3 text-center">
                      <Sparkles className="w-6 h-6 text-[#C5A059] opacity-40 animate-pulse mb-1.5" />
                      <span className="text-[9px] text-zinc-500 tracking-tight font-tech">RECONHECIDO POR I.A</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[10px] font-tech text-[#E5D1B0] uppercase font-bold tracking-wider">
                    Ver Post Original
                  </div>
                </div>
                <div className="p-3 text-left">
                  <div className="text-[9px] text-[#C5A059] font-mono">{pub.date}</div>
                  <div className="text-[10px] text-white truncate font-medium mt-0.5">{pub.title}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 py-10 text-center text-zinc-550 text-xs bg-zinc-900/20 border border-white/5 rounded-xl">
              Nenhuma postagem identificada no perfil nas últimas 72 horas.
            </div>
          )}
        </div>
      </motion.div>

      {/* 7. REUNIÕES (HISTÓRICO E SOLICITAÇÃO) & PENDÊNCIAS CLIENTE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-left">
        
        {/* Reuniões */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }} 
          animate={{ opacity: 1, x: 0 }}
          className="luxury-card p-5 md:p-6 rounded-2xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif text-lg text-white">Histórico de Reuniões</h3>
              </div>
              <button
                onClick={() => setShowMeetingModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/20 text-[#E5D1B0] font-tech text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Solicitar Reunião
              </button>
            </div>

            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
              {clientMeetings.length > 0 ? (
                clientMeetings.map((meet) => (
                  <div key={meet.id} className="p-3 bg-zinc-900/40 border border-white/5 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#C5A059] font-mono">{meet.date}</span>
                      <span className="text-zinc-550">Atas Auditadas</span>
                    </div>
                    <div className="text-xs font-semibold text-white">{meet.title}</div>
                    <p className="text-[10px] text-zinc-450 leading-relaxed truncate">Agenda: {meet.agenda}</p>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-zinc-600 text-center py-8">Nenhuma reunião catalogada.</div>
              )}
            </div>
          </div>

          {/* Meeting solicitar Modal */}
          <AnimatePresence>
            {showMeetingModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-md w-full bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl space-y-4 relative"
                >
                  <button 
                    onClick={() => setShowMeetingModal(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="font-serif text-lg text-white">Solicitar Agenda com Diretoria</h3>
                  <p className="text-[10px] text-zinc-400">Insira a pauta e a sugestão de horário. O suporte técnico responderá em tempo real.</p>
                  
                  {meetRequestSuccess && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                      {meetRequestSuccess}
                    </div>
                  )}

                  <form onSubmit={handleRequestMeeting} className="space-y-3">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech font-bold mb-1">Título / Pauta da Reunião</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Alinhamento de criativos da coleção"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech font-bold mb-1">Data Sugerida</label>
                        <input
                          type="date"
                          required
                          value={meetingDate}
                          onChange={(e) => setMeetingDate(e.target.value)}
                          className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech font-bold mb-1">Horário Sugerido</label>
                        <input
                          type="time"
                          required
                          value={meetingTime}
                          onChange={(e) => setMeetingTime(e.target.value)}
                          className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech font-bold mb-1">Notas da Agenda / Detalhes</label>
                      <textarea
                        rows={3}
                        placeholder="Quais tópicos ou dúvidas de design gostaria de abordar nesta reunião?"
                        value={meetingAgenda}
                        onChange={(e) => setMeetingAgenda(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059] outline-none transition-all resize-none font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 font-bold font-tech text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                    >
                      Enviar Solicitação
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pendências do cliente */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }} 
          animate={{ opacity: 1, x: 0 }}
          className="luxury-card p-5 md:p-6 rounded-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-lg text-white">Pendências da Marca (Suas Ações)</h3>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {clientPendings.length > 0 ? (
              clientPendings.map((pend) => (
                <div key={pend.id} className="p-3.5 bg-zinc-900/40 border border-white/5 rounded-xl flex items-start gap-3 justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/20 px-2 py-0.5 rounded font-tech uppercase tracking-wider font-semibold">
                      Ação: {pend.type}
                    </span>
                    <h4 className="text-xs font-semibold text-white mt-1">{pend.title}</h4>
                    <p className="text-[10px] text-zinc-400 font-light leading-normal">{pend.description}</p>
                  </div>
                  <div className="text-[9px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded shrink-0 font-mono">
                    Prazo: {pend.deadline}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[10px] text-zinc-650 text-center py-12 bg-zinc-900/10 border border-white/5 rounded-xl">
                Parabéns! Sua mesa está completamente limpa de pendências operacionais.
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* 8. PORTAL I.A. CA.RO TECH INTEGRADO */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card p-5 md:p-6 rounded-2xl border border-white/10 bg-[#0C0C0C] relative overflow-hidden"
      >
        <div className="absolute inset-0 geo-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl text-[#C5A059]">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-white">Canal de Alinhamento Síncrono (Mensagens Diretas)</h3>
              <p className="text-[10px] text-zinc-400">Atendimento rápido, feedbacks e alertas em tempo real direto de Barueri</p>
            </div>
          </div>
          <span className="text-[9px] font-tech text-[#C5A059] tracking-widest bg-[#C5A059]/10 border border-[#C5A059]/20 px-2.5 py-0.5 rounded uppercase font-semibold">
            Mesa: {clientObj.name}
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
          {/* Chat Feed */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-zinc-950/60 rounded-xl border border-white/5 p-4 min-h-[260px] max-h-[350px] overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-855">
              {clientMessages.filter(m => m.clientEmail.toLowerCase() === currentUser.email.toLowerCase()).length > 0 ? (
                clientMessages
                  .filter(m => m.clientEmail.toLowerCase() === currentUser.email.toLowerCase())
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
                  <MessageSquare className="w-8 h-8 text-zinc-650 mb-2 stroke-1" />
                  <p className="text-xs font-semibold">Canal configurado com sucesso.</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Insira mensagens abaixo para interagir com o CA.RO ATELIER.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMsg} className="flex gap-2">
              <input
                type="text"
                required
                value={directMsgText}
                onChange={(e) => setDirectMsgText(e.target.value)}
                placeholder="Digite uma dúvida, aprovação verbal ou solicitação de suporte aqui..."
                className="flex-1 bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059] placeholder-zinc-550 select-text font-sans"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Side Info */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-zinc-900/30 rounded-xl border border-white/5 p-4 text-xs font-light space-y-3">
            <div className="space-y-2.5">
              <span className="text-[10px] text-[#C5A059] font-tech uppercase tracking-widest font-bold block">Controle Operacional</span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-500">Servidor Síncrono:</span>
                  <strong className="text-white font-tech uppercase">ALLPHAVILLE - BARUERI</strong>
                </div>
                <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-550">Atas Auditadas:</span>
                  <strong className="text-white font-tech">{clientMeetings.length}</strong>
                </div>
                <div className="flex justify-between items-center bg-zinc-950/40 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-550">Peças na Mesa:</span>
                  <strong className="text-white font-tech">{clientApprovals.length}</strong>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/40 border border-[#C5A059]/10 rounded-xl text-[10px] text-zinc-500 leading-normal">
              <span className="block font-semibold text-[#E5D1B0] mb-0.5">💡 Suporte Técnico Síncrono</span>
              Suas considerações são avaliadas diretamente por nossos diretores em Barueri. Todas as interações contam com logs persistidos para fins de compliance.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl space-y-5 relative my-8"
            >
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-serif text-lg text-white">Configurações de Conta e Acesso</h3>
              </div>

              {profileUpdateSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" /> {profileUpdateSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-left">
                {/* Credentials Section */}
                <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-[10px] text-[#C5A059] font-tech uppercase tracking-widest font-bold">Credenciais de Acesso</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech font-bold mb-1">E-mail de Login (Somente Leitura)</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="email"
                          disabled
                          value={clientObj.email}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950/50 border border-white/5 rounded-lg text-zinc-500 outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Senha Exclusiva</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={editClientPassword}
                          onChange={(e) => setEditClientPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corporate Info Section */}
                <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-[10px] text-[#C5A059] font-tech uppercase tracking-widest font-bold">Dados Corporativos</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        required
                        value={editClientName}
                        onChange={(e) => setEditClientName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">CNPJ</label>
                      <input
                        type="text"
                        value={editClientCnpj}
                        onChange={(e) => setEditClientCnpj(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Endereço Comercial</label>
                      <input
                        type="text"
                        value={editClientAddress}
                        onChange={(e) => setEditClientAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Identity & Socials */}
                <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <span className="text-[10px] text-[#C5A059] font-tech uppercase tracking-widest font-bold">Identidade & Presença Digital</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Slogan / Tagline</label>
                      <input
                        type="text"
                        value={editClientTagline}
                        onChange={(e) => setEditClientTagline(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">URL da Logomarca (PNG/JPG)</label>
                      <input
                        type="url"
                        value={editClientLogoUrl}
                        onChange={(e) => setEditClientLogoUrl(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Website URL</label>
                      <input
                        type="url"
                        value={editClientWebsite}
                        onChange={(e) => setEditClientWebsite(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Instagram (@usuario)</label>
                      <input
                        type="text"
                        value={editClientInstagram}
                        onChange={(e) => setEditClientInstagram(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-lg text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 font-bold font-tech text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Salvar Configurações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
