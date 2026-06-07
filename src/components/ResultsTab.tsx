import React, { useState } from "react";
import { Project, ResultMetrics } from "../types";
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
  Tv
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ResultsTabProps {
  metrics: ResultMetrics;
  projects: Project[];
}

interface AiRecommendationPayload {
  visaoGeral: string;
  recomendacoes: {
    titulo: string;
    descricao: string;
  }[];
}

export default function ResultsTab({ metrics, projects }: ResultsTabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AiRecommendationPayload | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchAiRecommendations = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const response = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metrics,
          activeProjects: projects.map(p => ({ name: p.name, status: p.status, progress: p.progress }))
        })
      });

      if (!response.ok) throw new Error("Erro no servidor de IA.");
      const data = await response.json();
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError("Ocorreu um erro ao consultar as recomendações. Criamos um conselho modelo para você.");
      
      // Fallback elegant mock
      setAiResult({
        visaoGeral: "A trajetória da Mundi TKR une o rigor técnico da engenharia manufaturada e a leveza aerodinâmica contemporânea. Percebe-se uma oportunidade crucial de elevar o prestígio da marca conectando os galpões de produção com ensaios estéticos em locações de alta classe europeia.",
        recomendacoes: [
          {
            titulo: "Lançamento Técnico: Detalhes em Macrofotografia",
            descricao: "Utilizar desfoque artístico profundo e iluminação cenográfica alemã para dar destaque absoluto à fibra de carbono moldada e de alta resistência física."
          },
          {
            titulo: "Hub de Integração com Lojas Conceito no Brasil",
            descricao: "Expandir o alcance tático organizando pockets events em Alphaville para revendedores qualificados, unindo tecnologia de suspensão e catering premium."
          },
          {
            titulo: "Inteligência Autoral nos Bastidores do Chão de Fábrica",
            descricao: "Publicar documentários curtos de 1 minuto em preto e branco com som original das máquinas robotizadas, cultivando a aura de rigor técnico incomparável."
          }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const performanceBars = [
    { label: "Alcance total", value: metrics.reach.toLocaleString(), progress: 85, change: "+15.2%", color: "from-[#C5A059] to-[#E5D1B0]", sub: "Foco editorial europeu" },
    { label: "Impressões de marca", value: metrics.impressions.toLocaleString(), progress: 92, change: "+22.1%", color: "from-[#C5A059] to-yellow-600", sub: "Alta densidade visual" },
    { label: "Cliques em campanhas", value: metrics.clicks.toLocaleString(), progress: 70, change: "+12.3%", color: "from-blue-500 to-sky-400", sub: "CTR de Alta conversão" },
    { label: "Engajamento qualitativo", value: metrics.engagement.toLocaleString(), progress: 62, change: "+8.4%", color: "from-emerald-500 to-teal-400", sub: "Assinaturas autênticas" },
    { label: "Oportunidades geradas", value: metrics.opportunities.toLocaleString(), progress: 48, change: "+14.8%", color: "from-purple-500 to-pink-400", sub: "Leads de altíssimo padrão" }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl text-white tracking-tight">Resultados Operacionais (Módulo de Performance)</h2>
        <p className="text-xs text-zinc-400">Mensuração precisa das campanhas digitais e inteligência estratégica ativa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Analytics performance meters - lg:col-span-7 */}
        <div className="lg:col-span-7 space-y-5">
          <div className="luxury-card p-6 rounded-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-xs font-tech text-[#C5A059] uppercase tracking-wider">Métricas de Performance da Parceria</span>
              <span className="text-[10px] text-zinc-500">Junho de 2026</span>
            </div>

            <div className="space-y-5">
              {performanceBars.map((bar, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-zinc-200 block font-normal">{bar.label}</span>
                      <span className="text-[10px] text-zinc-500 block font-light">{bar.sub}</span>
                    </div>
                    <div className="text-right font-tech">
                      <strong className="text-white block text-sm">{bar.value}</strong>
                      <span className="text-emerald-400 font-semibold text-[10px] inline-flex items-center gap-0.5">
                        <ArrowUpRight className="w-3 h-3" /> {bar.change}
                      </span>
                    </div>
                  </div>

                  {/* Gorgeous animated progress fill */}
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-white/5 relative">
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

        {/* AI Luxury Strategic Recommendations Hub - lg:col-span-5 */}
        <div className="lg:col-span-5">
          <div className="luxury-card p-6 rounded-2xl border border-[#C5A059]/20 space-y-5 lg:sticky lg:top-4 bg-gradient-to-b from-zinc-900/60 to-zinc-950/60 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C5A059] animate-pulse" />
                <h3 className="font-serif text-lg text-white">Conselheiro Estratégico AI CA.RO</h3>
              </div>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Nossa inteligência avançada analisa em tempo real as métricas históricas da Mundi TKR 
                para conceber recomendações de alta costura criativa e engajamento.
              </p>
            </div>

            {/* Recommendation Display Area with stateful rendering */}
            <div className="min-h-[180px] bg-zinc-950/80 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
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
                    <p className="text-xs text-[#E5D1B0] font-tech uppercase tracking-widest">Sincronizando Tendências de Munique...</p>
                    <p className="text-[10px] text-zinc-500 font-light">Calculando vetores de exclusividade estético-digital</p>
                  </motion.div>
                ) : aiResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-left"
                  >
                    {/* General analysis quote */}
                    <div className="border-l-2 border-[#C5A059] pl-3 py-1">
                      <p className="text-[11px] text-zinc-300 font-serif leading-relaxed italic">
                        "{aiResult.visaoGeral}"
                      </p>
                    </div>

                    {/* Specific points lists */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-tech font-bold block">Táticas de Posicionamento</span>
                      
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {aiResult.recomendacoes.map((rec, i) => (
                          <div key={i} className="p-2.5 rounded bg-zinc-900 border border-white/5 space-y-1">
                            <h4 className="text-xs font-semibold text-[#E5D1B0] font-tech uppercase tracking-wide">{rec.titulo}</h4>
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
                    <p className="text-xs">Conselho Inteligente pronto para geração.</p>
                    <p className="text-[10px] font-light">Clique em "Gerar Recomendações" para acionar os motores cognitivos.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={fetchAiRecommendations}
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-[#C5A059] to-[#E5D1B0] text-zinc-900 font-bold uppercase tracking-wider font-tech text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? "Processando Conselho..." : "Consultar Direção Criativa"}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
