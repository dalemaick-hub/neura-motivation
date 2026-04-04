import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import GradientBackground from '../components/GradientBackground';
import { categories } from '../data/categories';
import { getSelectedCategory, setSelectedCategory } from '../services/preferences';

export default function CategoriesScreen() {
  const [selectedCategory, setCurrentCategory] = useState('calma');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSelectedCategory = async () => {
        const stored = await getSelectedCategory();

        if (isActive) {
          setCurrentCategory(stored);
        }
      };

      loadSelectedCategory();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleSelectCategory = async (categoryId) => {
    setCurrentCategory(categoryId);
    await setSelectedCategory(categoryId);
  };

  return (
    <GradientBackground>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Categorías</Text>
        <Text style={styles.title}>Elige una energía</Text>
        <Text style={styles.subtitle}>
          Selecciona el tono de tus frases y vuelve a Home para generar una nueva con ese mood.
        </Text>
      </View>

      <View style={styles.list}>
        {categories.map((category) => {
          const isSelected = category.id === selectedCategory;

          return (
            <Pressable
              key={category.id}
              onPress={() => handleSelectCategory(category.id)}
              style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryStatus}>
                {isSelected ? 'Seleccionada' : 'Tocar para usar'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.secondaryButton} onPress={() => router.push('/favorites')}>
        <Text style={styles.secondaryButtonText}>Ver favoritos</Text>
      </Pressable>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  eyebrow: {
    color: '#d3b9ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  categoryCardSelected: {
    backgroundColor: 'rgba(123,75,255,0.35)',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  categoryName: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryStatus: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
  },
  secondaryButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  secondaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
