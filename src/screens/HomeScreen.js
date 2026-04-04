import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import GradientBackground from '../components/GradientBackground';
import QuoteCard from '../components/QuoteCard';
import { categories, getCategoryName } from '../data/categories';
import { supabase } from '../lib/supabase';
import { generateQuote } from '../services/ai';
import { isFavoriteQuote, removeFavorite, saveFavorite } from '../services/favorites';
import { getSelectedCategory } from '../services/preferences';

export default function HomeScreen() {
  const [quote, setQuote] = useState('Respira. Todo va a estar bien.');
  const [selectedCategory, setSelectedCategory] = useState('calma');
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const syncScreenState = async () => {
        const storedCategory = await getSelectedCategory();
        const favoriteState = await isFavoriteQuote(quote);

        if (isActive) {
          setSelectedCategory(storedCategory);
          setIsFavorite(favoriteState);
        }
      };

      syncScreenState();

      return () => {
        isActive = false;
      };
    }, [quote])
  );

  const currentCategory = categories.find((category) => category.id === selectedCategory);

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    const newQuote = await generateQuote(selectedCategory);
    setQuote(newQuote);
    setIsFavorite(await isFavoriteQuote(newQuote));
    setIsLoading(false);
  };

  const handleFavoritePress = async () => {
    if (isFavorite) {
      await removeFavorite(quote);
      setIsFavorite(false);
      return;
    }

    await saveFavorite(quote, selectedCategory);
    setIsFavorite(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <GradientBackground>
      <View style={styles.topRow}>
        <Pressable style={styles.miniButton} onPress={() => router.push('/explore')}>
          <Text style={styles.miniButtonText}>Categorías</Text>
        </Pressable>
        <Pressable style={styles.miniButton} onPress={() => router.push('/favorites')}>
          <Text style={styles.miniButtonText}>Favoritos</Text>
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => router.push('/settings')}>
          <Text style={styles.iconButtonText}>Ajustes</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>NEURA Motivation</Text>
        <Text style={styles.heroTitle}>Tu impulso diario en formato claro, humano y guardable.</Text>
      </View>

      <QuoteCard
        text={quote}
        categoryLabel={getCategoryName(currentCategory?.id)}
        caption="Frases IA listas para enchufar con Groq o fallback local cuando falte la API key."
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
          onPress={handleGenerateQuote}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Nueva frase</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleFavoritePress}>
          <Text style={styles.buttonText}>
            {isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.roadmapCard}>
        <Text style={styles.roadmapTitle}>Siguiente fase</Text>
        <Text style={styles.roadmapText}>
          Premium con RevenueCat para categorías extra, más fondos y más generaciones IA.
        </Text>
        <Text style={styles.roadmapText}>
          Widget diario listo para conectar cuando demos el salto a Expo Widgets o nativo.
        </Text>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  miniButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  miniButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  iconButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  hero: {
    marginBottom: 18,
  },
  eyebrow: {
    color: '#d3b9ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryButton: {
    backgroundColor: 'rgba(123,75,255,0.45)',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  roadmapCard: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 8,
  },
  roadmapTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  roadmapText: {
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 22,
    fontSize: 15,
  },
  signOutButton: {
    marginTop: 16,
    paddingVertical: 14,
  },
  signOutText: {
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
});
