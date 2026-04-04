import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import GradientBackground from '../components/GradientBackground';
import { supabase } from '../lib/supabase';
import { setupNotifications } from '../services/notifications';

export default function SettingsScreen() {
  const handleReminder = async () => {
    const result = await setupNotifications();

    if (result.status === 'enabled') {
      Alert.alert('Recordatorio activo', 'Cada día a las 9:00 tendrás tu recordatorio de NEURA.');
      return;
    }

    if (result.status === 'unavailable') {
      Alert.alert(
        'Falta instalar notificaciones',
        'Añade el paquete expo-notifications para activar este recordatorio en el dispositivo.'
      );
      return;
    }

    Alert.alert('Permiso no concedido', 'Activa las notificaciones desde los ajustes del sistema.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <GradientBackground>
      <Text style={styles.eyebrow}>Ajustes</Text>
      <Text style={styles.title}>Personaliza la experiencia NEURA</Text>
      <Text style={styles.subtitle}>
        Desde aquí dejas lista la base para recordatorios, premium y siguientes integraciones.
      </Text>

      <View style={styles.group}>
        <Pressable style={styles.item} onPress={handleReminder}>
          <Text style={styles.itemTitle}>Activar recordatorio diario</Text>
          <Text style={styles.itemText}>Programa una notificación local a las 9:00 cada mañana.</Text>
        </Pressable>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>NEURA Premium</Text>
          <Text style={styles.itemText}>
            Base pensada para conectar RevenueCat y desbloquear categorías extra, temas y más IA.
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemTitle}>Widget diario</Text>
          <Text style={styles.itemText}>
            Siguiente fase preparada para mostrar la frase del día en la pantalla principal.
          </Text>
        </View>
      </View>

      <Pressable style={[styles.item, styles.logout]} onPress={handleLogout}>
        <Text style={styles.itemTitle}>Cerrar sesión</Text>
        <Text style={styles.itemText}>Salir de tu cuenta de Supabase en este dispositivo.</Text>
      </Pressable>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: '#d3b9ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 24,
  },
  group: {
    gap: 14,
  },
  item: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  itemTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  itemText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 22,
  },
  logout: {
    marginTop: 18,
  },
});
