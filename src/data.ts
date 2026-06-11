import { Project, Meeting, ApprovalItem, Publication, PendingItem, ResultMetrics, Client } from "./types";

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "Mundi TKR",
    email: "mundi@tkr.com",
    password: "mundi2026",
    tagline: "Design Estratégico & Engenharia de Alta Performance",
    welcomeMessage: "Sua mesa executiva integrada com o CA.RO TECH, de Barueri à elite internacional.",
    reachMultiplier: 1.0,
    cnpj: "12.345.678/0001-99",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200",
    website: "https://munditkr.com",
    instagram: "@mundi.tkr",
    linkedin: "mundi-tkr-sports",
    address: "Rua das Pistas, 100 - Interlagos, São Paulo",
    status: "Ativo"
  },
  {
    id: "cli-2",
    name: "Kagiva Sports",
    email: "dadoskagiva@gmail.com",
    password: "dadoskagiva",
    tagline: "Sensibilidade, Design & Tecnologia Estética em Artigos Esportivos",
    welcomeMessage: "Conectado diretamente à célula criativa da CA.RO TECH.",
    reachMultiplier: 1.45,
    cnpj: "98.765.432/0001-11",
    logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200",
    website: "https://kagivasports.com.br",
    instagram: "@kagiva.sports",
    linkedin: "kagiva-sports",
    address: "Avenida do Esporte, 450 - Barueri, São Paulo",
    status: "Ativo"
  },
  {
    id: "cli-3",
    name: "AeroVelo Dynamics",
    email: "aerovelo@elite.com",
    password: "aerovelo2026",
    tagline: "Aerodinâmica Fina & Design Fibra de Carbono Estrutural",
    welcomeMessage: "Visão executiva das frentes de engenharia em tempo real.",
    reachMultiplier: 1.15,
    cnpj: "55.444.333/0001-22",
    logoUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=200",
    website: "https://aerovelodynamics.com",
    instagram: "@aerovelo.dynamics",
    linkedin: "aerovelo-dynamics",
    address: "Aeródromo das Asas, Hangar 3 - Jundiaí, São Paulo",
    status: "Ativo"
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Campanha Premium Mundi Racing Series",
    goal: "Apresentar a nova linha esportiva utilizando estética cinematográfica, focando no público das pistas e clubes de elite.",
    owner: "Diretoria (CA.RO TECH)",
    startDate: "2026-06-01",
    endDate: "2026-06-25",
    priority: "Alta",
    status: "Design",
    progress: 65,
    lastUpdate: "Ajustes de cores e luzes finalizados no Lightroom seguindo a identidade carotech.com.",
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
        author: "Equipe CA.RO TECH",
        role: "Direção Criativa",
        text: "Obrigada! Estamos agora aplicando a paleta champagne-obsidian nos banners finais da campanha.",
        date: "2026-06-05"
      }
    ],
    assets: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800"
    ],
    clientEmail: "mundi@tkr.com"
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
    ],
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "proj-3",
    name: "Editorial TKR Barueri Tendências",
    goal: "Lançamento oficial da integração física do CA.RO TECH em Barueri - SP, conectando fornecedores e tendências do mercado de altíssimo padrão brasileiro.",
    owner: "Diretoria (CA.RO TECH)",
    startDate: "2026-05-20",
    endDate: "2026-06-15",
    priority: "Média",
    status: "Aprovação",
    progress: 90,
    lastUpdate: "Seleção final de fotos enviada para aprovação do conselho operacional.",
    comments: [],
    assets: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    ],
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "proj-k1",
    name: "Branding Visual Kagiva Pro Line - Novas Embalagens",
    goal: "Redefinir a linguagem artística das embalagens profissionais Kagiva Sports de alta performance, utilizando cores refinadas e acabamento fosco com hot-stamping dourado.",
    owner: "Design (CA.RO TECH)",
    startDate: "2026-06-02",
    endDate: "2026-06-28",
    priority: "Alta",
    status: "Criação",
    progress: 45,
    lastUpdate: "Definida a paleta prata-platina com detalhes em verniz localizado. Protótipos em fase de renderização de luz.",
    comments: [],
    assets: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800"
    ],
    clientEmail: "dadoskagiva@gmail.com"
  },
  {
    id: "proj-k2",
    name: "Ensaio Fotográfico Conceito 'Kagiva Move 2026'",
    goal: "Capturar o dinamismo e a elegância dos materiais Kagiva sob a ótica luxuosa do CA.RO TECH em estúdio fechado com iluminação de alto contraste alemão.",
    owner: "Design (CA.RO TECH)",
    startDate: "2026-06-04",
    endDate: "2026-06-30",
    priority: "Média",
    status: "Design",
    progress: 60,
    lastUpdate: "Seleção de lentes concluída. Primeiro lote de fotos em edição cromática.",
    comments: [
      {
        id: "c-k1",
        author: "Diretoria Kagiva",
        role: "Cliente",
        text: "Queremos uma pegada bem moderna, que mostre a flexibilidade e a sofisticação da costura.",
        date: "2026-06-06"
      }
    ],
    assets: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800"
    ],
    clientEmail: "dadoskagiva@gmail.com"
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    date: "2026-06-02",
    title: "Kickoff e Integração: Transparência Ativa Mundi TKR",
    attendees: ["Diretoria (CA.RO TECH)", "Julio M. (CA.RO TECH)", "Diretor Comercial (Mundi)", "Marketing Mundi"],
    agenda: "Apresentar a nova mecânica de trabalho em Barueri; estabelecer a rotina de reuniões semanais de progresso e definir o uso do portal executivo.",
    decisions: [
      "Rotina fixa estabelecida: Reuniões de Produto e Marketing todas as terças e quintas-feiras.",
      "Lançamento do Portal de Gestão no ar para acompanhamento sem atrasos e com auditoria visual."
    ],
    nextActions: [
      {
        acao: "Disponibilizar os primeiros renders 3D do chassi",
        responsavel: "Julio M. (CA.RO TECH)",
        prazo: "2026-06-08"
      },
      {
        acao: "Aprovar diretrizes visuais da nova campanha",
        responsavel: "Marketing Mundi",
        prazo: "2026-06-10"
      }
    ],
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "meet-k1",
    date: "2026-06-05",
    title: "Briefing de Posicionamento Estético Kagiva Sports",
    attendees: ["Diretoria (CA.RO TECH)", "Equipe Criativa (CA.RO TECH)", "Equipe Marketing Kagiva"],
    agenda: "Alinhar o cronograma de entregas virtuais (posts & legendas) e estabelecer a esteira de aprovação síncrona no Portal.",
    decisions: [
      "Disponibilização imediata do módulo 'Post & Legenda' para aprovação em tempo real.",
      "Garantia de comunicação com a I.A Oracle exclusiva 'CA.RO - KAGIVA SPORTS'."
    ],
    nextActions: [
      {
        acao: "Finalizar primeiro ensaio piloto no estúdio",
        responsavel: "Equipe Criativa (CA.RO TECH)",
        prazo: "2026-06-10"
      },
      {
        acao: "Subir os primeiros posts com legendas refinadas para a diretoria Kagiva",
        responsavel: "Diretoria (CA.RO TECH)",
        prazo: "2026-06-08"
      }
    ],
    clientEmail: "dadoskagiva@gmail.com"
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
    feedback: [],
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "appr-k1",
    title: "Design de Coleção Gold Edition Kagiva 2026",
    type: "Post & Legenda",
    thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800",
    description: "Post conceitual para feed do Instagram destacando os materiais premium Kagiva em uma ambientação luxuosa com tonalidades de champanhe.",
    captionText: "🏆 Onde a alta tecnologia encontra o requinte esportivo. Apresentamos a prévia da linha Gold Edition: materiais selecionados por engenheiros e estilistas em uma simbiose perfeita de flexibilidade e status. #KagivaGold #HighPerformance #TecnologiaEstetica",
    status: "Pendente",
    feedback: [],
    clientEmail: "dadoskagiva@gmail.com"
  },
  {
    id: "appr-k2",
    title: "Teaser Dinâmico Estúdio - Kagiva Move",
    type: "Vídeo",
    thumbnail: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    description: "Filme conceitual registrando o impacto e a elasticidade do tecido tecnológico premium sob iluminação sutil de estúdio.",
    status: "Pendente",
    feedback: [],
    clientEmail: "dadoskagiva@gmail.com"
  },
  {
    id: "appr-3",
    title: "Folder de Vendas Corporativo - Versão Munique / São Paulo",
    type: "Material Comercial",
    thumbnail: "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?auto=format&fit=crop&q=80&w=800",
    description: "Catálogo impresso de luxo em papel Couché Velvet 300g para apresentação da tecnologia Mundi a patrocinadores e investidores.",
    status: "Aprovado",
    feedback: ["Excelente! Fonte sofisticada, margens amplas que refletem luxo e tecnologia de forma majestosa."],
    clientEmail: "mundi@tkr.com"
  }
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: "pub-1",
    date: "2026-05-28",
    channel: "LinkedIn",
    title: "Nova Era de Design Técnico: CA.RO ATELIER e a Inovação em Alphaville",
    link: "https://linkedin.com",
    owner: "Julio M. (CA.RO ATELIER)",
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "pub-2",
    date: "2026-06-03",
    channel: "Instagram",
    title: "Série Elegância Dinâmica: Ensaio Autoral Mundi TKR",
    link: "https://instagram.com",
    owner: "Design (CA.RO TECH)",
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "pub-k1",
    date: "2026-06-06",
    channel: "Instagram",
    title: "Lançamento Prévia: Detalhes da Linha Kagiva Premium",
    link: "https://instagram.com",
    owner: "Design (CA.RO TECH)",
    clientEmail: "dadoskagiva@gmail.com"
  }
];

export const INITIAL_PENDINGS: PendingItem[] = [
  {
    id: "pend-1",
    title: "Aprovação do Storyboard do Teaser Oficial",
    deadline: "2026-06-09",
    description: "A equipe precisa do aval criativo final para iniciar a pós-produção cromática.",
    type: "Aprovação",
    clientEmail: "mundi@tkr.com"
  },
  {
    id: "pend-k1",
    title: "Fornecer Cores Oficiais e Logos em Vetor",
    deadline: "2026-06-11",
    description: "Diretoria Kagiva precisa encaminhar a pasta com o guide de cores de fabricação para o estúdio.",
    type: "Material",
    clientEmail: "dadoskagiva@gmail.com"
  }
];

export const INITIAL_METRICS: ResultMetrics = {
  reach: 124000,
  impressions: 489000,
  engagement: 10200,
  clicks: 5800,
  leads: 990,
  opportunities: 74
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
