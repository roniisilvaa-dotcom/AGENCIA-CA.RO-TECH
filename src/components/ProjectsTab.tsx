import React, { useState } from "react";
import { Project, Comment } from "../types";
import { 
  Plus, 
  User, 
  Calendar, 
  Tag, 
  MessageSquare, 
  TrendingUp, 
  ArrowRight, 
  FolderLock,
  ChevronDown,
  ChevronsUpDown,
  Upload,
  Layers,
  Send,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectsTabProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
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

export default function ProjectsTab({ projects, onAddProject, onUpdateProject }: ProjectsTabProps) {
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("all");
  const [showPlanForm, setShowPlanForm] = useState<boolean>(false);
  
  // New project creation state
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newOwner, setNewOwner] = useState("Carol (CA.RO TECH)");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newPriority, setNewPriority] = useState<Project["priority"]>("Média");
  const [newStatus, setNewStatus] = useState<Project["status"]>("Briefing");

  // Selected project drawer details
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Comment input
  const [commentText, setCommentText] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newGoal || !newStart || !newEnd) return;

    const newProg = newStatus === "Briefing" ? 10 : newStatus === "Planejamento" ? 25 : newStatus === "Criação" ? 40 : newStatus === "Design" ? 60 : newStatus === "Revisão" ? 75 : newStatus === "Aprovação" ? 90 : 95;

    const nProj: Project = {
      id: "proj-" + Date.now(),
      name: newName,
      goal: newGoal,
      owner: newOwner,
      startDate: newStart,
      endDate: newEnd,
      priority: newPriority,
      status: newStatus,
      progress: newProg,
      lastUpdate: "Fluxo de projeto criado estritamente via portal de transparência.",
      comments: [],
      assets: []
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
  };

  const handleAddComment = (projectId: string) => {
    if (!commentText.trim()) return;

    const target = projects.find(p => p.id === projectId);
    if (!target) return;

    const newComment: Comment = {
      id: "comm-" + Date.now(),
      author: "Mundi TKR Diretoria",
      role: "Cliente",
      text: commentText,
      date: new Date().toISOString().split("T")[0]
    };

    const updated: Project = {
      ...target,
      comments: [...target.comments, newComment],
      lastUpdate: `Comentário novo registrado pelo cliente Mundi TKR: "${commentText.slice(0, 30)}..."`
    };

    onUpdateProject(updated);
    setCommentText("");
  };

  const handleAdvanceStatus = (proj: Project) => {
    const currentIndex = pipelineStages.indexOf(proj.status);
    if (currentIndex === -1 || currentIndex === pipelineStages.length - 1) return;

    const nextStatus = pipelineStages[currentIndex + 1];
    let nextProgress = Math.min(100, proj.progress + 12);
    if (nextStatus === "Publicação") nextProgress = 100;
    if (nextStatus === "Aprovação") nextProgress = 90;

    const updated: Project = {
      ...proj,
      status: nextStatus,
      progress: nextProgress,
      lastUpdate: `Status avançado automaticamente de ${proj.status} para ${nextStatus}.`
    };

    onUpdateProject(updated);
  };

  const filteredProjects = activeProjectFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === activeProjectFilter);

  const activeProjectDetails = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      
      {/* Upper Options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white tracking-tight">Projetos & Execução</h2>
          <p className="text-xs text-zinc-400">Acompanhamento completo de fluxos, prioridades e pipelines remotos.</p>
        </div>

        <button
          onClick={() => setShowPlanForm(!showPlanForm)}
          className="px-4 py-2 bg-zinc-900 border border-[#C5A059]/30 hover:border-[#C5A059]/60 text-[#E5D1B0] rounded-xl text-xs font-semibold uppercase tracking-wider font-tech flex items-center gap-2 transition-all cursor-pointer self-stretch md:self-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Planejar Novo Projeto
        </button>
      </div>

      {/* Filter Tabs for Pipeline Stage */}
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

      {/* Project Form or Stream Layout */}
      <AnimatePresence mode="wait">
        {showPlanForm ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="luxury-card p-6 rounded-2xl relative"
          >
            <button 
              onClick={() => setShowPlanForm(false)} 
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-5">
              <Layers className="w-4.5 h-4.5 text-[#C5A059]" />
              <h3 className="font-serif text-lg text-white">Novo Projeto de Gestão Remota</h3>
            </div>

            <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#C5A059] uppercase tracking-wider font-tech mb-1">Nome do Projeto</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
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
                    className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] resize-none"
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
                      className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                      value={newStart}
                      onChange={(e) => setNewStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Previsão Conclusão</label>
                    <input
                      type="date"
                      required
                      className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                      value={newEnd}
                      onChange={(e) => setNewEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Prioridade</label>
                    <select
                      className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
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
                      className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
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
                      className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Project List Column - lg:col-span-2 */}
            <div className="lg:col-span-2 space-y-4">
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

                      {/* Micro pipeline visualization */}
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

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-tech">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {project.comments.length}</span>
                          <span>Início: {project.startDate}</span>
                        </div>
                        
                        {project.status !== "Publicação" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(project);
                            }}
                            className="text-[#C5A059] hover:text-[#E5D1B0] uppercase font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            Avançar Fase <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Project Details Panel - lg:col-span-1 */}
            <div className="lg:col-span-1">
              {activeProjectDetails ? (
                <div className="luxury-card p-5 rounded-2xl space-y-5 lg:sticky lg:top-4 border border-[#C5A059]/15">
                  <div className="border-b border-white/5 pb-3">
                    <h4 className="font-serif text-lg text-white tracking-tight">{activeProjectDetails.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-tech uppercase tracking-widest mt-1 block">Lead Técnico: {activeProjectDetails.owner}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech block mb-1">Última Atualização Operacional</span>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed bg-[#C5A059]/5 p-3.5 rounded-xl border border-white/5 italic">
                        "{activeProjectDetails.lastUpdate}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-950 p-3 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-tech">Início</span>
                        <strong className="text-zinc-200 mt-0.5 block">{activeProjectDetails.startDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-tech">Previsão</span>
                        <strong className="text-zinc-200 mt-0.5 block">{activeProjectDetails.endDate}</strong>
                      </div>
                    </div>

                    {/* Comments log */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech block">Histórico de Comentários ({activeProjectDetails.comments.length})</span>
                      
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {activeProjectDetails.comments.length === 0 ? (
                          <div className="text-[11px] text-zinc-500 italic py-2">Nenhum comentário registrado para este projeto.</div>
                        ) : (
                          activeProjectDetails.comments.map(comm => (
                            <div key={comm.id} className="p-2.5 rounded bg-zinc-900 border border-white/5 space-y-1">
                              <div className="flex justify-between items-center text-[10px] text-zinc-400">
                                <strong>{comm.author} ({comm.role})</strong>
                                <span>{comm.date}</span>
                              </div>
                              <p className="text-xs text-zinc-300 font-light leading-relaxed">{comm.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Form */}
                      <div className="flex gap-2 pt-2">
                        <input
                          type="text"
                          className="flex-1 text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                          placeholder="Adicione observações ou ajustes..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(activeProjectDetails.id);
                          }}
                        />
                        <button
                          onClick={() => handleAddComment(activeProjectDetails.id)}
                          className="p-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-900 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Assets Render if any */}
                    {activeProjectDetails.assets && activeProjectDetails.assets.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech block">Materiais e Fotos de Apoio</span>
                        <div className="grid grid-cols-2 gap-2">
                          {activeProjectDetails.assets.map((ast, i) => (
                            <img
                              key={i}
                              src={ast}
                              alt="Asset"
                              className="w-full h-16 object-cover rounded-lg border border-white/5 hover:scale-105 transition-all"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex flex-col items-center justify-center text-zinc-500 py-24 text-center border border-dashed border-white/5 rounded-2xl h-full">
                  <Layers className="w-8 h-8 text-[#C5A059] opacity-40 mb-2 animate-pulse" />
                  <p className="text-xs">Selecione um projeto para auditar comentários, arquivos e histórico.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
