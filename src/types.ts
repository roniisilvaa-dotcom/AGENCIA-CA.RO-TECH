export interface Project {
  id: string;
  name: string;
  goal: string;
  owner: string;
  startDate: string;
  endDate: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Briefing" | "Planejamento" | "Criação" | "Design" | "Revisão" | "Aprovação" | "Programação" | "Publicação";
  progress: number;
  lastUpdate: string;
  comments: Comment[];
  assets: string[];
}

export interface Comment {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  agenda: string;
  decisions: string[];
  nextActions: {
    acao: string;
    responsavel: string;
    prazo: string;
  }[];
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: "Arte" | "Vídeo" | "Campanha" | "Material Comercial";
  thumbnail: string;
  description: string;
  status: "Pendente" | "Aprovado" | "Ajustes Solicitados";
  feedback?: string[];
}

export interface Publication {
  id: string;
  date: string;
  channel: "Instagram" | "LinkedIn" | "Youtube" | "Website" | "Mídia Corporativa";
  title: string;
  link?: string;
  fileUrl?: string;
  owner: string;
}

export interface PendingItem {
  id: string;
  title: string;
  deadline: string;
  description: string;
  type: "Aprovação" | "Informação" | "Material" | "Decisão";
}

export interface ResultMetrics {
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  leads: number;
  opportunities: number;
}
