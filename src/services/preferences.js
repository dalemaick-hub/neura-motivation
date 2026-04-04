import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORY_KEY = 'selectedCategory';

export async function getSelectedCategory() {
  return (await AsyncStorage.getItem(CATEGORY_KEY)) ?? 'calma';
}

export async function setSelectedCategory(categoryId) {
  await AsyncStorage.setItem(CATEGORY_KEY, categoryId);
}
