import { pgTable, text, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  tagline: text('tagline'),
  welcomeMessage: text('welcome_message'),
  reachMultiplier: integer('reach_multiplier').default(1),
  cnpj: text('cnpj'),
  logoUrl: text('logo_url'),
  website: text('website'),
  instagram: text('instagram'),
  linkedin: text('linkedin'),
  address: text('address'),
  status: text('status').default('Ativo'),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  goal: text('goal'),
  owner: text('owner'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  priority: text('priority'),
  status: text('status'),
  progress: integer('progress').default(0),
  lastUpdate: text('last_update'),
  comments: jsonb('comments').default([]),
  assets: jsonb('assets').default([]),
  clientEmail: text('client_email'),
});

export const meetings = pgTable('meetings', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  title: text('title').notNull(),
  attendees: jsonb('attendees').default([]),
  agenda: text('agenda'),
  decisions: jsonb('decisions').default([]),
  nextActions: jsonb('next_actions').default([]),
  clientEmail: text('client_email'),
});

export const approvals = pgTable('approvals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type'),
  thumbnail: text('thumbnail'),
  description: text('description'),
  captionText: text('caption_text'),
  driveLink: text('drive_link'),
  status: text('status').default('Pendente'),
  feedback: jsonb('feedback').default([]),
  clientEmail: text('client_email'),
});

export const clientMessages = pgTable('client_messages', {
  id: text('id').primaryKey(),
  clientEmail: text('client_email').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(),
  text: text('text').notNull(),
  timestamp: text('timestamp').notNull(),
});

export const publications = pgTable('publications', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  channel: text('channel'),
  title: text('title').notNull(),
  link: text('link'),
  fileUrl: text('file_url'),
  owner: text('owner'),
  clientEmail: text('client_email'),
});

export const pendings = pgTable('pendings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  deadline: text('deadline'),
  description: text('description'),
  type: text('type'),
  clientEmail: text('client_email'),
});

export const reports = pgTable('reports', {
  id: text('id').primaryKey(),
  clientEmail: text('client_email').notNull(),
  month: text('month'),
  year: text('year'),
  title: text('title').notNull(),
  rawContentText: text('raw_content_text'),
  imageUrl: text('image_url'),
  aiAnalysis: text('ai_analysis'),
  reach: integer('reach').default(0),
  impressions: integer('impressions').default(0),
  engagement: integer('engagement').default(0),
  clicks: integer('clicks').default(0),
});
