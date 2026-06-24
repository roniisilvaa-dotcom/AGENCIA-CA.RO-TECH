import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Se não houver string de conexão, evita que o app quebre durante a compilação inicial
const databaseUrl = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@ep-placeholder.neon.tech/placeholder?sslmode=require';

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
