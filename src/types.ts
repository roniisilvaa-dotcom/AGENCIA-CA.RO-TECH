export interface Client {
  id: string;
  name: string;
  email: string;
  password?: string;
  accessToken?: string;
  tagline: string;
  welcomeMessage?: string;
  reachMultiplier: number;
  cnpj?: string;
  logoUrl?: string;
  website?: string;
  instagram?: string;
  linkedin?: string;
  address?: string;
  status?: "Ativo" | "Inativo" | "Suspenso";
}

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
  clientEmail?: string;
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
  clientEmail?: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  type: "Arte" | "Vídeo" | "Campanha" | "Material Comercial" | "Post & Legenda";
  thumbnail: string;
  description: string;
  captionText?: string; // Legenda do post para aprovação em tempo real
  driveLink?: string; // Link direto do Google Drive com arquivos originais de posts e vídeos
  status: "Pendente" | "Aprovado" | "Ajustes Solicitados";
  feedback?: string[];
  clientEmail?: string;
}

export interface ClientMessage {
  id: string;
  clientEmail: string;
  senderName: string;
  senderRole: "agency" | "client";
  text: string;
  timestamp: string;
}

export interface Publication {
  id: string;
  date: string;
  channel: "Instagram" | "LinkedIn" | "Youtube" | "Website" | "Mídia Corporativa";
  title: string;
  link?: string;
  fileUrl?: string;
  owner: string;
  clientEmail?: string;
}

export interface PendingItem {
  id: string;
  title: string;
  deadline: string;
  description: string;
  type: "Aprovação" | "Informação" | "Material" | "Decisão";
  clientEmail?: string;
}

export interface ResultMetrics {
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  leads: number;
  opportunities: number;
}

export interface ClientReport {
  id: string;
  clientEmail: string;
  month: string;
  year: string;
  title: string;
  rawContentText: string;
  imageUrl?: string;
  aiAnalysis: string;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
}
