import React, { useState } from "react";
import { ApprovalItem } from "../types";
import { 
  Check, 
  X, 
  Image as ImageIcon, 
  Volume2, 
  FileText, 
  Compass, 
  HelpCircle,
  CornerDownRight,
  Sparkles,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ApprovalsTabProps {
  approvals: ApprovalItem[];
  onUpdateApproval: (item: ApprovalItem) => void;
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  } | null;
}

export default function ApprovalsTab({ approvals, onUpdateApproval, currentUser }: ApprovalsTabProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>("appr-1");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  const handleApprove = (item: ApprovalItem) => {
    const actorName = currentUser ? `${currentUser.name} (${currentUser.role === "agency" ? "Agência" : "Cliente"})` : "Conselho Mundi TKR";
    const updated: ApprovalItem = {
      ...item,
      status: "Aprovado",
      feedback: item.feedback ? [...item.feedback, `Material formalmente aprovado e liberado por ${actorName}.`] : [`Material formalmente aprovado e liberado por ${actorName}.`]
    };

    onUpdateApproval(updated);
    
    // Trigger majestic celebration
    setCelebrationMessage(`O material "${item.title}" foi aprovado com absoluto sucesso!`);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
    }, 3800);
  };

  const handleRequestAdjustments = (item: ApprovalItem) => {
    if (!feedbackInput.trim()) return;

    const actorName = currentUser ? `${currentUser.name} (${currentUser.role === "agency" ? "Agência" : "Cliente"})` : "Conselho";
    const commentWithAuthor = `[Ajuste por ${actorName}]: ${feedbackInput}`;

    const updated: ApprovalItem = {
      ...item,
      status: "Ajustes Solicitados",
      feedback: item.feedback ? [...item.feedback, commentWithAuthor] : [commentWithAuthor]
    };

    onUpdateApproval(updated);
    setFeedbackInput("");
  };

  const selectedItem = approvals.find(a => a.id === selectedItemId);

  const getIconForType = (type: ApprovalItem["type"]) => {
    switch (type) {
      case "Arte": return ImageIcon;
      case "Vídeo": return Volume2;
      case "Campanha": return Compass;
      case "Material Comercial": return FileText;
      case "Post & Legenda": return FileText;
      default: return HelpCircle;
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Celebratory Banner & Motion Backdrop */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="max-w-md w-full bg-[#0A0A0A] border border-[#C5A059]/30 p-8 rounded-2xl text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 geo-grid opacity-20 pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mx-auto text-[#E5D1B0]">
                <Sparkles className="w-8 h-8 animate-bounce" />
               </div>
              <h3 className="font-serif text-2xl text-[#E5D1B0] tracking-tight">Material Validado</h3>
              <p className="text-zinc-300 text-sm font-light leading-relaxed">
                {celebrationMessage}
              </p>
              <p className="text-[10px] text-zinc-500 font-tech uppercase tracking-widest">Aviso enviado via email para Carol & Julio</p>
              <button 
                onClick={() => setShowCelebration(false)}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#E5D1B0] text-zinc-900 rounded-xl text-xs font-semibold uppercase tracking-wider font-tech transition-all cursor-pointer"
              >
                Prosseguir
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Header */}
      <div>
        <h2 className="font-serif text-2xl text-white tracking-tight">Máfia de Aprovações (Módulo de Validação)</h2>
        <p className="text-xs text-zinc-400">Analise, comente e assine as mídias e campanhas criadas pela agência.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gallery / Feed - lg:col-span-7 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvals.map(item => {
              const IconType = getIconForType(item.type);
              const isSelected = selectedItemId === item.id;
              
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`luxury-card rounded-xl overflow-hidden cursor-pointer transition-all border ${
                    isSelected ? "border-[#C5A059]" : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="relative h-40">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Floating Status Badges */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-tech uppercase px-2 py-0.5 rounded tracking-wider border ${
                        item.status === "Aprovado" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        item.status === "Ajustes Solicitados" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                        "bg-[#C5A059]/15 text-[#E5D1B0] border-[#C5A059]/20 animate-pulse"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-[#E5D1B0] font-tech font-light py-0.5 px-2 rounded backdrop-blur-md bg-zinc-900/60 border border-white/5">
                      <IconType className="w-3.5 h-3.5" />
                      <span>{item.type}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1 select-none">
                    <h3 className="font-serif text-base text-white tracking-tight leading-snug">{item.title}</h3>
                    <p className="text-xs text-zinc-400 font-light truncate">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

         {/* Selected Asset Auditor Panel - lg:col-span-5 */}
         <div className="lg:col-span-5">
           {selectedItem ? (
             <div className="luxury-card p-6 rounded-2xl space-y-5 lg:sticky lg:top-4 border border-[#C5A059]/20">
               <div className="space-y-2">
                 <span className="text-[10px] text-[#C5A059] uppercase tracking-widest font-tech font-medium bg-[#C5A059]/15 px-2 py-1 rounded inline-block">
                   Auditoria de Campanha • ID: {selectedItem.id}
                 </span>
                 <h3 className="font-serif text-xl text-white tracking-tight leading-tight">{selectedItem.title}</h3>
               </div>

               {/* Large Image Preview wrapper */}
               <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/5 relative bg-zinc-950">
                 <img
                   src={selectedItem.thumbnail}
                   alt={selectedItem.title}
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-zinc-950/30 flex items-center justify-center">
                   <div className="p-3 bg-zinc-900/80 border border-white/15 rounded-full text-white backdrop-blur-sm hover:scale-105 transition-all cursor-pointer">
                     <Compass className="w-5 h-5" />
                   </div>
                 </div>
               </div>

               <div className="space-y-4 text-xs font-light">
                 <div className="space-y-1">
                   <span className="text-[10px] text-zinc-400 font-tech uppercase tracking-widest block">Metas estratégicas do Asset</span>
                   <p className="text-zinc-300 leading-relaxed">{selectedItem.description}</p>
                   {selectedItem.driveLink && (
                     <div className="mt-4 p-3.5 bg-gradient-to-r from-blue-950/20 to-zinc-900 border border-blue-500/20 rounded-xl flex items-center justify-between gap-4">
                       <div className="space-y-0.5">
                         <span className="text-[9px] uppercase font-tech text-blue-400 font-semibold tracking-wider">Ativos de Alta Fidelidade</span>
                         <h4 className="text-xs text-white">Google Drive dos Posts & Vídeos</h4>
                       </div>
                       <a 
                         href={selectedItem.driveLink} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-400 text-zinc-950 hover:text-black font-semibold text-[10px] font-tech uppercase tracking-wide rounded-lg flex items-center gap-1.5 transition-all shadow-md select-none cursor-pointer"
                       >
                         Acessar Pasta <ExternalLink className="w-3 h-3" />
                       </a>
                     </div>
                   )}
									{selectedItem.captionText && (
										<div className="mt-4 space-y-1.5 p-3.5 bg-zinc-900/60 border border-[#C5A059]/25 rounded-xl">
											<div className="flex items-center justify-between text-[10px] text-[#C5A059] font-tech uppercase tracking-wider font-semibold border-b border-[#C5A059]/10 pb-1.5 mb-1.5">
												<span>Legenda do Post (Aprovação em Tempo Real)</span>
												<span className="text-zinc-500 font-normal hover:text-white cursor-pointer" onClick={() => navigator.clipboard.writeText(selectedItem.captionText || "")}>Copiar</span>
											</div>
											<p className="text-xs text-white leading-relaxed whitespace-pre-wrap select-all bg-zinc-950 p-3 rounded-lg border border-white/5 font-mono">
												{selectedItem.captionText}
											</p>
										</div>
									)}
                 </div>

                 {/* Audit Actions depending on Status */}
                 {selectedItem.status === "Pendente" ? (
                   <div className="space-y-4 pt-2">
                     <div className="grid grid-cols-2 gap-3">
                       <button
                         onClick={() => handleApprove(selectedItem)}
                         className="py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold tracking-wider font-tech uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                       >
                         <Check className="w-4 h-4" /> Aprovar Asset
                       </button>
                       <button
                         onClick={() => {
                           const target = document.getElementById("adj-feedback-input");
                           target?.focus();
                         }}
                         className="py-2.5 bg-zinc-900 border border-white/10 hover:border-rose-500/40 text-rose-400 font-semibold tracking-wider font-tech uppercase rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                       >
                         <X className="w-4 h-4" /> Solicitar Ajustes
                       </button>
                     </div>

                     {/* Adjust Form */}
                     <div className="space-y-2 pt-2 border-t border-white/5">
                       <label className="block text-[10px] text-rose-300 uppercase tracking-wider font-tech">O que precisa ser alterado?</label>
                       <textarea
                         id="adj-feedback-input"
                         rows={3}
                         className="w-full text-xs bg-zinc-950 border border-rose-500/15 focus:border-rose-500 rounded-lg p-2.5 text-white resize-none"
                         placeholder="Ex: Escurecer a iluminação e centralizar o logo da Mundi TKR nos frames finais..."
                         value={feedbackInput}
                         onChange={(e) => setFeedbackInput(e.target.value)}
                       />
                       <button
                         onClick={() => handleRequestAdjustments(selectedItem)}
                         disabled={!feedbackInput.trim()}
                         className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 rounded-lg text-[10px] tracking-wider uppercase font-tech transition-all cursor-pointer"
                       >
                         Enviar Feedback de Ajuste
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-3 pt-3 border-t border-white/5">
                     <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-tech block">Histórico de Respostas dadas</span>
                     <div className="space-y-2">
                       {selectedItem.feedback && selectedItem.feedback.length > 0 ? (
                         selectedItem.feedback.map((fe, idx) => (
                           <div key={idx} className="p-3 bg-zinc-900 rounded-xl border border-white/5 flex gap-2">
                             <CornerDownRight className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                             <p className="text-zinc-300 italic text-xs leading-relaxed">"{fe}"</p>
                           </div>
                         ))
                       ) : (
                         <div className="text-[11px] text-zinc-500 italic">Nenhum feedback adicional cadastrado.</div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center text-zinc-500 py-32 text-center border border-dashed border-white/5 rounded-2xl">
               <AlertCircle className="w-10 h-10 text-[#C5A059] opacity-40 mb-2 animate-pulse" />
               <p className="text-xs">Selecione uma peça na galeria para auditar, aprovar ou comentar.</p>
             </div>
           )}
         </div>

      </div>
    </div>
  );
}
