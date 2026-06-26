import React, { useState } from "react";
import { Client } from "../types";
import { 
  Building2, 
  UserPlus, 
  Edit, 
  Trash2, 
  Check, 
  Shield, 
  Search, 
  Globe, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Clock,
  Briefcase,
  QrCode,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClientsTabProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onUpdateClient: (client: Client) => void;
}

export default function ClientsTab({
  clients,
  onAddClient,
  onDeleteClient,
  onUpdateClient
}: ClientsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showQrFor, setShowQrFor] = useState<string | null>(null);

  // Registration form states
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");
  const [newClientTagline, setNewClientTagline] = useState("");
  const [newClientCnpj, setNewClientCnpj] = useState("");
  const [newClientLogoUrl, setNewClientLogoUrl] = useState("");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [newClientInstagram, setNewClientInstagram] = useState("");
  const [newClientLinkedin, setNewClientLinkedin] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientStatus, setNewClientStatus] = useState<"Ativo" | "Inativo" | "Suspenso">("Ativo");
  const [clientRegSuccess, setClientRegSuccess] = useState<string | null>(null);

  // Edit form states
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editClientName, setEditClientName] = useState("");
  const [editClientPassword, setEditClientPassword] = useState("");
  const [editClientTagline, setEditClientTagline] = useState("");
  const [editClientCnpj, setEditClientCnpj] = useState("");
  const [editClientLogoUrl, setEditClientLogoUrl] = useState("");
  const [editClientWebsite, setEditClientWebsite] = useState("");
  const [editClientInstagram, setEditClientInstagram] = useState("");
  const [editClientLinkedin, setEditClientLinkedin] = useState("");
  const [editClientAddress, setEditClientAddress] = useState("");
  const [editClientStatus, setEditClientStatus] = useState<"Ativo" | "Inativo" | "Suspenso">("Ativo");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) {
      alert("Nome e e-mail de login são obrigatórios.");
      return;
    }

    if (clients.some(c => c.email.toLowerCase() === newClientEmail.toLowerCase())) {
      alert("Já existe um cliente cadastrado com este e-mail.");
      return;
    }

    // Generate token in the pattern requested (e.g., CARO-CLI-XPTO-RANDOM)
    const cleanName = newClientName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9]/g, "")    // Remove symbols
      .toUpperCase()
      .substring(0, 5);
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedToken = `CARO-CLI-${cleanName}-${randSuffix}`;

    const newCli: Client = {
      id: `cli-${Date.now()}`,
      name: newClientName,
      email: newClientEmail,
      accessToken: generatedToken,
      tagline: newClientTagline || "Parceiro CA.RO TECH",
      welcomeMessage: "Bem-vindo ao seu painel digital síncrono.",
      reachMultiplier: 1.0,
      cnpj: newClientCnpj,
      logoUrl: newClientLogoUrl,
      website: newClientWebsite,
      instagram: newClientInstagram,
      linkedin: newClientLinkedin,
      address: newClientAddress,
      status: newClientStatus
    };

    onAddClient(newCli);
    setClientRegSuccess(`Cliente "${newClientName}" cadastrado com sucesso! Token de Acesso gerado: ${newCli.accessToken}`);
    
    // Clear registration fields
    setNewClientName("");
    setNewClientEmail("");
    setNewClientPassword("");
    setNewClientTagline("");
    setNewClientCnpj("");
    setNewClientLogoUrl("");
    setNewClientWebsite("");
    setNewClientInstagram("");
    setNewClientLinkedin("");
    setNewClientAddress("");
    setNewClientStatus("Ativo");

    setTimeout(() => setClientRegSuccess(null), 10000);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const updatedCli: Client = {
      ...editingClient,
      name: editClientName,
      tagline: editClientTagline,
      cnpj: editClientCnpj,
      logoUrl: editClientLogoUrl,
      website: editClientWebsite,
      instagram: editClientInstagram,
      linkedin: editClientLinkedin,
      address: editClientAddress,
      status: editClientStatus,
      accessToken: editClientPassword || editingClient.accessToken // Re-use editClientPassword state variable to hold/edit the token
    };

    onUpdateClient(updatedCli);
    setEditingClient(null);
  };

  const toggleClientStatus = (client: Client) => {
    const nextStatus = client.status === "Ativo" ? "Inativo" : "Ativo";
    onUpdateClient({
      ...client,
      status: nextStatus
    });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.cnpj?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-white font-medium flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#C5A059]" />
            Gestão Estratégica de Clientes
          </h2>
          <p className="text-[11px] text-zinc-400 font-tech uppercase tracking-wider mt-1">
            Espaços Dinâmicos, Credenciais de Acesso e Configuração de Contas
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/40 focus:border-[#C5A059] rounded-xl text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Grid: Management Forms and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Form (Create or Edit) */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {editingClient ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="luxury-card p-6 rounded-2xl border border-amber-500/20 bg-zinc-950/80 space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500 uppercase font-tech tracking-wider">
                      Editar Cadastro do Cliente
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingClient(null)}
                    className="text-[10px] font-tech uppercase text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900 border border-white/5 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-3.5 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        required
                        value={editClientName}
                        onChange={(e) => setEditClientName(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">CNPJ da Empresa</label>
                      <input
                        type="text"
                        placeholder="Ex: 98.765.432/0001-11"
                        value={editClientCnpj}
                        onChange={(e) => setEditClientCnpj(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase tracking-widest font-tech mb-1">E-mail (Não editável)</label>
                      <input
                        type="email"
                        disabled
                        value={editingClient.email}
                        className="w-full text-xs bg-zinc-950 border border-white/5 opacity-55 rounded-lg p-2.5 text-zinc-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Token de Acesso</label>
                      <input
                        type="text"
                        value={editClientPassword}
                        onChange={(e) => setEditClientPassword(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Slogan de Luxo</label>
                      <input
                        type="text"
                        value={editClientTagline}
                        onChange={(e) => setEditClientTagline(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">URL da Logomarca</label>
                      <input
                        type="text"
                        value={editClientLogoUrl}
                        onChange={(e) => setEditClientLogoUrl(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Website URL</label>
                      <input
                        type="url"
                        value={editClientWebsite}
                        onChange={(e) => setEditClientWebsite(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Status Operacional</label>
                      <select
                        value={editClientStatus}
                        onChange={(e) => setEditClientStatus(e.target.value as "Ativo" | "Inativo" | "Suspenso")}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all cursor-pointer"
                      >
                        <option value="Ativo">🟢 Ativo</option>
                        <option value="Inativo">🟡 Inativo</option>
                        <option value="Suspenso">🔴 Suspenso</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Instagram (@usuario)</label>
                      <input
                        type="text"
                        value={editClientInstagram}
                        onChange={(e) => setEditClientInstagram(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">LinkedIn (Username)</label>
                      <input
                        type="text"
                        value={editClientLinkedin}
                        onChange={(e) => setEditClientLinkedin(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Endereço Físico</label>
                    <input
                      type="text"
                      value={editClientAddress}
                      onChange={(e) => setEditClientAddress(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold select-none text-[10px] font-tech uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Salvar Alterações
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="luxury-card p-6 rounded-2xl border border-white/[0.03] bg-zinc-950/80 space-y-4"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <span className="p-1 bg-[#C5A059]/15 rounded text-[#C5A059]">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-[#E5D1B0] uppercase font-tech tracking-wider">
                    Cadastrar Novo Cliente
                  </span>
                </div>

                {clientRegSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px]">{clientRegSuccess}</p>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Nome da Empresa</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Mundi TKR"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">CNPJ da Empresa</label>
                      <input
                        type="text"
                        placeholder="Ex: 12.345.678/0001-99"
                        value={newClientCnpj}
                        onChange={(e) => setNewClientCnpj(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">E-mail de Login</label>
                    <input
                      type="email"
                      required
                      placeholder="cliente@exemplo.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Slogan / Tagline</label>
                      <input
                        type="text"
                        placeholder="Ex: Design Estrutural de Performance"
                        value={newClientTagline}
                        onChange={(e) => setNewClientTagline(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">URL da Logomarca (URL)</label>
                      <input
                        type="text"
                        placeholder="Ex: https://..."
                        value={newClientLogoUrl}
                        onChange={(e) => setNewClientLogoUrl(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Website URL</label>
                      <input
                        type="url"
                        placeholder="Ex: https://exemplo.com"
                        value={newClientWebsite}
                        onChange={(e) => setNewClientWebsite(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Status Operacional</label>
                      <select
                        value={newClientStatus}
                        onChange={(e) => setNewClientStatus(e.target.value as "Ativo" | "Inativo" | "Suspenso")}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all cursor-pointer font-bold"
                      >
                        <option value="Ativo">🟢 Ativo</option>
                        <option value="Inativo">🟡 Inativo</option>
                        <option value="Suspenso">🔴 Suspenso</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Instagram (@usuario)</label>
                      <input
                        type="text"
                        placeholder="Ex: @empresa"
                        value={newClientInstagram}
                        onChange={(e) => setNewClientInstagram(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">LinkedIn (Username)</label>
                      <input
                        type="text"
                        placeholder="Ex: company/nome-empresa"
                        value={newClientLinkedin}
                        onChange={(e) => setNewClientLinkedin(e.target.value)}
                        className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-400 uppercase tracking-widest font-tech font-bold mb-1">Endereço Comercial</label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Paulista, 1000 - Bela Vista, SP"
                      value={newClientAddress}
                      onChange={(e) => setNewClientAddress(e.target.value)}
                      className="w-full text-xs bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-white focus:border-[#C5A059] outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C5A059] hover:bg-[#E5D1B0] hover:scale-[1.01] text-zinc-950 font-bold uppercase tracking-wider font-tech text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg mt-4"
                  >
                    Salvar e Registrar Cliente <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Active Clients List */}
        <div className="lg:col-span-7 luxury-card p-6 rounded-2xl border border-white/[0.03] bg-zinc-950/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-[#E5D1B0] uppercase font-tech tracking-wider">
              Clientes Ativos no Database ({filteredClients.length})
            </span>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              Nenhum cliente cadastrado no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredClients.map((cli) => {
                return (
                  <div 
                    key={cli.id}
                    className="luxury-card p-4 rounded-xl border border-white/5 hover:border-[#C5A059]/20 bg-zinc-900/40 relative space-y-3"
                  >
                    {/* Header: Logo and Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center p-1 overflow-hidden shrink-0">
                          {cli.logoUrl ? (
                            <img src={cli.logoUrl} alt={cli.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="w-5 h-5 text-zinc-650" />
                          )}
                        </div>
                        <div className="text-left">
                          <h4 className="font-serif text-sm text-white font-medium truncate max-w-[120px]">{cli.name}</h4>
                          <span className="text-[9px] text-zinc-500 truncate block max-w-[120px]">{cli.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => toggleClientStatus(cli)}
                          className={`text-[8px] px-2 py-0.5 rounded font-tech uppercase tracking-wider border font-bold cursor-pointer transition-all ${
                            cli.status === "Ativo"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : cli.status === "Suspenso"
                              ? "bg-rose-500/10 text-rose-450 border-rose-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                          title="Alternar Ativo/Inativo"
                        >
                          {cli.status || "Ativo"}
                        </button>
                      </div>
                    </div>

                    <div className="text-left space-y-1.5 pt-1">
                      <div className="text-[10px] text-zinc-400 italic">"{cli.tagline}"</div>
                      
                      {cli.cnpj && (
                        <div className="text-[9px] text-zinc-500 font-mono">
                          CNPJ: <strong className="text-zinc-300 font-semibold">{cli.cnpj}</strong>
                        </div>
                      )}
                      
                      {cli.address && (
                        <div className="text-[9px] text-zinc-500 flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-[#C5A059] shrink-0 mt-0.5" />
                          <span className="truncate">{cli.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Socials / Actions */}
                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {cli.website && (
                          <a href={cli.website} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white" title={cli.website}>
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {cli.instagram && (
                          <a href={`https://instagram.com/${cli.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white" title={cli.instagram}>
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {cli.linkedin && (
                          <a href={`https://linkedin.com/company/${cli.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-white/5 rounded text-zinc-400 hover:text-white" title={cli.linkedin}>
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {cli.accessToken && (
                          <span className="text-[8px] bg-zinc-900 border border-white/5 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                            Token: {cli.accessToken}
                          </span>
                        )}
                        
                        
                        <button
                          onClick={() => {
                            setEditingClient(cli);
                            setEditClientName(cli.name);
                            setEditClientTagline(cli.tagline);
                            setEditClientCnpj(cli.cnpj || "");
                            setEditClientLogoUrl(cli.logoUrl || "");
                            setEditClientWebsite(cli.website || "");
                            setEditClientInstagram(cli.instagram || "");
                            setEditClientLinkedin(cli.linkedin || "");
                            setEditClientAddress(cli.address || "");
                            setEditClientStatus(cli.status || "Ativo");
                            setEditClientPassword(cli.accessToken || "");
                          }}
                          className="text-amber-500 hover:text-amber-400 p-1.5 rounded hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja excluir o cliente "${cli.name}"?`)) {
                              onDeleteClient(cli.id);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-350 p-1.5 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* BIG QR CODE BUTTON */}
                    <div className="pt-2">
                      <button
                        onClick={() => setShowQrFor(showQrFor === cli.id ? null : cli.id)}
                        className="w-full py-2.5 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400 font-bold select-none text-[10px] font-tech uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" /> 
                        {showQrFor === cli.id ? "Esconder QR Code" : "Gerar QR Code de Acesso (Login)"}
                      </button>
                    </div>

                    {showQrFor === cli.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-white/5 pt-4 pb-2 flex flex-col items-center justify-center space-y-3"
                      >
                        <span className="text-[10px] text-[#C5A059] font-tech uppercase tracking-wider font-bold">Acesso Direto do Cliente</span>
                        <div className="bg-white p-2.5 rounded-xl border-2 border-[#C5A059]">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + "/?token=" + cli.accessToken)}`} 
                            alt="QR Code" 
                            className="w-32 h-32" 
                          />
                        </div>
                        <span className="text-[9px] text-zinc-400 font-mono text-center px-4 leading-relaxed">
                          Mostre este QR Code para o cliente ler com a câmera do celular.<br/>
                          O login será efetuado automaticamente pelo Token Seguro.
                        </span>
                      </motion.div>
                    )}
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
