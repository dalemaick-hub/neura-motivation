import { StyleSheet, Text, View } from 'react-native';

export default function QuoteCard({ text, categoryLabel, caption }) {
  return (
    <View style={styles.card}>
      {categoryLabel ? <Text style={styles.badge}>{categoryLabel}</Text> : null}
      <Text style={styles.quote}>{text}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    borderRadius: 28,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  badge: {
    color: '#d9c5ff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: 14,
  },
  quote: {
    fontSize: 28,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 38,
    fontWeight: '600',
  },
  caption: {
    marginTop: 16,
    color: 'rgba(255,255,255,0.64)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
