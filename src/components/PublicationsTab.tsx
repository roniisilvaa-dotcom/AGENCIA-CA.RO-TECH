import React, { useState } from "react";
import { Publication } from "../types";
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Globe, 
  Award, 
  Search, 
  ExternalLink,
  Plus,
  Compass
} from "lucide-react";
import { motion } from "motion/react";

interface PublicationsTabProps {
  publications: Publication[];
  onAddPublication: (pub: Publication) => void;
}

export default function PublicationsTab({ publications, onAddPublication }: PublicationsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");

  // New publication inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newChannel, setNewChannel] = useState<Publication["channel"]>("Instagram");
  const [newLink, setNewLink] = useState("");
  const [newOwner, setNewOwner] = useState("Assessoria CA.RO");

  const getChannelIcon = (chan: Publication["channel"]) => {
    switch (chan) {
      case "Instagram": return Instagram;
      case "LinkedIn": return Linkedin;
      case "Youtube": return Youtube;
      case "Website": return Globe;
      default: return Award;
    }
  };

  const getChannelColor = (chan: Publication["channel"]) => {
    switch (chan) {
      case "Instagram": return "text-pink-400 bg-pink-400/5 border-pink-400/10";
      case "LinkedIn": return "text-sky-400 bg-sky-400/5 border-sky-400/10";
      case "Youtube": return "text-rose-400 bg-rose-400/5 border-rose-400/10";
      case "Website": return "text-emerald-400 bg-emerald-400/5 border-emerald-400/10";
      default: return "text-[#C5A059] bg-[#C5A059]/5 border-[#C5A059]/10";
    }
  };

  const handleCreatePublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const nPub: Publication = {
      id: "pub-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      channel: newChannel,
      title: newTitle,
      link: newLink || "https://caroimage.com",
      owner: newOwner
    };

    onAddPublication(nPub);
    setNewTitle("");
    setNewLink("");
    setShowAddForm(false);
  };

  const filtered = publications.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === "all" || p.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl text-white tracking-tight">Módulo de Publicações</h2>
          <p className="text-xs text-zinc-400">Histórico de materiais veiculados e arquivamento estratégico.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#0A0A0A] border border-[#C5A059]/35 hover:border-[#C5A059]/60 text-[#E5D1B0] rounded-xl text-xs font-semibold uppercase tracking-wider font-tech flex items-center gap-2 transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Registrar Publicação
        </button>
      </div>

      {/* Show Add Form conditional drawer */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="luxury-card p-5 rounded-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-4">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-base text-zinc-100">Registrar Material Veiculado</h3>
          </div>

          <form onSubmit={handleCreatePublication} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-[10px] text-[#C5A059] uppercase tracking-wider font-tech mb-1">Título da Publicação / Post</label>
              <input
                type="text"
                required
                className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                placeholder="Ex: Editorial Alta Velocidade - Coleção Outono"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Canal de Publicação</label>
              <select
                className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as Publication["channel"])}
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Youtube">Youtube</option>
                <option value="Website">Website</option>
                <option value="Mídia Corporativa">Mídia Corporativa</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Líder / Autor</label>
              <input
                type="text"
                className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1">Link de Destino / Arquivo final (Mídia Pública)</label>
              <input
                type="url"
                className="w-full text-xs bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059]"
                placeholder="Ex: https://instagram.com/caroimage..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
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
                Salvar Registro
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full text-xs bg-zinc-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-3 placeholder-zinc-500 text-white focus:border-[#C5A059] transition-colors"
            placeholder="Pesquise por títulos, autores ou mídias publicadas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="bg-zinc-900/60 border border-white/5 text-xs text-zinc-300 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A059]"
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
        >
          <option value="all">Filtro: Todos os Canais</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Youtube">Youtube</option>
          <option value="Website">Website</option>
          <option value="Mídia Corporativa">Mídia Corporativa</option>
        </select>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm">
            Nenhuma publicação encontrada para os critérios fornecidos.
          </div>
        ) : (
          filtered.map((pub, idx) => {
            const Icon = getChannelIcon(pub.channel);
            const classes = getChannelColor(pub.channel);

            return (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="luxury-card p-5 rounded-xl border border-white/5 flex flex-col justify-between h-48 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-tech font-bold uppercase px-2.5 py-1 rounded inline-flex items-center gap-1.5 border ${classes}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {pub.channel}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-tech">{pub.date}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-base text-zinc-100 tracking-tight leading-snug line-clamp-2">{pub.title}</h4>
                    <span className="text-[10px] text-zinc-400 font-tech block">Autor: • {pub.owner}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs mt-2 select-none">
                  <span className="text-[11px] text-zinc-500 font-tech">Ativo Arquivado</span>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#C5A059] inline-flex items-center gap-1 hover:underline text-xs"
                    >
                      Ver Mídia <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </div>
  );
}
