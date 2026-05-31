import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateQuote } from './ai';

const DAILY_QUOTE_KEY = 'dailyQuote';
const DAILY_HISTORY_KEY = 'dailyQuoteHistory';

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getStoredDailyQuote(date = new Date()) {
  const stored = await AsyncStorage.getItem(DAILY_QUOTE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const data = JSON.parse(stored);
    return data?.date === getDateKey(date) ? data : null;
  } catch (_error) {
    return null;
  }
}

export async function getDailyQuoteHistory() {
  const stored = await AsyncStorage.getItem(DAILY_HISTORY_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (_error) {
    return [];
  }
}

export async function saveDailyQuote(quote, categoryId = 'calma', date = new Date()) {
  const dailyQuote = {
    date: getDateKey(date),
    text: quote,
    categoryId,
    createdAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(dailyQuote));

  const history = await getDailyQuoteHistory();
  const updatedHistory = [dailyQuote, ...history.filter((item) => item.text !== quote)].slice(0, 30);
  await AsyncStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(updatedHistory));

  return dailyQuote;
}

export async function getOrCreateTodaysQuote(categoryId = 'calma') {
  const existing = await getStoredDailyQuote();
  if (existing && existing.categoryId === categoryId) {
    return existing;
  }

  const history = await getDailyQuoteHistory();
  const exclusions = history.map((item) => item.text).slice(0, 12);
  const quote = await generateQuote(categoryId, exclusions);

  return saveDailyQuote(quote, categoryId);
}
