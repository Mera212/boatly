import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import apiClient from '../api/client';

export default function SettingsScreen() {
  const [marina, setMarina] = useState({ name: '', address: '' });
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [marinaResp, spotsResp] = await Promise.all([
          apiClient.get('/api/marina'),
          apiClient.get('/api/spots'),
        ]);
        setMarina(marinaResp.data || { name: '', address: '' });
        setSpots(spotsResp.data || []);
      } catch (err) {
        console.error('Failed to load settings', err?.response || err);
      }
    };
    load();
  }, []);

  const saveMarina = async () => {
    setLoading(true);
    try {
      const resp = await apiClient.post('/api/marina', marina);
      if (resp.status === 200) {
        Alert.alert('Saved', 'Marina saved successfully');
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (err) {
      console.error('saveMarina error', err?.response || err);
      Alert.alert('Error', err?.response?.data?.message || err.message || 'Check server logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marina Settings</Text>
      <TextInput placeholder="Marina name" value={marina.name} onChangeText={(t) => setMarina({ ...marina, name: t })} style={styles.input} />
      <TextInput placeholder="Address" value={marina.address} onChangeText={(t) => setMarina({ ...marina, address: t })} style={styles.input} />
      <Button title={loading ? 'Saving…' : 'Save Marina'} onPress={saveMarina} disabled={loading} />

      <View style={{ height: 16 }} />
      <Text style={{ fontWeight: '600', marginBottom: 8 }}>Spots</Text>
      <FlatList
        data={spots}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <View style={styles.spotRow}>
            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
            <Text>{item.size} — ${item.price}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No spots yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 10 },
  spotRow: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
