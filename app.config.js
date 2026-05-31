import appJson from './app.json';

try {
  require('dotenv').config();
} catch (_error) {
  // dotenv may already be available via Expo dependencies.
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const EXPO_PUBLIC_GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export default {
  expo: {
    ...appJson.expo,
    name: 'neura-motivation',
    slug: 'neura-motivation',
    extra: {
      supabaseUrl: SUPABASE_URL,
      supabaseAnonKey: SUPABASE_ANON_KEY,
      EXPO_PUBLIC_GROQ_API_KEY,
    },
  },
};
