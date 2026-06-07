import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  Compass, 
  ShieldCheck,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";
import { Client } from "../types";
import { INITIAL_CLIENTS } from "../data";

interface LoginGateProps {
  onLogin: (role: "agency" | "client", name: string, email: string) => void;
}

export default function LoginGate({ onLogin }: LoginGateProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("caro_clients");
      if (saved) {
        setClients(JSON.parse(saved));
      } else {
        localStorage.setItem("caro_clients", JSON.stringify(INITIAL_CLIENTS));
        setClients(INITIAL_CLIENTS);
      }
    } catch {
      setClients(INITIAL_CLIENTS);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check Admin / Agency presets
    if ((cleanEmail === "admcaro" || cleanEmail === "admcaro@carotech.com" || cleanEmail === "admcaro@caroimage.com") && cleanPassword === "admcaro") {
      onLogin("agency", "Admin CA.RO (admcarotech)", "adm@carotech.com");
      return;
    } 
    
    if ((cleanEmail === "agencia@carotech.com" || cleanEmail === "agencia@caroimage.com") && cleanPassword === "caro2026") {
      onLogin("agency", "Carol (CA.RO TECH)", "agencia@carotech.com");
      return;
    }

    // Check dynamic clients database
    const matchedClient = clients.find(c => c.email.toLowerCase() === cleanEmail);
    if (matchedClient) {
      // If password field exists and matches, or if it isn't specified, let them in with default client password or matched password
      const clientPassword = matchedClient.password || "caro2026";
      if (cleanPassword === clientPassword) {
        onLogin("client", `Diretoria ${matchedClient.name}`, matchedClient.email);
        return;
      }
    }

    setError("Credenciais inválidas. Use os presets de demonstração ou e-mails cadastrados abaixo.");
  };

  const handleShortcutLogin = (role: "agency" | "admin" | string) => {
    if (role === "admin") {
      onLogin("agency", "Admin CA.RO (admcarotech)", "adm@carotech.com");
    } else if (role === "agency") {
      onLogin("agency", "Carol (CA.RO TECH)", "agencia@carotech.com");
    } else {
      // Role is email of a dynamic client
      const matched = clients.find(c => c.email === role);
      if (matched) {
        onLogin("client", `Diretoria ${matched.name}`, matched.email);
      } else {
        onLogin("client", "Diretoria Mundi TKR", "mundi@tkr.com");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] relative overflow-hidden flex flex-col justify-between p-6">
      {/* Golden accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8F7035] via-[#C5A059] to-[#8F7035] z-50 font-serif" />
      
      {/* Background elements */}
      <div className="absolute top-[10%] left-[50%] translate-x-[-50%] w-[600px] h-[600px] bg-gradient-radial from-[#C5A059]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 geo-grid opacity-[0.03] pointer-events-none" />

      {/* Empty block for flex alignment */}
      <div />

      <div className="max-w-md w-full mx-auto relative z-10 space-y-8 my-8">
        {/* Brand header */}
        <div className="text-center space-y-3 select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full text-[10px] text-[#E5D1B0] tracking-[0.2em] uppercase font-tech"
          >
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#C5A059]" /> CA.RO TECH ATELIER
          </motion.div>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-[0.2em]">
              CA.RO <span className="italic text-[#C5A059]">TECH</span>
            </h1>
            <p className="text-[10px] uppercase font-tech tracking-[0.25em] text-zinc-500">
              Alta Costura Digital & Transparência Conectada
            </p>
          </div>
        </div>

        {/* Auth form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="luxury-card p-6 md:p-8 rounded-2xl relative border border-white/5 bg-gradient-to-b from-[#111] to-[#0A0A0A]"
        >
          <div className="absolute top-0 right-0 p-3">
            <ShieldCheck className="w-5 h-5 text-zinc-600" />
          </div>

          <p className="text-xs text-zinc-400 font-light text-center mb-6 leading-relaxed">
            Seja bem-vindo. Insira suas credenciais seguras para sincronizar atividades do pipeline tecnológico e células produtivas de Alphaville.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1.5">E-mail Corporativo</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="exemplo@carotech.com ou e-mail de cliente"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#C5A059] transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1.5">Senha Exclusiva</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#C5A059] transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-[11px] text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#C5A059] to-[#E5D1B0] hover:scale-[1.01] text-zinc-950 font-bold uppercase tracking-wider font-tech text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-6"
            >
              Autenticar Credenciais <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset credentials buttons section */}
          <div className="mt-8 border-t border-white/5 pt-6 space-y-4">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-tech text-center">Acessos Rápidos Facilitados</span>
            
            <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {/* Admin */}
              <button
                type="button"
                onClick={() => handleShortcutLogin("admin")}
                className="p-2.5 text-left bg-zinc-950 rounded-xl border border-[#C5A059] hover:border-[#E5D1B0] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-bold text-[#E5D1B0] font-tech uppercase tracking-wide group-hover:text-white">AGÊNCIA ADMIN SUPREMO</span>
                  <span className="text-[8px] bg-[#C5A059]/20 text-white font-bold px-1.5 py-0.5 rounded border border-[#C5A059]">ADM TECH</span>
                </div>
                <p className="text-[10px] text-zinc-300">Login: <span className="text-[#C5A059] font-mono">admcaro</span> | Senha: <span className="text-[#C5A059] font-mono">admcaro</span></p>
              </button>

              {/* Agency standard */}
              <button
                type="button"
                onClick={() => handleShortcutLogin("agency")}
                className="p-2.5 text-left bg-zinc-950 rounded-xl border border-white/5 hover:border-[#C5A059]/40 transition-all cursor-pointer group opacity-90 hover:opacity-100"
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-bold text-white font-tech uppercase tracking-wide group-hover:text-[#E5D1B0]">Carol (Agência Editora)</span>
                  <span className="text-[8px] bg-zinc-900 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded">Agência</span>
                </div>
                <p className="text-[10px] text-zinc-400">E-mail: <span className="text-zinc-300 font-mono">agencia@carotech.com</span> | Senha: <span className="text-zinc-300 font-mono">caro2026</span></p>
              </button>

              {/* Dynamics Clients List mapping */}
              {clients.map((cli) => (
                <button
                  key={cli.id}
                  type="button"
                  onClick={() => handleShortcutLogin(cli.email)}
                  className="p-2.5 text-left bg-zinc-950 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group opacity-90 hover:opacity-100"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[11px] font-bold text-zinc-200 font-tech uppercase tracking-wide group-hover:text-[#E5D1B0]">{cli.name}</span>
                    <span className="text-[8px] bg-zinc-900 border border-white/5 text-[#C5A059] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Briefcase className="w-2 h-2" /> Cliente
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">E-mail: <span className="text-zinc-300 font-mono">{cli.email}</span> | Senha: <span className="text-zinc-200 font-mono font-bold">{cli.password || "caro2026"}</span></p>
                  <p className="text-[9px] text-[#C5A059] italic mt-0.5 leading-none">{cli.tagline}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer credit */}
      <footer className="text-center text-[10px] text-zinc-600 font-tech uppercase tracking-wider select-none">
        CARO TECH ATELIER • SEGURANÇA E ALTA COSTURA DIGITAL • 2026
      </footer>
    </div>
  );
}
