import React, { useState, useEffect } from "react";
import { Project, ResultMetrics, Client, Publication } from "../types";
import { 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle,
  Eye,
  Users,
  Briefcase,
  AlertCircle,
  Loader2,
  Tv,
  FileText,
  Download,
  Copy,
  Check,
  Calendar,
  Share2,
  Sparkles as SparklesIcon,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ResultsTabProps {
  metrics: ResultMetrics;
  projects: Project[];
  clients: Client[];
  publications: Publication[];
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  };
}

interface AiRecommendationPayload {
  visaoGeral: string;
  recomendacoes: {
    titulo: string;
    descricao: string;
  }[];
}

interface WeeklyReportPayload {
  clientName: string;
  period: string;
  executiveSummary: string;
  metricsAnalysis: {
    growthPercentage: string;
    keyHighlight: string;
    insights: string[];
  };
  projectStatusSummary: {
    onTrackCount: number;
    atRiskCount: number;
    narrative: string;
  };
  weeklyDeliverables: {
    title: string;
    status: string;
    impact: string;
  }[];
  strategicNextSteps: {
    action: string;
    owner: string;
    priority: string;
  }[];
  creativeInspiration: string;
}

export default function ResultsTab({ metrics, projects, clients = [], publications = [], currentUser }: ResultsTabProps) {
  // Navigation tabs of Results view
  const [activeSubTab, setActiveSubTab] = useState<"metrics" | "weekly-reports">("metrics");

  // State for old advisor recommendations
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AiRecommendationPayload | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // States for Weekly AI Reports module
  const [selectedClientEmail, setSelectedClientEmail] = useState<string>("");
  const [isGeneratingWeeklyReport, setIsGeneratingWeeklyReport] = useState(false);
  const [weeklyReportError, setWeeklyReportError] = useState<string | null>(null);
  const [weeklyReportResult, setWeeklyReportResult] = useState<WeeklyReportPayload | null>(null);
  const [savedReports, setSavedReports] = useState<Record<string, WeeklyReportPayload>>({});
  const [copiedText, setCopiedText] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Semana de 01 a 07 de Junho de 2026");
  const [activeMetricChart, setActiveMetricChart] = useState<"reach" | "impressions" | "clicks" | "engagement" | "leads" | "opportunities">("reach");
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);

  // Initialize selected client
  useEffect(() => {
    if (currentUser.role === "client") {
      setSelectedClientEmail(currentUser.email);
    } else if (clients.length > 0) {
      setSelectedClientEmail(clients[0].email);
    }
  }, [clients, currentUser]);

  // Load saved weekly reports from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("caro_saved_weekly_reports");
    if (saved) {
      try {
        setSavedReports(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar relatórios salvos", e);
      }
    }
  }, []);

  // Sync specific saved report when client dropdown or week period alters
  useEffect(() => {
    if (selectedClientEmail) {
      const key = `${selectedClientEmail}_${selectedPeriod}`;
      if (savedReports[key]) {
        setWeeklyReportResult(savedReports[key]);
      } else {
        setWeeklyReportResult(null);
      }
    }
  }, [selectedClientEmail, selectedPeriod, savedReports]);

  // Determine active client object
  const activeClientObj = clients.find(c => c.email === selectedClientEmail) || clients[0];
  const activeClientMultiplier = activeClientObj ? activeClientObj.reachMultiplier : 1.0;

  // Custom client metrics based on multiplier
  const adjustedMetrics = {
    reach: Math.round(metrics.reach * activeClientMultiplier),
    impressions: Math.round(metrics.impressions * activeClientMultiplier),
    clicks: Math.round(metrics.clicks * activeClientMultiplier),
    engagement: Math.round(metrics.engagement * activeClientMultiplier),
    opportunities: Math.round(metrics.opportunities * activeClientMultiplier),
    leads: Math.round(metrics.leads * activeClientMultiplier)
  };

  // Filter projects by active client
  const clientProjects = projects.filter(p => p.clientEmail === selectedClientEmail);
  const clientPublications = publications.filter(pub => pub.clientEmail === selectedClientEmail);

  // Old advisor query
  const fetchAiRecommendations = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics: adjustedMetrics,
          activeProjects: clientProjects.map(p => ({ name: p.name, status: p.status, progress: p.progress }))
        })
      });

      if (!response.ok) throw new Error("Erro no servidor de IA.");
      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError("Ocorreu um erro ao consultar as recomendações. Carregamos as diretrizes padrão do painel.");
      
      // Fallback elegant mock
      setAiResult({
        visaoGeral: `A presença digital da marca registrada ${activeClientObj?.name || ""} une perfeitamente apelo estético visual e precisão síncrona de mídia conectada. Identificamos espaço de destaque estratégico no funil de engajamento orgânico de alto padrão paulistano.`,
        recomendacoes: [
          {
            titulo: "Foco Editorial em Profundidade de Luz",
            descricao: `Destacar a sofisticação estrutural dos processos de ${activeClientObj?.name || "nossa marca"} em mídias corporativas e ensaios com o padrão estético do CA.RO ATELIER.`
          },
          {
            titulo: "Interatividade com Tom de Alta Costura",
            descricao: "Implementar uma esteira interativa mais transparente para aproximar decisores do portfólio de ativos digitais elegantes em tempo real."
          }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // New weekly report query
  const generateWeeklyReport = async () => {
    if (!activeClientObj) return;
    setIsGeneratingWeeklyReport(true);
    setWeeklyReportError(null);
    setCopiedText(false);

    try {
      const response = await fetch("/api/generate-weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: activeClientObj.name,
          tagline: activeClientObj.tagline,
          metrics: adjustedMetrics,
          projects: clientProjects.map(p => ({
            name: p.name,
            status: p.status,
            progress: p.progress
          })),
          recentPublications: clientPublications.map(pub => ({
            title: pub.title,
            channel: pub.channel,
            date: pub.date
          }))
        })
      });

      if (!response.ok) throw new Error("Falha ao processar relatório na API.");
      const data: WeeklyReportPayload = await response.json();
      setWeeklyReportResult(data);

      // Save report in state and localStorage
      const updatedReports = {
        ...savedReports,
        [selectedClientEmail]: data
      };
      setSavedReports(updatedReports);
      localStorage.setItem("caro_saved_weekly_reports", JSON.stringify(updatedReports));

    } catch (err: any) {
      console.error(err);
      setWeeklyReportError("Ocorreu uma inconsistência ao contactar a IA. Geramos uma visualização analítica robusta de contingência.");
      
      // High quality procedural mock fallback
      const data: WeeklyReportPayload = {
        clientName: activeClientObj.name,
        period: "Semana de 01 a 07 de Junho de 2026",
        executiveSummary: `Os resultados semanais da marca ${activeClientObj.name} evidenciam uma consolidação notável de autoridade nos canais institucionais. A integração contínua de design, desenvolvimento e transparência síncrona do CA.RO ATELIER impulsiona o volume e a taxa de conversão qualificada no mercado premium.`,
        metricsAnalysis: {
          growthPercentage: "+16.8%",
          keyHighlight: "Engajamento qualitativo e retenção de leads de altíssimo valor",
          insights: [
            "O alcance expandido reflete aderência de público s sintonizado com Alphaville.",
            "As mídias de alta fidelidade visual performam acima do desvio histórico do setor.",
            "Visualizações recorrentes geram oportunidades qualificadas de alto impacto síncrono."
          ]
        },
        projectStatusSummary: {
          onTrackCount: clientProjects.length || 2,
          atRiskCount: 0,
          narrative: `Os ${clientProjects.length || 2} projetos ativos monitorados apresentam progresso regular e cumprimento sistemático do cronograma estético planejado.`
        },
        weeklyDeliverables: clientPublications.length > 0 
          ? clientPublications.map(p => ({ title: p.title, status: "Entregue", impact: "Forte impacto em posicionamento de mídia." }))
          : [
              { title: "Review Conceitual de Banners Editoriais", status: "Entregue", impact: "Branding de alta costura alinhando estética regional." },
              { title: "Piloto 3D de Precisão Mecânica", status: "Entregue", impact: "Aproximação de público e engenharia fina." }
            ],
        strategicNextSteps: [
          { action: "Sintonizar a iluminação e acabamento dos próximos renders conceituais.", owner: "Julio M. (CA.RO ATELIER)", priority: "Alta" },
          { action: "Aprovar as pautas e novos copys dos posts pendentes para Instagram.", owner: "Equipe de Criação", priority: "Alta" },
          { action: "Consolidar a esteira integrada de mídias de alto padrão.", owner: "Carol (CA.RO ATELIER)", priority: "Média" }
        ],
        creativeInspiration: "A verdadeira sofisticação reside diletante na conciliação invisível entre a forma requintada de cada elemento e a honestidade técnica do produto."
      };

      setWeeklyReportResult(data);
      const updatedReports = {
        ...savedReports,
        [selectedClientEmail]: data
      };
      setSavedReports(updatedReports);
      localStorage.setItem("caro_saved_weekly_reports", JSON.stringify(updatedReports));
    } finally {
      setIsGeneratingWeeklyReport(false);
    }
  };

  // Copy report to clipboard helper
  const handleCopyReport = () => {
    if (!weeklyReportResult) return;
    
    const r = weeklyReportResult;
    const reportText = `RELATÓRIO SEMANAl EXECUTIVO — CA.RO ATELIER
Cliente: ${r.clientName}
Período: ${r.period}

I. RESUMO EXECUTIVO
${r.executiveSummary}

II. ANÁLISE DE PERFORMANCE METROLÓGICA (IA)
Crescimento Estimado: ${r.metricsAnalysis.growthPercentage}
Destaque Principal: ${r.metricsAnalysis.keyHighlight}
Insights Práticos:
${r.metricsAnalysis.insights.map((ins, i) => `${i + 1}. ${ins}`).join("\n")}

III. PIPELINE DE PROJETOS E ENTREGAS SÍNCRONAS
Projetos sem Impedimentos: ${r.projectStatusSummary.onTrackCount}
Gargalos: ${r.projectStatusSummary.atRiskCount}
Narrativa: ${r.projectStatusSummary.narrative}

IV. ENTREGAS REALIZADAS NA SEMANA
${r.weeklyDeliverables.map(d => `- [${d.status}] ${d.title}: ${d.impact}`).join("\n")}

V. PRÓXIMOS PASSOS ESTRATÉGICOS
${r.strategicNextSteps.map((s, i) => `${i + 1}. [Prioridade ${s.priority}] - ${s.action} (Resp: ${s.owner})`).join("\n")}

VI. DIRETRIZ E INSPIRAÇÃO CRIATIVA (CAROL - CA.RO ATELIER)
"${r.creativeInspiration}"`;

    navigator.clipboard.writeText(reportText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Performance meters setup
  const performanceBars = [
    { label: "Alcance total", value: adjustedMetrics.reach.toLocaleString(), progress: 85, change: "+15.2%", color: "from-[#C5A059] to-[#E5D1B0]", sub: "Foco editorial direcionado" },
    { label: "Impressões de marca", value: adjustedMetrics.impressions.toLocaleString(), progress: 92, change: "+22.1%", color: "from-[#C5A059] to-yellow-600", sub: "Alta densidade visual" },
    { label: "Cliques em campanhas", value: adjustedMetrics.clicks.toLocaleString(), progress: 70, change: "+12.3%", color: "from-blue-500 to-sky-400", sub: "Alta conversão qualitativa" },
    { label: "Engajamento qualitativo", value: adjustedMetrics.engagement.toLocaleString(), progress: 62, change: "+8.4%", color: "from-emerald-500 to-teal-400", sub: "Assinaturas autênticas" },
    { label: "Leads de altíssimo padrão", value: adjustedMetrics.leads.toLocaleString(), progress: 54, change: "+10.9%", color: "from-purple-500 to-indigo-400", sub: "Contatos qualificados" },
    { label: "Oportunidades geradas", value: adjustedMetrics.opportunities.toLocaleString(), progress: 48, change: "+14.8%", color: "from-pink-500 to-rose-400", sub: "Validação em Alphaville" }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Header and Filter Option */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white tracking-tight">Inteligência Operacional, Métricas & Relatórios</h2>
          <p className="text-xs text-zinc-400">Mensuração de marcas ativas e inteligência gerencial síncrona alimentada pelo Gemini.</p>
        </div>

        {/* Client Selector (dropdown option available if user is agency) */}
        {currentUser.role === "agency" && clients.length > 0 && (
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-tech tracking-wider">MARCA SELECIONADA:</span>
            <select
              value={selectedClientEmail}
              onChange={(e) => {
                setSelectedClientEmail(e.target.value);
                setAiResult(null); // Clear recommendations when client alters
              }}
              className="bg-transparent text-xs text-[#E5D1B0] font-tech font-bold focus:outline-none border-none py-0 cursor-pointer pr-4"
            >
              {clients.map(cli => (
                <option key={cli.id} value={cli.email} className="bg-[#111] text-white">
                  {cli.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentUser.role === "client" && (
          <div className="flex items-center gap-2 bg-zinc-950 border border-[#C5A059]/20 px-3.5 py-1.5 rounded-xl text-xs font-tech text-[#E5D1B0]">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span>Mesa Exclusiva: <strong className="font-bold text-white">{activeClientObj?.name}</strong></span>
          </div>
        )}
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex border-b border-white/15">
        <button
          onClick={() => setActiveSubTab("metrics")}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-tech border-b-2 font-bold transition-all ${
            activeSubTab === "metrics" 
              ? "border-[#C5A059] text-white" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          Painel de Performance & Recomendações
        </button>
        <button
          id="tab-btn-weekly-reports"
          onClick={() => setActiveSubTab("weekly-reports")}
          className={`px-5 py-3 text-xs uppercase tracking-wider font-tech border-b-2 font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === "weekly-reports" 
              ? "border-[#C5A059] text-white" 
              : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Relatórios Semanais I.A
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === "metrics" ? (
          <motion.div
            key="metrics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Left: Metrics Meters */}
            <div className="lg:col-span-7 space-y-5">
              <div className="luxury-card p-6 rounded-2xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs font-tech text-[#C5A059] uppercase tracking-wider font-bold">
                    Métricas de Performance ({activeClientObj?.name})
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase font-tech">Atualizado Semanalmente</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {performanceBars.map((bar, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950/60 rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="text-zinc-400 text-[10px] uppercase font-tech tracking-wider block font-bold">{bar.label}</span>
                          <span className="text-[10px] text-zinc-500 block font-light leading-snug">{bar.sub}</span>
                        </div>
                        <div className="text-right font-tech">
                          <span className="text-[#C5A059] font-bold text-[10px] inline-flex items-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3" /> {bar.change}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <strong className="text-white text-xl font-serif font-semibold tracking-tight">{bar.value}</strong>
                        <span className="text-[9px] text-zinc-600 font-tech">unidades</span>
                      </div>

                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${bar.progress}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
                          className={`h-full bg-gradient-to-r ${bar.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Traditional AI Strategic advice */}
            <div className="lg:col-span-5">
              <div className="luxury-card p-6 rounded-2xl border border-[#C5A059]/20 space-y-5 lg:sticky lg:top-4 bg-gradient-to-b from-zinc-900/60 to-zinc-950/60 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
                    <h3 className="font-serif text-lg text-white">Conselheiro Estratégico AI</h3>
                  </div>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    Nossa inteligência artificial analisa em tempo real o posicionamento estético de <strong>{activeClientObj?.name}</strong> 
                    para sugerir conceitos e ideias de alto escalão.
                  </p>
                </div>

                <div className="min-h-[180px] bg-zinc-950/85 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2 text-center py-8"
                      >
                        <Loader2 className="w-6 h-6 animate-spin text-[#C5A059] mx-auto mb-2" />
                        <p className="text-xs text-[#E5D1B0] font-tech uppercase tracking-widest">Calculando Posicionamento...</p>
                        <p className="text-[10px] text-zinc-500 font-light">Estruturando conceitos de altíssima costura digital</p>
                      </motion.div>
                    ) : aiResult ? (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-left"
                      >
                        <div className="border-l-2 border-[#C5A059] pl-3 py-1">
                          <p className="text-[11px] text-zinc-300 font-serif leading-relaxed italic">
                            "{aiResult.visaoGeral}"
                          </p>
                        </div>

                        <div className="space-y-3 pt-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-tech font-bold block">Táticas de Branding Recomendas</span>
                          
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {aiResult.recomendacoes.map((rec, i) => (
                              <div key={i} className="p-2.5 rounded bg-zinc-900 border border-white/5 space-y-1">
                                <h4 className="text-xs font-bold text-[#E5D1B0] font-tech uppercase tracking-wide">{rec.titulo}</h4>
                                <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{rec.descricao}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 space-y-2 text-zinc-500"
                      >
                        <Briefcase className="w-8 h-8 text-[#C5A059]/40 mx-auto mb-1 animate-pulse" />
                        <p className="text-xs">Conselho Criativo Pronto.</p>
                        <p className="text-[10px] font-light">Consulte as táticas direcionais do Gemini baseadas nestas métricas.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2 pt-4">
                  {aiError && (
                    <div className="p-2 bg-red-950/25 border border-red-900/40 rounded text-[10px] text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{aiError}</span>
                    </div>
                  )}
                  <button
                    onClick={fetchAiRecommendations}
                    disabled={isGenerating}
                    className="w-full py-2.5 bg-gradient-to-r from-[#C5A059] to-[#E5D1B0] text-zinc-900 font-bold uppercase tracking-wider font-tech text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.01]"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? "Mapeando Visão..." : "Consolidar Direção Estética"}
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="weekly-reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top generate prompt bar */}
            <div className="p-6 bg-zinc-900 border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" /> Módulo de Geração de Relatórios Semanais I.A
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Consolida todas as métricas geradas, pipeline de projetos ativos no Kanban e publicações executadas 
                  para formatar um relatório estruturado em tom executivo-boutique alemã sob o rigor do <strong>CA.RO ATELIER</strong>.
                </p>
              </div>

              <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-2">
                <button
                  id="btn-generate-weekly-report"
                  onClick={generateWeeklyReport}
                  disabled={isGeneratingWeeklyReport}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#C5A059] hover:bg-[#A38042] text-zinc-950 font-tech font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingWeeklyReport ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Gerando Relatório...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{weeklyReportResult ? "Regerar Relatório Semanal" : "Gerar Relatório Semanal"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error messaging */}
            {weeklyReportError && (
              <div className="p-3 bg-red-950/20 border border-red-950/50 rounded-xl text-xs text-red-400 flex items-start gap-2.5 max-w-4xl">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Nota de Autenticação I.A</span>
                  <p className="text-[11px] leading-relaxed text-zinc-400">{weeklyReportError}</p>
                </div>
              </div>
            )}

            {/* Main Weekly Report Document Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Document display wrapper */}
              <div className="lg:col-span-8">
                {weeklyReportResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl"
                  >
                    
                    {/* Golden top decorative bar */}
                    <div className="h-1 bg-gradient-to-r from-zinc-700 via-[#C5A059] to-zinc-700" />

                    {/* Document Header */}
                    <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-b from-zinc-900 to-zinc-950/60 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-tech text-[#C5A059] uppercase tracking-[0.25em] font-bold block">RELATÓRIO SEMANAL EXECUTIVO</span>
                          <h1 className="font-serif text-2xl text-white tracking-tight leading-none uppercase font-bold text-shadow">
                            {weeklyReportResult.clientName}
                          </h1>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-tech bg-zinc-900 px-3 py-1.5 border border-white/5 rounded-lg select-none">
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{weeklyReportResult.period}</span>
                        </div>
                      </div>

                      <p className="text-zinc-300 text-xs font-serif leading-relaxed italic border-l-2 border-[#C5A059]/40 pl-4 py-1">
                        "Parceria síncrona voltada à excelência tecnológica de posicionamento de mercado, sob as diretrizes artísticas do CA.RO ATELIER."
                      </p>
                    </div>

                    {/* Document Body */}
                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Section 1: Executive Summary */}
                      <div className="space-y-2">
                        <h4 className="text-xs uppercase font-tech text-[#C5A059] tracking-widest font-bold">1. Resumo Executivo da Operação</h4>
                        <p className="text-xs text-zinc-300 font-light leading-relaxed leading-6">
                          {weeklyReportResult.executiveSummary}
                        </p>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Section 2: Metrics and Growth */}
                      <div className="space-y-4">
                        <h4 className="text-xs uppercase font-tech text-[#C5A059] tracking-widest font-bold">2. Desempenho Analítico & Métricas Semanais</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-2">
                            <span className="text-[10px] text-zinc-500 uppercase font-tech font-bold block">Crescimento Estimado Geral</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-serif text-emerald-400 font-bold">{weeklyReportResult.metricsAnalysis.growthPercentage}</span>
                              <span className="text-[9px] text-zinc-500 font-tech">positivo de alcance</span>
                            </div>
                          </div>
                          <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl space-y-2">
                            <span className="text-[10px] text-zinc-500 uppercase font-tech font-bold block">Tendência de Maior Impacto</span>
                            <span className="text-xs text-white font-tech font-medium block leading-tight">{weeklyReportResult.metricsAnalysis.keyHighlight}</span>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2 bg-zinc-950/30 p-4 rounded-xl border border-white/5">
                          <span className="text-[9px] text-zinc-500 uppercase font-tech font-bold tracking-widest block">Insights Práticos & Tendências de Munique:</span>
                          <div className="space-y-1.5 list-none">
                            {weeklyReportResult.metricsAnalysis.insights.map((ins, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
                                <span className="text-[#C5A059] font-tech font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                                <p className="font-light">{ins}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Section 3: Projects status */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-tech text-[#C5A059] tracking-widest font-bold">3. Pipeline do Portfólio de Projetos</h4>
                        <div className="flex items-center gap-4 text-xs font-tech">
                          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-semibold">
                            {weeklyReportResult.projectStatusSummary.onTrackCount} Sem Impedimentos
                          </span>
                          <span className="px-3 py-1 bg-zinc-950 border border-white/5 rounded-full text-zinc-500">
                            {weeklyReportResult.projectStatusSummary.atRiskCount} Em Atenção
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 font-light leading-relaxed">
                          {weeklyReportResult.projectStatusSummary.narrative}
                        </p>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Section 4: Deliveries */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-tech text-[#C5A059] tracking-widest font-bold">4. Entregas de Mídia Concluídas</h4>
                        <div className="space-y-2">
                          {weeklyReportResult.weeklyDeliverables.map((del, index) => (
                            <div key={index} className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 flex justify-between items-center gap-3">
                              <div className="space-y-1">
                                <span className="text-xs font-semibold text-white block">{del.title}</span>
                                <span className="text-[10px] text-zinc-400 font-light block">{del.impact}</span>
                              </div>
                              <span className="text-[9px] font-tech bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded text-emerald-400 uppercase tracking-widest font-bold shrink-0">
                                {del.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Section 5: Strategic Next Actions */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase font-tech text-[#C5A059] tracking-widest font-bold">5. Próximos Passos & Gestão de Cronograma</h4>
                        <div className="space-y-2">
                          {weeklyReportResult.strategicNextSteps.map((step, index) => {
                            const isHigh = step.priority === "Alta";
                            return (
                              <div key={index} className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div className="space-y-1 max-w-xl">
                                  <p className="text-xs text-zinc-200 font-light leading-relaxed">{step.action}</p>
                                  <span className="text-[10px] text-zinc-500 block">Responsável: <strong className="text-zinc-400 font-normal">{step.owner}</strong></span>
                                </div>
                                <span className={`text-[9px] font-tech px-2 py-0.5 rounded uppercase tracking-wider font-bold shrink-0 text-center sm:w-auto w-16 ${
                                  isHigh 
                                    ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                                    : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                                }`}>
                                  Prioridade {step.priority}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Section 6: Creative Note */}
                      <div className="p-4 bg-gradient-to-r from-zinc-950/60 to-zinc-900/60 rounded-xl border border-[#C5A059]/20 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-tech text-[#C5A059] tracking-wider font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin-slow" />
                          <span>Diretriz Criativa Geral Autoral</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-light font-serif leading-relaxed italic">
                          "{weeklyReportResult.creativeInspiration}"
                        </p>
                        <span className="text-[9px] text-zinc-500 block text-right font-tech">— Conselho Criativo, CA.RO ATELIER</span>
                      </div>

                    </div>

                    {/* Document Footer Operations */}
                    <div className="p-6 bg-zinc-950 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-[9px] font-tech text-zinc-600 tracking-wider">PORTAL SÍNCRONO EXECUTIVO — ACESSO SEGURO</span>
                      
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={handleCopyReport}
                          className="flex-1 sm:flex-none px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white rounded-xl text-xs font-tech font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {copiedText ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Texto</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center space-y-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-[#C5A059]" />
                    </div>
                    <div className="space-y-1.5 max-w-sm mx-auto">
                      <h4 className="text-sm font-semibold text-white">Nenhum Relatório Semanal Ativo</h4>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed">
                        Ainda não geramos relatórios para a marca {activeClientObj?.name} nesta sessão.
                        Pressione o botão <strong>"Gerar Relatório Semanal"</strong> acima para gerar um relatório inteligente de alto padrão.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Guide tips */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Information card */}
                <div className="luxury-card p-5 rounded-2xl bg-zinc-950/40 border border-white/5 space-y-4">
                  <span className="text-[10px] font-tech text-[#C5A059] uppercase block tracking-wider font-bold">Instruções de Prestígio</span>
                  <div className="space-y-3.5">
                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-tech text-[#E5D1B0] font-bold">1</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white block">Sincronização de Dados</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-light">Para alimentar a I.A, adicione novos projetos, atas de reuniões ou publique posts nos outros módulos. A IA lerá seu estado mais recente de forma integral.</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-tech text-[#E5D1B0] font-bold">2</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white block">Personalização de Métricas</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-light">Cada marca dinâmica conta com multiplicadores específicos de audiência que ponderam os gráficos e geram análises preditivas personalizadas.</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-tech text-[#E5D1B0] font-bold">3</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white block">Compartilhamento Facilitado</span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-light">Copie o conteúdo estruturado com um único clique para enviar relatórios rápidos aos conselhos diretores ou parceiros de distribuição.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro metrics card */}
                {activeClientObj && (
                  <div className="p-4 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-xl border border-white/5 space-y-3">
                    <span className="text-[9px] font-tech text-zinc-500 uppercase tracking-widest block font-bold">SUMÁRIO DE CAMPANHAS</span>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-light">Projetos Ativos</span>
                        <span className="font-tech font-bold text-white">{clientProjects.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-light">Mídias Publicadas</span>
                        <span className="font-tech font-bold text-[#C5A059]">{clientPublications.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-400 font-light">Multiplicador de Alcance</span>
                        <span className="font-tech font-bold text-emerald-400">{activeClientMultiplier}x</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
