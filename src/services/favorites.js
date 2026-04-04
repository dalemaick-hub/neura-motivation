import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export async function getFavorites() {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function saveFavorite(quote, categoryId) {
  const list = await getFavorites();
  const exists = list.some((item) => item.text === quote);

  if (exists) {
    return list;
  }

  const updated = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: quote,
      categoryId,
      createdAt: new Date().toISOString(),
    },
    ...list,
  ];

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavorite(quote) {
  const list = await getFavorites();
  const updated = list.filter((item) => item.text !== quote);

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function isFavoriteQuote(quote) {
  const list = await getFavorites();
  return list.some((item) => item.text === quote);
}
