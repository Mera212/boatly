import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import apiClient from '../api/client';

export default function DashboardScreen({ navigation }) {
  const [marina, setMarina] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await apiClient.get('/api/marina');
        setMarina(resp.data || null);
      } catch (err) {
        console.error('Failed to load marina', err?.response || err);
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {marina ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{marina.name}</Text>
          <Text>{marina.address}</Text>
        </View>
      ) : (
        <Text>No marina found. Open Settings to add one.</Text>
      )}

      <View style={{ height: 12 }} />
      <Button title="Open Map" onPress={() => navigation.navigate('Map')} />
      <View style={{ height: 8 }} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
});
