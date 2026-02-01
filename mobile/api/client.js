import axios from 'axios';

export const api = {
  // Default baseURL: adjust for your setup. When running the Expo client on a simulator:
  // - iOS simulator: use 'http://localhost:3000'
  // - Android emulator (AVD): use 'http://10.0.2.2:3000'
  // - Physical device: use your machine IP like 'http://192.168.1.5:3000'
  baseURL: 'http://localhost:3000',
};

export const apiClient = axios.create({ baseURL: api.baseURL });

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export default apiClient;
