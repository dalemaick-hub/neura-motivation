import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import GradientBackground from '../components/GradientBackground';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!isSupabaseConfigured) {
      setError('Configura EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY para continuar.');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    } else {
      router.replace('/');
    }

    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!isSupabaseConfigured) {
      setError('Configura EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY para continuar.');
      return;
    }

    setIsLoading(true);
    setError('');

    const { error: registerError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (registerError) {
      setError(registerError.message);
    } else {
      Alert.alert('Revisa tu correo', 'Te enviamos un enlace para confirmar tu cuenta.');
    }

    setIsLoading(false);
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Bienvenido a NEURA Motivation</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para guardar favoritos, mantener tu progreso y sincronizar tu energía.
          </Text>

          {!isSupabaseConfigured ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Falta configurar Supabase. Añade `EXPO_PUBLIC_SUPABASE_URL` y
                `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
              </Text>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            value={password}
          />

          {error !== '' ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.link} onPress={handleRegister} disabled={isLoading}>
            <Text style={styles.linkText}>Crear cuenta nueva</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  title: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
  },
  notice: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  noticeText: {
    color: '#f4eaff',
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    color: 'white',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  button: {
    backgroundColor: '#7b4bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
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
  link: {
    marginTop: 20,
  },
  linkText: {
    color: '#d3baff',
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: '#ff8f8f',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
});
