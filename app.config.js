// ============================================================
// app.config.js
// Configuración de Expo — lee variables de entorno de forma segura
//
// IMPORTANTE:
//   - Las variables de process.env las provee .env en desarrollo
//   - En producción (EAS Build) las proveen EAS Secrets
//   - Nunca pongas valores reales hardcodeados aquí
// ============================================================

import appJson from './app.json';

// Carga .env en desarrollo local (en EAS Build no es necesario)
try {
  require('dotenv').config();
} catch (_error) {
  // dotenv puede no estar disponible; en ese caso process.env
  // viene del entorno del sistema o de EAS Secrets
}

// ── Lectura de variables de entorno ────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const EXPO_PUBLIC_OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? process.env.EXPO_PUBLIC_GROQ_API_KEY;

// ── Validación en tiempo de build ──────────────────────────
// Solo advertimos, no bloqueamos el build (la app tiene fallbacks)
const __NEURA_CONFIG_WARNED__ = global.__NEURA_CONFIG_WARNED__ ||= {
  supabase: false,
  openai: false,
};

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (!__NEURA_CONFIG_WARNED__.supabase) {
    __NEURA_CONFIG_WARNED__.supabase = true;
    console.warn(
      '\n⚠️  [NeuraMotivación] Supabase no configurado.\n' +
      '   Copia .env.example a .env y rellena las claves.\n' +
      '   La autenticación no funcionará hasta entonces.\n'
    );
  }
}

if (!EXPO_PUBLIC_OPENAI_API_KEY) {
  if (!__NEURA_CONFIG_WARNED__.openai) {
    __NEURA_CONFIG_WARNED__.openai = true;
    console.warn(
      '\n⚠️  [NeuraMotivación] EXPO_PUBLIC_OPENAI_API_KEY no encontrado.\n' +
      '   La app usará frases de fallback local (sin IA).\n'
    );
  }
}

// ── Exportación de configuración ───────────────────────────

export default {
  expo: {
    ...appJson.expo,
    name: 'neura-motivation',
    slug: 'neura-motivation',
    extra: {
      // Estas variables quedan disponibles en el cliente via:
      // Constants.expoConfig?.extra?.supabaseUrl
      supabaseUrl: SUPABASE_URL ?? null,
      supabaseAnonKey: SUPABASE_ANON_KEY ?? null,
      // EXPO_PUBLIC_ prefix → también accesible como process.env en el cliente
      EXPO_PUBLIC_OPENAI_API_KEY: EXPO_PUBLIC_OPENAI_API_KEY ?? null,
    },
  },
};
