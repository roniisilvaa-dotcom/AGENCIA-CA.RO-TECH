import { Project, Meeting, ApprovalItem, Publication, PendingItem, ResultMetrics } from "./types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Campanha Premium Mundi Racing Series",
    goal: "Apresentar a nova linha esportiva utilizando estética cinematográfica europeia, focando no público das pistas e clubes de elite.",
    owner: "Carol (CA.RO TECH)",
    startDate: "2026-06-01",
    endDate: "2026-06-25",
    priority: "Alta",
    status: "Design",
    progress: 65,
    lastUpdate: "Ajustes de cores e luzes finalizados no Lightroom seguindo a identidade caroimage.com.",
    comments: [
      {
        id: "c-1",
        author: "Mundi TKR Diretoria",
        role: "Cliente",
        text: "Gostamos muito do contraste do primeiro teaser. O refinamento técnico está notável.",
        date: "2026-06-04"
      },
      {
        id: "c-2",
        author: "Carol (CA.RO)",
        role: "Diretora Criativa",
        text: "Obrigada! Estamos agora aplicando a paleta champagne-obsidian nos banners finais da campanha.",
        date: "2026-06-05"
      }
    ],
    assets: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "proj-2",
    name: "Conceito & Render 3D do Chassi Aliviado TKR",
    goal: "Projeto técnico-visual ilustrando a engenharia sofisticada alemã do produto, aproximando o cliente do chão de fábrica e a engenharia de precisão.",
    owner: "Julio M. (CA.RO TECH)",
    startDate: "2026-06-05",
    endDate: "2026-07-10",
    priority: "Alta",
    status: "Criação",
    progress: 40,
    lastUpdate: "Modelo CAD exportado e iluminado no estúdio 3D. Próximo passo é render de materiais compósitos.",
    comments: [
      {
        id: "c-3",
        author: "Engenharia Mundi",
        role: "Cliente",
        text: "Por favor garantir a visibilidade das fibras de carbono nas travessas estruturais do chassi.",
        date: "2026-06-06"
      }
    ],
    assets: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "proj-3",
    name: "Editorial TKR Alphaville Tendências",
    goal: "Lançamento oficial da integração física da CA.RO TECH em Alphaville - SP, conectando fornecedores e tendências do mercado de altíssimo padrão brasileiro.",
    owner: "Carol (CA.RO TECH)",
    startDate: "2026-05-20",
    endDate: "2026-06-15",
    priority: "Média",
    status: "Aprovação",
    progress: 90,
    lastUpdate: "Seleção final de fotos enviada para aprovação do conselho operacional.",
    comments: [],
    assets: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "proj-4",
    name: "Produção de Conteúdo: Os Bastidores de Performance",
    goal: "Registrar o processo de desenvolvimento, do corte de chapas à soldagem robótica, trazendo transparência para o pipeline premium.",
    owner: "Lucas H. (CA.RO TECH)",
    startDate: "2026-06-10",
    endDate: "2026-07-20",
    priority: "Baixa",
    status: "Briefing",
    progress: 15,
    lastUpdate: "Briefing e fluxos de gravação aprovados. Agendando visitas ao chão de fábrica.",
    comments: [],
    assets: [
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    date: "2026-06-02",
    title: "Kickoff e Integração: Transparência Ativa Mundi TKR",
    attendees: ["Carol (CA.RO)", "Julio M. (CA.RO)", "Diretor Comercial (Mundi)", "Marketing Mundi"],
    agenda: "Apresentar a nova mecânica de trabalho em Alphaville; estabelecer a rotina de reuniões semanais de progresso e definir o uso do portal executivo.",
    decisions: [
      "Rotina fixa estabelecida: Reuniões de Produto e Marketing todas as terças e quintas-feiras.",
      "Lançamento do Portal de Gestão no ar para acompanhamento sem atrasos e com auditoria visual."
    ],
    nextActions: [
      {
        acao: "Disponibilizar os primeiros renders 3D do chassi",
        responsavel: "Julio M. (CA.RO)",
        prazo: "2026-06-08"
      },
      {
        acao: "Aprovar diretrizes visuais da nova campanha",
        responsavel: "Marketing Mundi",
        prazo: "2026-06-10"
      }
    ]
  },
  {
    id: "meet-2",
    date: "2026-06-06",
    title: "Alinhamento Editorial: Linhas de Costura e Premium Branding",
    attendees: ["Carol (CA.RO)", "Lucas H. (CA.RO)", "Diretora de Estilo (Mundi)"],
    agenda: "Definir abordagens cromáticas para as fotos macro das roupas esportivas e materiais compósitos inovadores.",
    decisions: [
      "Utilizar iluminação nobre, alto contraste europeu (claro-escuro) e desfoque profundo para valorizar os texturizados nobres do produto."
    ],
    nextActions: [
      {
        acao: "Enviar referências de iluminação europeia da caroimage.com",
        responsavel: "Carol (CA.RO)",
        prazo: "2026-06-07"
      }
    ]
  }
];

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: "appr-1",
    title: "Concept Render - Chassi de Titânio Forjado TKR-9X",
    type: "Arte",
    thumbnail: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=800",
    description: "Render técnico de alta resolução simulando o acabamento jateado e os filetes dourados estruturais do novo produto premium da marca Mundi.",
    status: "Pendente",
    feedback: []
  },
  {
    id: "appr-2",
    title: "Teaser Oficial de Lançamento Premium (30s)",
    type: "Vídeo",
    thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    description: "Vídeo conceitual com cortes rápidos em câmera de altíssimo framerate (1000fps) registrando a aceleração e o artesanato técnico.",
    status: "Pendente",
    feedback: []
  },
  {
    id: "appr-3",
    title: "Folder de Vendas Corporativo - Versão Munique / São Paulo",
    type: "Material Comercial",
    thumbnail: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&q=80&w=800",
    description: "Catálogo impresso de luxo em papel Couché Velvet 300g para apresentação da tecnologia Mundi a patrocinadores e investidores.",
    status: "Aprovado",
    feedback: ["Excelente! Fonte sofisticada, margens amplas que refletem luxo e tecnologia de forma majestosa."]
  }
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    date: "2026-05-28",
    channel: "LinkedIn",
    title: "Nova Era de Design Técnico: CA.RO TECH e a Inovação em Alphaville",
    link: "https://linkedin.com",
    owner: "Julio M. (CA.RO)"
  },
  {
    id: "pub-2",
    date: "2026-06-03",
    channel: "Instagram",
    title: "Série Elegância Dinâmica: Ensaio Autoral Mundi TKR",
    link: "https://instagram.com",
    owner: "Carol (CA.RO)"
  },
  {
    id: "pub-3",
    date: "2026-06-05",
    channel: "Mídia Corporativa",
    title: "Press Release: Parceria e Lançamento de Modelagem Sob Demanda",
    link: "https://caroimage.com",
    owner: "Assessoria CA.RO"
  }
];

export const INITIAL_PENDINGS: PendingItem[] = [
  {
    id: "pend-1",
    title: "Aprovação do Storyboard do Teaser Oficial",
    deadline: "2026-06-09",
    description: "A equipe precisa do aval criativo final para iniciar a pós-produção cromática.",
    type: "Aprovação"
  },
  {
    id: "pend-2",
    title: "Enviar Fotos em Alta Definição da Linha Esportiva antiga",
    deadline: "2026-06-12",
    description: "Mund TKR precisa disponibilizar o material de referência histórica para a equipe de criação.",
    type: "Material"
  },
  {
    id: "pend-3",
    title: "Validação do Orçamento do Fotógrafo Adicional de Campanha",
    deadline: "2026-06-10",
    description: "Necessária resposta da diretoria para fechar contratação do assistente especializado do estúdio de Munique.",
    type: "Decisão"
  }
];

export const INITIAL_METRICS: ResultMetrics = {
  reach: 145900,
  impressions: 512000,
  engagement: 11400,
  clicks: 6830,
  leads: 1250,
  opportunities: 84
};

// Help helper for initial state setup in localStorage to manage data seamlessly and permit edits.
export function getSavedOrCreate<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  const sav = localStorage.getItem(key);
  if (sav) {
    try {
      return JSON.parse(sav) as T;
    } catch (e) {
      return initial;
    }
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

export function saveState<T>(key: string, data: T): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
