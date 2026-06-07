import React, { useState } from "react";
import { Project, PendingItem, Meeting } from "../types";
import { 
  Briefcase, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  FileCheck2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Layers
} from "lucide-react";
import { motion } from "motion/react";

interface DashboardTabProps {
  projects: Project[];
  meetings: Meeting[];
  pendings: PendingItem[];
  publicationsCount: number;
}

export default function DashboardTab({ projects, meetings, pendings, publicationsCount }: DashboardTabProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Terça");

  // Statistics derived dynamically
  const plannedCount = projects.filter(p => p.status === "Briefing" || p.status === "Planejamento").length;
  const inProgressCount = projects.filter(p => !["Briefing", "Planejamento", "Aprovação", "Publicação"].includes(p.status)).length;
  const awaitingApprovalCount = projects.filter(p => p.status === "Aprovação").length;
  const publishedCount = publicationsCount;
  const pendingMundiCount = pendings.length;

  const quickKPIs = [
    { label: "Planejados", value: plannedCount, subtitle: "Em fase de concepção", icon: Briefcase, color: "text-[#C5A059]" },
    { label: "Em Andamento", value: inProgressCount, subtitle: "Foco de produção ativa", icon: Clock, color: "text-blue-400" },
    { label: "Aguardando Aprovação", value: awaitingApprovalCount, subtitle: "Pendente Mundi TKR", icon: HelpCircle, color: "text-amber-400" },
    { label: "Prontos para Publicação", value: projects.filter(p => p.progress >= 90 && p.status !== "Publicação").length, subtitle: "Fase operacional final", icon: FileCheck2, color: "text-emerald-400" },
    { label: "Publicados", value: publishedCount, subtitle: "Histórico consolidado", icon: CheckCircle2, color: "text-zinc-500" },
    { label: "Pendências de Cliente", value: pendingMundiCount, subtitle: "Demandas TKR", icon: Layers, color: "text-rose-400" },
  ];

  // Calendar events based on meetings & delivery dates
  const daysOfWeek = [
    { name: "Segunda", date: "08 Jun" },
    { name: "Terça", date: "09 Jun" },
    { name: "Quarta", date: "10 Jun" },
    { name: "Quinta", date: "11 Jun" },
    { name: "Sexta", date: "12 Jun" },
  ];

  const calendarEventsMap: Record<string, { time: string; title: string; category: string; host: string }[]> = {
    "Segunda": [
      { time: "09:00", title: "Brainstorming Criativo - Novos Tecidos", category: "Concepção", host: "Carol (CA.RO)" }
    ],
    "Terça": [
      { time: "10:30", title: "Sprint Semanal de Desenvolvimento de Produto", category: "Técnico / Alinhamento", host: "Julio M. (CA.RO)" },
      { time: "15:00", title: "Apresentação Renders 3D Chassi TKR", category: "Aprovação", host: "Lucas H. (CA.RO)" }
    ],
    "Quarta": [
      { time: "14:00", title: "Análise de Resultados de Mídia de Munique", category: "Performance", host: "Marketing TKR" }
    ],
    "Quinta": [
      { time: "10:30", title: "Alinhamento de Marketing & Campanha Racing", category: "Comercial", host: "Carol (CA.RO)" }
    ],
    "Sexta": [
      { time: "11:00", title: "Fechamento de Pautas Operacionais e Pendências", category: "Planejamento", host: "Julio M. (CA.RO)" },
      { time: "16:00", title: "Review Geral de Transparência Semanal", category: "Gestão", host: "Conselho Diretor" }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Brand & Partnership Header Card with subtle grid background */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="luxury-card p-8 md:p-10 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden w-full"
      >
        <div className="absolute inset-0 geo-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-xs text-[#E5D1B0] tracking-wider uppercase font-tech">
            <MapPin className="w-3.5 h-3.5" /> Estúdio Alphaville & Conectividade Europeia
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#F8F9FA] tracking-tight leading-tight">
            Transparência Ativa <span className="italic text-[#E5D1B0]">CA.RO TECH</span> + MUNDI TKR
          </h1>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light">
            Da essência do chão de fábrica aos principais hubs de tendências e inovação, nosso compromisso 
            é atuar como uma extensão técnica e criativa de altíssimo nível, documentando cada avanço tático.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col items-start md:items-end justify-center bg-zinc-900/40 p-4 border border-white/5 rounded-xl backdrop-blur-sm shrink-0">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech">Status do Portal</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-400 font-tech">CONECTADO EM TEMPO REAL</span>
          </div>
          <div className="text-xs text-zinc-400 mt-2">Última auditoria: Hoje às 14:37</div>
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
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-tech">{kpi.label}</span>
                  <div className="font-serif text-3xl font-medium text-white group-hover:text-[#E5D1B0] transition-colors">
                    {kpi.value.toString().padStart(2, "0")}
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-zinc-900/80 border border-white/5 ${kpi.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>
              <div className="text-[11px] text-zinc-500 mt-3 flex items-center gap-1">
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
          transition={{ delay: 0.3, duration: 0.5 }}
          className="luxury-card p-6 rounded-2xl xl:col-span-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <h3 className="font-serif text-lg text-white">Calendário da Semana</h3>
              </div>
              <span className="text-xs text-[#C5A059] font-tech tracking-wider uppercase">Fuso Horário: São Paulo</span>
            </div>

            {/* Days Selector */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {daysOfWeek.map((day) => {
                const isSelected = selectedDay === day.name;
                const hasEvents = (calendarEventsMap[day.name] || []).length > 0;
                return (
                  <button
                    key={day.name}
                    onClick={() => setSelectedDay(day.name)}
                    className={`p-3 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-[#C5A059] text-zinc-950 font-medium scale-105" 
                        : "bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800/80 hover:border-white/10"
                    } border border-white/5`}
                  >
                    <span className="text-xs font-semibold uppercase font-tech tracking-wide">{day.name.slice(0, 3)}</span>
                    <span className={`text-[10px] mt-1 ${isSelected ? "text-zinc-900" : "text-zinc-400"}`}>{day.date}</span>
                    {hasEvents && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-[#C5A059] mt-1.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Day Events */}
            <div className="space-y-3 min-h-[160px] flex flex-col justify-start">
              {calendarEventsMap[selectedDay] && calendarEventsMap[selectedDay].length > 0 ? (
                calendarEventsMap[selectedDay].map((ev, i) => (
                  <div 
                    key={i} 
                    className="flex text-zinc-100 bg-zinc-900/40 p-3 rounded-xl border border-white/5 items-center justify-between gap-4 transition-all hover:bg-zinc-900/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-tech text-xs text-[#E5D1B0] bg-[#C5A059]/10 border border-[#C5A059]/20 px-2.5 py-1 rounded">
                        {ev.time}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium tracking-tight text-white">{ev.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-zinc-400 capitalize bg-neutral-800 px-1.5 py-0.5 rounded">{ev.category}</span>
                          <span className="text-[11px] text-zinc-500">Apresentador: • {ev.host}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-xs py-8">
                  Nenhum compromisso estratégico agendado para esta data.
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-zinc-400">
            <span>Possui necessidades fora da agenda?</span>
            <button className="text-[#C5A059] inline-flex items-center gap-1.5 hover:underline">
              Solicitar Extraordinária <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>

        {/* Mini Pendencies & Objectives Tracker - xl:col-span-5 */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="luxury-card p-6 rounded-2xl xl:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h3 className="font-serif text-lg text-white">Atividades Recentes</h3>
              </div>
              <span className="text-[10px] font-tech text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-semibold">Live Feed</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 relative before:content-[''] before:absolute before:left-2 before:top-6 before:bottom-0 before:w-[1px] before:bg-zinc-800 pb-3">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-tech">HOJE • 11:32</div>
                  <h4 className="text-xs font-semibold text-white mt-1">Sincronização de Ensaio 3D concluída</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-light">Novo render de titânio submetido para validação na aba Aprovações.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative before:content-[''] before:absolute before:left-2 before:top-6 before:bottom-0 before:w-[1px] before:bg-zinc-800 pb-3">
                <div className="w-4.5 h-4.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-tech">06 JUN • 15:12</div>
                  <h4 className="text-xs font-semibold text-white mt-1">Ata da Reunião de Costuras postada</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-light">Lucas disponibilizou os planos de iluminação definidos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4.5 h-4.5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-tech">05 JUN • 09:20</div>
                  <h4 className="text-xs font-semibold text-white mt-1">Projeto editorial em Alphaville aprovado</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-light">O conselho aprovou o comitê estético local.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 border border-white/5 rounded-xl mt-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase text-zinc-400 tracking-wider font-tech">Próxima Entrega Crítica</div>
              <div className="text-sm font-serif text-white tracking-tight mt-0.5 truncate">Aprovação do Storyboard do Teaser</div>
            </div>
            <div className="text-[11px] text-zinc-300 font-tech bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded shrink-0">
              Prazo: 09 Jun
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
