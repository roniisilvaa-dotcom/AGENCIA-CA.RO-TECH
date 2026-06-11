import React, { useState, useEffect } from "react";
import { Project, Comment, Client } from "../types";
import { 
  Plus, 
  User, 
  Calendar, 
  Tag, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft,
  FolderLock,
  ChevronDown,
  ChevronsUpDown,
  Upload,
  Layers,
  Send,
  X,
  Sliders,
  Sparkles,
  RefreshCw,
  LayoutGrid,
  Kanban as KanbanIcon,
  Activity,
  Award,
  Zap,
  Globe,
  Loader2,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectsTabProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  } | null;
  clients?: Client[];
}

const pipelineStages: Project["status"][] = [
  "Briefing", 
  "Planejamento", 
  "Criação", 
  "Design", 
  "Revisão", 
  "Aprovação", 
  "Programação", 
  "Publicação"
];

const stageColors: Record<string, string> = {
  "Briefing": "border-zinc-700/40 text-zinc-400 bg-zinc-950/20",
  "Planejamento": "border-blue-500/20 text-blue-400 bg-blue-500/5",
  "Criação": "border-amber-500/20 text-amber-400 bg-amber-500/5",
  "Design": "border-purple-500/20 text-purple-400 bg-purple-500/5",
  "Revisão": "border-orange-500/20 text-orange-400 bg-orange-500/5",
  "Aprovação": "border-[#C5A059]/30 text-[#E5D1B0] bg-[#C5A059]/5",
  "Programação": "border-teal-500/20 text-teal-400 bg-teal-500/5",
  "Publicação": "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
};

export default function ProjectsTab({ projects, onAddProject, onUpdateProject, currentUser, clients = [] }: ProjectsTabProps) {
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("all");
  const [showPlanForm, setShowPlanForm] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  
  // New project creation state
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newOwner, setNewOwner] = useState("Carol (CA.RO ATELIER)");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newPriority, setNewPriority] = useState<Project["priority"]>("Média");
  const [newStatus, setNewStatus] = useState<Project["status"]>("Briefing");
  const [newClientEmail, setNewClientEmail] = useState("");

  // AI Briefing Generator states
  const [rawConcept, setRawConcept] = useState("");
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefingError, setBriefingError] = useState<string | null>(null);
  const [showAiBriefPanel, setShowAiBriefPanel] = useState(false);

  useEffect(() => {
    if (currentUser?.role === "client") {
      setNewClientEmail(currentUser.email);
    } else if (clients && clients.length > 0) {
      setNewClientEmail(clients[0].email);
    }
  }, [clients, currentUser]);

  const handleGenerateAiBriefing = async () => {
    if (!rawConcept.trim()) return;
    setIsGeneratingBriefing(true);
    setBriefingError(null);
    try {
      const activeClientName = clients.find(c => c.email === newClientEmail)?.name || "Mundi TKR";
      const res = await fetch("/api/generate-project-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: activeClientName,
          rawConcept: rawConcept
        })
      });

      if (!res.ok) throw new Error("Erro de comunicação.");
      const data = await res.json();
      
      if (data.refinedTitle) setNewName(data.refinedTitle);
      
      let goalsAndAesthetic = data.refinedGoal;
      if (data.visualDirections && data.visualDirections.length > 0) {
        goalsAndAesthetic += "\n\nDiretrizes Visuais Recomendadas:\n" + data.visualDirections.map((dir: string) => `- ${dir}`).join("\n");
      }
      if (goalsAndAesthetic) setNewGoal(goalsAndAesthetic);
      
      if (data.suggestedPriority) setNewPriority(data.suggestedPriority);
      if (data.owner) setNewOwner(data.owner);
      
      // Auto-fill dates too for convenient scheduling (e.g. today to +20 days)
      const today = new Date().toISOString().split("T")[0];
      const future = new Date();
      future.setDate(future.getDate() + 20);
      const futureStr = future.toISOString().split("T")[0];
      setNewStart(today);
      setNewEnd(futureStr);

      setShowAiBriefPanel(false);
      setRawConcept("");
    } catch (err: any) {
      console.error(err);
      setBriefingError("Inconsistência síncrona na nuvem. Gerando rascunho de preenchimento inteligente.");
      
      // Fine-crafted fallback
      setNewName(`Campanha Estética de Precisão • ${clients.find(c => c.email === newClientEmail)?.name || "Mundi TKR"}`);
      setNewGoal(`Concepção de mídias de alto nível para divulgar o conceito "${rawConcept}".\n\nDiretrizes Visuais:\n- Acabamento fino com iluminação direcionada alemã.\n- Contraste sutil e uso do desfoque elegante.`);
      setNewPriority("Alta");
      setNewOwner("Carol (CA.RO ATELIER)");
      
      const today = new Date().toISOString().split("T")[0];
      const future = new Date();
      future.setDate(future.getDate() + 15);
      setNewStart(today);
      setNewEnd(future.toISOString().split("T")[0]);
      
      setShowAiBriefPanel(false);
      setRawConcept("");
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  // Selected project drawer details
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);

  // Comment input
  const [commentText, setCommentText] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newGoal || !newStart || !newEnd) return;

    // Calculate progress depending on initial phase choice
    const progressMap: Record<Project["status"], number> = {
      "Briefing": 10,
      "Planejamento": 25,
      "Criação": 40,
      "Design": 60,
      "Revisão": 75,
      "Aprovação": 90,
      "Programação": 95,
      "Publicação": 100
    };

    const nProj: Project = {
      id: "proj-" + Date.now(),
      name: newName,
      goal: newGoal,
      owner: newOwner,
      startDate: newStart,
      endDate: newEnd,
      priority: newPriority,
      status: newStatus,
      progress: progressMap[newStatus] || 10,
      lastUpdate: "Fluxo de projeto criado estritamente via portal de transparência.",
      comments: [],
      assets: [],
      clientEmail: newClientEmail
    };

    onAddProject(nProj);
    
    // reset inputs
    setNewName("");
    setNewGoal("");
    setNewStart("");
    setNewEnd("");
    setNewPriority("Média");
    setNewStatus("Briefing");
    setShowPlanForm(false);
    setSelectedProjectId(nProj.id);
  };

  const handleAddComment = (projectId: string) => {
    if (!commentText.trim()) return;

    const target = projects.find(p => p.id === projectId);
    if (!target) return;

    const newComment: Comment = {
      id: "comm-" + Date.now(),
      author: currentUser?.name || "Diretoria Mundi TKR",
      role: currentUser?.role === "agency" ? "Diretor Técnico" : "Cliente",
      text: commentText,
      date: new Date().toISOString().split("T")[0]
    };

    const updated: Project = {
      ...target,
      comments: [...target.comments, newComment],
      lastUpdate: `Novo comentário registrado por ${currentUser?.name || "Mundi TKR"}: "${commentText.slice(0, 30)}..."`
    };

    onUpdateProject(updated);
    setCommentText("");
  };

  // State handler to move statuses manually or via HTML5 Drag and Drop
  const handleTransitionStatus = (projId: string, nextStatus: Project["status"]) => {
    const target = projects.find(p => p.id === projId);
    if (!target) return;

    const progressMap: Record<Project["status"], number> = {
      "Briefing": 10,
      "Planejamento": 25,
      "Criação": 40,
      "Design": 60,
      "Revisão": 75,
      "Aprovação": 90,
      "Programação": 95,
      "Publicação": 100
    };

    const updated: Project = {
      ...target,
      status: nextStatus,
      progress: progressMap[nextStatus],
      lastUpdate: `Pipeline realinhado para: ${nextStatus} por ${currentUser?.name || "Operação"}.`
    };
    onUpdateProject(updated);
  };

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("projectId", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Project["status"]) => {
    e.preventDefault();
    const pid = e.dataTransfer.getData("projectId");
    if (pid) {
      handleTransitionStatus(pid, targetStatus);
    }
  };

  // Metrics calculations for the dashboard widgets
  const totalProjects = projects.length;
  const avgProgress = totalProjects > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects) 
    : 0;
  const highPriorityCount = projects.filter(p => p.priority === "Alta").length;
  const activeWorkingCount = projects.filter(p => ["Criação", "Design", "Revisão"].includes(p.status)).length;

  const filteredProjects = activeProjectFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === activeProjectFilter);

  const activeProjectDetails = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      
      {/* Upper Options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white tracking-tight">Projetos & Módulos Kanban</h2>
          <p className="text-xs text-zinc-400">Atividades organizadas e fluxos rastreáveis com dashboards operacionais.</p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end">
          {/* View Mode selection */}
          <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-white/5 font-mono text-[10px]">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer uppercase font-semibold transition-all ${
                viewMode === "kanban" ? "bg-[#C5A059]/10 text-[#E5D1B0] font-bold border border-[#C5A059]/20" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" /> Mesa Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer uppercase font-semibold transition-all ${
                viewMode === "list" ? "bg-[#C5A059]/10 text-[#E5D1B0] font-bold border border-[#C5A059]/20" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Lista Cartões
            </button>
          </div>

          {currentUser?.role === "agency" ? (
            <button
              onClick={() => setShowPlanForm(!showPlanForm)}
              className="px-4 py-2.5 bg-zinc-900 border border-[#C5A059]/30 hover:border-[#C5A059]/60 text-[#E5D1B0] rounded-xl text-xs font-semibold uppercase tracking-wider font-tech flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Novo Projeto
            </button>
          ) : (
            <div className="px-4 py-2.5 bg-zinc-900/60 border border-white/5 text-zinc-400 rounded-xl text-xs font-medium tracking-wide font-tech flex items-center gap-2 select-none justify-center">
              <span>🔒 Gestão Exclusiva Agência</span>
            </div>
          )}
        </div>
      </div>

      {/* Technological Dashboard Widgets Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Widget 1 */}
        <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-2.5 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-xl text-[#C5A059]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase font-tech text-zinc-500 tracking-wider">Conclusão Média</div>
            <div className="text-lg font-serif text-white tracking-tight">{avgProgress}%</div>
          </div>
          <div className="absolute right-0 bottom-0 p-1 opacity-10">
            <Sliders className="w-16 h-16 text-[#C5A059]" />
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
            <Zap className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-[9px] uppercase font-tech text-zinc-500 tracking-wider">Prazos Críticos</div>
            <div className="text-lg font-serif text-white tracking-tight">{highPriorityCount} Alta Prioridade</div>
          </div>
          <div className="absolute right-0 bottom-0 p-1 opacity-10">
            <Zap className="w-16 h-16 text-rose-500" />
          </div>
        </div>

        {/* Widget 3 */}
        <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase font-tech text-zinc-500 tracking-wider">Célula Criação</div>
            <div className="text-lg font-serif text-white tracking-tight">{activeWorkingCount} Projetos Ativos</div>
          </div>
          <div className="absolute right-0 bottom-0 p-1 opacity-10">
            <Layers className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        {/* Widget 4 */}
        <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] uppercase font-tech text-zinc-500 tracking-wider">Pipeline Sincronizado</div>
            <div className="text-lg font-serif text-white tracking-tight">{totalProjects} frentes</div>
          </div>
          <div className="absolute right-0 bottom-0 p-1 opacity-10">
            <Globe className="w-16 h-16 text-emerald-400" />
          </div>
        </div>

      </div>

      {/* Filter Tabs / Stage summary indicators only in list view */}
      {viewMode === "list" && (
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveProjectFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-tech tracking-wide transition-all cursor-pointer ${
              activeProjectFilter === "all" ? "bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E5D1B0]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Todos ({projects.length})
          </button>
          {pipelineStages.map(stage => {
            const count = projects.filter(p => p.status === stage).length;
            return (
              <button
                key={stage}
                onClick={() => setActiveProjectFilter(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-tech tracking-wide transition-all cursor-pointer ${
                  activeProjectFilter === stage ? "bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5D1B0]" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {stage} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Project Plan creation module */}
      <AnimatePresence mode="wait">
        {showPlanForm && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="luxury-card p-6 rounded-2xl relative border border-white/5 bg-zinc-950"
          >
            <button 
              onClick={() => setShowPlanForm(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-[#C5A059]" />
                <h3 className="font-serif text-lg text-white">Novo Projeto de Gestão Remota</h3>
              </div>
              
              <button
                type="button"
                onClick={() => setShowAiBriefPanel(!showAiBriefPanel)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/25 text-[#E5D1B0] rounded-xl text-xs font-medium tracking-wide font-tech transition-all cursor-pointer self-start md:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                <span>Gerar Briefing por CA.RO TECH IA</span>
              </button>
            </div>

            {/* AI Generator Panel Overlay */}
            <AnimatePresence>
              {showAiBriefPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="p-4 bg-zinc-900 border border-[#C5A059]/20 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs text-white font-medium">
                      <Bot className="w-4 h-4 text-[#C5A059]" />
                      <span>Estúdio de Briefing Síncrono • CA.RO TECH IA</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Escreva um conceito livre e rápido (ex: <i>"fotos aéreas em Barueri com os carros, contraste cinza"</i>). Nossa inteligência estruturará de forma requintada o título, os objetivos de alto impacto e completará as datas previstas.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 text-xs bg-zinc-950 border border-white/10 rounded-lg p-2 text-white placeholder-zinc-600 focus:border-[#C5A059] outline-none"
                        placeholder="Rabiscar conceito técnico..."
                        value={rawConcept}
                        onChange={(e) => setRawConcept(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleGenerateAiBriefing()}
                        disabled={isGeneratingBriefing}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateAiBriefing}
                        disabled={isGeneratingBriefing || !rawConcept.trim()}
                        className="px-4 py-2 bg-[#C5A059] hover:bg-[#E5D1B0] disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-900 rounded-lg text-xs font-semibold tracking-wider uppercase font-tech flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {isGeneratingBriefing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Processando...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Gerar</span>
                          </>
                        )}
                      </button>
                    </div>
                    {briefingError && (
                      <p className="text-[10px] text-rose-400 font-mono">{briefingError}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUser?.role === "agency" && (
                <div className="md:col-span-2 bg-[#111] p-3 border border-white/5 rounded-xl">
                  <label className="block text-[10px] text-[#C5A059] uppercase tracking-wider font-tech mb-1.5 font-medium">Cliente Alvo do Projeto</label>
                  <select
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                  >
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.email}>{cli.name} — {cli.email}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#C5A059] uppercase tracking-wider font-tech mb-1">Nome do Projeto</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                    placeholder="Ex: Editorial Inovação Chão de Fábrica"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#C5A059] uppercase tracking-wider font-tech mb-1">Objetivos & Metas</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] resize-none outline-none"
                    placeholder="Ex: Registrar os avanços de manufatura da Mundi TKR em São Paulo com fotografia de altíssimo padrão..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Início</label>
                    <input
                      type="date"
                      required
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Previsão Conclusão</label>
                    <input
                      type="date"
                      required
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Prioridade</label>
                    <select
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Project["priority"])}
                    >
                      <option value="Alta">Alta</option>
                      <option value="Média">Média</option>
                      <option value="Baixa">Baixa</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Fase Inicial</label>
                    <select
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Project["status"])}
                    >
                      {pipelineStages.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Líder Técnico</label>
                    <input
                      type="text"
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPlanForm(false)}
                    className="px-4 py-2 bg-transparent border border-white/10 text-zinc-400 hover:text-white rounded-lg text-xs tracking-wider uppercase font-tech cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-900 rounded-lg text-xs font-semibold tracking-wider uppercase font-tech cursor-pointer"
                  >
                    Registrar Projeto
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main projects container based on selected view mode */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="xl:col-span-3">
          
          <AnimatePresence mode="wait">
            {viewMode === "kanban" ? (
              
              // STUNNING TRELLO-STYLE INTERACTIVE KANBAN BOARD
              <motion.div
                key="kanban-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x custom-scrollbar text-left h-[500px]"
              >
                {pipelineStages.map(stage => {
                  const stageProjects = projects.filter(p => p.status === stage);
                  
                  return (
                    <div
                      key={stage}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage)}
                      className="w-72 shrink-0 bg-zinc-950/40 border border-white/5 p-3.5 rounded-2xl flex flex-col snap-start hover:border-[#C5A059]/20 transition-all"
                    >
                      {/* Column Header */}
                      <div className="flex justify-between items-center mb-3 mb-4 select-none pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            stage === "Briefing" ? "bg-zinc-500" :
                            stage === "Planejamento" ? "bg-blue-500" :
                            stage === "Criação" ? "bg-amber-500" :
                            stage === "Design" ? "bg-purple-500" :
                            stage === "Revisão" ? "bg-orange-500" :
                            stage === "Aprovação" ? "bg-[#C5A059]" :
                            stage === "Programação" ? "bg-teal-500" :
                            "bg-emerald-500"
                          }`} />
                          <span className="text-xs font-bold tracking-wide uppercase font-tech text-white">{stage}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 font-mono">
                          {stageProjects.length}
                        </span>
                      </div>

                      {/* Column cards pool */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar min-h-[300px]">
                        {stageProjects.length === 0 ? (
                          <div className="h-full border border-dashed border-white/5 rounded-xl flex items-center justify-center p-6 text-center select-none">
                            <p className="text-[10px] text-zinc-600 font-light">Arraste um cartão ou mude o status para esta fase.</p>
                          </div>
                        ) : (
                          stageProjects.map(project => {
                            const isSelected = selectedProjectId === project.id;
                            
                            return (
                              <div
                                key={project.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, project.id)}
                                onClick={() => setSelectedProjectId(project.id)}
                                className={`p-4 bg-[#111111]/90 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
                                  isSelected 
                                    ? "border-[#C5A059] bg-zinc-900 shadow-[#C5A059]/5 shadow-md scale-[1.01]" 
                                    : "border-white/5 hover:border-[#C5A059]/30 hover:bg-zinc-900/60"
                                }`}
                              >
                                {/* Drag signal lines layout */}
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                  <span className={`text-[8px] font-tech font-bold uppercase px-1.5 py-0.5 rounded ${
                                    project.priority === "Alta" ? "bg-rose-500/10 text-rose-400 border border-rose-500/10" : 
                                    project.priority === "Média" ? "bg-amber-500/10 text-amber-500/70 border border-amber-500/10" : 
                                    "bg-[#C5A059]/10 text-[#E5D1B0] border border-[#C5A059]/10"
                                  }`}>
                                    {project.priority}
                                  </span>
                                  
                                  {/* Quick manual transition helper for mobile/accessible clicks */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      disabled={pipelineStages.indexOf(stage) === 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const prevStage = pipelineStages[pipelineStages.indexOf(stage) - 1];
                                        handleTransitionStatus(project.id, prevStage);
                                      }}
                                      className="p-1 text-zinc-600 hover:text-[#C5A059] hover:bg-zinc-900 rounded cursor-pointer disabled:opacity-20"
                                      title="Fase anterior"
                                    >
                                      <ArrowLeft className="w-3 h-3" />
                                    </button>
                                    <button
                                      disabled={pipelineStages.indexOf(stage) === pipelineStages.length - 1}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const nextStage = pipelineStages[pipelineStages.indexOf(stage) + 1];
                                        handleTransitionStatus(project.id, nextStage);
                                      }}
                                      className="p-1 text-zinc-600 hover:text-[#C5A059] hover:bg-zinc-900 rounded cursor-pointer disabled:opacity-20"
                                      title="Próxima fase"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                <h4 className="font-serif text-sm font-semibold text-zinc-100 group-hover:text-white leading-snug line-clamp-2">
                                  {project.name}
                                </h4>

                                <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                                  <span className="truncate max-w-[120px]">Lead: {project.owner}</span>
                                  <span>{project.progress}%</span>
                                </div>

                                <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden mt-1.5 border border-white/5">
                                  <div 
                                    className="bg-gradient-to-r from-[#C5A059] to-[#E5D1B0] h-full"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                                
                                {/* Micro tags summary */}
                                <div className="mt-2.5 flex items-center justify-between text-[8px] text-zinc-600 uppercase font-tech">
                                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {project.comments.length} obs</span>
                                  <span>Fim: {project.endDate}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

            ) : (
              
              // TRADITIONAL STANDARD LIST VIEW
              <motion.div
                key="list-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                {filteredProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-zinc-500 py-16 text-center border border-dashed border-white/5 rounded-2xl bg-zinc-900/10">
                    <FolderLock className="w-10 h-10 text-[#C5A059] opacity-40 mb-2" />
                    <p className="text-sm">Nenhum projeto ativo nesta fase da esteira.</p>
                  </div>
                ) : (
                  filteredProjects.map(project => {
                    const isSelected = selectedProjectId === project.id;
                    
                    return (
                      <div
                        key={project.id}
                        onClick={() => setSelectedProjectId(project.id)}
                        className={`luxury-card p-5 rounded-xl cursor-pointer transition-all border ${
                          isSelected ? "border-[#C5A059] bg-zinc-900/50" : "border-white/5 hover:border-white/15"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded tracking-wider ${
                                project.priority === "Alta" ? "bg-rose-500/10 text-rose-400 border border-rose-500/10" : 
                                project.priority === "Média" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" : 
                                "bg-[#C5A059]/10 text-[#E5D1B0] border border-[#C5A059]/10"
                              }`}>
                                Prioridade: {project.priority}
                              </span>
                              <span className="text-xs text-zinc-400 font-tech">• Lead: {project.owner}</span>
                            </div>
                            <h3 className="font-serif text-lg text-white group-hover:text-[#E5D1B0] tracking-tight">{project.name}</h3>
                            <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">{project.goal}</p>
                          </div>
                        </div>

                        {/* Micro pipeline progress bar indicator */}
                        <div className="mt-5 space-y-2">
                          <div className="flex justify-between text-[11px] font-tech text-zinc-400">
                            <span className="flex items-center gap-1">Estágio: <strong className="text-white">{project.status}</strong></span>
                            <span>Progresso: <strong>{project.progress}%</strong></span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              className="bg-gradient-to-r from-[#C5A059] to-[#E5D1B0] h-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${project.progress}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                        </div>

                        {/* Card footer metrics */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-tech">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {project.comments.length} Comentários</span>
                            <span>Início Oficial: {project.startDate}</span>
                          </div>
                          
                          {project.status !== "Publicação" && currentUser?.role === "agency" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = pipelineStages.indexOf(project.status);
                                if (currentIndex !== -1 && currentIndex < pipelineStages.length - 1) {
                                  handleTransitionStatus(project.id, pipelineStages[currentIndex + 1]);
                                }
                              }}
                              className="text-[#C5A059] hover:text-[#E5D1B0] uppercase font-semibold flex items-center gap-1 hover:underline cursor-pointer font-tech text-[9px] tracking-widest"
                            >
                              Próxima Fase <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Selected Project Drawer Detail Panel (xl:col-span-1) */}
        <div className="xl:col-span-1">
          {activeProjectDetails ? (
            <div className="bg-zinc-950 border border-[#C5A059]/15 p-5 rounded-2xl space-y-5 xl:sticky xl:top-4 text-left shadow-2xl relative">
              
              {/* Highlight background lines */}
              <div className="absolute top-0 right-0 p-3 flex items-center gap-1 text-[#C5A059]/40 font-tech text-[8px] select-none uppercase tracking-widest font-black">
                <Sliders className="w-3 h-3" /> Detalhes Módulo
              </div>

              <div className="border-b border-white/5 pb-3 pr-8">
                <h4 className="font-serif text-lg text-white tracking-tight">{activeProjectDetails.name}</h4>
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-[9px] text-zinc-500 font-tech uppercase tracking-widest block">Líder: {activeProjectDetails.owner}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded">
                      Fase: {activeProjectDetails.status}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded">
                      Progresso: {activeProjectDetails.progress}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-tech block mb-1 font-semibold">Atualização Operacional</span>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed bg-[#C5A059]/5 p-3.5 rounded-xl border border-white/5 italic">
                    "{activeProjectDetails.lastUpdate}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#111] p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-tech font-semibold">Data Início</span>
                    <strong className="text-zinc-200 mt-0.5 block font-mono">{activeProjectDetails.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 block uppercase font-tech font-semibold">Data Entrega</span>
                    <strong className="text-zinc-200 mt-0.5 block font-mono">{activeProjectDetails.endDate}</strong>
                  </div>
                </div>

                {/* Comments Workflow log */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-tech block font-semibold">Histórico de Discussão ({activeProjectDetails.comments.length})</span>
                  
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {activeProjectDetails.comments.length === 0 ? (
                      <div className="text-[10px] text-zinc-600 italic py-2">Nenhum comentário adicionado ao dossiê.</div>
                    ) : (
                      activeProjectDetails.comments.map(comm => (
                        <div key={comm.id} className="p-2.5 rounded bg-[#111] border border-white/5 space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-zinc-400">
                            <strong>{comm.author} ({comm.role})</strong>
                            <span className="font-mono">{comm.date}</span>
                          </div>
                          <p className="text-xs text-zinc-300 font-light leading-relaxed">{comm.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment input Form */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      className="flex-1 text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                      placeholder="Comentar ou solicitar ajuste..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddComment(activeProjectDetails.id);
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(activeProjectDetails.id)}
                      className="p-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Static supporting assets display */}
                {activeProjectDetails.assets && activeProjectDetails.assets.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-tech block font-semibold">Peças Digitais Ilustrativas</span>
                    <div className="grid grid-cols-2 gap-2">
                      {activeProjectDetails.assets.map((ast, i) => (
                        <img
                          key={i}
                          src={ast}
                          alt="Supporting Artwork piece"
                          className="w-full h-16 object-cover rounded-lg border border-white/10 hover:scale-105 transition-all cursor-zoom-in"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="hidden xl:flex flex-col items-center justify-center text-zinc-600 py-24 text-center border border-dashed border-white/5 rounded-2xl h-full bg-zinc-950/20 select-none">
              <Layers className="w-8 h-8 text-[#C5A059] opacity-40 mb-2 animate-pulse" />
              <p className="text-xs font-light">Selecione um projeto na Mesa Kanban para auditar comentários, arquivos e histórico.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
