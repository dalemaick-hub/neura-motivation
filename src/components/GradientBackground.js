import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function GradientBackground({ children }) {
  return (
    <LinearGradient
      colors={['#05030a', '#12081f', '#2e1450', '#7b4bff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}>
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#05030a',
  },
  orbTop: {
    position: 'absolute',
    top: -80,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(173, 122, 255, 0.18)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: -110,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: 'rgba(83, 214, 255, 0.12)',
  },
});
