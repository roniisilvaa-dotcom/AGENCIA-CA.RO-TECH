import React from 'react';
import { Settings, QrCode, AlertTriangle } from 'lucide-react';

export default function SettingsTab() {
  const handleResetSystem = () => {
    if (confirm("Aviso supremo: Deseja realmente ZERAR e limpar todo o banco de dados local do sistema? Isso apagará todos os clientes, projetos, pendências e mensagens cadastrados.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const appUrl = window.location.origin;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <div className="p-2 bg-[#C5A059]/10 rounded-lg">
          <Settings className="w-6 h-6 text-[#C5A059]" />
        </div>
        <div>
          <h2 className="font-serif text-2xl text-white font-medium">Configurações do Sistema</h2>
          <p className="text-[11px] text-zinc-400 font-tech uppercase tracking-wider mt-1">
            Administração, Acessos e Manutenção de Dados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="luxury-card p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all bg-zinc-950/80 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <QrCode className="w-5 h-5 text-emerald-500" />
            <h3 className="font-serif text-lg text-white">Acesso Universal (QR Code)</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Apresente este QR Code para qualquer cliente. Ao ler com a câmera do celular, eles serão direcionados diretamente para a tela inicial do aplicativo para fazerem o login.
          </p>
          <div className="flex justify-center pt-4">
            <div className="bg-white p-3 rounded-2xl border-4 border-[#C5A059] shadow-2xl shadow-[#C5A059]/10">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`} 
                alt="QR Code de Acesso" 
                className="w-48 h-48" 
              />
            </div>
          </div>
          <div className="text-center text-[10px] text-zinc-500 font-mono mt-2 break-all">
            Link: {appUrl}
          </div>
        </div>

        <div className="luxury-card p-6 rounded-2xl border border-rose-500/10 bg-zinc-950/80 space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg text-rose-100">Zerar o Sistema</h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Utilize a opção abaixo para restaurar o sistema ao estado inicial (de fábrica). Esta ação é irreversível e apagará todos os cadastros, deixando o sistema totalmente limpo e pronto para uso.
          </p>
          
          <button
            onClick={handleResetSystem}
            className="w-full mt-4 py-3 bg-rose-600/20 border border-rose-500/30 hover:bg-rose-500/30 hover:scale-[1.02] text-rose-400 font-bold select-none text-[11px] font-tech uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4" /> ZERAR SISTEMA INTEIRO
          </button>
        </div>
      </div>
    </div>
  );
}
