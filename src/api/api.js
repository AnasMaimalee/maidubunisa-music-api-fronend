// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fatidic-elin-unelective.ngrok-free.dev/api/v1',
  timeout: 5000,
});

export default api;
