// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://winter-technological-tough-simulations.trycloudflare.com/api/v1',
  timeout: 5000,
});

export default api;
