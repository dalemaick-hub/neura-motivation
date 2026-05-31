// ============================================================
// src/types/index.ts
// Tipos TypeScript compartidos para toda la app
// ============================================================

// --- Categorías de motivación ---

export type CategoryId = 'calma' | 'ansiedad' | 'amor' | 'energia' | 'exito';

export interface Category {
  id: CategoryId;
  name: string;
  description?: string;
  emoji?: string;
}

// --- Frases / Quotes ---

export interface DailyQuote {
  /** Clave de fecha en formato YYYY-MM-DD */
  date: string;
  text: string;
  categoryId: CategoryId;
  createdAt: string; // ISO 8601
}

export interface FavoriteQuote {
  /** ID único generado con Date.now() + random */
  id: string;
  text: string;
  categoryId: CategoryId;
  createdAt: string; // ISO 8601
}

// --- Respuesta del servicio de IA ---

export interface AIQuoteResult {
  quote: string;
  /** true si la frase viene del fallback local, false si viene de OpenAI */
  isLocalFallback: boolean;
  categoryId: CategoryId;
}

// --- Estado de notificaciones ---

export type NotificationStatus = 'enabled' | 'denied' | 'unavailable';

export interface NotificationSetupResult {
  status: NotificationStatus;
}

// --- Preferencias del usuario ---

export interface UserPreferences {
  selectedCategory: CategoryId;
  notificationsEnabled: boolean;
  notificationHour: number; // 0-23
}

// --- Estado de Supabase session ---
// Re-exportamos el tipo de Supabase para no depender de él en todos los archivos
export type { Session } from '@supabase/supabase-js';
