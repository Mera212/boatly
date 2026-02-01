import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { View, Text, StyleSheet, ActivityIndicator, Platform, FlatList } from 'react-native';
import apiClient from '../api/client';

export default function MapScreen() {
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
  const resp = await apiClient.get('/api/spots');
  setSpots(resp.data || []);
      } catch (err) {
        console.error('Failed to fetch spots', err?.response || err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, fontWeight: '600', margin: 12 }}>Spots (placeholder map)</Text>
      <FlatList
        data={spots}
        keyExtractor={(item) => item._id || `${item.lat}-${item.lng}`}
        renderItem={({ item }) => (
          <View style={styles.spotRow}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            <Text>{`Lat: ${item.lat || 'N/A'} • Lng: ${item.lng || 'N/A'}`}</Text>
            <Text>{`Size: ${item.size} • $${item.price}`}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ padding: 12 }}>No spots to show.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
