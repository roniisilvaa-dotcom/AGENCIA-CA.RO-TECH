import React, { useState, useEffect } from "react";
import { 
  Project, 
  Meeting, 
  ApprovalItem, 
  Publication, 
  PendingItem, 
  ResultMetrics,
  Client,
  ClientMessage
} from "./types";
import { 
  INITIAL_PROJECTS, 
  INITIAL_MEETINGS, 
  INITIAL_APPROVALS, 
  INITIAL_PUBLICATIONS, 
  INITIAL_PENDINGS, 
  INITIAL_METRICS,
  INITIAL_CLIENTS,
  getSavedOrCreate,
  saveState
} from "./data";

import DashboardTab from "./components/DashboardTab";
import MeetingsTab from "./components/MeetingsTab";
import ProjectsTab from "./components/ProjectsTab";
import PortalAiTab from "./components/PortalAiTab";
import ApprovalsTab from "./components/ApprovalsTab";
import PublicationsTab from "./components/PublicationsTab";
import ResultsTab from "./components/ResultsTab";
import PendingsTab from "./components/PendingsTab";
import LoginGate from "./components/LoginGate";
import ClientDashboard from "./components/ClientDashboard";
import ClientsTab from "./components/ClientsTab";

// Lucide icons
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  CheckSquare, 
  FileCheck2, 
  TrendingUp, 
  AlertTriangle,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // User Profile Authenticated State
  const [currentUser, setCurrentUser] = useState<{ role: "agency" | "client"; name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem("caro_login");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (role: "agency" | "client", name: string, email: string) => {
    const user = { role, name, email };
    setCurrentUser(user);
    localStorage.setItem("caro_login", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("caro_login");
  };

  const handleResetSystem = () => {
    if (confirm("Aviso supremo: Deseja realmente ZERAR e limpar todo o banco de dados local do sistema? Isso apagará todos os clientes, projetos, pendências e mensagens cadastrados.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Core App states persisting seamlessly inside localStorage
  const [projects, setProjects] = useState<Project[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pendings, setPendings] = useState<PendingItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientMessages, setClientMessages] = useState<ClientMessage[]>([]);
  const [metrics, setMetrics] = useState<ResultMetrics>(INITIAL_METRICS);

  // Initialize data on component mount
  useEffect(() => {
    setProjects(getSavedOrCreate<Project[]>("caro_projects", INITIAL_PROJECTS));
    setMeetings(getSavedOrCreate<Meeting[]>("caro_meetings", INITIAL_MEETINGS));
    setApprovals(getSavedOrCreate<ApprovalItem[]>("caro_approvals", INITIAL_APPROVALS));
    setPublications(getSavedOrCreate<Publication[]>("caro_publications", INITIAL_PUBLICATIONS));
    setPendings(getSavedOrCreate<PendingItem[]>("caro_pendings", INITIAL_PENDINGS));
    setClients(getSavedOrCreate<Client[]>("caro_clients", INITIAL_CLIENTS));
    setClientMessages(getSavedOrCreate<ClientMessage[]>("caro_client_messages", [
      {
        id: "msg-init-1",
        clientEmail: "mundi@tkr.com",
        senderName: "Agência CA.RO TECH",
        senderRole: "agency",
        text: "Bem-vindos ao nosso espaço unificado de Barueri. Deixem suas considerações ou avisos urgentes aqui para nossa equipe de criação síncrona.",
        timestamp: "07/06/2026, 14:00"
      },
      {
        id: "msg-init-2",
        clientEmail: "dadoskagiva@gmail.com",
        senderName: "Agência CA.RO TECH",
        senderRole: "agency",
        text: "Olá equipe Kagiva Sports! Fuso de São Paulo sintonizado com Alphaville. Aguardamos sua revisão dos novos posts de alto impacto esportivo.",
        timestamp: "07/06/2026, 14:15"
      }
    ]));
  }, []);

  // Update localStorage when state alters
  const handleAddProject = (newProj: Project) => {
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveState("caro_projects", updated);
  };

  const handleUpdateProject = (updatedProj: Project) => {
    const updated = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(updated);
    saveState("caro_projects", updated);
  };

  const handleAddMeeting = (newMeet: Meeting) => {
    const updated = [newMeet, ...meetings];
    setMeetings(updated);
    saveState("caro_meetings", updated);
  };

  const handleUpdateApproval = (updatedAppr: ApprovalItem) => {
    const updated = approvals.map(a => a.id === updatedAppr.id ? updatedAppr : a);
    setApprovals(updated);
    saveState("caro_approvals", updated);
  };

  const handleAddPublication = (newPub: Publication) => {
    const updated = [newPub, ...publications];
    setPublications(updated);
    saveState("caro_publications", updated);
    
    // Dynamically increment client metrics for excitement!
    const updatedMetrics = {
      ...metrics,
      reach: metrics.reach + 2400,
      impressions: metrics.impressions + 9100,
      clicks: metrics.clicks + 320
    };
    setMetrics(updatedMetrics);
  };

  const handleAddPending = (newPend: PendingItem) => {
    const updated = [newPend, ...pendings];
    setPendings(updated);
    saveState("caro_pendings", updated);
  };

  const handleAddClient = (newCli: Client) => {
    const updated = [...clients, newCli];
    setClients(updated);
    saveState("caro_clients", updated);
  };

  const handleDeleteClient = (clientId: string) => {
    const updated = clients.filter(c => c.id !== clientId);
    setClients(updated);
    saveState("caro_clients", updated);
  };

  const handleUpdateClient = (updatedCli: Client) => {
    const updated = clients.map(c => c.id === updatedCli.id ? updatedCli : c);
    setClients(updated);
    saveState("caro_clients", updated);
  };

  const handleAddClientMessage = (newMsg: ClientMessage) => {
    const updated = [...clientMessages, newMsg];
    setClientMessages(updated);
    saveState("caro_client_messages", updated);
  };

  const handleAddApproval = (newAppr: ApprovalItem) => {
    const updated = [newAppr, ...approvals];
    setApprovals(updated);
    saveState("caro_approvals", updated);
  };

  const handleResolvePending = (id: string) => {
    const updated = pendings.filter(p => p.id !== id);
    setPendings(updated);
    saveState("caro_pendings", updated);
  };

  const sidebarTabs = [
    { id: "dashboard", label: "Painel Geral", icon: LayoutDashboard },
    { id: "clientes", label: "Gestão de Clientes", icon: Building2 },
    { id: "reunioes", label: "Histórico de Reuniões", icon: Users },
    { id: "projetos", label: "Mesa Kanban & Status", icon: Layers },
    { id: "portal-ai", label: "Portal I.A Oracle", icon: Sparkles },
    { id: "aprovacoes", label: "Aprovações (Mundis)", icon: CheckSquare },
    { id: "publicacoes", label: "Publicações", icon: FileCheck2 },
    { id: "resultados", label: "Métricas & Relatórios", icon: TrendingUp },
    { id: "pendencias", label: "Pendências Cliente", icon: AlertTriangle, badge: pendings.length },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab 
            projects={projects} 
            meetings={meetings} 
            pendings={pendings} 
            publicationsCount={publications.length} 
            currentUser={currentUser} 
            clients={clients}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            onUpdateClient={handleUpdateClient}
            onAddApproval={handleAddApproval}
            clientMessages={clientMessages}
            onAddClientMessage={handleAddClientMessage}
          />
        );
      case "clientes":
        return (
          <ClientsTab
            clients={clients}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            onUpdateClient={handleUpdateClient}
          />
        );
      case "reunioes":
        return <MeetingsTab meetings={meetings} onAddMeeting={handleAddMeeting} currentUser={currentUser} />;
      case "projetos":
        return <ProjectsTab projects={projects} onAddProject={handleAddProject} onUpdateProject={handleUpdateProject} currentUser={currentUser} clients={clients} />;
      case "portal-ai":
        return <PortalAiTab projects={projects} currentUser={currentUser} />;
      case "aprovacoes":
        return <ApprovalsTab approvals={approvals} onUpdateApproval={handleUpdateApproval} currentUser={currentUser} />;
      case "publicacoes":
        return <PublicationsTab publications={publications} onAddPublication={handleAddPublication} currentUser={currentUser} />;
      case "resultados":
        return <ResultsTab metrics={metrics} projects={projects} clients={clients} publications={publications} currentUser={currentUser} />;
      case "pendencias":
        return <PendingsTab pendings={pendings} onAddPending={handleAddPending} onResolvePending={handleResolvePending} currentUser={currentUser} />;
      default:
        return (
          <DashboardTab 
            projects={projects} 
            meetings={meetings} 
            pendings={pendings} 
            publicationsCount={publications.length} 
            currentUser={currentUser} 
            clients={clients}
            onAddClient={handleAddClient}
            onDeleteClient={handleDeleteClient}
            onUpdateClient={handleUpdateClient}
            onAddApproval={handleAddApproval}
            clientMessages={clientMessages}
            onAddClientMessage={handleAddClientMessage}
          />
        );
    }
  };

  if (!currentUser) {
    return <LoginGate onLogin={handleLogin} />;
  }

  return (
    <div id="app-viewport-wrapper" className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] relative overflow-hidden flex flex-col">
      {/* Decorative ultra-thin golden line represent elite European style */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#8F7035] via-[#C5A059] to-[#8F7035] z-50 shrink-0" />
      
      {/* Background radial effects representing expensive studio illumination */}
      <div className="absolute top-[-300px] left-[50%] translate-x-[-50%] w-[800px] h-[600px] bg-gradient-radial from-[#C5A059]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full geo-grid opacity-[0.035] pointer-events-none" />

      {/* Main header block */}
      <header className="border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md z-45 sticky top-0 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#C5A059] rounded-full shrink-0"></div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-[0.25em] text-white">CA.RO <span className="italic text-[#C5A059]">ATELIER</span></span>
                <span className="text-[9px] text-[#C5A059] font-tech uppercase tracking-[0.3em] font-bold">Tecnologia Síncrona & Design de Luxo / Barueri</span>
              </div>
            </div>
            <div className="hidden sm:block h-6 w-[1px] bg-white/10" />
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 font-tech">
              <span>Parceria Executiva</span>
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#111] px-3 py-1.5 border border-white/5 rounded-xl">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-zinc-300 font-medium font-tech">{currentUser.name}</span>
                <span className="text-[8px] text-[#C5A059] font-tech uppercase tracking-wider font-semibold">
                  {currentUser.role === "agency" ? "Acesso Agência" : "Acesso Cliente / Auditor"}
                </span>
              </div>
              {currentUser.role === "agency" && (
                <button
                  onClick={handleResetSystem}
                  className="text-[9px] font-tech text-amber-550 hover:text-amber-455 hover:bg-amber-500/10 px-2 py-1 rounded transition-all uppercase cursor-pointer font-bold"
                >
                  Zerar Sistema
                </button>
              )}
              <button
                onClick={handleLogout}
                className="text-[9px] font-tech text-rose-450 hover:text-rose-400 hover:bg-rose-500/10 px-2 py-1 rounded transition-all uppercase cursor-pointer font-bold"
              >
                Sair
              </button>
            </div>
            
            <span className="text-[9px] tracking-widest font-mono text-zinc-500 uppercase">LX.2026</span>
          </div>

          {/* Mobile menu trigger */}
          {currentUser.role === "agency" && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 text-zinc-300 hover:text-[#C5A880] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </header>

      {/* App Body Structure */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6 relative z-10 min-h-0">
        
        {/* Navigation Sidebar (Desktop) */}
        {currentUser.role === "agency" && (
          <aside className="hidden md:block w-64 shrink-0 space-y-4">
            <div className="luxury-card p-4 rounded-xl space-y-1.5 border border-white/[0.03]">
              <div className="text-[10px] text-zinc-500 uppercase font-tech tracking-widest px-3 mb-2.5">Portal de Ações</div>
              
              <nav className="space-y-1">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium tracking-wide font-tech transition-all cursor-pointer ${
                        isActive 
                          ? "bg-[#C5A059] text-zinc-950 font-bold scale-[1.01]" 
                          : "text-zinc-400 hover:text-[#E5D1B0] hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4.5 h-4.5 shrink-0" />
                        <span>{tab.label}</span>
                      </div>

                      {tab.badge && tab.badge > 0 ? (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-zinc-900 text-white" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}>
                          {tab.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Info Box */}
            <div className="luxury-card p-4 rounded-xl space-y-2 border border-white/[0.02]">
              <span className="text-[10px] text-zinc-400 font-tech uppercase tracking-widest border-b border-white/5 pb-1 block font-bold">Resumo Geral</span>
              <div className="space-y-1.5 pt-1.5 text-[11px] font-light text-zinc-300">
                <div className="flex justify-between">
                  <span>Atividades Ativas:</span>
                  <strong className="text-white font-tech">{projects.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Última Ata de Reunião:</span>
                  <strong className="text-white font-tech">{meetings[0]?.date || "N/A"}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Peças Pendentes TKR:</span>
                  <strong className="text-amber-400 font-tech">{approvals.filter(a => a.status === "Pendente").length}</strong>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Mobile Navigation Drawer */}
        {currentUser.role === "agency" && (
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden w-full bg-zinc-950 border border-white/10 rounded-xl p-4 space-y-2 shrink-0 select-none overflow-hidden"
              >
                <div className="text-[10px] text-zinc-500 uppercase font-tech tracking-wider px-2 mb-1.5">Navegação Móvel</div>
                <div className="grid grid-cols-2 gap-2">
                  {sidebarTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-2 p-3.5 rounded-xl text-xs font-semibold font-tech tracking-wider transition-all cursor-pointer border ${
                          isActive 
                            ? "bg-[#C5A059] text-zinc-950 border-[#C5A059]" 
                            : "bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-white"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-current" />
                        <span className="truncate">{tab.label}</span>
                        {tab.badge && tab.badge > 0 ? (
                          <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-auto">
                            {tab.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile session info & toggle */}
                <div className="border-t border-white/5 pt-3.5 mt-2.5 flex flex-col gap-2 bg-[#111]/40 p-3 rounded-xl">
                  <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400 font-tech">
                    <span>Conectado como: <strong className="text-white font-medium">{currentUser.name}</strong></span>
                    <span className="text-[#C5A059] uppercase font-bold tracking-wider">{currentUser.role === "agency" ? "Agência" : "Cliente"}</span>
                  </div>
                  <div className="flex text-[10px] font-tech uppercase tracking-wider">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 text-center bg-rose-950/20 text-rose-400 border border-rose-900/30 rounded-lg font-bold cursor-pointer active:scale-95 transition-all"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Main Workspace Frame container */}
        <main className="flex-1 overflow-y-auto pr-1 min-w-0" style={{ contentVisibility: "auto" }}>
          {currentUser.role === "client" ? (
            <ClientDashboard
              currentUser={currentUser}
              clients={clients}
              projects={projects}
              meetings={meetings}
              approvals={approvals}
              publications={publications}
              pendings={pendings}
              clientMessages={clientMessages}
              onAddClientMessage={handleAddClientMessage}
              onUpdateApproval={handleUpdateApproval}
              onAddMeeting={handleAddMeeting}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full pb-8"
              >
                {renderActiveTabContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

      </div>

      {/* Tiny designer footer credit line */}
      <footer className="border-t border-white/10 py-6 bg-zinc-950/80 backdrop-blur-md shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-tech">
          <div className="flex space-x-12">
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-tighter opacity-40 font-semibold text-[#C5A059]">Berlin Office</span>
              <span className="text-[10px] tracking-widest text-[#E5E5E5]">4.3292° N, 10.1233° E</span>
            </div>
            <div className="flex flex-col text-left pb-1">
              <span className="text-[9px] uppercase tracking-tighter opacity-40 font-semibold text-[#C5A059]">Lisbon Studio</span>
              <span className="text-[10px] tracking-widest text-[#E5E5E5]">38.7223° N, 9.1393° W</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-tighter opacity-40 font-semibold text-[#C5A059]">São Paulo Atelier</span>
              <span className="text-[10px] tracking-widest text-[#E5E5E5]">23.5505° S, 46.6333° W</span>
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-normal text-center md:text-right">
            CA.RO ATELIER • Todos os Direitos Reservados • 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
