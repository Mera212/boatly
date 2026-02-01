import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { api, setAuthToken } from '../api/client';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Call the mobile login endpoint which returns a JWT
      const resp = await apiClient.post('/api/auth/mobile-login', { email, password });
      if (resp.status === 200 && resp.data?.token) {
        const { token } = resp.data;
        await AsyncStorage.setItem('authToken', token);
        setAuthToken(token);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error', err?.response || err);
      Alert.alert('Login failed', err?.response?.data?.error || err.message || 'Check server logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boatly — Landlord Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? 'Signing in…' : 'Sign in'} onPress={handleLogin} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Try Map" onPress={() => navigation.navigate('Map')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 6 },
});
