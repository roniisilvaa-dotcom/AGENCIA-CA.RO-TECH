import React, { useState, useEffect } from "react";
import { 
  Lock, 
  ArrowRight, 
  Compass, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { Client } from "../types";
import { INITIAL_CLIENTS } from "../data";

interface LoginGateProps {
  onLogin: (role: "agency" | "client", name: string, email: string) => void;
}

export default function LoginGate({ onLogin }: LoginGateProps) {
  const [token, setToken] = useState("");
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

  // Safe and immediate auto-login check once URL token parameters and clients database are ready
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      const cleanToken = tokenParam.trim();
      setToken(cleanToken);
      if (cleanToken === "CARO-OWNER-0001-RONI") {
        onLogin("agency", "Agência CA.RO TECH", "agencia@carotech.com");
      } else {
        // Resolve immediately from localStorage to prevent sync delay blank pages
        let currentClients = clients;
        if (!currentClients || currentClients.length === 0) {
          try {
            const saved = localStorage.getItem("caro_clients");
            if (saved) currentClients = JSON.parse(saved);
          } catch {}
        }
        const matched = (currentClients || []).find(c => c.accessToken === cleanToken);
        if (matched) {
          onLogin("client", `Diretoria ${matched.name}`, matched.email);
        }
      }
    }
  }, [clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanToken = token.trim();

    // Check Master Token
    if (cleanToken === "CARO-OWNER-0001-RONI") {
      onLogin("agency", "Agência CA.RO TECH", "agencia@carotech.com");
      return;
    }

    // Check dynamic clients database for matching accessToken
    const matchedClient = clients.find(c => c.accessToken === cleanToken);
    if (matchedClient) {
      onLogin("client", `Diretoria ${matchedClient.name}`, matchedClient.email);
      return;
    }

    setError("Token de acesso inválido ou expirado.");
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
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#C5A059]" /> CA.RO TECH
          </motion.div>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl md:text-5xl text-white tracking-[0.25em]">
              CA.RO <span className="italic text-[#C5A059]">TECH</span>
            </h1>
            <p className="text-[10px] uppercase font-tech tracking-[0.25em] text-[#C5A059] font-medium">
              Tecnologia & Design Estratégico — Transparência Conectada
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
            Seja bem-vindo. Insira o seu Token de Acesso Síncrono para sincronizar atividades do pipeline tecnológico.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-400 uppercase tracking-widest font-tech mb-1.5">Token de Acesso Síncrono</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex: CARO-OWNER-..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full text-xs bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#C5A059] transition-all outline-none font-mono"
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
        </motion.div>
      </div>

      {/* Footer credit */}
      <footer className="text-center text-[10px] text-zinc-600 font-tech uppercase tracking-wider select-none">
        CA.RO TECH • TECNOLOGIA & DESIGN ESTRATÉGICO • 2026
      </footer>
    </div>
  );
}
