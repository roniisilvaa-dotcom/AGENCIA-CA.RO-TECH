import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crashes if key is omitted
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Generate premium strategic recommendations
app.post("/api/generate-recommendations", async (req, res) => {
  try {
    const { metrics, activeProjects } = req.body;
    
    const ai = getAi();
    
    const prompt = `Você é o Diretor Criativo e Tecnológico Principal da CA.RO TECH (agência boutique de luxo, tecnologia e design de matriz europeia baseada em Alphaville, integrada à identidade de luxo-fotográfico da caroimage.com).
Com base nestas métricas de performance do cliente Mundi TKR:
- Alcance: ${metrics?.reach || "N/A"}
- Impressões: ${metrics?.impressions || "N/A"}
- Engajamento: ${metrics?.engagement || "N/A"}
- Cliques: ${metrics?.clicks || "N/A"}
- Leads: ${metrics?.leads || "N/A"}
- Oportunidades: ${metrics?.opportunities || "N/A"}

E nestes projetos ativos de comunicação:
${(activeProjects || []).map((p: any) => `- ${p.name} (Status: ${p.status}, Progresso: ${p.progress}%)`).join("\n")}

Gere uma lista estruturada em formato JSON contendo exatamente:
1. "visaoGeral": Uma análise conceitual e elegante em 2 frases sobre a identidade atual da marca, com tom requintado e minimalista de luxo europeu.
2. "recomendacoes": Quatro recomendações táticas luxuosas e tecnológicas específicas para otimizar os resultados da Mundi TKR, unindo tecnologia de ponta e refinamento estilístico caroimage.com. Cada item deve ter um "titulo" curto e intelectual e uma "descricao" detalhada.

Forneça estritamente um JSON estruturado com essa especificação, sem códigos markdown extras ou introduções.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visaoGeral: { type: Type.STRING },
            recomendacoes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  descricao: { type: Type.STRING },
                },
                required: ["titulo", "descricao"],
              },
            },
          },
          required: ["visaoGeral", "recomendacoes"],
        },
      },
    });

    const resultText = response.text?.trim() || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Erro ao gerar recomendações:", error);
    res.status(500).json({
      error: error.message || "Erro desconhecido ao processar inteligência artificial.",
      mockRecommendations: [
        {
          titulo: "Sofisticação Conectada: Realidade Aumentada Editorial",
          descricao: "Desenvolver showroom tridimensional interativo na web, combinando fotos de alta densidade no padrão caroimage.com com modelagem técnica de alta performance.",
        },
        {
          titulo: "Inteligência Preditiva em Canais de Prestígio",
          descricao: "Ajustar veiculação focando no público das quadras de tênis privadas e clubes náuticos de São Paulo e Munique, onde a Mundi TKR possui aderência orgânica de altíssimo padrão.",
        }
      ]
    });
  }
});

// 3. Summarize raw meeting notes into structured luxurious details
app.post("/api/summarize-meeting", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: "Texto de reunião é obrigatório." });
    }

    const ai = getAi();
    const prompt = `Você é um assessor executivo sênior e sofisticado que documenta reuniões de alinhamento com voz elegante e precisa.
Dada a seguinte ata ou transcrição bruta de reunião de alinhamento entre CA.RO TECH e Mundi TKR:
"""
${rawText}
"""

Gere um JSON com o seguinte formato estruturado:
{
  "pauta": "Assunto ou objetivo central resumido em uma frase nobre",
  "decisoes": ["Decisão formal 1 de altíssimo nível", "Decisão formal 2"],
  "proximasAcoes": [
    {
      "acao": "Tarefa ou próxima ação clara",
      "responsavel": "Nome ou cargo do responsável",
      "prazo": "Data ou indicação de tempo elegante"
    }
  ],
  "participantes": ["Nome 1", "Nome 2"]
}

Retorne exclusivamente o JSON, sem markdown exterior.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pauta: { type: Type.STRING },
            decisoes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            proximasAcoes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  acao: { type: Type.STRING },
                  responsavel: { type: Type.STRING },
                  prazo: { type: Type.STRING }
                },
                required: ["acao", "responsavel", "prazo"]
              }
            },
            participantes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["pauta", "decisoes", "proximasAcoes", "participantes"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Erro ao resumir reunião:", error);
    res.status(500).json({
      error: error.message || "Erro de inteligência artificial",
      mockMeeting: {
        pauta: "Alinhamento de Expansão e Conceituação de Alta Linha",
        decisoes: [
          "Definição do ensaio em alta velocidade de Alphaville",
          "Lançamento do Portal de Transparência Operacional para a Mundi TKR"
        ],
        proximasAcoes: [
          { acao: "Finalização das artes institucionais", responsavel: "Julio M. (CA.RO)", prazo: "2 dias" },
          { acao: "Fornecer retornos sobre o design de embalagem", responsavel: "Time Mundi TKR", prazo: "Próxima terça" }
        ],
        participantes: ["Carol (CA.RO)", "Julio (CA.RO)", "Diretoria Mundi TKR"]
      }
    });
  }
});

// Start our full Express & Vite application setup
async function startServer() {
  // Direct serving of frontend build assets in production, or integrated Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CA.RO TECH PORTAL SERVER] Running on port http://0.0.0.0:${PORT}`);
  });
}

startServer();
