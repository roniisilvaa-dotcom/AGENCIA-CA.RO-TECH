import React, { useState } from "react";
import { Client, ClientReport } from "../types";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Image as ImageIcon,
  Building2,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReportsAdminTabProps {
  clients: Client[];
  reports: ClientReport[];
  onAddReport: (report: ClientReport) => void;
  onDeleteReport: (reportId: string) => void;
}

export default function ReportsAdminTab({
  clients,
  reports,
  onAddReport,
  onDeleteReport
}: ReportsAdminTabProps) {
  const [selectedClient, setSelectedClient] = useState("");
  const [month, setMonth] = useState("Janeiro");
  const [year, setYear] = useState("2026");
  const [reach, setReach] = useState("");
  const [impressions, setImpressions] = useState("");
  const [engagement, setEngagement] = useState("");
  const [clicks, setClicks] = useState("");
  const [rawText, setRawText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Preset chart images for quick premium mockups
  const CHART_PRESETS = [
    { name: "Gráfico de Linha Champagne (Crescimento)", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" },
    { name: "Gráfico de Barras Escuro (Engajamento)", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
    { name: "Funil de Métricas (Luxo)", url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientEmail = selectedClient || (clients[0]?.email || "");
    if (!clientEmail) {
      alert("Por favor, selecione ou cadastre um cliente primeiro.");
      return;
    }

    setLoading(true);

    // Simulate IA Reading the image/graph and text to formulate a standardized luxury report layout
    setTimeout(() => {
      const matchedClient = clients.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
      const clientName = matchedClient ? matchedClient.name : "Cliente";

      // Formulate Standard IA critique based on input
      const standardAiAnalysis = `A inteligência artificial CA.RO TECH processou o ativo gráfico e as notas críticas do mês. Com base no alcance de ${Number(reach).toLocaleString("pt-BR")} e engajamento de ${Number(engagement).toLocaleString("pt-BR")}%, identificamos um alinhamento excepcional com as diretrizes de design estratégico. O tráfego qualificado direcionado para os canais de ${clientName} apresenta comportamento de alta retenção visual. 

Considerações de Mercado:
• A exposição das artes sob a paleta champagne gerou impacto estético, resultando em ${Number(clicks).toLocaleString("pt-BR")} cliques qualificados.
• Recomenda-se manter a consistência cromática nos próximos ativos de marca.
• Análise das notas do administrador: "${rawText || "Sem notas adicionais."}"`;

      const newReport: ClientReport = {
        id: `rep-${Date.now()}`,
        clientEmail,
        month,
        year,
        title: `Relatório Consolidado de Desempenho — ${month}/${year}`,
        rawContentText: rawText,
        imageUrl: imageUrl || CHART_PRESETS[0].url,
        reach: Number(reach) || 0,
        impressions: Number(impressions) || 0,
        engagement: Number(engagement) || 0,
        clicks: Number(clicks) || 0,
        aiAnalysis: standardAiAnalysis
      };

      onAddReport(newReport);
      setLoading(false);
      setSuccessMsg(`Relatório de ${month}/${year} para "${clientName}" gerado e consolidado pela IA com sucesso!`);
      
      // Reset fields
      setReach("");
      setImpressions("");
      setEngagement("");
      setClicks("");
      setRawText("");
      setImageUrl("");

      setTimeout(() => setSuccessMsg(null), 6000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#C5A059]" />
            Consolidador de Relatórios (I.A. Oracle)
          </h2>
          <p className="text-[11px] text-zinc-400 font-tech uppercase tracking-wider mt-1">
            Alimente os dados mensais com texto e gráficos para gerar o layout unificado do cliente
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Feed Data Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="luxury-card p-6 rounded-2xl border border-white/[0.03] bg-zinc-950/85">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5 mb-4">
              <span className="p-1 bg-[#C5A059]/15 rounded text-[#C5A059]">
                <Plus className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-[#E5D1B0] uppercase font-tech tracking-wider">
                Gerar Novo Relatório Mensal
              </span>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2 mb-4">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-mono">{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                <div>
                  <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Cliente</label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                    className="w-full text-xs bg-zinc-900 border border-white/10 focus:border-[#C5A059] rounded-lg p-2.5 text-white outline-none transition-all cursor-pointer"
                  >
                    <option value="">Selecione...</option>
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.email}>{cli.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Mês</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 focus:border-[#C5A059] rounded-lg p-2.5 text-white outline-none transition-all cursor-pointer"
                  >
                    {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Ano</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 focus:border-[#C5A059] rounded-lg p-2.5 text-white outline-none transition-all cursor-pointer"
                  >
                    {["2026", "2027", "2028"].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* standard KPI metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900/30 p-3 border border-white/5 rounded-xl">
                <div>
                  <label className="block text-[8px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Alcance (Reach)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 85000"
                    value={reach}
                    onChange={(e) => setReach(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2 text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Impressões</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 340000"
                    value={impressions}
                    onChange={(e) => setImpressions(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2 text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Engajamento %</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 4.8"
                    value={engagement}
                    onChange={(e) => setEngagement(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2 text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[8px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Cliques</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 1200"
                    value={clicks}
                    onChange={(e) => setClicks(e.target.value)}
                    className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2 text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Chart Image */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Gráfico / Imagem (URL)</label>
                    <input
                      type="text"
                      placeholder="Cole o link da imagem do gráfico..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Presets Rápidos de Gráficos</label>
                    <select
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 focus:border-[#C5A059] rounded-lg p-2.5 text-white outline-none transition-all cursor-pointer"
                    >
                      <option value="">Escolher preset...</option>
                      {CHART_PRESETS.map((preset, idx) => (
                        <option key={idx} value={preset.url}>{preset.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes / raw content text */}
              <div>
                <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">
                  Notas Críticas & Considerações do Administrador
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Descreva o que funcionou bem, análises qualitativas ou notas de tráfego que serão enviadas para a consolidação da Inteligência Artificial..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-950 font-bold select-none text-[11px] font-tech uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>Sincronizando IA...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-zinc-950 animate-pulse" />
                    Consolidar Relatório com Inteligência Artificial
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Reports History */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 bg-[#C5A059]/15 rounded text-[#C5A059]">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#E5D1B0] uppercase font-tech tracking-wider">
              Relatórios Consolidados Ativos ({reports.length})
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 border border-white/5 rounded-2xl bg-zinc-950/30">
              Nenhum relatório foi consolidado ainda. Alimente o gerador ao lado.
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {reports.map((rep) => {
                const clientObj = clients.find(c => c.email.toLowerCase() === rep.clientEmail.toLowerCase());
                return (
                  <div 
                    key={rep.id} 
                    className="p-4 bg-zinc-900/40 rounded-xl border border-white/5 hover:border-[#C5A059]/20 transition-all flex justify-between items-start gap-4"
                  >
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <strong className="text-white text-xs font-serif">{rep.title}</strong>
                        <span className="text-[8px] bg-[#C5A059]/15 text-[#E5D1B0] border border-[#C5A059]/25 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-tech">
                          {clientObj?.name || "Desconhecido"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono truncate max-w-sm">{rep.clientEmail}</p>
                      
                      <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono pt-1">
                        <span>Reach: <strong className="text-[#E5D1B0]">{rep.reach.toLocaleString()}</strong></span>
                        <span>Engagement: <strong className="text-emerald-450">{rep.engagement}%</strong></span>
                        <span>Cliques: <strong className="text-[#C5A059]">{rep.clicks.toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja apagar o relatório de ${rep.month}/${rep.year}?`)) {
                          onDeleteReport(rep.id);
                        }
                      }}
                      className="text-rose-450 hover:text-rose-400 p-2 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Deletar Relatório"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
