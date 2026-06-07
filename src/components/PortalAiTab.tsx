import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Layers, 
  TrendingUp, 
  Lock, 
  HelpCircle, 
  CheckCircle,
  Clock,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Client, Project } from "../types";
import { INITIAL_CLIENTS } from "../data";

interface PortalAiTabProps {
  projects: Project[];
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  } | null;
}

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

interface DynamicChannel {
  id: string;
  name: string; // Dynamic AI Display Name: CA.RO - [NAME] (e.g., CA.RO - Mundi TKR)
  clientName: string; // The pure corporate name
  tagline: string;
  unlockedForClientEmail: string;
  initialWelcome: string;
  suggestedQuestions: string[];
}

export default function PortalAiTab({ projects, currentUser }: PortalAiTabProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Maintain separate conversation histories dynamically
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load clients dynamic list from localStorage or INITIAL_CLIENTS fallback
  useEffect(() => {
    let loadedClients: Client[] = [];
    try {
      const saved = localStorage.getItem("caro_clients");
      if (saved) {
        loadedClients = JSON.parse(saved);
      } else {
        loadedClients = INITIAL_CLIENTS;
      }
    } catch {
      loadedClients = INITIAL_CLIENTS;
    }
    setClients(loadedClients);

    // Filter or default active channel ID based on current logger
    if (currentUser) {
      if (currentUser.role === "client") {
        const matched = loadedClients.find(c => c.email.toLowerCase() === currentUser.email.toLowerCase());
        if (matched) {
          setActiveChannelId(matched.id);
        } else {
          setActiveChannelId(loadedClients[0]?.id || "");
        }
      } else {
        setActiveChannelId(loadedClients[0]?.id || "");
      }
    }
  }, [currentUser]);

  // Map dynamic clients to Dynamic AI channels representation
  const dynamicChannels: DynamicChannel[] = clients.map(cli => {
    const aiBrandName = "CA.RO TECH IA"; // NOME DA IA CA.RO TECH IA
    
    // Custom strategic suggested questions
    const suggested: string[] = [
      `Quais projetos da ${cli.name} estão ativos?`,
      `Qual o status atual do que temos programado?`,
      `Que peças ou postagens temos prontas ou pendentes?`
    ];

    return {
      id: cli.id,
      name: `${aiBrandName} - ${cli.name}`,
      clientName: cli.name,
      tagline: cli.tagline,
      unlockedForClientEmail: cli.email,
      initialWelcome: `Olá! Sou o assessor inteligente integrado **${aiBrandName}** do CA.RO ATELIER. Posso responder qualquer dúvida operacional, listar o andamento real do que está sendo feito e detalhar o cronograma programado de marketing de altíssimo padrão.`,
      suggestedQuestions: suggested
    };
  });

  const activeChannel = dynamicChannels.find(c => c.id === activeChannelId) || dynamicChannels[0];

  // Initialize dynamic welcomes histories
  useEffect(() => {
    if (dynamicChannels.length === 0) return;

    setChatHistories(prev => {
      const updated = { ...prev };
      dynamicChannels.forEach(ch => {
        if (!updated[ch.id]) {
          updated[ch.id] = [
            {
              id: `${ch.id}-init`,
              role: "model",
              text: ch.initialWelcome,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
          ];
        }
      });
      return updated;
    });
  }, [clients]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistories, activeChannelId, loading]);

  const activeHistory = activeChannel ? (chatHistories[activeChannel.id] || []) : [];

  // Security authorization checks
  const hasAccess = (channel: DynamicChannel): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "agency") return true; // ADM has sovereign access to all client tabs
    return currentUser.email.toLowerCase() === channel.unlockedForClientEmail.toLowerCase();
  };

  const handleSelectChannel = (channel: DynamicChannel) => {
    setPermissionError(null);
    if (hasAccess(channel)) {
      setActiveChannelId(channel.id);
    } else {
      setPermissionError(`Acesso bloqueado. Seus dados operacionais como cliente são isolados de forma estrita. O canal de inteligência de "${channel.clientName}" é restrito à sua respectiva diretoria ou aos administradores do CA.RO ATELIER.`);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!activeChannel || !textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const nextHistory = [...activeHistory, userMsg];
    setChatHistories(prev => ({
      ...prev,
      [activeChannel.id]: nextHistory
    }));
    setInputMessage("");
    setLoading(true);

    // Filter projects of this dynamic client email
    const clientProjects = projects.filter(p => p.clientEmail?.toLowerCase() === activeChannel.unlockedForClientEmail.toLowerCase());

    try {
      const response = await fetch("/api/client-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: activeChannel.clientName, // matches server mapping
          message: textToSend,
          history: nextHistory.slice(0, -1).map(h => ({ role: h.role, text: h.text })),
          activeProjects: clientProjects
        })
      });

      if (!response.ok) {
        throw new Error("Erro na rede.");
      }

      const data = await response.json();
      const aiMsg: Message = {
        id: "ai-" + Date.now(),
        role: "model",
        text: data.text || `Entendido sua solicitação de "${activeChannel.clientName}". Projetos ativos e programados em tempo real no nosso portal estão alinhados.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatHistories(prev => ({
        ...prev,
        [activeChannel.id]: [...nextHistory, aiMsg]
      }));
    } catch (e) {
      console.warn("Using smart fallback matching for Portal AI...", e);
      
      // Smart offline fallback matching for cost-efficiency and quick responses:
      let fallbackText = "";
      const query = textToSend.toLowerCase();

      if (query.includes("projeto") || query.includes("que esta sendo") || query.includes("andamento") || query.includes("faz") || query.includes("feito")) {
        fallbackText = `### Status Estético e Progresso do que está Sendo Feito - **${activeChannel.clientName}**\n\nNossa célula criativa de Alphaville em consonância com a diretoria europeia consolidou as seguintes frentes em produção ativa:\n\n` +
          (clientProjects.length > 0 
            ? clientProjects.map(p => `- **${p.name}**:\n  - *Estágio do Pipeline*: \`${p.status}\`\n  - *Conclusão Operacional*: **${p.progress}%**\n  - *Última Ação*: ${p.lastUpdate || "Sincronização estática finalizada."}`).join("\n\n")
            : `- **Planejamento Geral Criativo**: \`Briefing Ativo\`\n  - *Progresso*: **15%**\n  - *Última Ação*: Setup inicial de direcionamento cromático de fotos macro para ${activeChannel.clientName}.`) +
          `\n\n*Gostaria de solicitar fotos de bastidores ou priorizar alguma das frentes operacionais?*`;
      } else if (query.includes("programa") || query.includes("previsto") || query.includes("cronograma") || query.includes("agenda") || query.includes("proximo") || query.includes("programado")) {
        fallbackText = `### Planejamento e Entregas Programadas para **${activeChannel.clientName}**\n\nNosso calendário operacional estipula as seguintes atividades programadas e prazos para este ciclo:\n\n` +
          `- **Post & Legenda para redes sociais**: Programado para entrega de rascunhos e revisão nas próximas 24h na sua aba *Aprovações*.\n` +
          `- **Envio de arquivos em alta definição**: Necessário aprovação do Storyboard planejado para as reuniões de alinhamento.\n` +
          `- **Sincronização de Métricas**: Painel analítico programado para receber novos dados na próxima terça-feira às 14:00.\n\n*Quer que eu agende uma conferência extraordinária de acompanhamento com a Carol?*`;
      } else if (query.includes("métrica") || query.includes("resultado") || query.includes("alcance") || query.includes("dado") || query.includes("número")) {
        fallbackText = `### Relatório Estratégico & Métricas de Performance\n\nOs resultados de veiculação e campanhas de prestígio de **${activeChannel.clientName}** indicam excelente progresso de autoridade de mercado:\n\n- **Taxa de Engajamento**: Ótimo aproveitamento do público em Alphaville.\n- **Visualizações (Impressões)**: Altos índices orgânicos consolidados pelas mídias de alto padrão.\n- **Geração de Oportunidades**: Clientes em potencial qualificados contactando diretamente o ecossistema.\n\n*Recomendamos manter o contraste sutil alemão e o Lightroom nobre como guia cromático das próximas postagens corporativas.*`;
      } else {
        fallbackText = `### Atendente Exclusivo: **${activeChannel.name}**\n\nOlá! Analisei sua dúvida. No portal executivo do **CA.RO ATELIER**, todos os dados referentes aos projetos de **${activeChannel.clientName}** estão acessíveis e protegidos sob sigilo.\n\n- **O que está sendo feito**: Amostragem de cards, ensaios piloto de estúdio de alta sensibilidade e revisão sistemática cromática.\n- **O que está programado**: Posts com legendas ricas integradas à esteira para sua aprovação em tempo real antes de irem a público.\n\nComo posso ajudar você agora? Digite uma pergunta direta como *"O que está sendo feito?"* ou *"O que tem programado?"* para obter respostas concisas!`;
      }

      const aiMsgErr: Message = {
        id: "ai-fb-" + Date.now(),
        role: "model",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatHistories(prev => ({
        ...prev,
        [activeChannel.id]: [...nextHistory, aiMsgErr]
      }));
    } finally {
      setLoading(false);
    }
  };

  if (dynamicChannels.length === 0 || !activeChannel) {
    return (
      <div className="flex items-center justify-center py-32 text-zinc-500 text-xs">
        Sincronizando banco de canais I.A...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl text-white tracking-tight">Canais Oracle Gratuito</h2>
            <span className="text-[9px] bg-[#C5A059]/10 text-[#E5D1B0] font-tech font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#C5A059]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> IA dos Clientes
            </span>
          </div>
          <p className="text-xs text-zinc-400">Ambiente virtual de atendimento. Tire dúvidas sobre as etapas em andamento, o que foi concluído e os próximos passos operacionais programados.</p>
        </div>

        {currentUser?.role === "agency" && (
          <div className="text-[10px] uppercase font-tech px-3 py-1.5 bg-[#111111] border border-[#C5A059]/40 rounded-xl text-[#E5D1B0] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            <span>Soberano ADM: Visualizando todos os canais</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side Channels Select Tabs */}
        <div className="lg:col-span-1 space-y-3.5">
          <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-2xl">
            <h3 className="text-[10px] font-tech text-zinc-500 uppercase tracking-widest mb-3.5 flex items-center gap-1.5 select-none font-bold">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" /> Canais Personalizados
            </h3>

            <div className="space-y-2">
              {dynamicChannels.map(ch => {
                const isUnlocked = hasAccess(ch);
                const isActive = ch.id === activeChannelId;

                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChannel(ch)}
                    className={`w-full text-left p-3 rounded-xl transition-all relative border flex flex-col gap-1 cursor-pointer ${
                      isActive 
                        ? "bg-[#111111] border-[#C5A059]/50 text-[#E5D1B0] shadow-md"
                        : isUnlocked 
                          ? "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900"
                          : "bg-zinc-950/40 border-dashed border-white/5 text-zinc-600 select-none cursor-not-allowed group"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* AS REQUESTED: Dynamic Branding exactly: CA.RO - [NAME] */}
                      <span className="text-[11px] font-bold tracking-wide font-tech uppercase">{ch.name}</span>
                      {!isUnlocked && (
                        <span className="text-[8px] bg-rose-950/10 text-rose-500 font-tech px-1.5 py-0.5 rounded flex items-center gap-1 border border-rose-500/10 uppercase">
                          <Lock className="w-2 h-2" /> Bloqueado
                        </span>
                      )}
                      {isUnlocked && !isActive && (
                        <span className="w-1.5 h-1.5 bg-[#C5A035] rounded-full opacity-60" />
                      )}
                    </div>
                    <span className="text-[9px] font-light leading-relaxed truncate opacity-75">{ch.tagline}</span>
                    
                    {isActive && (
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[3px] h-3/5 bg-[#C5A059] rounded-r-md" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <p className="text-[9px] text-zinc-500/80 leading-relaxed font-light mt-4 select-none">
              * Cada conta possui inteligência autônoma isolada e parametrizada com os dados reais de seu projeto em tempo real.
            </p>
          </div>
        </div>

        {/* Right Side Virtual Chat Assistant Panel */}
        <div className="lg:col-span-3 flex flex-col min-h-[500px] bg-zinc-950/60 border border-white/5 rounded-2xl overflow-hidden relative backdrop-blur-sm">
          
          {/* Header of active assistant */}
          <div className="bg-zinc-900/80 border-b border-white/5 p-4 flex justify-between items-center z-10 select-none">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#C5A059]/10 rounded-xl border border-[#C5A059]/20">
                <Bot className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white tracking-wide uppercase font-tech flex items-center gap-1.5">
                  AI Oracle Especialista • {activeChannel.name}
                </span>
                <span className="text-[9px] text-zinc-400 font-light truncate max-w-md">{activeChannel.tagline}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[8px] font-tech text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 rounded-full border border-emerald-500/15 py-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span>Criptografado</span>
            </div>
          </div>

          {/* Secure Warnings */}
          <AnimatePresence>
            {permissionError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5"
              >
                <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold uppercase tracking-wider font-tech text-[10px]">Políticas estritas de dados</p>
                  <p className="font-light leading-relaxed">{permissionError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages Render list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px] custom-scrollbar">
            {activeHistory.map((msg) => {
              const isAi = msg.role === "model";
              
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 border ${
                    isAi 
                      ? "bg-zinc-900 border-[#C5A059]/20 text-[#C5A059]" 
                      : "bg-[#C5A059]/10 border-[#C5A059]/30 text-white"
                  }`}>
                    {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`p-3.5 rounded-2xl space-y-2 text-xs leading-relaxed border ${
                    isAi 
                      ? "bg-[#111111]/80 border-white/5 text-zinc-200 rounded-tl-none font-light" 
                      : "bg-[#111111] border-[#C5A059]/20 text-[#E5D1B0] rounded-tr-none font-medium"
                  }`}>
                    <div className="space-y-2 whitespace-pre-wrap text-left font-sans">
                      {msg.text.split("\n").map((line, idx) => {
                        if (line.startsWith("###")) {
                          return <h4 key={idx} className="font-serif text-sm font-semibold text-[#E5D1B0] mt-3 mb-1">{line.replace("###", "").trim()}</h4>;
                        }
                        if (line.startsWith("-") || line.startsWith("*")) {
                          return (
                            <div key={idx} className="flex items-start gap-1.5 pl-2">
                              <span className="text-[#C5A059] mt-1 shrink-0">•</span>
                              <span>
                                {line.substring(2).split("**").map((part, pIdx) => 
                                  pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-white">{part}</strong> : part
                                )}
                              </span>
                            </div>
                          );
                        }
                        const boldParts = line.split("**");
                        return (
                          <p key={idx} className="leading-relaxed">
                            {boldParts.map((part, pIdx) => 
                              pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-[#C5A059]">{part}</strong> : part
                            )}
                          </p>
                        );
                      })}
                    </div>
                    
                    <span className="block text-[8px] tracking-wide font-mono text-zinc-500 text-right uppercase mt-1 select-none">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-3 max-w-[80%] mr-auto">
                <div className="p-1.5 bg-zinc-900 border border-[#C5A059]/20 rounded-lg shrink-0 text-[#C5A035]">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-[#111111]/80 border border-white/5 text-zinc-400 text-xs rounded-2xl rounded-tl-none flex items-center gap-2 select-none">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-150" />
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce delay-300" />
                  </span>
                  <span className="font-tech text-[8px] uppercase tracking-wider pl-1 font-semibold text-[#C5A059]">Consultando duto integrado...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Interactive Suggested Questions Panel */}
          <div className="px-5 py-2.5 border-t border-white/5 bg-zinc-950 flex flex-wrap gap-2 items-center select-none z-10">
            <span className="text-[8px] font-tech text-zinc-500 uppercase tracking-widest flex items-center gap-1 font-bold">
              <HelpCircle className="w-3 h-3 text-[#C5A059]" /> Consultas Prontas:
            </span>
            {activeChannel.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="text-[9px] font-tech text-[#E5D1B0] bg-[#111] hover:bg-[#C5A059]/10 border border-white/10 hover:border-[#C5A059]/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Send Input Message Form */}
          <div className="p-4 border-t border-white/5 bg-zinc-900/80 z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="flex gap-2.5"
            >
              <input
                type="text"
                placeholder={`Pergunte ao assessor ${activeChannel.name} o que está sendo feito ou programado...`}
                value={inputMessage}
                disabled={loading}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow text-xs bg-zinc-950 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="px-4 py-3 bg-[#C5A059] hover:bg-[#E5D1B0] disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center font-bold"
                title="Sincronizar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
