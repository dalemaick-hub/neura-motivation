// ============================================================
// src/services/ai.ts
// Motor de IA para generación de frases motivacionales
//
// SEGURIDAD:
//   - La API key se lee desde expo-constants (app.config.js)
//     que a su vez la lee desde variables de entorno (.env)
//   - Nunca hardcodees la clave aquí directamente
//   - Para producción usa EAS Secrets (ver README)
// ============================================================

import Constants from 'expo-constants';
import type { AIQuoteResult, CategoryId } from '../types';

// ── Constantes ──────────────────────────────────────────────

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-3.5-turbo';
const MAX_TOKENS = 60;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Lee la API key desde la configuración de Expo.
 * app.config.js la inyecta desde process.env en tiempo de build.
 * NUNCA pongas la clave directamente como string aquí.
 */
function getApiKey(): string | undefined {
  return Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined;
}

// ── Banco de frases de fallback (sin internet / sin API key) ─

const FALLBACK_QUOTES: Record<CategoryId, string[]> = {
  calma: [
    'Respira. Todo va a estar bien.',
    'La paz también se entrena, un momento a la vez.',
    'Baja el ruido. Tu alma sabe el camino.',
    'No todo necesita tu atención ahora mismo.',
    'El silencio también es una respuesta válida.',
  ],
  ansiedad: [
    'No tienes que resolverlo todo hoy.',
    'Tu mente está cansada, no rota.',
    'Un pensamiento no decide tu destino.',
    'Estás haciendo lo que puedes, y eso es suficiente.',
    'La incertidumbre no es tu enemiga, es parte del camino.',
  ],
  amor: [
    'Hablarte bonito también es una forma de sanar.',
    'Mereces el amor que das con tanta facilidad.',
    'Tu valor no cambia cuando dudas de ti.',
    'Cuídate con la misma dedicación que cuidas a los demás.',
    'Eres suficiente exactamente como eres hoy.',
  ],
  energia: [
    'Hoy no necesitas perfección, necesitas movimiento.',
    'Empieza pequeño. La fuerza llega en marcha.',
    'Tu energía regresa cuando recuerdas por qué empezaste.',
    'Un solo paso cuenta como progreso.',
    'No esperes el momento perfecto. Crea el tuyo.',
  ],
  exito: [
    'La disciplina te lleva donde la emoción no alcanza.',
    'Tu proceso también cuenta como victoria.',
    'Cada paso invisible está construyendo algo grande.',
    'Los resultados llegan cuando la constancia se vuelve hábito.',
    'Lo que haces cuando nadie mira define quién eres.',
  ],
};

// ── Utilidades internas ──────────────────────────────────────

/**
 * Devuelve una frase de fallback local que no esté en las excluidas.
 */
function getRandomFallback(
  categoryId: CategoryId,
  excludedQuotes: string[] = []
): string {
  const list = FALLBACK_QUOTES[categoryId] ?? FALLBACK_QUOTES.calma;
  const candidates = list.filter((quote) => !excludedQuotes.includes(quote));

  // Si todas las frases ya fueron usadas, permite repetir
  const pool = candidates.length > 0 ? candidates : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Limpia la respuesta de la IA: elimina comillas, espacios extra, etc.
 * Si el resultado no es válido, devuelve una frase de fallback.
 */
function sanitizeQuote(
  rawContent: string | null | undefined,
  categoryId: CategoryId,
  excludedQuotes: string[] = []
): string {
  if (!rawContent || typeof rawContent !== 'string') {
    return getRandomFallback(categoryId, excludedQuotes);
  }

  const cleaned = rawContent.replace(/^['\"""«»]+|['\"""«»]+$/g, '').trim();

  if (!cleaned || excludedQuotes.includes(cleaned)) {
    return getRandomFallback(categoryId, excludedQuotes);
  }

  return cleaned;
}

/**
 * Hace la petición a la API de OpenAI con un timeout de seguridad.
 * Lanza error si la respuesta no es 2xx.
 */
async function fetchFromOpenAI(
  categoryId: CategoryId,
  apiKey: string
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // La API key va en el header, nunca en la URL ni en el body
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 1,
        max_tokens: MAX_TOKENS,
        messages: [
          {
            role: 'system',
            content:
              'Eres un escritor de frases motivacionales breves, profundas y humanas. ' +
              'Responde SOLO con una frase corta en español. ' +
              'Sin comillas. Sin introducción. Sin explicación.',
          },
          {
            role: 'user',
            content: `Dame una frase motivacional corta, emocional y profunda sobre el tema: ${categoryId}.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data?.choices?.[0]?.message?.content ?? null;
    return content ?? '';
  } finally {
    clearTimeout(timer);
  }
}

// ── API pública ──────────────────────────────────────────────

/**
 * Genera una frase motivacional usando IA (OpenAI) o fallback local.
 *
 * @param categoryId  - Categoría de la frase (calma, ansiedad, etc.)
 * @param excludedQuotes - Frases que NO deben repetirse (historial reciente)
 * @returns AIQuoteResult con la frase y metadatos
 *
 * @example
 * const result = await generateQuote('calma', ['Frase ya vista']);
 * console.log(result.quote);        // "Respira. Todo va a estar bien."
 * console.log(result.isLocalFallback); // false si vino de OpenAI
 */
export async function generateQuote(
  categoryId: CategoryId = 'calma',
  excludedQuotes: string[] = []
): Promise<AIQuoteResult> {
  const apiKey = getApiKey();

  // Sin API key → fallback local inmediato
  if (!apiKey || apiKey.trim() === '') {
    return {
      quote: getRandomFallback(categoryId, excludedQuotes),
      isLocalFallback: true,
      categoryId,
    };
  }

  try {
    const rawContent = await fetchFromOpenAI(categoryId, apiKey);
    const quote = sanitizeQuote(rawContent, categoryId, excludedQuotes);

    return {
      quote,
      isLocalFallback: false,
      categoryId,
    };
  } catch {
    // Si la IA falla (red, timeout, error API), usamos fallback silenciosamente
    return {
      quote: getRandomFallback(categoryId, excludedQuotes),
      isLocalFallback: true,
      categoryId,
    };
  }
}

/**
 * Versión simplificada que devuelve solo el texto de la frase.
 * Compatible con el código anterior que esperaba un string.
 */
export async function generateQuoteText(
  categoryId: CategoryId = 'calma',
  excludedQuotes: string[] = []
): Promise<string> {
  const result = await generateQuote(categoryId, excludedQuotes);
  return result.quote;
}
