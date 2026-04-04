import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import GradientBackground from '../components/GradientBackground';
import { getCategoryName } from '../data/categories';
import { getFavorites, removeFavorite } from '../services/favorites';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadFavorites = async () => {
        const stored = await getFavorites();

        if (isActive) {
          setFavorites(stored);
        }
      };

      loadFavorites();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleRemove = async (quote) => {
    const updated = await removeFavorite(quote);
    setFavorites(updated);
  };

  return (
    <GradientBackground>
      <Text style={styles.title}>Tus favoritos</Text>
      <Text style={styles.subtitle}>Guarda las frases que quieras volver a leer.</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Aún no guardaste frases</Text>
          <Text style={styles.emptyText}>
            Cuando toques el botón de favorito en Home, aparecerán aquí.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {favorites.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.badge}>{getCategoryName(item.categoryId)}</Text>
              <Text style={styles.quote}>{item.text}</Text>
              <Text style={styles.meta}>
                Guardada {new Date(item.createdAt).toLocaleDateString('es-ES')}
              </Text>
              <Pressable style={styles.removeButton} onPress={() => handleRemove(item.text)}>
                <Text style={styles.removeButtonText}>Quitar de favoritos</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badge: {
    color: '#d8cbff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  quote: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 10,
  },
  meta: {
    color: 'rgba(255,255,255,0.56)',
    fontSize: 13,
    marginBottom: 18,
  },
  removeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
