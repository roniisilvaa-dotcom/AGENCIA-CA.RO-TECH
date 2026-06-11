import React, { useState } from "react";
import { PendingItem } from "../types";
import { 
  ClipboardCheck, 
  HelpCircle, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  Info,
  Sliders,
  Sparkles,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PendingsTabProps {
  pendings: PendingItem[];
  onAddPending: (newPend: PendingItem) => void;
  onResolvePending: (id: string) => void;
  currentUser: {
    role: "agency" | "client";
    name: string;
    email: string;
  } | null;
}

export default function PendingsTab({ pendings, onAddPending, onResolvePending, currentUser }: PendingsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newType, setNewType] = useState<PendingItem["type"]>("Aprovação");

  const getTypeIcon = (type: PendingItem["type"]) => {
    switch (type) {
      case "Aprovação": return CheckCircle2;
      case "Informação": return Info;
      case "Material": return Layers;
      case "Decisão": return Sliders;
      default: return HelpCircle;
    }
  };

  const getTypeColor = (type: PendingItem["type"]) => {
    switch (type) {
      case "Aprovação": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/15";
      case "Informação": return "text-blue-400 bg-blue-500/10 border-blue-500/15";
      case "Material": return "text-purple-400 bg-purple-500/10 border-purple-500/15";
      case "Decisão": return "text-amber-400 bg-amber-500/10 border-amber-500/15";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/15";
    }
  };

  const handleCreatePending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDeadline) return;

    const nPend: PendingItem = {
      id: "pend-" + Date.now(),
      title: newTitle,
      deadline: newDeadline,
      description: newDesc || "Nenhuma especificação detalhada fornecida ainda.",
      type: newType
    };

    onAddPending(nPend);
    
    // Reset fields
    setNewTitle("");
    setNewDeadline("");
    setNewDesc("");
    setNewType("Aprovação");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white tracking-tight">Módulo de Pendências TKR</h2>
          <p className="text-xs text-zinc-400">Demandas ativas qualificadas aguardando a retaguarda do cliente.</p>
        </div>

        {currentUser?.role === "agency" ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#C5A059] text-zinc-900 border border-[#C5A059] rounded-xl text-xs font-semibold uppercase tracking-wider font-tech flex items-center gap-2 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" /> Solicitar Esclarecimento / Pendência
          </button>
        ) : (
          <div className="px-4 py-2 bg-zinc-900/60 border border-white/5 text-zinc-400 rounded-xl text-xs font-medium tracking-wide font-tech flex items-center gap-2 select-none self-stretch sm:self-auto justify-center">
            <span>🔒 Gestão Exclusiva Agência</span>
          </div>
        )}
      </div>

      {/* Conditionally rendered new pending items */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="luxury-card p-5 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-4">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-serif text-base text-zinc-100">Criar Alerta de Pendência</h3>
            </div>

            <form onSubmit={handleCreatePending} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-[10px] text-[#C5A059] uppercase tracking-wider font-tech mb-1">Título do Bloco de Impedimento</label>
                <input
                  type="text"
                  required
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                  placeholder="Ex: Fornecer especificações completas das medidas do kit de suspensão..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Data Limite (Deadline)</label>
                <input
                  type="date"
                  required
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Tipo de Pendência</label>
                <select
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as PendingItem["type"])}
                >
                  <option value="Aprovação">Aprovação</option>
                  <option value="Informação">Informação</option>
                  <option value="Material">Material</option>
                  <option value="Decisão">Decisão</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Instruções para o Time</label>
                <input
                  type="text"
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                  placeholder="Descreva o que precisamos para desbloquear o fluxo corporativo..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 md:col-span-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-2 bg-transparent text-zinc-400 border border-white/5 rounded-lg text-xs"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C5A059] text-zinc-900 rounded-lg text-xs font-semibold uppercase tracking-wider font-tech cursor-pointer"
                >
                  Postar Bloqueio
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendings.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-zinc-900/10">
            <ClipboardCheck className="w-12 h-12 text-[#C5A059] mb-2 opacity-50" />
            <p>Excelente! A Mundi TKR não possui pendências ou bloqueios operacionais no pipeline.</p>
            <p className="text-[11px] font-light text-zinc-500 mt-1">Conexão 100% fluida da nossa equipe de Barueri.</p>
          </div>
        ) : (
          pendings.map((pend) => {
            const Icon = getTypeIcon(pend.type);
            const classesType = getTypeColor(pend.type);

            return (
              <motion.div
                key={pend.id}
                layoutId={pend.id}
                className="luxury-card p-5 rounded-xl border border-white/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <span className={`text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded border ${classesType} flex items-center gap-1`}>
                      <Icon className="w-3 h-3" />
                      {pend.type}
                    </span>

                    <span className="text-[10px] text-zinc-500 font-tech inline-flex items-center gap-1.5 bg-zinc-950 px-2 py-0.5 rounded border border-white/5">
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      Prazo: {pend.deadline}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-base text-zinc-100 tracking-tight leading-snug">{pend.title}</h4>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">{pend.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs mt-4">
                  <span className="text-[10px] text-zinc-500 font-tech uppercase font-semibold flex items-center gap-1 text-amber-500">
                    <AlertTriangle className="w-3.5 h-3.5" /> Bloqueio Ativo
                  </span>
                  
                  <button
                    onClick={() => onResolvePending(pend.id)}
                    className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-tech uppercase font-bold tracking-wide rounded-lg cursor-pointer transition-all"
                  >
                    Marcar Resolvido
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
